import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import type { JSONContent } from '@tiptap/react'
import { Pencil, History } from 'lucide-react'
import { toast } from 'sonner'
import { usePage, useAcquirePageLock } from '@/hooks/usePages'
import { useRecordVisit } from '@/hooks/useUserActivity'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useSpace } from '@/hooks/useSpaces'
import { usePermissions } from '@/hooks/usePermissions'
import { ContentRenderer } from '@/components/editor/ContentRenderer'
import { scrollToAndHighlight } from '@/lib/scrollToHeading'
import { TableOfContents } from '@/components/site/TableOfContents'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { MetadataFooter } from '@/components/ui/MetadataFooter'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { VersionHistoryPanel } from '@/components/pages/VersionHistoryPanel'
import { CommentsSection } from '@/components/comments/CommentsSection'
import { PageBreadcrumbs } from '@/components/ui/PageBreadcrumbs'
import { LANGUAGES } from '@/config/constants'
import { useTranslation, useGenerateTranslation } from '@/hooks/useTranslations'
import { LanguageSelector } from '@/components/translations/LanguageSelector'
import { TranslationBanner } from '@/components/translations/TranslationBanner'

function PageContent({ content }: { content: string | null }) {
  const parsed = useMemo<JSONContent | null>(() => {
    if (!content) return null
    try {
      return JSON.parse(content) as JSONContent
    } catch {
      return null
    }
  }, [content])

  if (!parsed) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground text-sm">
          Esta pagina ainda nao tem conteudo.
        </p>
      </div>
    )
  }

  return <ContentRenderer content={parsed} />
}

export function PageViewPage() {
  const { spaceId, pageId } = useParams<{ spaceId: string; pageId: string }>()
  const numSpaceId = Number(spaceId)
  const numPageId = Number(pageId)

  const { data: space } = useSpace(numSpaceId)
  const { data: page, isLoading } = usePage(numPageId)
  useDocumentTitle(page?.title)
  const { canEdit } = usePermissions()
  const acquireLock = useAcquirePageLock()
  const recordVisit = useRecordVisit()
  const navigate = useNavigate()
  const location = useLocation()
  const scrollRef = useRef<HTMLElement>(null)
  const [historyOpen, setHistoryOpen] = useState(false)

  const [currentLang, setCurrentLang] = useState<string>(() => {
    const stored = localStorage.getItem(LANGUAGES.STORAGE_KEY)
    if (stored && LANGUAGES.AVAILABLE.includes(stored as typeof LANGUAGES.AVAILABLE[number])) return stored
    const browserLang = navigator.language.split('-')[0]
    if (LANGUAGES.TRANSLATABLE.includes(browserLang as typeof LANGUAGES.TRANSLATABLE[number])) return browserLang
    return LANGUAGES.ORIGINAL
  })

  const { data: translation } = useTranslation(numPageId, page && currentLang !== page.language ? currentLang : null)
  const generateTranslation = useGenerateTranslation()

  function handleLanguageChange(lang: string) {
    setCurrentLang(lang)
    localStorage.setItem(LANGUAGES.STORAGE_KEY, lang)
  }

  const isTranslated = page && currentLang !== page.language && translation
  const displayTitle = isTranslated ? translation.title : page?.title
  const displayDescription = isTranslated ? translation.description : page?.description
  const displayContent = isTranslated ? translation.content : page?.content
  const translationStatus = isTranslated ? translation.status : null

  useEffect(() => {
    if (page) recordVisit.mutate(numPageId)
  }, [page?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!page || !location.hash) return
    const headingId = location.hash.slice(1)
    const timer = setTimeout(() => {
      scrollToAndHighlight(headingId)
    }, 200)
    return () => clearTimeout(timer)
  }, [page, location.hash])

  async function handleEdit() {
    try {
      await acquireLock.mutateAsync(numPageId)
      navigate(`/spaces/${spaceId}/pages/${pageId}/edit`)
    } catch (err) {
      const message = err instanceof Error && err.message
        ? err.message
        : 'Pagina esta sendo editada por outro usuario.'
      toast.error(message)
    }
  }

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-4 w-48 mb-4" />
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }

  if (!page) {
    return <p className="text-muted-foreground">Pagina nao encontrada.</p>
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <PageBreadcrumbs
        spaceId={numSpaceId}
        spaceName={space?.title}
        breadcrumbs={page.breadcrumbs}
        currentPageTitle={page.title}
        className="mb-4"
      />

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold font-heading">{displayTitle ?? page.title}</h1>
            {page.language && page.language !== 'pt-BR' && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                {page.language.toUpperCase()}
              </span>
            )}
            <FavoriteButton pageId={numPageId} />
          </div>
          {page.description && (
            <p className="text-muted-foreground mt-2">{displayDescription ?? page.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSelector
            pageId={numPageId}
            spaceId={numSpaceId}
            pageLanguage={page.language ?? 'pt-BR'}
            currentLang={currentLang}
            onLanguageChange={handleLanguageChange}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHistoryOpen(true)}
          >
            <History className="h-4 w-4" />
            Historico
          </Button>
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              disabled={acquireLock.isPending}
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {translationStatus && (
        <TranslationBanner
          status={translationStatus}
          language={currentLang}
          onViewOriginal={() => handleLanguageChange(page.language ?? 'pt-BR')}
          onRefresh={() => generateTranslation.mutate(
            { pageId: numPageId, lang: currentLang },
            { onSuccess: () => toast.success('Traducao atualizada') }
          )}
          isRefreshing={generateTranslation.isPending}
        />
      )}

      {/* Content + ToC */}
      <div className="flex gap-8">
        <article ref={scrollRef} className="flex-1 min-w-0 max-w-3xl">
          <PageContent content={displayContent ?? page?.content ?? null} />
        </article>
        <div className="hidden xl:block shrink-0 w-48">
          <TableOfContents content={page.content} scrollContainer={scrollRef} />
        </div>
      </div>

      {/* Metadata footer */}
      <MetadataFooter
        createdByName={page.createdByName}
        createdAt={page.createdAt}
        updatedByName={page.updatedByName}
        updatedAt={page.updatedAt}
      />

      {/* Comments */}
      <CommentsSection pageId={numPageId} />

      <ScrollToTop />

      <VersionHistoryPanel
        pageId={numPageId}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        canEdit={canEdit}
      />
    </div>
  )
}
