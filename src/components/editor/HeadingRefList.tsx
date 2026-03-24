import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  memo,
} from 'react'
import type { HeadingDto } from '@/types/reference'

interface HeadingRefListProps {
  items: HeadingDto[]
  command: (item: HeadingDto) => void
}

export interface HeadingRefListHandle {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const HeadingRefList = forwardRef<HeadingRefListHandle, HeadingRefListProps>(
  function HeadingRefList({ items, command }, ref) {
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
        if (item) command(item)
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
            Nenhum heading encontrado
          </p>
        </div>
      )
    }

    return (
      <div
        ref={listRef}
        className="max-h-64 min-w-[200px] overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md"
      >
        <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
          Headings deste documento
        </p>
        {items.map((item, index) => (
          <button
            key={item.id}
            data-index={index}
            onClick={() => selectItem(index)}
            className={`flex w-full items-center gap-2 rounded-md py-1.5 text-left text-sm transition-colors ${
              item.level === 3 ? 'pl-6 pr-2' : 'px-2'
            } ${
              index === selectedIndex
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent/50'
            }`}
          >
            <span className="text-xs text-muted-foreground font-mono shrink-0">
              H{item.level}
            </span>
            <span className="truncate">{item.text}</span>
          </button>
        ))}
      </div>
    )
  },
)

const MemoizedHeadingRefList = memo(HeadingRefList)
export { MemoizedHeadingRefList as HeadingRefList }
