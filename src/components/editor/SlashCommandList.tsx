import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  memo,
} from 'react'
import {
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  ImageIcon,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Columns2,
  Columns3,
  Columns4,
  PanelTop,
  SeparatorHorizontal,
  MousePointerClick,
  SquareStack,
  ListCollapse,
  LayoutTemplate,
  Megaphone,
  Globe,
  Video,
} from 'lucide-react'
import type { SlashCommandItem } from './slashCommands'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  ImageIcon,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Columns2,
  Columns3,
  Columns4,
  PanelTop,
  SeparatorHorizontal,
  MousePointerClick,
  SquareStack,
  ListCollapse,
  LayoutTemplate,
  Megaphone,
  Globe,
  Video,
}

interface SlashCommandListProps {
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
}

export interface SlashCommandListHandle {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const SlashCommandList = forwardRef<SlashCommandListHandle, SlashCommandListProps>(
  function SlashCommandList({ items, command }, ref) {
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
            Nenhum comando encontrado
          </p>
        </div>
      )
    }

    return (
      <div
        ref={listRef}
        className="max-h-64 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md"
      >
        {items.map((item, index) => {
          const Icon = ICON_MAP[item.icon]
          return (
            <button
              key={item.title}
              data-index={index}
              onClick={() => selectItem(index)}
              className={`flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                index === selectedIndex
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/50'
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                {Icon && <Icon className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    )
  },
)

const MemoizedSlashCommandList = memo(SlashCommandList)
export { MemoizedSlashCommandList as SlashCommandList }
