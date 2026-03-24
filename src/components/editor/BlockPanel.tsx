import { useState, useMemo } from 'react'
import type { Editor } from '@tiptap/core'
import {
  X,
  Search,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  Columns2,
  Columns3,
  Columns4,
  PanelTop,
  SeparatorHorizontal,
  MousePointerClick,
  SquareStack,
  ListCollapse,
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
  LayoutTemplate,
  LayoutGrid,
  Megaphone,
  PanelLeftClose,
  HelpCircle,
  Globe,
  Video,
} from 'lucide-react'
import {
  BLOCK_PANEL_ITEMS,
  BLOCK_CATEGORY_LABELS,
  type BlockCategory,
  type BlockPanelItem,
} from './blockPanelItems'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  Columns2,
  Columns3,
  Columns4,
  PanelTop,
  SeparatorHorizontal,
  MousePointerClick,
  SquareStack,
  ListCollapse,
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
  LayoutTemplate,
  LayoutGrid,
  Megaphone,
  PanelLeftClose,
  HelpCircle,
  Globe,
  Video,
}

const CATEGORY_ORDER: BlockCategory[] = [
  'templates',
  'layout',
  'conteudo',
  'texto',
  'midia',
  'alertas',
]

interface BlockPanelProps {
  editor: Editor
  onClose: () => void
}

function BlockPanelItemButton({ item, editor }: { item: BlockPanelItem; editor: Editor }) {
  const Icon = ICON_MAP[item.icon]

  return (
    <button
      type="button"
      onClick={() => item.action(editor)}
      className="flex items-center gap-3 w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent/50 transition-colors"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
        {Icon && <Icon className="h-4 w-4" />}
      </div>
      <div className="min-w-0">
        <p className="font-medium text-sm truncate">{item.title}</p>
        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
      </div>
    </button>
  )
}

export function BlockPanel({ editor, onClose }: BlockPanelProps) {
  const [search, setSearch] = useState('')

  const grouped = useMemo(() => {
    const query = search.toLowerCase().trim()
    const filtered = query
      ? BLOCK_PANEL_ITEMS.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query),
        )
      : BLOCK_PANEL_ITEMS

    const groups = new Map<BlockCategory, BlockPanelItem[]>()
    for (const cat of CATEGORY_ORDER) {
      const items = filtered.filter((item) => item.category === cat)
      if (items.length > 0) {
        groups.set(cat, items)
      }
    }
    return groups
  }, [search])

  return (
    <div className="w-72 border-l border-border bg-background flex flex-col h-full shrink-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="font-medium text-sm">Blocos</span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 py-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar blocos..."
            className="w-full h-8 pl-7 pr-2 text-sm rounded-md border bg-background"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {grouped.size === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum bloco encontrado
          </p>
        )}
        {Array.from(grouped.entries()).map(([category, items]) => (
          <div key={category}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">
              {BLOCK_CATEGORY_LABELS[category]}
            </p>
            <div className="space-y-0.5">
              {items.map((item) => (
                <BlockPanelItemButton key={item.id} item={item} editor={editor} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
