import { useCallback, useEffect, useRef, useState } from 'react'
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface ImageLightboxProps {
  src: string
  alt?: string
  open: boolean
  onClose: () => void
}

const MIN_SCALE = 0.5
const MAX_SCALE = 5
const ZOOM_STEP = 0.3

export function ImageLightbox({ src, alt, open, onClose }: ImageLightboxProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })

  const reset = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(s + ZOOM_STEP, MAX_SCALE))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((s) => {
      const next = Math.max(s - ZOOM_STEP, MIN_SCALE)
      if (next <= 1) setPosition({ x: 0, y: 0 })
      return next
    })
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation()
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
    setScale((s) => {
      const next = Math.max(MIN_SCALE, Math.min(s + delta, MAX_SCALE))
      if (next <= 1) setPosition({ x: 0, y: 0 })
      return next
    })
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    e.stopPropagation()
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = { ...position }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [position])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return
    e.stopPropagation()
    setPosition({
      x: posStart.current.x + (e.clientX - dragStart.current.x),
      y: posStart.current.y + (e.clientY - dragStart.current.y),
    })
  }, [dragging])

  const handlePointerUp = useCallback(() => {
    setDragging(false)
  }, [])

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    // Toggle zoom on click (if not dragged)
    if (!dragging) {
      setScale((s) => {
        if (s < 2) return 2
        setPosition({ x: 0, y: 0 })
        return 1
      })
    }
  }, [dragging])

  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === '+' || e.key === '=') zoomIn()
      if (e.key === '-') zoomOut()
      if (e.key === '0') reset()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      reset()
    }
  }, [open, onClose, zoomIn, zoomOut, reset])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm text-white/60">
          {Math.round(scale * 100)}%
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            title="Diminuir zoom (-)"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <button
            onClick={zoomIn}
            className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            title="Aumentar zoom (+)"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            onClick={reset}
            className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            title="Resetar (0)"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <div className="mx-2 h-5 w-px bg-white/20" />
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            title="Fechar (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="flex flex-1 items-center justify-center overflow-hidden"
        onWheel={handleWheel}
      >
        <img
          src={src}
          alt={alt ?? ''}
          className="select-none rounded-lg shadow-2xl"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: dragging ? 'none' : 'transform 0.2s ease-out',
            cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in',
            maxHeight: '85vh',
            maxWidth: '90vw',
          }}
          draggable={false}
          onClick={handleImageClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      </div>

      {/* Hint */}
      <div className="pb-3 text-center text-xs text-white/40">
        Scroll para zoom &middot; Arraste para mover &middot; Clique para alternar zoom
      </div>
    </div>
  )
}
