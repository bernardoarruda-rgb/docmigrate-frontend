import type { UserSettings } from '@/types/userPreference'

export interface ThemePalette {
  id: string
  label: string
  previewHex: string
  variables: {
    light: Record<string, string>
    dark: Record<string, string>
  }
}

export const THEME_PALETTES: ThemePalette[] = [
  {
    id: 'bms-core',
    label: 'BMS Core',
    previewHex: '#E5892B',
    variables: {
      light: {},
      dark: {},
    },
  },
  {
    id: 'azul-corporativo',
    label: 'Azul Corporativo',
    previewHex: '#2563EB',
    variables: {
      light: {
        '--primary': 'oklch(0.55 0.18 250)',
        '--secondary': 'oklch(0.97 0.01 250)',
        '--accent': 'oklch(0.92 0.04 250)',
        '--ring': 'oklch(0.55 0.18 250)',
        '--sidebar': 'oklch(0.97 0.01 250)',
        '--sidebar-primary': 'oklch(0.55 0.18 250)',
        '--sidebar-accent': 'oklch(0.92 0.04 250)',
        '--sidebar-ring': 'oklch(0.55 0.18 250)',
        '--chart-1': 'oklch(0.55 0.18 250)',
        '--chart-2': 'oklch(0.92 0.04 250)',
        '--chart-3': 'oklch(0.97 0.01 250)',
      },
      dark: {
        '--primary': 'oklch(0.55 0.18 250)',
        '--secondary': 'oklch(0.25 0.01 250)',
        '--accent': 'oklch(0.30 0.01 250)',
        '--ring': 'oklch(0.55 0.18 250)',
        '--sidebar': 'oklch(0.18 0 0)',
        '--sidebar-primary': 'oklch(0.55 0.18 250)',
        '--sidebar-accent': 'oklch(0.25 0.01 250)',
        '--sidebar-ring': 'oklch(0.55 0.18 250)',
        '--chart-1': 'oklch(0.55 0.18 250)',
        '--chart-2': 'oklch(0.92 0.04 250)',
        '--chart-3': 'oklch(0.97 0.01 250)',
      },
    },
  },
  {
    id: 'verde-nature',
    label: 'Verde Nature',
    previewHex: '#16A34A',
    variables: {
      light: {
        '--primary': 'oklch(0.60 0.16 155)',
        '--secondary': 'oklch(0.97 0.01 155)',
        '--accent': 'oklch(0.92 0.04 155)',
        '--ring': 'oklch(0.60 0.16 155)',
        '--sidebar': 'oklch(0.97 0.01 155)',
        '--sidebar-primary': 'oklch(0.60 0.16 155)',
        '--sidebar-accent': 'oklch(0.92 0.04 155)',
        '--sidebar-ring': 'oklch(0.60 0.16 155)',
        '--chart-1': 'oklch(0.60 0.16 155)',
        '--chart-2': 'oklch(0.92 0.04 155)',
        '--chart-3': 'oklch(0.97 0.01 155)',
      },
      dark: {
        '--primary': 'oklch(0.60 0.16 155)',
        '--secondary': 'oklch(0.25 0.01 155)',
        '--accent': 'oklch(0.30 0.01 155)',
        '--ring': 'oklch(0.60 0.16 155)',
        '--sidebar': 'oklch(0.18 0 0)',
        '--sidebar-primary': 'oklch(0.60 0.16 155)',
        '--sidebar-accent': 'oklch(0.25 0.01 155)',
        '--sidebar-ring': 'oklch(0.60 0.16 155)',
        '--chart-1': 'oklch(0.60 0.16 155)',
        '--chart-2': 'oklch(0.92 0.04 155)',
        '--chart-3': 'oklch(0.97 0.01 155)',
      },
    },
  },
  {
    id: 'roxo-tech',
    label: 'Roxo Tech',
    previewHex: '#7C3AED',
    variables: {
      light: {
        '--primary': 'oklch(0.55 0.18 290)',
        '--secondary': 'oklch(0.97 0.01 290)',
        '--accent': 'oklch(0.92 0.04 290)',
        '--ring': 'oklch(0.55 0.18 290)',
        '--sidebar': 'oklch(0.97 0.01 290)',
        '--sidebar-primary': 'oklch(0.55 0.18 290)',
        '--sidebar-accent': 'oklch(0.92 0.04 290)',
        '--sidebar-ring': 'oklch(0.55 0.18 290)',
        '--chart-1': 'oklch(0.55 0.18 290)',
        '--chart-2': 'oklch(0.92 0.04 290)',
        '--chart-3': 'oklch(0.97 0.01 290)',
      },
      dark: {
        '--primary': 'oklch(0.55 0.18 290)',
        '--secondary': 'oklch(0.25 0.01 290)',
        '--accent': 'oklch(0.30 0.01 290)',
        '--ring': 'oklch(0.55 0.18 290)',
        '--sidebar': 'oklch(0.18 0 0)',
        '--sidebar-primary': 'oklch(0.55 0.18 290)',
        '--sidebar-accent': 'oklch(0.25 0.01 290)',
        '--sidebar-ring': 'oklch(0.55 0.18 290)',
        '--chart-1': 'oklch(0.55 0.18 290)',
        '--chart-2': 'oklch(0.92 0.04 290)',
        '--chart-3': 'oklch(0.97 0.01 290)',
      },
    },
  },
  {
    id: 'cinza-neutro',
    label: 'Cinza Neutro',
    previewHex: '#475569',
    variables: {
      light: {
        '--primary': 'oklch(0.45 0.02 260)',
        '--secondary': 'oklch(0.97 0.005 260)',
        '--accent': 'oklch(0.93 0.01 260)',
        '--ring': 'oklch(0.45 0.02 260)',
        '--sidebar': 'oklch(0.97 0.005 260)',
        '--sidebar-primary': 'oklch(0.45 0.02 260)',
        '--sidebar-accent': 'oklch(0.93 0.01 260)',
        '--sidebar-ring': 'oklch(0.45 0.02 260)',
        '--chart-1': 'oklch(0.45 0.02 260)',
        '--chart-2': 'oklch(0.93 0.01 260)',
        '--chart-3': 'oklch(0.97 0.005 260)',
      },
      dark: {
        '--primary': 'oklch(0.45 0.02 260)',
        '--secondary': 'oklch(0.25 0.005 260)',
        '--accent': 'oklch(0.30 0.005 260)',
        '--ring': 'oklch(0.45 0.02 260)',
        '--sidebar': 'oklch(0.18 0 0)',
        '--sidebar-primary': 'oklch(0.45 0.02 260)',
        '--sidebar-accent': 'oklch(0.25 0.005 260)',
        '--sidebar-ring': 'oklch(0.45 0.02 260)',
        '--chart-1': 'oklch(0.45 0.02 260)',
        '--chart-2': 'oklch(0.93 0.01 260)',
        '--chart-3': 'oklch(0.97 0.005 260)',
      },
    },
  },
] as const

export const FONT_COMBOS = [
  {
    id: 'montserrat',
    label: 'Montserrat (BMS Core)',
    body: 'Montserrat Variable',
    heading: 'Montserrat Variable',
    description: 'Geometrico, padrao BMS Core',
  },
  {
    id: 'dm-playfair',
    label: 'DM Sans + Playfair Display',
    body: 'DM Sans',
    heading: 'Playfair Display',
    description: 'Moderno e elegante',
  },
  {
    id: 'inter-space',
    label: 'Inter + Space Grotesk',
    body: 'Inter',
    heading: 'Space Grotesk',
    description: 'Limpo e geometrico',
  },
  {
    id: 'source-merri',
    label: 'Source Sans 3 + Merriweather',
    body: 'Source Sans 3',
    heading: 'Merriweather',
    description: 'Classico e legivel',
  },
  {
    id: 'nunito-poppins',
    label: 'Nunito + Poppins',
    body: 'Nunito',
    heading: 'Poppins',
    description: 'Amigavel e arredondado',
  },
  {
    id: 'lato-raleway',
    label: 'Lato + Raleway',
    body: 'Lato',
    heading: 'Raleway',
    description: 'Neutro e profissional',
  },
  {
    id: 'work-libre',
    label: 'Work Sans + Libre Baskerville',
    body: 'Work Sans',
    heading: 'Libre Baskerville',
    description: 'Corporativo e serifado',
  },
  {
    id: 'cascadia-code',
    label: 'Cascadia Code',
    body: 'Cascadia Code',
    heading: 'Cascadia Code',
    description: 'Estilo terminal, monospacado',
  },
] as const

export const BODY_FONTS = [
  'Montserrat Variable',
  'DM Sans',
  'Inter',
  'Source Sans 3',
  'Nunito',
  'Lato',
  'Work Sans',
  'Cascadia Code',
] as const

export const HEADING_FONTS = [
  'Montserrat Variable',
  'Playfair Display',
  'Space Grotesk',
  'Merriweather',
  'Poppins',
  'Raleway',
  'Libre Baskerville',
  'Cascadia Code',
] as const

export const FONT_SIZE_OPTIONS = [
  { value: 14, label: '14px' },
  { value: 15, label: '15px' },
  { value: 16, label: '16px (padrao)' },
  { value: 17, label: '17px' },
  { value: 18, label: '18px' },
] as const

export const LINE_HEIGHT_OPTIONS = [
  { value: 1.4, label: '1.4 (compacto)' },
  { value: 1.5, label: '1.5 (padrao)' },
  { value: 1.6, label: '1.6' },
  { value: 1.7, label: '1.7' },
  { value: 1.8, label: '1.8 (espacoso)' },
] as const

export const CONTENT_WIDTH_OPTIONS = [
  { value: 'narrow' as const, label: 'Estreito', maxWidth: '720px' },
  { value: 'normal' as const, label: 'Normal', maxWidth: '960px' },
  { value: 'wide' as const, label: 'Largo', maxWidth: '1200px' },
  { value: 'full' as const, label: 'Total', maxWidth: '100%' },
] as const

export const BLOCK_SPACING_OPTIONS = [
  { value: 'compact' as const, label: 'Compacto', gap: '0.75rem' },
  { value: 'normal' as const, label: 'Normal', gap: '1.25rem' },
  { value: 'spacious' as const, label: 'Espacoso', gap: '2rem' },
] as const

export const FONT_MULTIPLIER_OPTIONS = [
  { value: 0.85, label: '85%' },
  { value: 0.9, label: '90%' },
  { value: 1.0, label: '100% (padrao)' },
  { value: 1.1, label: '110%' },
  { value: 1.15, label: '115%' },
  { value: 1.25, label: '125%' },
] as const

export const DEFAULT_PREFERENCES: UserSettings = {
  themePalette: 'bms-core',
  customPrimaryColor: null,
  colorMode: 'light',
  headingFont: 'Montserrat Variable',
  bodyFont: 'Montserrat Variable',
  baseFontSize: 16,
  lineHeight: 1.5,
  contentWidth: 'normal',
  blockSpacing: 'normal',
  sidebarDefault: 'expanded',
  highContrast: false,
  fontSizeMultiplier: 1.0,
  reducedAnimations: false,
}
