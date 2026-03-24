import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import type { JSONContent } from '@tiptap/react'
import { ArrowLeft, Loader2, Lock } from 'lucide-react'
import { usePage } from '@/hooks/usePages'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useSpace } from '@/hooks/useSpaces'
import { useAutosave } from '@/hooks/useAutosave'
import { useSidebar } from '@/hooks/useSidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { ENDPOINTS } from '@/config/endpoints'
import { getToken } from '@/lib/authStore'
import { apiClient } from '@/lib/apiClient'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function PageEditPage() {
  const { spaceId, pageId } = useParams<{ spaceId: string; pageId: string }>()
  const id = Number(pageId)
  const numSpaceId = Number(spaceId)
  const { data: page, isLoading: pageLoading } = usePage(id)
  useDocumentTitle(page ? `Editando: ${page.title}` : undefined)
  const { data: space } = useSpace(numSpaceId)
  const { save, status: saveStatus } = useAutosave(id)
  const navigate = useNavigate()
  const { setHidden } = useSidebar()

  const [content, setContent] = useState<JSONContent | null>(null)
  const [lockAcquired, setLockAcquired] = useState(false)
  const [lockError, setLockError] = useState<string | null>(null)

  // Hide sidebar on mount, restore on unmount
  useEffect(() => {
    setHidden(true)
    return () => setHidden(false)
  }, [setHidden])

  // Acquire lock on mount
  useEffect(() => {
    let cancelled = false

    apiClient
      .post<{ locked: boolean }>(ENDPOINTS.PAGES_LOCK(id), {})
      .then(() => {
        if (!cancelled) setLockAcquired(true)
      })
      .catch((err) => {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : 'Erro ao adquirir lock'
          setLockError(msg)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!page?.content) return

    try {
      const parsed = JSON.parse(page.content) as JSONContent
      setContent(parsed)
    } catch {
      setContent(null)
    }
  }, [page?.content])

  // Fallback: release lock via raw fetch on unmount + beforeunload (for tab close/crash)
  useEffect(() => {
    if (!lockAcquired) return

    const releaseLockFetch = () => {
      const url = ENDPOINTS.PAGES_LOCK(id)
      const token = getToken()
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`
      fetch(url, { method: 'DELETE', headers, keepalive: true })
    }

    window.addEventListener('beforeunload', releaseLockFetch)
    return () => {
      window.removeEventListener('beforeunload', releaseLockFetch)
      releaseLockFetch()
    }
  }, [id, lockAcquired])

  // Explicit lock release via apiClient (reliable, with auth)
  const releaseLock = useCallback(async () => {
    try {
      await apiClient.delete(ENDPOINTS.PAGES_LOCK(id))
    } catch {
      // Silently ignore — fallback fetch on unmount will also try
    }
  }, [id])

  // Navigate back after explicitly releasing the lock (ensures version creation)
  const handleBack = useCallback(async () => {
    await releaseLock()
    navigate(`/spaces/${numSpaceId}/pages/${id}`)
  }, [releaseLock, navigate, numSpaceId, id])

  const handleContentChange = useCallback((newContent: JSONContent) => {
    setContent(newContent)
    save(JSON.stringify(newContent))
  }, [save])

  if (pageLoading) {
    return (
      <div>
        <Skeleton className="h-4 w-16 mb-4" />
        <Skeleton className="h-8 w-1/3 mb-6" />
        <Skeleton className="h-115 w-full rounded-xl" />
      </div>
    )
  }

  if (!page) {
    return <p className="text-muted-foreground">Pagina nao encontrada.</p>
  }

  if (lockError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Lock className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground text-center max-w-md">{lockError}</p>
        <button
          onClick={() => navigate(`/spaces/${numSpaceId}/pages/${id}`)}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para a pagina
        </button>
      </div>
    )
  }

  if (!lockAcquired) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden px-6 py-4 bg-muted/30">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-accent transition-colors shrink-0"
            title="Voltar para a pagina"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        <Breadcrumb>
          <BreadcrumbList>
            {space ? (
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/spaces/${numSpaceId}`}>{space.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <Skeleton className="h-4 w-20" />
              </BreadcrumbItem>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/spaces/${numSpaceId}/pages/${page.id}`}>{page.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Editar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        </div>

        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Salvando...
            </>
          )}
          {saveStatus === 'saved' && 'Salvo'}
          {saveStatus === 'unsaved' && (
            <span className="text-yellow-600">Alteracoes pendentes</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-destructive">Erro ao salvar</span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4 shrink-0">
        <h2 className="text-2xl font-bold font-heading truncate">{page.title}</h2>
      </div>

      <div className="flex-1 min-h-0">
        <RichTextEditor
          content={content}
          onChange={handleContentChange}
          pageTitle={page.title}
          pageContent={page.content}
        />
      </div>
    </div>
  )
}
