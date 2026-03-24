import { z } from 'zod'

export const tagSchema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio').max(100, 'Maximo 100 caracteres'),
  color: z.string().max(7).nullable().optional(),
})

export type TagFormData = z.infer<typeof tagSchema>
