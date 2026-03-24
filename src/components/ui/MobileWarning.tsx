import { Monitor } from 'lucide-react'

export function MobileWarning() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-6 lg:hidden">
      <div className="flex flex-col items-center text-center max-w-sm gap-4">
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-muted">
          <Monitor className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Acesso via desktop</h2>
          <p className="text-sm text-muted-foreground">
            O DocMigrate foi projetado para telas maiores. Para a melhor experiencia, acesse pelo computador com resolucao minima de 1280px.
          </p>
        </div>
      </div>
    </div>
  )
}
