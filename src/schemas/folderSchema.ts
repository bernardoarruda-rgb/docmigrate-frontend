import { z } from 'zod'
import { FIELD_LIMITS } from '@/config/constants'

export const folderSchema = z.object({
  title: z
    .string()
    .min(1, 'Titulo e obrigatorio')
    .max(FIELD_LIMITS.TITLE_MAX, `Titulo deve ter no maximo ${FIELD_LIMITS.TITLE_MAX} caracteres`),
  icon: z.string().max(500).nullable().optional(),
  iconColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Formato invalido (#RRGGBB)')
    .nullable()
    .optional()
    .or(z.literal('')),
})

export type FolderFormData = z.infer<typeof folderSchema>
