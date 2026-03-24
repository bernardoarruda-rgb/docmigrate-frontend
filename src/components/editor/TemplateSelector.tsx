import {
  FileText,
  LayoutTemplate,
  BookOpen,
  HelpCircle,
  Users,
} from 'lucide-react'
import { PAGE_TEMPLATES, type PageTemplate } from './templateDefinitions'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  LayoutTemplate,
  BookOpen,
  HelpCircle,
  Users,
}

interface TemplateSelectorProps {
  onSelect: (template: PageTemplate) => void
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Escolha um template para comecar:
      </p>
      <div className="grid grid-cols-2 gap-3">
        {PAGE_TEMPLATES.map((template) => {
          const Icon = ICON_MAP[template.icon]
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template)}
              className="flex flex-col items-start gap-2 rounded-lg border border-border p-4 text-left hover:border-primary/50 hover:bg-accent/30 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                {Icon && <Icon className="h-5 w-5 text-primary" />}
              </div>
              <div>
                <p className="font-medium text-sm">{template.title}</p>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
