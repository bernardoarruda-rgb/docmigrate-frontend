import { AlertTriangle } from 'lucide-react'
import { TRANSLATION_STATUS, LANGUAGES } from '@/config/constants'
import { usePermissions } from '@/hooks/usePermissions'
import { Button } from '@/components/ui/button'

interface TranslationBannerProps {
  status: string
  language: string
  onViewOriginal: () => void
  onRefresh: () => void
  isRefreshing?: boolean
}

export function TranslationBanner({ status, language, onViewOriginal, onRefresh, isRefreshing }: TranslationBannerProps) {
  const { canEdit } = usePermissions()

  if (status !== TRANSLATION_STATUS.OUTDATED) return null

  const langLabel = LANGUAGES.LABELS[language as keyof typeof LANGUAGES.LABELS] ?? language

  return (
    <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 mb-6">
      <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
      <p className="text-sm text-yellow-800 flex-1">
        Esta traducao ({langLabel}) pode estar desatualizada. O conteudo original foi modificado apos a ultima traducao.
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onViewOriginal}>
          Ver original
        </Button>
        {canEdit && (
          <Button variant="default" size="sm" onClick={onRefresh} disabled={isRefreshing}>
            {isRefreshing ? 'Atualizando...' : 'Atualizar traducao'}
          </Button>
        )}
      </div>
    </div>
  )
}
