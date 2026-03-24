import { useEffect, useState } from 'react'
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
import { IconPicker } from '@/components/ui/IconPicker'
import { ColorPicker } from '@/components/editor/properties/ColorPicker'
import { spaceSchema } from '@/schemas/spaceSchema'
import { useCreateSpace, useUpdateSpace } from '@/hooks/useSpaces'
import { useSetSpaceTags } from '@/hooks/useTags'
import { TagPicker } from '@/components/tags/TagPicker'
import type { SpaceFormData } from '@/schemas/spaceSchema'

interface SpaceFormDialogSpace {
  id: number
  title: string
  description: string | null
  icon: string | null
  iconColor: string | null
  backgroundColor: string | null
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
  const setTagsMutation = useSetSpaceTags()
  const isPending = createMutation.isPending || updateMutation.isPending
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])

  const form = useForm<SpaceFormData>({
    resolver: zodResolver(spaceSchema),
    defaultValues: {
      title: '',
      description: '',
      icon: null,
      iconColor: null,
      backgroundColor: null,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        title: space?.title ?? '',
        description: space?.description ?? '',
        icon: space?.icon ?? null,
        iconColor: space?.iconColor ?? null,
        backgroundColor: space?.backgroundColor ?? null,
      })
      setSelectedTagIds([])
    }
  }, [open, space, form])

  const watchIcon = form.watch('icon')
  const watchIconColor = form.watch('iconColor')

  const onSubmit = (data: SpaceFormData) => {
    const payload = {
      title: data.title,
      description: data.description || null,
      icon: data.icon || null,
      iconColor: data.iconColor || null,
      backgroundColor: data.backgroundColor || null,
    }

    if (isEditing && space) {
      updateMutation.mutate(
        { id: space.id, data: payload },
        {
          onSuccess: () => {
            if (selectedTagIds.length > 0) {
              setTagsMutation.mutate({ spaceId: space.id, tagIds: selectedTagIds })
            }
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
        onSuccess: (created) => {
          if (selectedTagIds.length > 0) {
            setTagsMutation.mutate({ spaceId: created.id, tagIds: selectedTagIds })
          }
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
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagPicker selectedTagIds={selectedTagIds} onChange={setSelectedTagIds} />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium">Personalizacao</Label>
            <div className="flex items-center gap-3">
              <Label className="text-xs text-muted-foreground shrink-0">Icone</Label>
              <IconPicker
                value={watchIcon ?? null}
                onChange={(icon) => form.setValue('icon', icon, { shouldDirty: true })}
                iconColor={watchIconColor}
              />
            </div>
            <ColorPicker
              label="Cor do icone"
              value={watchIconColor ?? null}
              onChange={(color) => form.setValue('iconColor', color, { shouldDirty: true })}
            />
            <ColorPicker
              label="Cor de fundo"
              value={form.watch('backgroundColor') ?? null}
              onChange={(color) => form.setValue('backgroundColor', color, { shouldDirty: true })}
            />
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
