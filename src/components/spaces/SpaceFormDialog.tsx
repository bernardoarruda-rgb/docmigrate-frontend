import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { spaceSchema } from '@/schemas/spaceSchema'
import { useCreateSpace, useUpdateSpace } from '@/hooks/useSpaces'
import type { SpaceFormData } from '@/schemas/spaceSchema'

interface SpaceFormDialogSpace {
  id: number
  title: string
  description: string | null
}

interface SpaceFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  space?: SpaceFormDialogSpace
}

export function SpaceFormDialog({ open, onOpenChange, space }: SpaceFormDialogProps) {
  const isEditing = !!space
  const createMutation = useCreateSpace()
  const updateMutation = useUpdateSpace()
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<SpaceFormData>({
    resolver: zodResolver(spaceSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        title: space?.title ?? '',
        description: space?.description ?? '',
      })
    }
  }, [open, space, form])

  const onSubmit = (data: SpaceFormData) => {
    const payload = {
      title: data.title,
      description: data.description || null,
    }

    if (isEditing && space) {
      updateMutation.mutate(
        { id: space.id, data: payload },
        {
          onSuccess: () => {
            toast.success('Espaco atualizado com sucesso')
            onOpenChange(false)
          },
          onError: (error) => {
            toast.error(error.message || 'Erro ao atualizar espaco')
          },
        },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Espaco criado com sucesso')
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.message || 'Erro ao criar espaco')
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar espaco' : 'Novo espaco'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titulo</Label>
            <Input id="title" {...form.register('title')} placeholder="Nome do espaco" />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descricao</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Descricao opcional"
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
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
