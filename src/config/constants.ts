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

export const ICON = {
  MAX_UPLOAD_SIZE: 1_048_576,
  ACCEPTED_TYPES: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'] as const,
  ACCEPTED_EXTENSIONS: '.png,.jpg,.jpeg,.svg,.webp',
  PREFIX_LUCIDE: 'lucide:',
  PREFIX_EMOJI: 'emoji:',
  PREFIX_UPLOAD: 'upload:',
} as const

export const EDITOR = {
  PLACEHOLDER: 'Comece a escrever ou digite "/" para comandos...',
  MIN_HEIGHT: 400,
  HEADING_LEVELS: [1, 2, 3] as const,
  SLASH_COMMAND_MAX_RESULTS: 30,
} as const

export const AUTOSAVE = {
  DEBOUNCE_MS: 2000,
} as const

export const PAGE_LOCK = {
  TIMEOUT_MINUTES: 30,
} as const

export const KEYCLOAK = {
  URL: import.meta.env.VITE_KEYCLOAK_URL ?? 'https://auth-dev.invoicy.com.br',
  REALM: import.meta.env.VITE_KEYCLOAK_REALM ?? 'Migrate',
  CLIENT_ID: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'docmigrate-frontend',
  MIN_TOKEN_VALIDITY_SECONDS: 60,
} as const

export const IMAGE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  ACCEPTED_EXTENSIONS: '.jpg,.jpeg,.png,.gif,.webp,.svg',
} as const

export const VIDEO_UPLOAD = {
  MAX_SIZE_MB: 100,
  MAX_SIZE_BYTES: 100 * 1024 * 1024,
  ACCEPTED_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  ACCEPTED_EXTENSIONS: '.mp4,.webm,.ogg',
} as const

export const DATE_FORMAT = {
  LOCALE: 'pt-BR',
  OPTIONS: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  } as Intl.DateTimeFormatOptions,
} as const

export const MENTION = {
  DEBOUNCE_MS: 300,
  MAX_RESULTS: 8,
  MIN_QUERY_LENGTH: 1,
} as const

export const LANGUAGES = {
  AVAILABLE: ['pt-BR', 'en', 'es'] as const,
  ORIGINAL: 'pt-BR',
  TRANSLATABLE: ['en', 'es'] as const,
  LABELS: { 'pt-BR': 'Portugues', en: 'English', es: 'Espanol' } as const,
  STORAGE_KEY: 'docmigrate:preferred-language',
} as const

export const TRANSLATION_STATUS = {
  AUTO: 'automatica',
  REVIEWED: 'revisada',
  OUTDATED: 'desatualizada',
} as const

