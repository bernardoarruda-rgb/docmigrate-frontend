import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SearchX, FileText, Globe, Loader2, Clock, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { IconRenderer } from '@/components/ui/IconRenderer'
import { TagBadge } from '@/components/tags/TagBadge'
import { useSearch } from '@/hooks/useSearch'
import { useTags } from '@/hooks/useTags'
import { useSpaces } from '@/hooks/useSpaces'
import { highlightText } from '@/lib/highlightText'
import { SEARCH_CONFIG } from '@/config/search'
import { cn } from '@/lib/utils'
import type { SearchResult, SearchTypeFilter } from '@/types/search'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TYPE_FILTERS: { value: SearchTypeFilter; label: string }[] = [
  { value: 'all', label: 'Tudo' },
  { value: 'space', label: 'Espacos' },
  { value: 'page', label: 'Paginas' },
]

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(SEARCH_CONFIG.RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveRecentSearch(query: string) {
  try {
    const recent = getRecentSearches().filter(q => q !== query)
    recent.unshift(query)
    localStorage.setItem(
      SEARCH_CONFIG.RECENT_SEARCHES_KEY,
      JSON.stringify(recent.slice(0, SEARCH_CONFIG.MAX_RECENT_SEARCHES)),
    )
  } catch {
    // ignore storage errors
  }
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [inputValue, setInputValue] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<SearchTypeFilter>('all')
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const filters = {
    type: typeFilter !== 'all' ? typeFilter : undefined,
    spaceId: selectedSpaceId ?? undefined,
    tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
  }

  const { data: searchData, isLoading } = useSearch(debouncedQuery, filters)
  const { data: allTags } = useTags()
  const { data: spacesData } = useSpaces()

  const results = searchData?.items ?? []
  const spaces = spacesData?.items ?? []
  const tags = allTags ?? []

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue.trim())
    }, SEARCH_CONFIG.DEBOUNCE_DELAY)
    return () => clearTimeout(timer)
  }, [inputValue])

  // Reset on open
  useEffect(() => {
    if (open) {
      setInputValue('')
      setDebouncedQuery('')
      setTypeFilter('all')
      setSelectedTagIds([])
      setSelectedSpaceId(null)
      setActiveIndex(-1)
      setRecentSearches(getRecentSearches())
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // Reset active index on results change
  useEffect(() => {
    setActiveIndex(-1)
  }, [results.length, typeFilter, selectedTagIds, selectedSpaceId])

  const handleNavigate = useCallback(
    (result: SearchResult) => {
      saveRecentSearch(debouncedQuery || inputValue.trim())
      onOpenChange(false)
      if (result.type === 'space') {
        navigate(`/spaces/${result.id}`)
      } else if (result.spaceId) {
        navigate(`/spaces/${result.spaceId}/pages/${result.id}`)
      }
    },
    [navigate, onOpenChange, debouncedQuery, inputValue],
  )

  const handleRecentSearch = useCallback((query: string) => {
    setInputValue(query)
    setDebouncedQuery(query)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(prev => Math.min(prev + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(prev => Math.max(prev - 1, -1))
      } else if (e.key === 'Enter' && activeIndex >= 0 && activeIndex < results.length) {
        e.preventDefault()
        handleNavigate(results[activeIndex])
      }
    },
    [results, activeIndex, handleNavigate],
  )

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll('[data-result-item]')
      items[activeIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  const toggleTag = (tagId: number) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId],
    )
  }

  const spaceResults = results.filter(r => r.type === 'space')
  const pageResults = results.filter(r => r.type === 'page')
  const hasResults = results.length > 0
  const showNoResults =
    debouncedQuery.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH && !isLoading && !hasResults
  const showMinChars =
    inputValue.trim().length > 0 && inputValue.trim().length < SEARCH_CONFIG.MIN_QUERY_LENGTH
  const showRecent =
    inputValue.trim().length === 0 && recentSearches.length > 0

  // Track global index for keyboard nav across grouped results
  let globalIndex = -1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-xl p-0 gap-0 overflow-hidden"
      >
        <DialogTitle className="sr-only">Buscar</DialogTitle>

        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar espacos, paginas e conteudo..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => { setInputValue(''); setDebouncedQuery('') }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {isLoading && (
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin shrink-0" />
          )}
        </div>

        {/* Filters */}
        <div className="border-b border-border px-4 py-2 space-y-2">
          {/* Type filter tabs */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {TYPE_FILTERS.map(f => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setTypeFilter(f.value)}
                  className={cn(
                    'px-2.5 py-1 text-xs rounded-full transition-colors',
                    typeFilter === f.value
                      ? 'bg-foreground text-background font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Space filter */}
            {spaces.length > 0 && (
              <select
                value={selectedSpaceId ?? ''}
                onChange={e => setSelectedSpaceId(e.target.value ? Number(e.target.value) : null)}
                className="text-xs bg-transparent border border-border rounded-md px-2 py-1 text-muted-foreground outline-none"
              >
                <option value="">Todos os espacos</option>
                {spaces.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            )}
          </div>

          {/* Tag filter chips */}
          {tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {tags.slice(0, 8).map(tag => {
                const isSelected = selectedTagIds.includes(tag.id)
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                      isSelected
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {tag.color && (
                      <span
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: isSelected ? undefined : tag.color }}
                      />
                    )}
                    {tag.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-80 overflow-y-auto">
          {/* Recent searches */}
          {showRecent && (
            <div className="py-2">
              <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Buscas recentes
              </div>
              {recentSearches.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleRecentSearch(q)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-accent/50 transition-colors"
                >
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">{q}</span>
                </button>
              ))}
            </div>
          )}

          {showMinChars && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Digite pelo menos 2 caracteres
            </div>
          )}

          {showNoResults && (
            <div className="px-4 py-8 text-center space-y-3">
              <div className="flex justify-center">
                <SearchX className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Nenhum resultado para &ldquo;{debouncedQuery}&rdquo;</p>
                <p className="text-xs text-muted-foreground/70">Sugestoes:</p>
              </div>
              <ul className="text-xs text-muted-foreground/70 space-y-0.5">
                <li>Verifique a ortografia dos termos</li>
                <li>Tente palavras-chave mais genericas</li>
                <li>Busque por titulo ou descricao da pagina</li>
              </ul>
            </div>
          )}

          {typeFilter !== 'page' && spaceResults.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Espacos ({spaceResults.length})
              </div>
              {spaceResults.map(result => {
                globalIndex++
                const idx = globalIndex
                return (
                  <SearchResultCard
                    key={`space-${result.id}`}
                    result={result}
                    query={debouncedQuery}
                    isActive={activeIndex === idx}
                    onSelect={handleNavigate}
                  />
                )
              })}
            </div>
          )}

          {typeFilter !== 'space' && pageResults.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Paginas ({pageResults.length})
              </div>
              {pageResults.map(result => {
                globalIndex++
                const idx = globalIndex
                return (
                  <SearchResultCard
                    key={`page-${result.id}`}
                    result={result}
                    query={debouncedQuery}
                    isActive={activeIndex === idx}
                    onSelect={handleNavigate}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
                ↑↓
              </kbd>{' '}
              navegar
            </span>
            <span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
                Enter
              </kbd>{' '}
              abrir
            </span>
            <span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
                Esc
              </kbd>{' '}
              fechar
            </span>
          </div>
          {searchData && searchData.totalCount > 0 && (
            <span>{searchData.totalCount} resultado(s)</span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface SearchResultCardProps {
  result: SearchResult
  query: string
  isActive: boolean
  onSelect: (result: SearchResult) => void
}

function SearchResultCard({ result, query, isActive, onSelect }: SearchResultCardProps) {
  return (
    <button
      data-result-item
      onClick={() => onSelect(result)}
      className={cn(
        'w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer',
        isActive ? 'bg-accent' : 'hover:bg-accent/50',
      )}
    >
      <div className="mt-0.5 shrink-0">
        {result.icon ? (
          <IconRenderer icon={result.icon} iconColor={result.iconColor} size={16} />
        ) : result.type === 'space' ? (
          <Globe className="h-4 w-4 text-muted-foreground" />
        ) : (
          <FileText className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">
            {highlightText(result.title, query)}
          </span>
          <span className={cn(
            'text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0',
            result.type === 'space'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-green-100 text-green-700',
          )}>
            {result.type === 'space' ? 'Espaco' : 'Pagina'}
          </span>
          {result.language && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 bg-purple-100 text-purple-700">
              {result.language.toUpperCase()}
            </span>
          )}
        </div>

        {/* Snippet with backend-generated <mark> highlights */}
        {result.snippet && (
          <div
            className="text-xs text-muted-foreground line-clamp-2 mt-0.5 [&_mark]:bg-yellow-200/70 [&_mark]:text-foreground [&_mark]:rounded-sm [&_mark]:px-0.5"
            dangerouslySetInnerHTML={{ __html: result.snippet }}
          />
        )}

        {/* Description fallback when no snippet */}
        {!result.snippet && result.description && (
          <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {highlightText(result.description, query)}
          </div>
        )}

        {/* Meta row: space name + tags */}
        <div className="flex items-center gap-2 mt-1">
          {result.type === 'page' && result.spaceTitle && (
            <span className="text-[10px] text-muted-foreground/70 truncate">
              {result.spaceTitle}
            </span>
          )}
          {result.tags && result.tags.length > 0 && (
            <div className="flex items-center gap-1">
              {result.tags.slice(0, 2).map(tag => (
                <TagBadge key={tag.id} tag={tag} size="sm" />
              ))}
              {result.tags.length > 2 && (
                <span className="text-[10px] text-muted-foreground">+{result.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
