import { X } from 'lucide-react'
import type { TagListItem } from '@/types/tag'

interface TagBadgeProps {
  tag: TagListItem
  size?: 'sm' | 'default'
  onRemove?: () => void
  onClick?: () => void
}

export function TagBadge({ tag, size = 'default', onRemove, onClick }: TagBadgeProps) {
  const isSmall = size === 'sm'
  const baseClasses = `inline-flex items-center gap-1 rounded-full border font-medium transition-colors ${
    isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
  }`

  const content = (
    <>
      {tag.color && (
        <span
          className={`rounded-full shrink-0 ${isSmall ? 'h-1.5 w-1.5' : 'h-2 w-2'}`}
          style={{ backgroundColor: tag.color }}
        />
      )}
      <span className="truncate max-w-24">{tag.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="shrink-0 hover:text-foreground"
        >
          <X className={isSmall ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
        </button>
      )}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} cursor-pointer border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground`}
      >
        {content}
      </button>
    )
  }

  return (
    <span className={`${baseClasses} border-border bg-muted/50 text-muted-foreground`}>
      {content}
    </span>
  )
}
