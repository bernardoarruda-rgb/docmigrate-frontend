import type { ReactNode } from 'react'

export function highlightText(text: string, query: string): ReactNode {
  if (!query || query.length < 2) return text

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)

  if (parts.length === 1) return text

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200/70 text-foreground rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}
