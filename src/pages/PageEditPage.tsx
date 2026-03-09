import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function PageEditPage() {
  const { pageId } = useParams<{ pageId: string }>()

  return (
    <div>
      <Link
        to={`/pages/${pageId}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <h2 className="text-2xl font-bold font-heading mb-6">Editor</h2>
      <div className="flex items-center justify-center py-12 rounded-lg border border-dashed border-border">
        <p className="text-muted-foreground">Editor Tiptap em construcao.</p>
      </div>
    </div>
  )
}
