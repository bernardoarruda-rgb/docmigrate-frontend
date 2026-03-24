export const IMPORT = {
  ACCEPTED_EXTENSIONS: '.md,.docx',
  ACCEPTED_TYPES: [
    'text/markdown',
    'text/x-markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ] as readonly string[],
  MAX_FILE_SIZE: 10_485_760, // 10MB
  MAX_IMAGE_SIZE: 1_048_576, // 1MB (matches backend limit)
} as const
