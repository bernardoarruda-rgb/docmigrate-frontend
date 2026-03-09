import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { JSONContent } from '@tiptap/react'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'
import { usePage, useUpdatePage } from '@/hooks/usePages'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { RichTextEditor } from '@/components/editor/RichTextEditor'

export function PageEditPage() {
  const { pageId } = useParams<{ pageId: string }>()
  const id = Number(pageId)
  const { data: page, isLoading } = usePage(id)
  const updateMutation = useUpdatePage()

  const [content, setContent] = useState<JSONContent | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (!page?.content) return

    try {
      const parsed = JSON.parse(page.content) as JSONContent
      setContent(parsed)
    } catch {
      setContent(null)
    }
  }, [page?.content])

  const handleContentChange = useCallback((newContent: JSONContent) => {
    setContent(newContent)
    setIsDirty(true)
  }, [])

  function handleSave() {
    if (!page) return

    updateMutation.mutate(
      {
        id,
        data: {
          title: page.title,
          description: page.description,
          content: content ? JSON.stringify(content) : null,
          sortOrder: page.sortOrder,
        },
      },
      {
        onSuccess: () => {
          toast.success('Conteudo salvo com sucesso')
          setIsDirty(false)
        },
        onError: (error) => {
          toast.error(error.message || 'Erro ao salvar conteudo')
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-5 w-20 mb-4" />
        <Skeleton className="h-8 w-1/3 mb-6" />
        <Skeleton className="h-115 w-full rounded-lg" />
      </div>
    )
  }

  if (!page) {
    return <p className="text-muted-foreground">Pagina nao encontrada.</p>
  }

  return (
    <div>
      <Link
        to={`/pages/${pageId}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-heading truncate">{page.title}</h2>
        <Button
          onClick={handleSave}
          disabled={!isDirty || updateMutation.isPending}
          className="shrink-0"
        >
          <Save className="h-4 w-4" />
          {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      <RichTextEditor content={content} onChange={handleContentChange} />
    </div>
  )
}
