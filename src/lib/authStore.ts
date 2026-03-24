import Keycloak from 'keycloak-js'
import { KEYCLOAK } from '@/config/constants'

// In-memory token store (XSS-safe — not in localStorage)
let accessToken: string | null = null

export const setToken = (token: string | null) => {
  accessToken = token
}

export const getToken = () => accessToken

// Singleton Keycloak instance
let keycloakInstance: Keycloak | null = null

export function getKeycloak(): Keycloak {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url: KEYCLOAK.URL,
      realm: KEYCLOAK.REALM,
      clientId: KEYCLOAK.CLIENT_ID,
    })
  }
  return keycloakInstance
}

// Refresh token if expiring soon — called before each API request
export async function ensureFreshToken(): Promise<string | null> {
  if (!keycloakInstance?.authenticated) return accessToken

  try {
    const refreshed = await keycloakInstance.updateToken(KEYCLOAK.MIN_TOKEN_VALIDITY_SECONDS)
    if (refreshed && keycloakInstance.token) {
      accessToken = keycloakInstance.token
    }
  } catch {
    console.warn('Token refresh failed')
  }

  return accessToken
}
