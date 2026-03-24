import { memo, useState } from 'react'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import { Trash2, Settings, Globe } from 'lucide-react'
import type { EmbedAspectRatio, EmbedWidth } from './EmbedExtension'
import { EMBED_ASPECT_RATIOS, EMBED_DEFAULT_HEIGHT } from './EmbedExtension'
import { buildStyleObject } from './utils/styleUtils'

function normalizeEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace('www.', '')

    if (host === 'youtube.com' && parsed.pathname === '/watch') {
      const videoId = parsed.searchParams.get('v')
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }
    if (host === 'youtu.be') {
      const videoId = parsed.pathname.slice(1)
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }
    if (host === 'vimeo.com' && /^\/\d+/.test(parsed.pathname)) {
      const videoId = parsed.pathname.slice(1)
      return `https://player.vimeo.com/video/${videoId}`
    }
  } catch {
    return url
  }
  return url
}

function EmbedNodeComponent({ node, updateAttributes, deleteNode, editor }: NodeViewProps) {
  const url = node.attrs.url as string
  const aspectRatio = (node.attrs.aspectRatio || '16:9') as EmbedAspectRatio
  const width = (node.attrs.width || '100%') as EmbedWidth
  const height = (node.attrs.height || EMBED_DEFAULT_HEIGHT) as number
  const isEditable = editor.isEditable

  const [editing, setEditing] = useState(!url)
  const [editUrl, setEditUrl] = useState(url)
  const [editHeight, setEditHeight] = useState(String(height))

  const handleSave = () => {
    const normalized = normalizeEmbedUrl(editUrl.trim())
    const parsedHeight = Math.max(100, Math.min(1200, Number(editHeight) || EMBED_DEFAULT_HEIGHT))
    updateAttributes({ url: normalized, height: parsedHeight })
    setEditUrl(normalized)
    setEditHeight(String(parsedHeight))
    setEditing(false)
  }

  const embedUrl = url ? normalizeEmbedUrl(url) : ''
  const isCustomHeight = aspectRatio === 'custom'

  const containerStyle: React.CSSProperties = isCustomHeight
    ? { height: `${height}px`, position: 'relative' }
    : { paddingBottom: EMBED_ASPECT_RATIOS[aspectRatio], position: 'relative', width: '100%' }

  const iframeElement = (
    <iframe
      src={embedUrl}
      className="absolute inset-0 w-full h-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
      title="Conteudo incorporado"
      loading="lazy"
    />
  )

  if (!isEditable) {
    if (!embedUrl) return null

    return (
      <NodeViewWrapper>
        <div className="my-4 rounded-lg overflow-hidden mx-auto" style={{ width, ...buildStyleObject(node.attrs) }}>
          <div style={containerStyle}>
            {iframeElement}
          </div>
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper className="my-4">
      <div
        className="relative group rounded-lg border border-dashed border-border overflow-hidden mx-auto"
        style={{ width, ...buildStyleObject(node.attrs) }}
      >
        {embedUrl ? (
          <div style={containerStyle}>
            {iframeElement}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
            <Globe className="h-8 w-8 opacity-50" />
            <p className="text-sm">Cole a URL para incorporar</p>
          </div>
        )}

        <div
          className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 rounded-md border border-border shadow-md p-1 z-10"
          style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}
        >
          <button
            type="button"
            onClick={() => {
              setEditUrl(url)
              setEditHeight(String(height))
              setEditing(!editing)
            }}
            className="p-1 rounded hover:bg-accent"
            title="Editar URL"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={deleteNode}
            className="p-1 rounded hover:bg-destructive/10 text-destructive"
            title="Remover embed"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {editing && (
        <div
          className="mt-2 p-3 rounded-md border shadow-md space-y-2 mx-auto"
          style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', width }}
        >
          <input
            type="url"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=... ou qualquer URL"
            className="w-full h-8 px-2 text-sm rounded border bg-background"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          {isCustomHeight && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground whitespace-nowrap">Altura (px):</label>
              <input
                type="number"
                value={editHeight}
                onChange={(e) => setEditHeight(e.target.value)}
                min={100}
                max={1200}
                className="w-24 h-8 px-2 text-sm rounded border bg-background"
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1 text-xs rounded bg-primary text-primary-foreground"
            >
              Aplicar
            </button>
            {url && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-3 py-1 text-xs rounded border hover:bg-accent"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}
    </NodeViewWrapper>
  )
}

export const EmbedNode = memo(EmbedNodeComponent)
