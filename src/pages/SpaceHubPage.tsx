import { useState } from 'react'
import { FolderOpen, Star, Clock, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { isWithinHours } from '@/lib/formatDate'
import { useSpaces } from '@/hooks/useSpaces'
import { useFavorites, useRecentPages } from '@/hooks/useUserActivity'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SpacePreviewCard } from '@/components/spaces/SpacePreviewCard'
import { SpaceFormDialog } from '@/components/spaces/SpaceFormDialog'
import { usePermissions } from '@/hooks/usePermissions'

function ActivityPageCard({ title, spaceTitle, spaceId, pageId, visitedAt }: {
  title: string
  spaceTitle: string | null
  spaceId: number
  pageId: number
  visitedAt?: string
}) {
  const isNew = visitedAt ? isWithinHours(visitedAt, 24) : false

  return (
    <Link
      to={`/spaces/${spaceId}/pages/${pageId}`}
      className="relative flex flex-col gap-1 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors min-w-50 max-w-50"
    >
      {isNew && (
        <span className="absolute -top-1.5 -right-1.5 text-[10px] font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
          Novo
        </span>
      )}
      <span className="text-sm font-medium truncate">{title}</span>
      {spaceTitle && (
        <span className="text-xs text-muted-foreground truncate">{spaceTitle}</span>
      )}
    </Link>
  )
}

export function SpaceHubPage() {
  useDocumentTitle('Espacos')
  const { data, isLoading, error } = useSpaces()
  const { data: favorites } = useFavorites()
  const { data: recentPages } = useRecentPages()
  const { canEdit } = usePermissions()
  const [spaceFormOpen, setSpaceFormOpen] = useState(false)

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">Erro ao carregar espacos. Verifique se o backend esta rodando.</p>
      </div>
    )
  }

  const spaces = data?.items ?? []

  if (spaces.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <div className="flex items-center justify-center h-20 w-20 rounded-3xl bg-muted mb-4">
            <FolderOpen className="h-10 w-10" />
          </div>
          <p className="text-lg font-medium text-foreground">Nenhum espaco encontrado</p>
          <p className="text-sm mt-1 mb-4">Crie seu primeiro espaco para comecar a documentar.</p>
          {canEdit && (
            <Button onClick={() => setSpaceFormOpen(true)}>
              <Plus className="h-4 w-4" />
              Criar primeiro espaco
            </Button>
          )}
        </div>
        <SpaceFormDialog open={spaceFormOpen} onOpenChange={setSpaceFormOpen} />
      </>
    )
  }

  return (
    <div>
      {/* Favoritos */}
      {favorites && favorites.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-yellow-400" />
            <h2 className="text-lg font-semibold">Favoritos</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {favorites.map((fav) => (
              <ActivityPageCard
                key={fav.pageId}
                title={fav.title}
                spaceTitle={fav.spaceTitle}
                spaceId={fav.spaceId}
                pageId={fav.pageId}
              />
            ))}
          </div>
        </section>
      )}

      {/* Visitados recentemente */}
      {recentPages && recentPages.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Visitados recentemente</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentPages.map((recent) => (
              <ActivityPageCard
                key={recent.pageId}
                title={recent.title}
                spaceTitle={recent.spaceTitle}
                spaceId={recent.spaceId}
                pageId={recent.pageId}
                visitedAt={recent.visitedAt}
              />
            ))}
          </div>
        </section>
      )}

      {/* Espacos */}
      <h1 className="text-xl font-semibold mb-6">Espacos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {spaces.map((space) => (
          <SpacePreviewCard key={space.id} space={space} />
        ))}
      </div>
    </div>
  )
}
