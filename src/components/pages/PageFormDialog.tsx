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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LANGUAGES } from '@/config/constants'
import { IconPicker } from '@/components/ui/IconPicker'
import { ColorPicker } from '@/components/editor/properties/ColorPicker'
import { pageSchema } from '@/schemas/pageSchema'
import { useCreatePage, useUpdatePage, usePages } from '@/hooks/usePages'
import { useSetPageTags } from '@/hooks/useTags'
import { TagPicker } from '@/components/tags/TagPicker'
import { TemplateSelector } from '@/components/editor/TemplateSelector'
import type { PageFormData } from '@/schemas/pageSchema'
import type { PageTemplate } from '@/components/editor/templateDefinitions'

interface PageFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaceId: number
  parentPageId?: number | null
  page?: { id: number; title: string; description: string | null; sortOrder: number; icon: string | null; iconColor: string | null; backgroundColor: string | null; language?: string }
}

export function PageFormDialog({
  open,
  onOpenChange,
  spaceId,
  parentPageId,
  page,
}: PageFormDialogProps) {
  const isEditing = !!page
  const createMutation = useCreatePage()
  const updateMutation = useUpdatePage()
  const setTagsMutation = useSetPageTags()
  const isPending = createMutation.isPending || updateMutation.isPending
  const { data: availablePages } = usePages(spaceId)

  const [step, setStep] = useState<'template' | 'form'>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null)
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [selectedParentPageId, setSelectedParentPageId] = useState<number | null>(null)

  const form = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: { title: '', description: '', sortOrder: 0, icon: null, iconColor: null, backgroundColor: null, language: 'pt-BR' },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        title: page?.title ?? '',
        description: page?.description ?? '',
        sortOrder: page?.sortOrder ?? 0,
        icon: page?.icon ?? null,
        iconColor: page?.iconColor ?? null,
        backgroundColor: page?.backgroundColor ?? null,
        language: page?.language ?? 'pt-BR',
      })
      setStep(isEditing ? 'form' : 'template')
      setSelectedTemplate(null)
      setSelectedTagIds([])
      setSelectedParentPageId(parentPageId ?? null)
    }
  }, [open, page, form, isEditing, parentPageId])

  const handleTemplateSelect = (template: PageTemplate) => {
    setSelectedTemplate(template)
    setStep('form')
  }

  const watchIcon = form.watch('icon')
  const watchIconColor = form.watch('iconColor')

  const onSubmit = (data: PageFormData) => {
    const description = data.description || null
    const icon = data.icon || null
    const iconColor = data.iconColor || null
    const backgroundColor = data.backgroundColor || null
    const language = data.language ?? 'pt-BR'
    const templateContent = selectedTemplate && selectedTemplate.id !== 'blank'
      ? JSON.stringify(selectedTemplate.content)
      : null

    if (isEditing && page) {
      updateMutation.mutate(
        {
          id: page.id,
          data: { title: data.title, description, sortOrder: data.sortOrder, icon, iconColor, backgroundColor, language, parentPageId: selectedParentPageId },
        },
        {
          onSuccess: () => {
            if (selectedTagIds.length > 0) {
              setTagsMutation.mutate({ pageId: page.id, tagIds: selectedTagIds })
            }
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
          content: templateContent,
          sortOrder: data.sortOrder,
          spaceId,
          icon,
          iconColor,
          backgroundColor,
          language,
          parentPageId: selectedParentPageId,
        },
        {
          onSuccess: (created) => {
            if (selectedTagIds.length > 0) {
              setTagsMutation.mutate({ pageId: created.id, tagIds: selectedTagIds })
            }
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
      <DialogContent className={step === 'template' ? 'sm:max-w-lg' : undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? 'Editar pagina'
              : step === 'template'
                ? 'Escolher template'
                : 'Nova pagina'}
          </DialogTitle>
        </DialogHeader>

        {step === 'template' && !isEditing ? (
          <div>
            <TemplateSelector onSelect={handleTemplateSelect} />
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {selectedTemplate && selectedTemplate.id !== 'blank' && (
              <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
                <span className="text-muted-foreground">Template:</span>
                <span className="font-medium">{selectedTemplate.title}</span>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setStep('template')}
                    className="ml-auto text-xs text-primary hover:underline"
                  >
                    Trocar
                  </button>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label>Pagina pai (opcional)</Label>
              <Select
                value={selectedParentPageId?.toString() ?? 'root'}
                onValueChange={(val) => setSelectedParentPageId(val === 'root' ? null : Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Raiz do espaco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Raiz do espaco</SelectItem>
                  {(availablePages ?? [])
                    .filter(p => p.level < 5 && p.id !== page?.id)
                    .map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {'  '.repeat(p.level - 1)}{p.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
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
              <Label>Idioma original</Label>
              <Select
                value={form.watch('language') ?? 'pt-BR'}
                onValueChange={(val) => form.setValue('language', val ?? 'pt-BR', { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.AVAILABLE.map(lang => (
                    <SelectItem key={lang} value={lang}>
                      {LANGUAGES.LABELS[lang as keyof typeof LANGUAGES.LABELS]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        )}
      </DialogContent>
    </Dialog>
  )
}
