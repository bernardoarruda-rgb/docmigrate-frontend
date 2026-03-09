import { z } from 'zod'
import { FIELD_LIMITS } from '@/config/constants'

export const pageSchema = z.object({
  title: z
    .string()
    .min(1, 'Titulo e obrigatorio')
    .max(FIELD_LIMITS.TITLE_MAX, `Titulo deve ter no maximo ${FIELD_LIMITS.TITLE_MAX} caracteres`),
  description: z
    .string()
    .max(FIELD_LIMITS.DESCRIPTION_MAX, `Descricao deve ter no maximo ${FIELD_LIMITS.DESCRIPTION_MAX} caracteres`)
    .optional()
    .or(z.literal('')),
  sortOrder: z
    .number({ error: 'Ordem deve ser um numero' })
    .int('Ordem deve ser um numero inteiro')
    .min(0, 'Ordem deve ser maior ou igual a zero'),
})

export type PageFormData = z.infer<typeof pageSchema>
