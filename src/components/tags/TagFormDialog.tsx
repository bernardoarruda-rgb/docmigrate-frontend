import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateTag, useUpdateTag } from '@/hooks/useTags'
import { tagSchema, type TagFormData } from '@/schemas/tagSchema'
import { toast } from 'sonner'
import type { TagListItem } from '@/types/tag'

const TAG_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
] as const

interface TagFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tag?: TagListItem
}

export function TagFormDialog({ open, onOpenChange, tag }: TagFormDialogProps) {
  const isEditing = !!tag
  const createMutation = useCreateTag()
  const updateMutation = useUpdateTag()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
      color: null,
    },
  })

  const selectedColor = watch('color')

  useEffect(() => {
    if (open) {
      reset({
        name: tag?.name ?? '',
        color: tag?.color ?? null,
      })
    }
  }, [open, tag, reset])

  const onSubmit = (data: TagFormData) => {
    if (isEditing && tag) {
      updateMutation.mutate(
        { id: tag.id, data: { name: data.name, color: data.color } },
        {
          onSuccess: () => {
            toast.success('Tag atualizada com sucesso')
            onOpenChange(false)
          },
          onError: (err) => {
            toast.error(err.message || 'Erro ao atualizar tag')
          },
        },
      )
    } else {
      createMutation.mutate(
        { name: data.name, color: data.color },
        {
          onSuccess: () => {
            toast.success('Tag criada com sucesso')
            onOpenChange(false)
          },
          onError: (err) => {
            toast.error(err.message || 'Erro ao criar tag')
          },
        },
      )
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar tag' : 'Nova tag'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Nome</Label>
            <Input
              id="tag-name"
              {...register('name')}
              placeholder="Nome da tag"
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex items-center gap-2 flex-wrap">
              {TAG_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', selectedColor === color ? null : color)}
                  className={`h-7 w-7 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? 'border-foreground scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              {selectedColor && (
                <button
                  type="button"
                  onClick={() => setValue('color', null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Remover cor
                </button>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
