import { DATE_FORMAT } from '@/config/constants'

interface MetadataFooterProps {
  createdByName: string | null
  createdAt: string
  updatedByName: string | null
  updatedAt: string
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(DATE_FORMAT.LOCALE, DATE_FORMAT.OPTIONS).format(
    new Date(iso),
  )
}

export function MetadataFooter({
  createdByName,
  createdAt,
  updatedByName,
  updatedAt,
}: MetadataFooterProps) {
  const createdDate = formatDate(createdAt)
  const updatedDate = formatDate(updatedAt)
  const hasBeenEdited = createdAt !== updatedAt

  return (
    <div className="flex flex-wrap items-center gap-x-1 text-xs text-muted-foreground mt-8 pt-4 border-t border-border">
      <span>
        {createdByName ? `Criado por ${createdByName}` : 'Criado'}
        {' em '}
        {createdDate}
      </span>
      {hasBeenEdited && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            {updatedByName ? `Editado por ${updatedByName}` : 'Editado'}
            {' em '}
            {updatedDate}
          </span>
        </>
      )}
    </div>
  )
}
