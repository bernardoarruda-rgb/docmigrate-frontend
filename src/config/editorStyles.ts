export const STYLE_BORDER_WIDTHS = [
  { value: '0', label: 'Nenhuma' },
  { value: '1px', label: '1px' },
  { value: '2px', label: '2px' },
  { value: '4px', label: '4px' },
] as const

export const STYLE_BORDER_RADII = {
  none: { value: '0', label: 'Nenhum' },
  sm: { value: '0.25rem', label: 'P' },
  md: { value: '0.5rem', label: 'M' },
  lg: { value: '1rem', label: 'G' },
  full: { value: '9999px', label: 'Redondo' },
} as const

export const STYLE_BORDER_STYLES = [
  { value: 'solid', label: 'Solida' },
  { value: 'dashed', label: 'Tracejada' },
  { value: 'dotted', label: 'Pontilhada' },
] as const

export const STYLE_SHADOWS = {
  none: { value: 'none', label: 'Nenhuma', css: 'none' },
  sm: { value: 'sm', label: 'Suave', css: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  md: { value: 'md', label: 'Media', css: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
  lg: { value: 'lg', label: 'Forte', css: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
} as const

export const STYLE_BMS_PALETTE = [
  '#E5892B',
  '#FDF4EA',
  '#FFE7D0',
  '#000000',
  '#FFFFFF',
  '#1e293b',
  '#ef4444',
  '#22c55e',
] as const

export const STYLE_WIDTH_PRESETS = [
  { value: 'auto', label: 'Auto' },
  { value: '25%', label: '25%' },
  { value: '50%', label: '50%' },
  { value: '75%', label: '75%' },
  { value: '100%', label: '100%' },
] as const

export const STYLE_HEIGHT_PRESETS = [
  { value: 'auto', label: 'Auto' },
  { value: '100px', label: '100px' },
  { value: '200px', label: '200px' },
  { value: '300px', label: '300px' },
  { value: '400px', label: '400px' },
] as const

export const GRID_COLUMNS_OPTIONS = [2, 3, 4, 5, 6] as const

export const GRID_GAP = {
  sm: { value: 'sm', label: 'P', css: '0.5rem' },
  md: { value: 'md', label: 'M', css: '1rem' },
  lg: { value: 'lg', label: 'G', css: '1.5rem' },
} as const

export type GridGapKey = keyof typeof GRID_GAP

export const GRID_ROW_SPAN_OPTIONS = [1, 2, 3, 4] as const

export const STYLE_PRESETS = [
  {
    name: 'Card sutil',
    attrs: {
      styleBorderWidth: '1px',
      styleBorderStyle: 'solid',
      styleBorderColor: '#e2e8f0',
      styleBorderRadius: '0.5rem',
      stylePaddingTop: '1rem',
      stylePaddingRight: '1rem',
      stylePaddingBottom: '1rem',
      stylePaddingLeft: '1rem',
    },
  },
  {
    name: 'Destaque BMS',
    attrs: {
      styleBgColor: '#FDF4EA',
      stylePaddingTop: '1rem',
      stylePaddingRight: '1rem',
      stylePaddingBottom: '1rem',
      stylePaddingLeft: '1rem',
      styleBorderRadius: '0.5rem',
    },
  },
  {
    name: 'Sombra',
    attrs: {
      styleShadow: 'md',
      styleBorderRadius: '0.5rem',
      stylePaddingTop: '1rem',
      stylePaddingRight: '1rem',
      stylePaddingBottom: '1rem',
      stylePaddingLeft: '1rem',
    },
  },
  {
    name: 'Escuro',
    attrs: {
      styleBgColor: '#1e293b',
      styleTextColor: '#f8fafc',
      stylePaddingTop: '1rem',
      stylePaddingRight: '1rem',
      stylePaddingBottom: '1rem',
      stylePaddingLeft: '1rem',
      styleBorderRadius: '0.5rem',
    },
  },
  {
    name: 'Alerta',
    attrs: {
      styleBgColor: '#fef2f2',
      styleBorderWidth: '1px',
      styleBorderStyle: 'solid',
      styleBorderColor: '#ef4444',
      styleBorderRadius: '0.5rem',
      stylePaddingTop: '0.75rem',
      stylePaddingRight: '1rem',
      stylePaddingBottom: '0.75rem',
      stylePaddingLeft: '1rem',
    },
  },
  {
    name: 'Sucesso',
    attrs: {
      styleBgColor: '#f0fdf4',
      styleBorderWidth: '1px',
      styleBorderStyle: 'solid',
      styleBorderColor: '#22c55e',
      styleBorderRadius: '0.5rem',
      stylePaddingTop: '0.75rem',
      stylePaddingRight: '1rem',
      stylePaddingBottom: '0.75rem',
      stylePaddingLeft: '1rem',
    },
  },
] as const
