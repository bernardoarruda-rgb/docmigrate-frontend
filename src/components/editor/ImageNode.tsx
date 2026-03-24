import { memo, useCallback, useRef, useState } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { ImageIcon, Trash2, Upload, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { buildStyleObject } from './utils/styleUtils'
import { useUploadImage } from '@/hooks/useFileUpload'
import { IMAGE_UPLOAD } from '@/config/constants'

type TabMode = 'upload' | 'url'

const ImageNode = memo(function ImageNode({
  node,
  updateAttributes,
  deleteNode,
  selected,
  editor,
}: NodeViewProps) {
  const isEditable = editor.isEditable
  const { src, alt } = node.attrs as { src: string | null; alt: string | null }
  const [url, setUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [error, setError] = useState(false)
  const [activeTab, setActiveTab] = useState<TabMode>('upload')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadImage = useUploadImage()

  function handleInsertUrl() {
    if (!url.trim()) return
    updateAttributes({ src: url.trim(), alt: altText.trim() || null })
  }

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > IMAGE_UPLOAD.MAX_SIZE_BYTES) {
      return `Arquivo muito grande. Tamanho maximo: ${IMAGE_UPLOAD.MAX_SIZE_MB} MB`
    }
    if (!IMAGE_UPLOAD.ACCEPTED_TYPES.includes(file.type as (typeof IMAGE_UPLOAD.ACCEPTED_TYPES)[number])) {
      return 'Tipo de arquivo nao suportado. Tipos aceitos: JPG, PNG, GIF, WebP, SVG'
    }
    return null
  }, [])

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      setUploadError(null)
      const validationError = validateFile(file)
      if (validationError) {
        setUploadError(validationError)
        return
      }

      uploadImage.mutate(file, {
        onSuccess: (data) => {
          updateAttributes({ src: data.url, alt: altText.trim() || null })
        },
        onError: (err) => {
          setUploadError(err instanceof Error ? err.message : 'Erro ao fazer upload da imagem')
        },
      })
    },
    [uploadImage, updateAttributes, altText, validateFile],
  )

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  if (!src) {
    if (!isEditable) {
      return <NodeViewWrapper as="div" />
    }
    return (
      <NodeViewWrapper
        as="div"
        className={`my-3 rounded-lg border-2 border-dashed p-6 ${
          selected ? 'border-primary' : 'border-border'
        }`}
      >
        <div className="flex flex-col items-center gap-4" contentEditable={false}>
          <ImageIcon className="h-10 w-10 text-muted-foreground" />

          {/* Tab toggle */}
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('upload')
                setUploadError(null)
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              Upload
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('url')
                setUploadError(null)
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === 'url'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Link className="h-3.5 w-3.5" />
              URL
            </button>
          </div>

          <div className="flex w-full max-w-md flex-col gap-2">
            {activeTab === 'upload' ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={IMAGE_UPLOAD.ACCEPTED_EXTENSIONS}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUploadClick}
                  disabled={uploadImage.isPending}
                  className="w-full"
                >
                  {uploadImage.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Selecionar imagem
                    </span>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  JPG, PNG, GIF, WebP, SVG — max {IMAGE_UPLOAD.MAX_SIZE_MB} MB
                </p>
              </>
            ) : (
              <>
                <Input
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleInsertUrl()
                    }
                  }}
                />
              </>
            )}

            <Input
              placeholder="Descricao da imagem (opcional)"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && activeTab === 'url') {
                  e.preventDefault()
                  handleInsertUrl()
                }
              }}
            />

            {uploadError && (
              <p className="text-center text-sm text-destructive">{uploadError}</p>
            )}

            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline" onClick={deleteNode}>
                Cancelar
              </Button>
              {activeTab === 'url' && (
                <Button size="sm" onClick={handleInsertUrl} disabled={!url.trim()}>
                  Inserir
                </Button>
              )}
            </div>
          </div>
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper
      as="figure"
      className={`my-3 rounded-lg ${selected ? 'ring-2 ring-primary' : ''}`}
      style={buildStyleObject(node.attrs)}
    >
      <div className="group relative" contentEditable={false}>
        {!error ? (
          <img
            src={src}
            alt={alt ?? ''}
            className="max-w-full rounded-lg"
            loading="lazy"
            decoding="async"
            onError={() => setError(true)}
          />
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
            <ImageIcon className="h-5 w-5 shrink-0" />
            Erro ao carregar imagem
          </div>
        )}
        {isEditable && (
          <button
            onClick={deleteNode}
            className="absolute top-2 right-2 rounded-md bg-background/80 p-1.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
            title="Remover imagem"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      {alt && (
        <figcaption className="mt-1 text-center text-xs text-muted-foreground">
          {alt}
        </figcaption>
      )}
    </NodeViewWrapper>
  )
})

export { ImageNode }
