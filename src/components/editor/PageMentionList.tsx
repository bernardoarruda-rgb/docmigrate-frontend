import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  memo,
} from 'react'
import { FileText, Layout } from 'lucide-react'
import type { SearchResult } from '@/types/search'

interface PageMentionListProps {
  items: SearchResult[]
  command: (item: SearchResult) => void
}

export interface PageMentionListHandle {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const PageMentionList = forwardRef<PageMentionListHandle, PageMentionListProps>(
  function PageMentionList({ items, command }, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      setSelectedIndex(0)
    }, [items])

    useEffect(() => {
      const selectedElement = listRef.current?.querySelector(
        `[data-index="${selectedIndex}"]`,
      )
      selectedElement?.scrollIntoView({ block: 'nearest' })
    }, [selectedIndex])

    const selectItem = useCallback(
      (index: number) => {
        const item = items[index]
        if (item) {
          command(item)
        }
      },
      [items, command],
    )

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((i) => (i > 0 ? i - 1 : items.length - 1))
          return true
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((i) => (i < items.length - 1 ? i + 1 : 0))
          return true
        }
        if (event.key === 'Enter') {
          selectItem(selectedIndex)
          return true
        }
        return false
      },
    }))

    if (items.length === 0) {
      return (
        <div className="rounded-lg border border-border bg-popover p-2 shadow-md">
          <p className="px-2 py-1.5 text-sm text-muted-foreground">
            Nenhum resultado encontrado
          </p>
        </div>
      )
    }

    const spaces = items.filter((i) => i.type === 'space')
    const pages = items.filter((i) => i.type === 'page')

    let flatIndex = 0
    const renderItem = (item: SearchResult) => {
      const index = flatIndex++
      const Icon = item.type === 'page' ? FileText : Layout
      return (
        <button
          key={`${item.type}-${item.id}`}
          data-index={index}
          onClick={() => selectItem(index)}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
            index === selectedIndex
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-accent/50'
          }`}
        >
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <span className="truncate block">{item.title}</span>
            {item.type === 'page' && item.spaceTitle && (
              <span className="text-xs text-muted-foreground truncate block">
                {item.spaceTitle}
              </span>
            )}
          </div>
        </button>
      )
    }

    return (
      <div
        ref={listRef}
        className="max-h-64 min-w-[240px] overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md"
      >
        {spaces.length > 0 && (
          <>
            <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
              Espacos
            </p>
            {spaces.map(renderItem)}
          </>
        )}
        {pages.length > 0 && (
          <>
            <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
              Paginas
            </p>
            {pages.map(renderItem)}
          </>
        )}
      </div>
    )
  },
)

const MemoizedPageMentionList = memo(PageMentionList)
export { MemoizedPageMentionList as PageMentionList }
