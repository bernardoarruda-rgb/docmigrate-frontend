import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { toast } from 'sonner'
import { useReorderPages } from '@/hooks/usePages'
import { SortablePageItem } from '@/components/pages/SortablePageItem'
import type { PageListItem } from '@/types/page'

interface SortablePageListProps {
  pages: PageListItem[]
  spaceId: number
  onView: (page: PageListItem) => void
  onEdit?: (page: PageListItem) => void
  onDelete?: (page: PageListItem) => void
}

export function SortablePageList({ pages, spaceId, onView, onEdit, onDelete }: SortablePageListProps) {
  const [localPages, setLocalPages] = useState<PageListItem[]>(pages)
  const reorderMutation = useReorderPages()

  useEffect(() => {
    setLocalPages(pages)
  }, [pages])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = localPages.findIndex((p) => p.id === active.id)
    const newIndex = localPages.findIndex((p) => p.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(localPages, oldIndex, newIndex)
    setLocalPages(reordered)

    const items = reordered.map((page, index) => ({
      pageId: page.id,
      sortOrder: index + 1,
    }))

    reorderMutation.mutate(
      { spaceId, items },
      {
        onError: () => {
          setLocalPages(pages)
          toast.error('Erro ao reordenar paginas')
        },
      },
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localPages.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {localPages.map((page) => (
            <SortablePageItem
              key={page.id}
              page={page}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
