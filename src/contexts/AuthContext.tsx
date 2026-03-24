import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react'
import { setToken, getKeycloak } from '@/lib/authStore'
import { KEYCLOAK } from '@/config/constants'

interface UserProfile {
  sub: string
  name: string
  email: string
  preferred_username: string
  resource_access?: Record<string, { roles: string[] }>
  realm_access?: { roles: string[] }
}

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isIframe: boolean
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper to decode JWT payload safely
function parseJwt(token: string): UserProfile | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    console.error('Invalid token', e)
    return null
  }
}

// Iframe detection (matches OKR pattern)
function checkIsIframe(): boolean {
  try {
    const inIframe = window.self !== window.top
    const hasHashToken = !!extractTokenFromHash()
    return inIframe || hasHashToken
  } catch {
    return true
  }
}

// Extract token from URL hash (#access_token=...)
function extractTokenFromHash(): string | null {
  const hash = window.location.hash.substring(1)
  if (!hash) return null
  const params = new URLSearchParams(hash)
  return params.get('access_token')
}

const PARENT_ORIGIN = import.meta.env.VITE_PARENT_ORIGIN || '*'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isIframe] = useState(checkIsIframe)
  const initCalledRef = useRef(false)

  // Sync token to authStore and user state
  const syncToken = useCallback((token: string | undefined) => {
    if (token) {
      setToken(token)
      setUser(parseJwt(token))
    } else {
      setToken(null)
      setUser(null)
    }
  }, [])

  // Logout
  const logout = useCallback(() => {
    if (isIframe) {
      // Signal parent to handle logout
      window.parent.postMessage({ type: 'LOGOUT' }, PARENT_ORIGIN)
      return
    }

    const kc = getKeycloak()
    if (kc.authenticated) {
      kc.logout({ redirectUri: window.location.origin })
    }
  }, [isIframe])

  // ─── STANDALONE MODE: Keycloak JS handles login/token/refresh ───
  useEffect(() => {
    if (isIframe) return
    if (initCalledRef.current) return
    initCalledRef.current = true

    const kc = getKeycloak()

    kc.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256',
    })
      .then((authenticated) => {
        if (authenticated) {
          syncToken(kc.token)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Keycloak init failed', err)
        setIsLoading(false)
      })

    kc.onTokenExpired = () => {
      kc.updateToken(KEYCLOAK.MIN_TOKEN_VALIDITY_SECONDS)
        .then((refreshed) => {
          if (refreshed) syncToken(kc.token)
        })
        .catch(() => kc.login())
    }
  }, [isIframe, syncToken])

  // Handle 401 responses from API — force re-authentication
  useEffect(() => {
    const handleUnauthorized = () => {
      if (isIframe) return
      const kc = getKeycloak()
      if (kc.authenticated) {
        kc.updateToken(-1).catch(() => kc.login())
      }
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [isIframe])

  // ─── IFRAME MODE: Token from hash or postMessage ───
  useEffect(() => {
    if (!isIframe) return

    // 1. Try token from URL hash first
    const hashToken = extractTokenFromHash()
    if (hashToken) {
      syncToken(hashToken)
      setIsLoading(false)
      // Clean URL hash
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    // 2. Listen for SET_TOKEN and NAVIGATE from parent
    const handleMessage = (event: MessageEvent) => {
      if (PARENT_ORIGIN !== '*' && event.origin !== PARENT_ORIGIN) return

      if (event.data?.type === 'SET_TOKEN' && event.data.token) {
        syncToken(event.data.token)
        setIsLoading(false)
      }
    }

    window.addEventListener('message', handleMessage)

    // 3. Signal parent that iframe is ready
    window.parent.postMessage({ type: 'READY' }, PARENT_ORIGIN)

    // 4. Timeout fallback if parent doesn't send token
    const timeout = setTimeout(() => setIsLoading(false), 5000)

    return () => {
      window.removeEventListener('message', handleMessage)
      clearTimeout(timeout)
    }
  }, [isIframe, syncToken])

  // Notify parent when route changes (iframe mode)
  useEffect(() => {
    if (!isIframe) return

    const handlePopState = () => {
      window.parent.postMessage(
        { type: 'ROUTE_CHANGED', path: window.location.pathname },
        PARENT_ORIGIN,
      )
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isIframe])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isIframe, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
