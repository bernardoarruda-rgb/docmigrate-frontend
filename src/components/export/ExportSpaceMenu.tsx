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
import { exportSpaceAsZip, type ExportFormat } from '@/lib/exportUtils'
import { pageService } from '@/services/pageService'

interface ExportSpaceMenuProps {
  spaceId: number
  spaceName: string
}

const FORMAT_OPTIONS: { format: ExportFormat; label: string; icon: React.ReactNode }[] = [
  { format: 'markdown', label: 'Markdown (.zip)', icon: <FileText className="h-4 w-4" /> },
  { format: 'docx', label: 'Word (.zip)', icon: <FileType className="h-4 w-4" /> },
  { format: 'pdf', label: 'HTML (.zip)', icon: <FileImage className="h-4 w-4" /> },
]

function ExportSpaceMenu({ spaceId, spaceName }: ExportSpaceMenuProps) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (format: ExportFormat) => {
    setExporting(true)
    try {
      const result = await pageService.getAll(spaceId)
      const pages = result.items

      if (pages.length === 0) {
        toast.error('Este espaco nao tem paginas para exportar')
        return
      }

      const fullPages = await Promise.all(
        pages.map((p) => pageService.getById(p.id)),
      )

      await exportSpaceAsZip(
        spaceName,
        fullPages.map((p) => ({ title: p.title, content: p.content })),
        format,
      )
      toast.success('Espaco exportado com sucesso')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro ao exportar espaco',
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
          <Button variant="outline" size="sm" disabled={exporting}>
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Exportar tudo
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Exportar espaco como</DropdownMenuLabel>
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

export { ExportSpaceMenu }
