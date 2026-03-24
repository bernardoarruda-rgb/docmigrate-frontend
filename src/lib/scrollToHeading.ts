const HIGHLIGHT_CLASS = 'heading-highlight'
const HIGHLIGHT_DURATION_MS = 2000

export function scrollToAndHighlight(elementId: string) {
  const el = document.getElementById(elementId)
  if (!el) return

  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.classList.add(HIGHLIGHT_CLASS)

  setTimeout(() => {
    el.classList.remove(HIGHLIGHT_CLASS)
  }, HIGHLIGHT_DURATION_MS)
}
