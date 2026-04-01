const HIGHLIGHT_CLASS = 'heading-highlight'
const HIGHLIGHT_DURATION_MS = 2000

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Strip all non-alphanumeric chars for loose comparison */
function alphanumOnly(text: string): string {
  return text.replace(/[^a-z0-9]/g, '')
}

/** Find a heading element by exact ID or fuzzy slug matching */
function findHeading(elementId: string): HTMLElement | null {
  // Try exact match first
  const exact = document.getElementById(elementId)
  if (exact) return exact

  // Slugify the requested ID and try again (Google Docs uses different ID format)
  const slug = slugify(decodeURIComponent(elementId))
  if (slug !== elementId) {
    const bySlug = document.getElementById(slug)
    if (bySlug) return bySlug
  }

  // Fuzzy: compare alphanumeric-only versions (ignores dash/dot differences)
  // e.g. "123-configuracao-nginx" matches "12-3-configuracao-nginx"
  const targetAlpha = alphanumOnly(slug)
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')

  for (const heading of headings) {
    if (!heading.id) continue
    const headingAlpha = alphanumOnly(heading.id)
    if (headingAlpha === targetAlpha || headingAlpha.includes(targetAlpha) || targetAlpha.includes(headingAlpha)) {
      return heading as HTMLElement
    }
  }

  // Last resort: match by heading text content
  for (const heading of headings) {
    const textAlpha = alphanumOnly(slugify(heading.textContent ?? ''))
    if (textAlpha === targetAlpha || textAlpha.includes(targetAlpha)) {
      return heading as HTMLElement
    }
  }

  return null
}

export function scrollToAndHighlight(elementId: string) {
  const el = findHeading(elementId)
  if (!el) return

  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.classList.add(HIGHLIGHT_CLASS)

  setTimeout(() => {
    el.classList.remove(HIGHLIGHT_CLASS)
  }, HIGHLIGHT_DURATION_MS)
}
