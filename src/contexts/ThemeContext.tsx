import { createContext, useContext, useEffect, useCallback, useMemo, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useUserPreferences, useUpdateUserPreferences, useResetUserPreferences } from '@/hooks/useUserPreferences'
import { userPreferenceKeys } from '@/services/userPreferenceService'
import { DEFAULT_PREFERENCES, THEME_PALETTES, CONTENT_WIDTH_OPTIONS, BLOCK_SPACING_OPTIONS } from '@/config/preferences'
import { generatePaletteFromHex, applyVariablesToDocument, clearVariableOverrides } from '@/lib/colorUtils'
import type { UserSettings, UpdateUserPreferenceRequest } from '@/types/userPreference'

interface ThemeContextValue {
  settings: UserSettings
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void
  updateSettings: (updates: UpdateUserPreferenceRequest) => void
  resetAll: () => void
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

// All CSS variable names that we might override (for clearing)
const PALETTE_VARIABLES = [
  '--primary', '--primary-foreground',
  '--secondary', '--secondary-foreground',
  '--accent', '--accent-foreground',
  '--ring',
  '--sidebar', '--sidebar-foreground',
  '--sidebar-primary', '--sidebar-primary-foreground',
  '--sidebar-accent', '--sidebar-accent-foreground',
  '--sidebar-ring',
  '--chart-1', '--chart-2', '--chart-3',
]

function mergeWithDefaults(settings: Partial<UserSettings> | null | undefined): UserSettings {
  if (!settings) return { ...DEFAULT_PREFERENCES }
  const merged = { ...DEFAULT_PREFERENCES }
  for (const key of Object.keys(merged) as (keyof UserSettings)[]) {
    if (settings[key] !== null && settings[key] !== undefined) {
      (merged as Record<string, unknown>)[key] = settings[key]
    }
  }
  return merged
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useUserPreferences()
  const updateMutation = useUpdateUserPreferences()
  const resetMutation = useResetUserPreferences()
  const queryClient = useQueryClient()
  const mediaQueryRef = useRef<MediaQueryList | null>(null)

  const settings = useMemo(() => mergeWithDefaults(data?.settings), [data?.settings])

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement

    // 1. Color mode (light/dark)
    const applyColorMode = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    if (settings.colorMode === 'dark') {
      applyColorMode(true)
    } else if (settings.colorMode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQueryRef.current = mq
      applyColorMode(mq.matches)
      const handler = (e: MediaQueryListEvent) => applyColorMode(e.matches)
      mq.addEventListener('change', handler)
      return () => {
        mq.removeEventListener('change', handler)
        mediaQueryRef.current = null
      }
    } else {
      applyColorMode(false)
    }
  }, [settings.colorMode])

  // Apply palette
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    const mode = isDark ? 'dark' : 'light'

    if (settings.themePalette === 'custom' && settings.customPrimaryColor) {
      const palette = generatePaletteFromHex(settings.customPrimaryColor)
      applyVariablesToDocument(palette[mode])
    } else if (settings.themePalette && settings.themePalette !== 'bms-core') {
      const palette = THEME_PALETTES.find(p => p.id === settings.themePalette)
      if (palette) {
        applyVariablesToDocument(palette.variables[mode])
      }
    } else {
      // BMS Core = defaults, clear any overrides
      clearVariableOverrides(PALETTE_VARIABLES)
    }
  }, [settings.themePalette, settings.customPrimaryColor, settings.colorMode])

  // Apply fonts
  useEffect(() => {
    const root = document.documentElement
    const fallback = (font: string) =>
      font === 'Cascadia Code' ? 'monospace' : 'sans-serif'
    root.style.setProperty('--font-sans', `'${settings.bodyFont}', ${fallback(settings.bodyFont ?? 'DM Sans')}`)
    root.style.setProperty('--font-heading', `'${settings.headingFont}', ${fallback(settings.headingFont ?? 'Playfair Display')}`)
  }, [settings.bodyFont, settings.headingFont])

  // Apply font size and multiplier
  useEffect(() => {
    const base = settings.baseFontSize ?? 16
    const multiplier = settings.fontSizeMultiplier ?? 1.0
    document.documentElement.style.fontSize = `${base * multiplier}px`
  }, [settings.baseFontSize, settings.fontSizeMultiplier])

  // Apply line height
  useEffect(() => {
    document.documentElement.style.setProperty('--line-height-base', String(settings.lineHeight ?? 1.5))
  }, [settings.lineHeight])

  // Apply content width
  useEffect(() => {
    const option = CONTENT_WIDTH_OPTIONS.find(o => o.value === settings.contentWidth)
    document.documentElement.style.setProperty('--content-max-width', option?.maxWidth ?? '960px')
  }, [settings.contentWidth])

  // Apply block spacing
  useEffect(() => {
    const option = BLOCK_SPACING_OPTIONS.find(o => o.value === settings.blockSpacing)
    document.documentElement.style.setProperty('--block-spacing', option?.gap ?? '1.25rem')
  }, [settings.blockSpacing])

  // Apply high contrast
  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', settings.highContrast ?? false)
  }, [settings.highContrast])

  // Apply reduced animations
  useEffect(() => {
    if (settings.reducedAnimations) {
      document.documentElement.setAttribute('data-reduce-motion', '')
    } else {
      document.documentElement.removeAttribute('data-reduce-motion')
    }
  }, [settings.reducedAnimations])

  const updateSetting = useCallback(<K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    // Optimistic: update query cache immediately
    queryClient.setQueryData(userPreferenceKeys.current(), (old: unknown) => ({
      ...(old as Record<string, unknown>),
      settings: { ...((old as Record<string, unknown>)?.settings as Record<string, unknown> ?? {}), [key]: value },
    }))
    // Persist
    updateMutation.mutate({ [key]: value } as UpdateUserPreferenceRequest)
  }, [queryClient, updateMutation])

  const updateSettings = useCallback((updates: UpdateUserPreferenceRequest) => {
    queryClient.setQueryData(userPreferenceKeys.current(), (old: unknown) => ({
      ...(old as Record<string, unknown>),
      settings: { ...((old as Record<string, unknown>)?.settings as Record<string, unknown> ?? {}), ...updates },
    }))
    updateMutation.mutate(updates)
  }, [queryClient, updateMutation])

  const resetAll = useCallback(() => {
    queryClient.setQueryData(userPreferenceKeys.current(), (old: unknown) => ({
      ...(old as Record<string, unknown>),
      settings: {},
    }))
    // Clear all CSS overrides
    clearVariableOverrides(PALETTE_VARIABLES)
    document.documentElement.style.removeProperty('--font-sans')
    document.documentElement.style.removeProperty('--font-heading')
    document.documentElement.style.removeProperty('--content-max-width')
    document.documentElement.style.removeProperty('--block-spacing')
    document.documentElement.style.removeProperty('--line-height-base')
    document.documentElement.style.fontSize = ''
    document.documentElement.classList.remove('dark', 'high-contrast')
    document.documentElement.removeAttribute('data-reduce-motion')
    resetMutation.mutate()
  }, [queryClient, resetMutation])

  const value = useMemo(() => ({
    settings,
    updateSetting,
    updateSettings,
    resetAll,
    isLoading,
  }), [settings, updateSetting, updateSettings, resetAll, isLoading])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
