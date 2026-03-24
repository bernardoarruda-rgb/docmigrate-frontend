import { useState, useRef, useEffect } from 'react'
import { Check, Tag, ChevronDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTags, useCreateTag } from '@/hooks/useTags'
import { TagBadge } from './TagBadge'

interface TagPickerProps {
  selectedTagIds: number[]
  onChange: (tagIds: number[]) => void
  className?: string
}

export function TagPicker({ selectedTagIds, onChange, className }: TagPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { data: tags } = useTags()
  const createTag = useCreateTag()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const allTags = tags ?? []
  const filteredTags = search
    ? allTags.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    : allTags

  const selectedTags = allTags.filter(t => selectedTagIds.includes(t.id))

  const toggleTag = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter(id => id !== tagId))
    } else {
      onChange([...selectedTagIds, tagId])
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent/50 transition-colors w-full"
      >
        <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        {selectedTags.length > 0 ? (
          <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0">
            {selectedTags.slice(0, 3).map(tag => (
              <TagBadge
                key={tag.id}
                tag={tag}
                size="sm"
                onRemove={() => toggleTag(tag.id)}
              />
            ))}
            {selectedTags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{selectedTags.length - 3}</span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground flex-1 text-left">Selecionar tags...</span>
        )}
        <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
          <div className="p-2 border-b border-border">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar tags..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {filteredTags.length === 0 && (
              <div className="px-2 py-2 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {search ? 'Nenhuma tag encontrada' : 'Nenhuma tag disponivel'}
                </p>
                {search.trim() && (
                  <button
                    type="button"
                    disabled={createTag.isPending}
                    onClick={() => {
                      createTag.mutate(
                        { name: search.trim() },
                        {
                          onSuccess: (newTag) => {
                            onChange([...selectedTagIds, newTag.id])
                            setSearch('')
                          },
                        },
                      )
                    }}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {createTag.isPending ? 'Criando...' : `Criar "${search.trim()}"`}
                  </button>
                )}
              </div>
            )}
            {filteredTags.map(tag => {
              const isSelected = selectedTagIds.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent/50 transition-colors"
                >
                  <div className={cn(
                    'h-4 w-4 rounded border flex items-center justify-center shrink-0',
                    isSelected ? 'bg-primary border-primary' : 'border-input'
                  )}>
                    {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  {tag.color && (
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                  )}
                  <span className="truncate">{tag.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
