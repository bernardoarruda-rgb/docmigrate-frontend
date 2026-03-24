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
  icon: z.string().max(500).nullable().optional(),
  iconColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Formato invalido (#RRGGBB)')
    .nullable()
    .optional()
    .or(z.literal('')),
  backgroundColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Formato invalido (#RRGGBB)')
    .nullable()
    .optional()
    .or(z.literal('')),
  language: z.string().optional(),
  parentPageId: z.number().int().positive().nullable().optional(),
  sortOrder: z
    .number({ error: 'Ordem deve ser um numero' })
    .int('Ordem deve ser um numero inteiro')
    .min(0, 'Ordem deve ser maior ou igual a zero'),
})

export type PageFormData = z.infer<typeof pageSchema>
