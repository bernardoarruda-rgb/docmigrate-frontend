import { useState } from 'react'
import { Download, FileText, FileType, FileImage, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { exportPage, type ExportFormat } from '@/lib/exportUtils'

interface ExportMenuProps {
  title: string
  content: string | null
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const FORMAT_OPTIONS: { format: ExportFormat; label: string; icon: React.ReactNode }[] = [
  { format: 'markdown', label: 'Markdown (.md)', icon: <FileText className="h-4 w-4" /> },
  { format: 'docx', label: 'Word (.doc)', icon: <FileType className="h-4 w-4" /> },
  { format: 'pdf', label: 'PDF (.pdf)', icon: <FileImage className="h-4 w-4" /> },
]

function ExportMenu({ title, content, variant = 'outline', size = 'sm' }: ExportMenuProps) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (format: ExportFormat) => {
    setExporting(true)
    try {
      await exportPage({ title, content }, format)
      toast.success('Arquivo exportado com sucesso')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro ao exportar arquivo',
      )
    } finally {
      setExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={exporting}
        render={
          <Button variant={variant} size={size} disabled={exporting}>
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Exportar
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Exportar como</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {FORMAT_OPTIONS.map(({ format, label, icon }) => (
            <DropdownMenuItem key={format} onClick={() => handleExport(format)}>
              {icon}
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ExportMenu }
