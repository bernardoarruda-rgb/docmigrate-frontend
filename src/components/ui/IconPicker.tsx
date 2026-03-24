import { useState, useRef, useEffect, useCallback } from 'react'
import { icons } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Search, Upload, Loader2 } from 'lucide-react'
import { IconRenderer } from '@/components/ui/IconRenderer'
import { ICON_CATEGORIES } from '@/config/iconList'
import { EMOJI_CATEGORIES } from '@/config/emojiList'
import { formatLucideIcon, formatEmojiIcon, formatUploadIcon } from '@/lib/iconUtils'
import { useUploadIcon } from '@/hooks/useFileUpload'
import { ICON } from '@/config/constants'
import { cn } from '@/lib/utils'

type Tab = 'lucide' | 'emoji' | 'upload'

const TABS: { key: Tab; label: string }[] = [
  { key: 'lucide', label: 'Icones' },
  { key: 'emoji', label: 'Emoji' },
  { key: 'upload', label: 'Upload' },
]

interface IconPickerProps {
  value: string | null
  onChange: (icon: string | null) => void
  iconColor?: string | null
}

export function IconPicker({ value, onChange, iconColor }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('lucide')
  const [search, setSearch] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadMutation = useUploadIcon()

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, handleClickOutside])

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
    setSearch('')
    setUploadError(null)
  }

  const handleSelectLucide = (iconName: string) => {
    onChange(formatLucideIcon(iconName))
    setIsOpen(false)
  }

  const handleSelectEmoji = (emoji: string) => {
    onChange(formatEmojiIcon(emoji))
    setIsOpen(false)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadError(null)

    if (!ICON.ACCEPTED_TYPES.includes(file.type as (typeof ICON.ACCEPTED_TYPES)[number])) {
      setUploadError(`Tipo de arquivo invalido. Aceitos: ${ICON.ACCEPTED_EXTENSIONS}`)
      return
    }

    if (file.size > ICON.MAX_UPLOAD_SIZE) {
      const maxMb = (ICON.MAX_UPLOAD_SIZE / 1_048_576).toFixed(0)
      setUploadError(`Arquivo muito grande. Maximo: ${maxMb}MB`)
      return
    }

    uploadMutation.mutate(file, {
      onSuccess: (response) => {
        onChange(formatUploadIcon(response.url))
        setIsOpen(false)
      },
      onError: () => {
        setUploadError('Erro ao enviar arquivo. Tente novamente.')
      },
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClear = () => {
    onChange(null)
    setIsOpen(false)
  }

  const filteredCategories = ICON_CATEGORIES.map((category) => ({
    ...category,
    icons: search
      ? category.icons.filter((name) => name.toLowerCase().includes(search.toLowerCase()))
      : category.icons,
  })).filter((category) => category.icons.length > 0)

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg border border-border',
          'bg-background transition-colors hover:bg-muted',
          isOpen && 'ring-2 ring-ring/50'
        )}
      >
        <IconRenderer icon={value} iconColor={iconColor} size={18} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-80 rounded-lg border border-border bg-background shadow-lg">
          <div className="flex border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key)
                  setSearch('')
                  setUploadError(null)
                }}
                className={cn(
                  'flex-1 px-3 py-2 text-sm font-medium transition-colors',
                  activeTab === tab.key
                    ? 'border-b-2 border-primary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-2">
            {activeTab === 'lucide' && (
              <LucideTab
                search={search}
                onSearchChange={setSearch}
                categories={filteredCategories}
                onSelect={handleSelectLucide}
              />
            )}

            {activeTab === 'emoji' && (
              <EmojiTab onSelect={handleSelectEmoji} />
            )}

            {activeTab === 'upload' && (
              <UploadTab
                fileInputRef={fileInputRef}
                onFileSelect={handleFileSelect}
                isLoading={uploadMutation.isPending}
                error={uploadError}
              />
            )}
          </div>

          {value && (
            <div className="border-t border-border p-2">
              <button
                type="button"
                onClick={handleClear}
                className="w-full rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Limpar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function LucideTab({
  search,
  onSearchChange,
  categories,
  onSelect,
}: {
  search: string
  onSearchChange: (value: string) => void
  categories: { name: string; icons: string[] }[]
  onSelect: (iconName: string) => void
}) {
  return (
    <>
      <div className="relative mb-2">
        <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar icone..."
          className="h-7 w-full rounded-md border border-input bg-transparent pl-7 pr-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </div>
      <div className="max-h-50 overflow-y-auto">
        {categories.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Nenhum icone encontrado
          </p>
        ) : (
          categories.map((category) => (
            <div key={category.name} className="mb-2">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                {category.name}
              </p>
              <div className="grid grid-cols-8 gap-0.5">
                {category.icons.map((iconName) => {
                  const LucideComponent = icons[iconName as keyof typeof icons] as LucideIcon | undefined
                  if (!LucideComponent) return null
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => onSelect(iconName)}
                      title={iconName}
                      className="flex h-8 w-full items-center justify-center rounded-md transition-colors hover:bg-muted"
                    >
                      <LucideComponent size={16} />
                    </button>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

function EmojiTab({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <div className="max-h-50 overflow-y-auto">
      {EMOJI_CATEGORIES.map((category) => (
        <div key={category.name} className="mb-2">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            {category.name}
          </p>
          <div className="grid grid-cols-6 gap-0.5">
            {category.emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onSelect(emoji)}
                className="flex h-9 w-full items-center justify-center rounded-md text-lg transition-colors hover:bg-muted"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function UploadTab({
  fileInputRef,
  onFileSelect,
  isLoading,
  error,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  isLoading: boolean
  error: string | null
}) {
  const maxMb = (ICON.MAX_UPLOAD_SIZE / 1_048_576).toFixed(0)

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <p className="text-sm text-muted-foreground">
        Envie uma imagem como icone
      </p>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors',
          'hover:bg-muted disabled:pointer-events-none disabled:opacity-50'
        )}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        {isLoading ? 'Enviando...' : 'Escolher arquivo'}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept={ICON.ACCEPTED_EXTENSIONS}
        onChange={onFileSelect}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground">
        {ICON.ACCEPTED_EXTENSIONS} (max {maxMb}MB)
      </p>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
