import { useMemo, useEffect, useState, useCallback, type RefObject } from 'react'
import { cn } from '@/lib/utils'
import { scrollToAndHighlight } from '@/lib/scrollToHeading'
import { SITE_LAYOUT } from '@/config/theme'

interface TocHeading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string | null
  scrollContainer?: RefObject<HTMLElement | null>
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function extractHeadings(content: string | null): TocHeading[] {
  if (!content) return []

  try {
    const doc = JSON.parse(content)
    const headings: TocHeading[] = []

    function walk(node: Record<string, unknown>) {
      if (node.type === 'heading') {
        const level = node.attrs && typeof node.attrs === 'object' && 'level' in node.attrs
          ? (node.attrs as { level: number }).level
          : 1
        if (level === 2 || level === 3) {
          const textParts: string[] = []
          const nodeContent = node.content as Record<string, unknown>[] | undefined
          if (Array.isArray(nodeContent)) {
            for (const child of nodeContent) {
              if (child.type === 'text' && typeof child.text === 'string') {
                textParts.push(child.text)
              }
            }
          }
          const text = textParts.join('')
          if (text) {
            headings.push({ id: slugify(text), text, level })
          }
        }
      }
      const children = node.content as Record<string, unknown>[] | undefined
      if (Array.isArray(children)) {
        for (const child of children) {
          walk(child)
        }
      }
    }

    walk(doc)
    return headings
  } catch {
    return []
  }
}

export function TableOfContents({ content, scrollContainer }: TableOfContentsProps) {
  const headings = useMemo(() => extractHeadings(content), [content])
  const [activeId, setActiveId] = useState<string>('')

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const visible = entries.filter((e) => e.isIntersecting)
    if (visible.length > 0) {
      setActiveId(visible[0].target.id)
    }
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const root = scrollContainer?.current ?? null
    const observer = new IntersectionObserver(handleIntersect, {
      root,
      rootMargin: root ? '0px 0px -60% 0px' : `-${SITE_LAYOUT.HEADER_HEIGHT}px 0px -60% 0px`,
      threshold: 0,
    })

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings, handleIntersect, scrollContainer])

  if (headings.length === 0) return null

  function scrollToHeading(id: string) {
    scrollToAndHighlight(id)
  }

  return (
    <nav
      className="sticky top-20 hidden xl:block shrink-0 overflow-y-auto"
      style={{ width: SITE_LAYOUT.TOC_WIDTH }}
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
        Nesta pagina
      </p>
      <ul className="space-y-0.5">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={cn(
                'block w-full text-left text-xs py-1 px-2 rounded-sm transition-colors truncate',
                heading.level === 3 && 'pl-5',
                activeId === heading.id
                  ? 'text-foreground font-medium bg-accent'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
