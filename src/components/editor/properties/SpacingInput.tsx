import { useState } from 'react'
import { Link2, Unlink2 } from 'lucide-react'

interface SpacingInputProps {
  label: string
  top: string | null
  right: string | null
  bottom: string | null
  left: string | null
  onChange: (side: 'top' | 'right' | 'bottom' | 'left', value: string | null) => void
  onChangeAll: (value: string | null) => void
}

export function SpacingInput({ label, top, right, bottom, left, onChange, onChangeAll }: SpacingInputProps) {
  const [linked, setLinked] = useState(false)

  const handleChange = (side: 'top' | 'right' | 'bottom' | 'left', raw: string) => {
    const value = raw.trim() === '' ? null : raw.trim()
    if (linked) {
      onChangeAll(value)
    } else {
      onChange(side, value)
    }
  }

  const sides = [
    { key: 'top' as const, label: 'T', value: top },
    { key: 'right' as const, label: 'D', value: right },
    { key: 'bottom' as const, label: 'B', value: bottom },
    { key: 'left' as const, label: 'E', value: left },
  ]

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <button
          type="button"
          onClick={() => setLinked(!linked)}
          className={`p-1 rounded ${linked ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
          title={linked ? 'Desvincular lados' : 'Vincular lados'}
        >
          {linked ? <Link2 className="h-3 w-3" /> : <Unlink2 className="h-3 w-3" />}
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {sides.map((side) => (
          <div key={side.key} className="relative">
            <input
              type="text"
              value={side.value || ''}
              onChange={(e) => handleChange(side.key, e.target.value)}
              placeholder="0"
              className="w-full h-7 px-1 text-xs text-center rounded border bg-background"
            />
            <span className="absolute top-0.5 left-1 text-[10px] text-muted-foreground pointer-events-none">
              {side.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground">Valores: 8px, 1rem, etc.</p>
    </div>
  )
}
