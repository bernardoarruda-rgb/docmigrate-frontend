import { FolderOpen, Star, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSpaces } from '@/hooks/useSpaces'
import { useFavorites, useRecentPages } from '@/hooks/useUserActivity'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Skeleton } from '@/components/ui/skeleton'
import { SpacePreviewCard } from '@/components/spaces/SpacePreviewCard'

function ActivityPageCard({ title, spaceTitle, spaceId, pageId }: {
  title: string
  spaceTitle: string | null
  spaceId: number
  pageId: number
}) {
  return (
    <Link
      to={`/spaces/${spaceId}/pages/${pageId}`}
      className="flex flex-col gap-1 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors min-w-50 max-w-50"
    >
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
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <div className="flex items-center justify-center h-20 w-20 rounded-3xl bg-muted mb-4">
          <FolderOpen className="h-10 w-10" />
        </div>
        <p className="text-lg font-medium text-foreground">Nenhum espaco encontrado</p>
        <p className="text-sm mt-1">Crie um espaco na area de administracao para comecar.</p>
      </div>
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
