const MINUTE = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

export function formatRelativeDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = Date.now()
  const diff = now - date.getTime()

  if (diff < MINUTE) return 'agora'
  if (diff < HOUR) {
    const mins = Math.floor(diff / MINUTE)
    return `ha ${mins} min`
  }
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR)
    return `ha ${hours}h`
  }
  if (diff < DAY * 7) {
    const days = Math.floor(diff / DAY)
    return `ha ${days}d`
  }

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export function isWithinHours(dateString: string | null | undefined, hours: number): boolean {
  if (!dateString) return false
  const diff = Date.now() - new Date(dateString).getTime()
  return diff < hours * HOUR
}
