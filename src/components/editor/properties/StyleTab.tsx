import type { Editor } from '@tiptap/core'
import { ColorPicker } from './ColorPicker'
import {
  STYLE_BORDER_WIDTHS,
  STYLE_BORDER_RADII,
  STYLE_BORDER_STYLES,
  STYLE_SHADOWS,
  STYLE_PRESETS,
} from '@/config/editorStyles'

interface StyleTabProps {
  editor: Editor
  attrs: Record<string, unknown>
  updateAttr: (key: string, value: string | null) => void
}

export function StyleTab({ attrs, updateAttr }: StyleTabProps) {
  const applyPreset = (preset: (typeof STYLE_PRESETS)[number]) => {
    for (const [key, value] of Object.entries(preset.attrs)) {
      updateAttr(key, value)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Presets</label>
        <div className="grid grid-cols-2 gap-1">
          {STYLE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className="py-1.5 text-xs rounded border border-border hover:bg-accent/50 hover:border-primary transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-3" />

      <ColorPicker
        label="Cor de fundo"
        value={(attrs.styleBgColor as string | null) || null}
        onChange={(v) => updateAttr('styleBgColor', v)}
      />
      <ColorPicker
        label="Cor do texto"
        value={(attrs.styleTextColor as string | null) || null}
        onChange={(v) => updateAttr('styleTextColor', v)}
      />

      <div className="border-t border-border pt-3 space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Borda</p>
        <ColorPicker
          label="Cor da borda"
          value={(attrs.styleBorderColor as string | null) || null}
          onChange={(v) => updateAttr('styleBorderColor', v)}
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Largura</label>
            <select
              value={(attrs.styleBorderWidth as string) || '0'}
              onChange={(e) => updateAttr('styleBorderWidth', e.target.value === '0' ? null : e.target.value)}
              className="w-full h-7 text-xs rounded border bg-background px-1"
            >
              {STYLE_BORDER_WIDTHS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Estilo</label>
            <select
              value={(attrs.styleBorderStyle as string) || 'solid'}
              onChange={(e) => updateAttr('styleBorderStyle', e.target.value)}
              className="w-full h-7 text-xs rounded border bg-background px-1"
            >
              {STYLE_BORDER_STYLES.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Arredondamento</label>
          <div className="flex gap-1">
            {Object.entries(STYLE_BORDER_RADII).map(([key, opt]) => (
              <button
                key={key}
                type="button"
                onClick={() => updateAttr('styleBorderRadius', key === 'none' ? null : opt.value)}
                className={`flex-1 py-1 text-xs rounded border ${
                  (attrs.styleBorderRadius || '0') === opt.value || (!attrs.styleBorderRadius && key === 'none')
                    ? 'bg-accent font-medium border-primary'
                    : 'border-border hover:bg-accent/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-3 space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Sombra</label>
        <div className="flex gap-1">
          {Object.entries(STYLE_SHADOWS).map(([key, opt]) => (
            <button
              key={key}
              type="button"
              onClick={() => updateAttr('styleShadow', key === 'none' ? null : opt.value)}
              className={`flex-1 py-1 text-xs rounded border ${
                (attrs.styleShadow || 'none') === opt.value || (!attrs.styleShadow && key === 'none')
                  ? 'bg-accent font-medium border-primary'
                  : 'border-border hover:bg-accent/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-3">
        <button
          type="button"
          onClick={() => {
            updateAttr('styleBgColor', null)
            updateAttr('styleTextColor', null)
            updateAttr('styleBorderColor', null)
            updateAttr('styleBorderWidth', null)
            updateAttr('styleBorderRadius', null)
            updateAttr('styleBorderStyle', null)
            updateAttr('styleShadow', null)
          }}
          className="w-full py-1.5 text-xs rounded border border-border hover:bg-accent/50 text-muted-foreground"
        >
          Resetar estilos
        </button>
      </div>
    </div>
  )
}
