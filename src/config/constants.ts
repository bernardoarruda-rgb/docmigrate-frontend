export const APP_NAME = 'DocMigrate'
export const APP_DESCRIPTION = 'Plataforma interna de documentacao'

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

export const FIELD_LIMITS = {
  TITLE_MAX: 255,
  DESCRIPTION_MAX: 500,
} as const

export const EDITOR = {
  PLACEHOLDER: 'Comece a escrever o conteudo da pagina...',
  MIN_HEIGHT: 400,
  HEADING_LEVELS: [1, 2, 3] as const,
} as const
