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
import { templateSchema } from '@/schemas/templateSchema'
import { useCreateTemplate, useUpdateTemplate } from '@/hooks/useTemplates'
import type { TemplateFormData } from '@/schemas/templateSchema'
import type { TemplateListItem } from '@/types/template'

interface TemplateFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template?: TemplateListItem
}

export function TemplateFormDialog({ open, onOpenChange, template }: TemplateFormDialogProps) {
  const isEditing = !!template
  const createMutation = useCreateTemplate()
  const updateMutation = useUpdateTemplate()
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: '',
      description: '',
      icon: '',
      sortOrder: 0,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        title: template?.title ?? '',
        description: template?.description ?? '',
        icon: template?.icon ?? '',
        sortOrder: template?.sortOrder ?? 0,
      })
    }
  }, [open, template, form])

  const onSubmit = (data: TemplateFormData) => {
    const payload = {
      title: data.title,
      description: data.description || null,
      icon: data.icon || null,
      sortOrder: data.sortOrder,
    }

    if (isEditing && template) {
      updateMutation.mutate(
        { id: template.id, data: payload },
        {
          onSuccess: () => {
            toast.success('Template atualizado com sucesso')
            onOpenChange(false)
          },
          onError: (error) => {
            toast.error(error.message || 'Erro ao atualizar template')
          },
        },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Template criado com sucesso')
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.message || 'Erro ao criar template')
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar template' : 'Novo template'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titulo</Label>
            <Input id="title" {...form.register('title')} placeholder="Nome do template" />
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
          <div className="space-y-2">
            <Label htmlFor="icon">Icone</Label>
            <Input
              id="icon"
              {...form.register('icon')}
              placeholder="Nome do icone Lucide (ex: file-text, layout-template)"
            />
            {form.formState.errors.icon && (
              <p className="text-sm text-destructive">{form.formState.errors.icon.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Ordem</Label>
            <Input
              id="sortOrder"
              type="number"
              {...form.register('sortOrder', { valueAsNumber: true })}
              placeholder="0"
            />
            {form.formState.errors.sortOrder && (
              <p className="text-sm text-destructive">{form.formState.errors.sortOrder.message}</p>
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
