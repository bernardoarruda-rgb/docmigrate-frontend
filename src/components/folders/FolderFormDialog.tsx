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
import { Label } from '@/components/ui/label'
import { IconPicker } from '@/components/ui/IconPicker'
import { ColorPicker } from '@/components/editor/properties/ColorPicker'
import { folderSchema } from '@/schemas/folderSchema'
import { useCreateFolder, useUpdateFolder } from '@/hooks/useFolders'
import type { FolderFormData } from '@/schemas/folderSchema'

interface FolderFormDialogFolder {
  id: number
  title: string
  icon: string | null
  iconColor: string | null
}

interface FolderFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaceId: number
  parentFolderId?: number | null
  folder?: FolderFormDialogFolder
}

export function FolderFormDialog({
  open,
  onOpenChange,
  spaceId,
  parentFolderId = null,
  folder,
}: FolderFormDialogProps) {
  const isEditing = !!folder
  const createMutation = useCreateFolder()
  const updateMutation = useUpdateFolder(spaceId)
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<FolderFormData>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      title: '',
      icon: null,
      iconColor: null,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        title: folder?.title ?? '',
        icon: folder?.icon ?? null,
        iconColor: folder?.iconColor ?? null,
      })
    }
  }, [open, folder, form])

  const watchIcon = form.watch('icon')
  const watchIconColor = form.watch('iconColor')

  const onSubmit = (data: FolderFormData) => {
    if (isEditing && folder) {
      updateMutation.mutate(
        {
          id: folder.id,
          data: {
            title: data.title,
            icon: data.icon || null,
            iconColor: data.iconColor || null,
            sortOrder: 0,
            parentFolderId,
          },
        },
        {
          onSuccess: () => {
            toast.success('Pasta atualizada com sucesso')
            onOpenChange(false)
          },
          onError: (error) => {
            toast.error(error.message || 'Erro ao atualizar pasta')
          },
        },
      )
    } else {
      createMutation.mutate(
        {
          title: data.title,
          icon: data.icon || null,
          iconColor: data.iconColor || null,
          sortOrder: 0,
          spaceId,
          parentFolderId,
        },
        {
          onSuccess: () => {
            toast.success('Pasta criada com sucesso')
            onOpenChange(false)
          },
          onError: (error) => {
            toast.error(error.message || 'Erro ao criar pasta')
          },
        },
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar pasta' : 'Nova pasta'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-title">Titulo</Label>
            <Input
              id="folder-title"
              {...form.register('title')}
              placeholder="Nome da pasta"
              autoFocus
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
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
