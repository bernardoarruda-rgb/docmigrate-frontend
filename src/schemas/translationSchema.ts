import { z } from 'zod'
import { FIELD_LIMITS } from '@/config/constants'

export const updateTranslationSchema = z.object({
  title: z.string().min(1, 'Titulo e obrigatorio').max(FIELD_LIMITS.TITLE_MAX, `Titulo deve ter no maximo ${FIELD_LIMITS.TITLE_MAX} caracteres`),
  description: z.string().max(FIELD_LIMITS.DESCRIPTION_MAX).nullable().optional(),
  content: z.string().nullable().optional(),
})

export type UpdateTranslationFormData = z.infer<typeof updateTranslationSchema>
