import type { JSONContent } from '@tiptap/react'

export function extractPlainText(content: string | null, maxLength = 200): string {
  if (!content) return ''
  try {
    const json = JSON.parse(content) as JSONContent
    return walkNodes(json, maxLength)
  } catch {
    return ''
  }
}

function walkNodes(node: JSONContent, maxLength: number): string {
  const parts: string[] = []

  if (node.text) {
    parts.push(node.text)
  }

  if (node.content) {
    for (const child of node.content) {
      parts.push(walkNodes(child, maxLength))
      if (parts.join(' ').length >= maxLength) break
    }
  }

  return parts.join(' ').slice(0, maxLength).trim()
}
