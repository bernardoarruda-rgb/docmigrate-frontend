import { History, RotateCcw, X, User, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { usePageVersions, useRestorePageVersion } from '@/hooks/usePageVersions'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { PageVersionListItem } from '@/types/pageVersion'

interface VersionHistoryPanelProps {
  pageId: number
  open: boolean
  onClose: () => void
  canEdit?: boolean
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function VersionHistoryPanel({ pageId, open, onClose, canEdit }: VersionHistoryPanelProps) {
  const { data: versions, isLoading } = usePageVersions(pageId)
  const restoreMutation = useRestorePageVersion()

  if (!open) return null

  const handleRestore = (version: PageVersionListItem) => {
    restoreMutation.mutate(
      { pageId, versionNumber: version.versionNumber },
      {
        onSuccess: () => {
          toast.success(`Versao ${version.versionNumber} restaurada com sucesso`)
          onClose()
        },
        onError: () => {
          toast.error('Erro ao restaurar versao')
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-md bg-background border-l border-border shadow-xl flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <History className="h-5 w-5" />
            Historico de versoes
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          )}

          {!isLoading && (!versions || versions.length === 0) && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <History className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Nenhuma versao encontrada</p>
              <p className="text-xs mt-1">Versoes sao criadas ao terminar de editar</p>
            </div>
          )}

          {versions && versions.length > 0 && (
            <div className="space-y-2">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      Versao {version.versionNumber}
                    </span>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestore(version)}
                        disabled={restoreMutation.isPending}
                        className="h-7 text-xs"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restaurar
                      </Button>
                    )}
                  </div>
                  {version.changeDescription && (
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                      {version.changeDescription}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {version.createdByName && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="truncate max-w-[120px]">{version.createdByName}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(version.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
