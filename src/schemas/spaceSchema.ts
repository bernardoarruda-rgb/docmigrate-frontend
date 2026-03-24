import { z } from 'zod'
import { FIELD_LIMITS } from '@/config/constants'

export const spaceSchema = z.object({
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
})

export type SpaceFormData = z.infer<typeof spaceSchema>
