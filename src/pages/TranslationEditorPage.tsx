import { useState, useCallback, useMemo, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import type { JSONContent } from '@tiptap/react'
import { ArrowLeft, Save, Home, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { usePage } from '@/hooks/usePages'
import { useTranslation, useUpdateTranslation } from '@/hooks/useTranslations'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useSpace } from '@/hooks/useSpaces'
import { useSidebar } from '@/hooks/useSidebar'
import { LANGUAGES } from '@/config/constants'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function TranslationEditorPage() {
  const { spaceId, pageId, lang } = useParams<{ spaceId: string; pageId: string; lang: string }>()
  const numSpaceId = Number(spaceId)
  const numPageId = Number(pageId)
  const language = lang ?? ''

  const { data: space } = useSpace(numSpaceId)
  const { data: page, isLoading: pageLoading } = usePage(numPageId)
  const { data: translation, isLoading: translationLoading } = useTranslation(numPageId, language)
  const updateTranslation = useUpdateTranslation()
  const navigate = useNavigate()
  const { setHidden } = useSidebar()

  const langLabel = LANGUAGES.LABELS[language as keyof typeof LANGUAGES.LABELS] ?? language
  useDocumentTitle(translation ? `Traduzir: ${translation.title}` : 'Traduzindo...')

  // Hide sidebar in editor mode
  useEffect(() => {
    setHidden(true)
    return () => setHidden(false)
  }, [setHidden])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState<string | null>(null)

  // Initialize form when translation loads
  useEffect(() => {
    if (translation) {
      setTitle(translation.title)
      setDescription(translation.description ?? '')
      setContent(translation.content ?? null)
    }
  }, [translation])

  const parsedContent = useMemo<JSONContent | null>(() => {
    if (!content) return null
    try { return JSON.parse(content) as JSONContent } catch { return null }
  }, [content])

  const handleContentChange = useCallback((json: JSONContent) => {
    setContent(JSON.stringify(json))
  }, [])

  async function handleSave() {
    if (!title.trim()) {
      toast.error('Titulo e obrigatorio')
      return
    }
    updateTranslation.mutate(
      {
        pageId: numPageId,
        lang: language,
        data: { title, description: description || null, content },
      },
      {
        onSuccess: () => {
          toast.success('Traducao salva')
          navigate(`/spaces/${spaceId}/pages/${pageId}`)
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : 'Erro ao salvar'),
      },
    )
  }

  const handleBack = useCallback(() => {
    navigate(`/spaces/${numSpaceId}/pages/${numPageId}`)
  }, [navigate, numSpaceId, numPageId])

  if (pageLoading || translationLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!page || !translation) {
    return <p className="text-muted-foreground p-6">Traducao nao encontrada.</p>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center gap-1">
                    <Home className="h-3 w-3" /> Inicio
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/spaces/${numSpaceId}`}>{space?.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/spaces/${numSpaceId}/pages/${numPageId}`}>{page.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Traduzir ({langLabel})</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button onClick={handleSave} disabled={updateTranslation.isPending}>
          {updateTranslation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar traducao
        </Button>
      </div>

      {/* Original reference (collapsed) */}
      <details className="mb-6 rounded-lg border border-border p-4">
        <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
          Ver original ({page.language ? LANGUAGES.LABELS[page.language as keyof typeof LANGUAGES.LABELS] ?? page.language : 'PT-BR'})
        </summary>
        <div className="mt-3 space-y-2 text-sm">
          <p><strong>Titulo:</strong> {page.title}</p>
          {page.description && <p><strong>Descricao:</strong> {page.description}</p>}
        </div>
      </details>

      {/* Translation form */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Titulo ({langLabel})</label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titulo traduzido" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Descricao ({langLabel})</label>
          <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Descricao traduzida (opcional)" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Conteudo ({langLabel})</label>
          <RichTextEditor content={parsedContent} onChange={handleContentChange} />
        </div>
      </div>
    </div>
  )
}
