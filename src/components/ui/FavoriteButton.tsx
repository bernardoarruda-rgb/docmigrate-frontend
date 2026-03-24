import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { useIsFavorite, useToggleFavorite } from '@/hooks/useUserActivity'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  pageId: number
  className?: string
}

export function FavoriteButton({ pageId, className }: FavoriteButtonProps) {
  const { data } = useIsFavorite(pageId)
  const toggleMutation = useToggleFavorite()
  const isFavorite = data?.isFavorite ?? false

  const handleToggle = () => {
    toggleMutation.mutate(pageId, {
      onSuccess: () => {
        toast.success(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
      },
      onError: () => {
        toast.error('Erro ao atualizar favorito')
      },
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={toggleMutation.isPending}
      className={cn(
        'inline-flex items-center justify-center rounded-md h-8 w-8 transition-colors hover:bg-accent',
        className,
      )}
      title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Star
        className={cn(
          'h-4 w-4 transition-colors',
          isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground',
        )}
      />
    </button>
  )
}
