import { useRef, useEffect, useCallback, useState } from 'react'
import { useAutosavePage } from '@/hooks/usePages'
import { AUTOSAVE } from '@/config/constants'
import { ENDPOINTS } from '@/config/endpoints'
import { getToken } from '@/lib/authStore'

type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved' | 'error'

export function useAutosave(pageId: number) {
  const autosaveMutation = useAutosavePage()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingContentRef = useRef<string | null>(null)
  const [status, setStatus] = useState<SaveStatus>('idle')

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const content = pendingContentRef.current
    if (!content) return

    setStatus('saving')
    autosaveMutation.mutate(
      { pageId, content },
      {
        onSuccess: () => {
          // Only clear if no newer content arrived while saving
          if (pendingContentRef.current === content) {
            pendingContentRef.current = null
            setStatus('saved')
          } else {
            // New content arrived during save — schedule another flush
            setStatus('unsaved')
            scheduleFlush()
          }
        },
        onError: () => {
          setStatus('error')
          // Retry after debounce interval
          scheduleFlush()
        },
      },
    )
  }, [pageId, autosaveMutation]) // eslint-disable-line react-hooks/exhaustive-deps

  const scheduleFlush = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(flush, AUTOSAVE.DEBOUNCE_MS)
  }, [flush])

  const save = useCallback((content: string) => {
    pendingContentRef.current = content
    setStatus('unsaved')
    scheduleFlush()
  }, [scheduleFlush])

  // Sync save on unmount (before lock release)
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      const content = pendingContentRef.current
      if (!content) return

      const url = ENDPOINTS.PAGES_AUTOSAVE(pageId)
      const token = getToken()
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      // Synchronous XHR to guarantee save completes before lock release
      const xhr = new XMLHttpRequest()
      xhr.open('PATCH', url, false) // false = synchronous
      Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v))
      xhr.send(JSON.stringify({ content }))
    }
  }, [pageId])

  return { save, status, isSaving: status === 'saving' }
}
