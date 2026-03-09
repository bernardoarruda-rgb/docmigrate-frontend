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
import { pageSchema } from '@/schemas/pageSchema'
import { useCreatePage, useUpdatePage } from '@/hooks/usePages'
import type { PageFormData } from '@/schemas/pageSchema'

interface PageFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaceId: number
  page?: { id: number; title: string; description: string | null; sortOrder: number }
}

export function PageFormDialog({
  open,
  onOpenChange,
  spaceId,
  page,
}: PageFormDialogProps) {
  const isEditing = !!page
  const createMutation = useCreatePage()
  const updateMutation = useUpdatePage()
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: { title: '', description: '', sortOrder: 0 },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        title: page?.title ?? '',
        description: page?.description ?? '',
        sortOrder: page?.sortOrder ?? 0,
      })
    }
  }, [open, page, form])

  const onSubmit = (data: PageFormData) => {
    const description = data.description || null

    if (isEditing && page) {
      updateMutation.mutate(
        {
          id: page.id,
          data: { title: data.title, description, content: null, sortOrder: data.sortOrder },
        },
        {
          onSuccess: () => {
            toast.success('Pagina atualizada com sucesso')
            onOpenChange(false)
          },
          onError: (error) => {
            toast.error(error.message || 'Erro ao atualizar pagina')
          },
        },
      )
    } else {
      createMutation.mutate(
        {
          title: data.title,
          description,
          content: null,
          sortOrder: data.sortOrder,
          spaceId,
        },
        {
          onSuccess: () => {
            toast.success('Pagina criada com sucesso')
            onOpenChange(false)
          },
          onError: (error) => {
            toast.error(error.message || 'Erro ao criar pagina')
          },
        },
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar pagina' : 'Nova pagina'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="page-title">Titulo</Label>
            <Input
              id="page-title"
              {...form.register('title')}
              placeholder="Nome da pagina"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="page-description">Descricao</Label>
            <Textarea
              id="page-description"
              {...form.register('description')}
              placeholder="Descricao da pagina (opcional)"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="page-sortOrder">Ordem</Label>
            <Input
              id="page-sortOrder"
              type="number"
              {...form.register('sortOrder', { valueAsNumber: true })}
            />
            {form.formState.errors.sortOrder && (
              <p className="text-sm text-destructive">
                {form.formState.errors.sortOrder.message}
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
