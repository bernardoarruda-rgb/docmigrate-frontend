import { STYLE_BMS_PALETTE } from '@/config/editorStyles'

interface ColorPickerProps {
  label: string
  value: string | null
  onChange: (color: string | null) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <label className="relative h-7 w-7 rounded border border-border cursor-pointer shrink-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: value || 'transparent' }}
          />
          {!value && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[1px] h-full bg-destructive rotate-45 absolute" />
            </div>
          )}
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
        </label>
        <div className="flex gap-1 flex-wrap">
          {STYLE_BMS_PALETTE.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`h-5 w-5 rounded-sm border ${value === color ? 'ring-2 ring-primary ring-offset-1' : 'border-border'}`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-muted-foreground hover:text-foreground shrink-0"
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  )
}
