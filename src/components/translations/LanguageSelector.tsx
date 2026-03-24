import { useState } from 'react'
import { Globe, ChevronDown, Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LANGUAGES, TRANSLATION_STATUS } from '@/config/constants'
import { useTranslations } from '@/hooks/useTranslations'
import { usePermissions } from '@/hooks/usePermissions'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LanguageSelectorProps {
  pageId: number
  spaceId: number
  pageLanguage: string
  currentLang: string
  onLanguageChange: (lang: string) => void
}

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  [TRANSLATION_STATUS.AUTO]: { label: 'Auto', className: 'bg-blue-100 text-blue-700' },
  [TRANSLATION_STATUS.REVIEWED]: { label: 'Revisada', className: 'bg-green-100 text-green-700' },
  [TRANSLATION_STATUS.OUTDATED]: { label: 'Desatualizada', className: 'bg-yellow-100 text-yellow-700' },
}

export function LanguageSelector({ pageId, spaceId, pageLanguage, currentLang, onLanguageChange }: LanguageSelectorProps) {
  const { data: translations = [] } = useTranslations(pageId)
  const { canEdit } = usePermissions()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const translationMap = new Map(translations.map(t => [t.language, t]))
  const targetLanguages = LANGUAGES.AVAILABLE.filter(l => l !== pageLanguage)

  function handleEdit(lang: string) {
    navigate(`/spaces/${spaceId}/pages/${pageId}/translate/${lang}`)
    setOpen(false)
  }

  const currentLabel = LANGUAGES.LABELS[currentLang as keyof typeof LANGUAGES.LABELS] ?? currentLang

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'gap-1.5',
        )}
      >
        <Globe className="h-4 w-4" />
        {currentLabel}
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {/* Original language */}
        <DropdownMenuItem
          onClick={() => onLanguageChange(pageLanguage)}
          className={currentLang === pageLanguage ? 'bg-accent' : ''}
        >
          <span className="flex-1">{LANGUAGES.LABELS[pageLanguage as keyof typeof LANGUAGES.LABELS] ?? pageLanguage}</span>
          <span className="text-xs text-muted-foreground">Original</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Target languages */}
        {targetLanguages.map(lang => {
          const translation = translationMap.get(lang)
          const badge = translation ? STATUS_BADGES[translation.status] : null

          return (
            <DropdownMenuItem
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={currentLang === lang ? 'bg-accent' : ''}
            >
              <span className="flex-1">{LANGUAGES.LABELS[lang as keyof typeof LANGUAGES.LABELS] ?? lang}</span>
              {badge && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${badge.className}`}>
                  {badge.label}
                </span>
              )}
              {!translation && (
                <span className="text-xs text-muted-foreground">Gerando...</span>
              )}
              {canEdit && translation && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleEdit(lang) }}
                  className="p-0.5 hover:bg-accent rounded ml-2"
                  title="Editar traducao"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
