import { useState, useRef, useCallback } from 'react'
import { FileUp, Loader2, AlertTriangle, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { importFile, type ImportResult } from '@/lib/importUtils'
import { IMPORT } from '@/config/importConfig'
import { FIELD_LIMITS } from '@/config/constants'

type ImportMode = 'create' | 'insert'

interface ImportFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: ImportMode
  onPageCreate?: (title: string, content: string) => void
  onContentInsert?: (result: ImportResult) => void
}

type ImportState = 'idle' | 'processing' | 'done' | 'error'

function ImportFileDialog({
  open,
  onOpenChange,
  mode,
  onPageCreate,
  onContentInsert,
}: ImportFileDialogProps) {
  const [state, setState] = useState<ImportState>('idle')
  const [progress, setProgress] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setState('idle')
    setProgress('')
    setResult(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) reset()
      onOpenChange(nextOpen)
    },
    [onOpenChange, reset],
  )

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (file.size > IMPORT.MAX_FILE_SIZE) {
        setError('Arquivo muito grande. O tamanho maximo e 10MB.')
        setState('error')
        return
      }

      const ext = `.${file.name.toLowerCase().split('.').pop()}`
      const allowedExtensions = IMPORT.ACCEPTED_EXTENSIONS.split(',')
      if (!allowedExtensions.includes(ext)) {
        setError('Formato nao suportado. Use arquivos .md ou .docx.')
        setState('error')
        return
      }

      setState('processing')
      setError('')
      setProgress('Iniciando importacao...')

      try {
        const importResult = await importFile(file, setProgress)
        setResult(importResult)
        setState('done')
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao importar arquivo.',
        )
        setState('error')
      }
    },
    [],
  )

  const handleConfirm = useCallback(() => {
    if (!result) return

    if (mode === 'create' && onPageCreate) {
      onPageCreate(result.title, JSON.stringify(result.content))
    } else if (mode === 'insert' && onContentInsert) {
      onContentInsert(result)
    }

    handleOpenChange(false)
  }, [result, mode, onPageCreate, onContentInsert, handleOpenChange])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create'
              ? 'Importar como nova pagina'
              : 'Importar conteudo'}
          </DialogTitle>
          <DialogDescription>
            Selecione um arquivo .md ou .docx para importar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {state === 'idle' && (
            <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-8 cursor-pointer hover:border-primary/50 transition-colors">
              <FileUp className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Clique para selecionar arquivo
              </span>
              <span className="text-xs text-muted-foreground">
                .md ou .docx (max 10MB)
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept={IMPORT.ACCEPTED_EXTENSIONS}
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          )}

          {state === 'processing' && (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">{progress}</p>
            </div>
          )}

          {state === 'done' && result && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="font-medium">
                  Arquivo importado com sucesso
                </span>
              </div>

              {mode === 'create' && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Titulo da pagina
                  </label>
                  <Input
                    type="text"
                    value={result.title}
                    onChange={(e) =>
                      setResult({ ...result, title: e.target.value })
                    }
                    maxLength={FIELD_LIMITS.TITLE_MAX}
                  />
                </div>
              )}

              {result.warnings.length > 0 && (
                <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Avisos ({result.warnings.length})
                  </div>
                  <ul className="text-xs text-amber-600 dark:text-amber-500 space-y-0.5">
                    {result.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {state === 'error' && (
            <div className="space-y-3">
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
              <Button variant="outline" size="sm" onClick={reset}>
                Tentar novamente
              </Button>
            </div>
          )}
        </div>

        {state === 'done' && (
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>
              {mode === 'create' ? 'Criar pagina' : 'Inserir conteudo'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { ImportFileDialog }
export type { ImportMode, ImportFileDialogProps }
