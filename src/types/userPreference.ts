export interface UserSettings {
  themePalette: string | null
  customPrimaryColor: string | null
  colorMode: 'light' | 'dark' | 'system' | null
  headingFont: string | null
  bodyFont: string | null
  baseFontSize: number | null
  lineHeight: number | null
  contentWidth: 'narrow' | 'normal' | 'wide' | 'full' | null
  blockSpacing: 'compact' | 'normal' | 'spacious' | null
  sidebarDefault: 'expanded' | 'collapsed' | null
  highContrast: boolean | null
  fontSizeMultiplier: number | null
  reducedAnimations: boolean | null
}

export interface UserPreferenceResponse {
  userId: number
  settings: UserSettings
  updatedAt: string
}

export type UpdateUserPreferenceRequest = Partial<UserSettings>
