import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePages } from '@/hooks/usePages'

export function usePageKeyboardNav(spaceId: number, currentPageId: number) {
  const navigate = useNavigate()
  const { data: pages } = usePages(spaceId)

  useEffect(() => {
    if (!pages || pages.length < 2) return

    const sorted = [...pages].sort((a, b) => a.sortOrder - b.sortOrder)
    const currentIndex = sorted.findIndex(p => p.id === currentPageId)
    if (currentIndex === -1) return

    function handleKeyDown(e: KeyboardEvent) {
      if (!e.altKey || !sorted) return
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault()
        const prev = sorted[currentIndex - 1]
        navigate(`/spaces/${spaceId}/pages/${prev.id}`)
      } else if (e.key === 'ArrowDown' && currentIndex < sorted.length - 1) {
        e.preventDefault()
        const next = sorted[currentIndex + 1]
        navigate(`/spaces/${spaceId}/pages/${next.id}`)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pages, currentPageId, spaceId, navigate])
}
