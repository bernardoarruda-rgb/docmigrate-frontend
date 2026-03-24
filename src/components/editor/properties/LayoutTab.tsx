import type { Editor } from '@tiptap/core'
import { SpacingInput } from './SpacingInput'
import { STYLE_WIDTH_PRESETS, STYLE_HEIGHT_PRESETS, GRID_ROW_SPAN_OPTIONS } from '@/config/editorStyles'

interface GridContext {
  columns: number
}

interface LayoutTabProps {
  editor: Editor
  attrs: Record<string, unknown>
  updateAttr: (key: string, value: string | null) => void
  gridContext: GridContext | null
}

export function LayoutTab({ attrs, updateAttr, gridContext }: LayoutTabProps) {
  const columnSpan = (attrs.gridColumnSpan as number | null) || 1
  const rowSpan = (attrs.gridRowSpan as number | null) || 1

  return (
    <div className="space-y-4">
      {gridContext && (
        <div className="space-y-3 rounded-md border border-primary/30 bg-primary/5 p-2.5">
          <p className="text-xs font-medium text-primary">Grid ({gridContext.columns} colunas)</p>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Colunas (span)</label>
            <div className="flex gap-1">
              {Array.from({ length: gridContext.columns }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => updateAttr('gridColumnSpan', n <= 1 ? null : String(n))}
                  className={`flex-1 py-1 text-xs rounded border ${
                    columnSpan === n ? 'bg-accent font-medium border-primary' : 'border-border hover:bg-accent/50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Linhas (span)</label>
            <div className="flex gap-1">
              {GRID_ROW_SPAN_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => updateAttr('gridRowSpan', n <= 1 ? null : String(n))}
                  className={`flex-1 py-1 text-xs rounded border ${
                    rowSpan === n ? 'bg-accent font-medium border-primary' : 'border-border hover:bg-accent/50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Largura</label>
        <div className="flex gap-1">
          {STYLE_WIDTH_PRESETS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateAttr('styleWidth', opt.value === 'auto' ? null : opt.value)}
              className={`flex-1 py-1 text-xs rounded border ${
                (attrs.styleWidth || 'auto') === opt.value || (!attrs.styleWidth && opt.value === 'auto')
                  ? 'bg-accent font-medium border-primary'
                  : 'border-border hover:bg-accent/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={(attrs.styleWidth as string) || ''}
          onChange={(e) => updateAttr('styleWidth', e.target.value.trim() || null)}
          placeholder="auto"
          className="w-full h-7 px-2 text-xs rounded border bg-background"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Altura</label>
        <div className="flex gap-1">
          {STYLE_HEIGHT_PRESETS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateAttr('styleHeight', opt.value === 'auto' ? null : opt.value)}
              className={`flex-1 py-1 text-xs rounded border ${
                (attrs.styleHeight || 'auto') === opt.value || (!attrs.styleHeight && opt.value === 'auto')
                  ? 'bg-accent font-medium border-primary'
                  : 'border-border hover:bg-accent/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={(attrs.styleHeight as string) || ''}
          onChange={(e) => updateAttr('styleHeight', e.target.value.trim() || null)}
          placeholder="auto"
          className="w-full h-7 px-2 text-xs rounded border bg-background"
        />
      </div>

      <div className="border-t border-border pt-3">
        <SpacingInput
          label="Margem"
          top={(attrs.styleMarginTop as string | null) || null}
          right={(attrs.styleMarginRight as string | null) || null}
          bottom={(attrs.styleMarginBottom as string | null) || null}
          left={(attrs.styleMarginLeft as string | null) || null}
          onChange={(side, value) => {
            const map = { top: 'styleMarginTop', right: 'styleMarginRight', bottom: 'styleMarginBottom', left: 'styleMarginLeft' }
            updateAttr(map[side], value)
          }}
          onChangeAll={(value) => {
            updateAttr('styleMarginTop', value)
            updateAttr('styleMarginRight', value)
            updateAttr('styleMarginBottom', value)
            updateAttr('styleMarginLeft', value)
          }}
        />
      </div>

      <div className="border-t border-border pt-3">
        <SpacingInput
          label="Padding"
          top={(attrs.stylePaddingTop as string | null) || null}
          right={(attrs.stylePaddingRight as string | null) || null}
          bottom={(attrs.stylePaddingBottom as string | null) || null}
          left={(attrs.stylePaddingLeft as string | null) || null}
          onChange={(side, value) => {
            const map = { top: 'stylePaddingTop', right: 'stylePaddingRight', bottom: 'stylePaddingBottom', left: 'stylePaddingLeft' }
            updateAttr(map[side], value)
          }}
          onChangeAll={(value) => {
            updateAttr('stylePaddingTop', value)
            updateAttr('stylePaddingRight', value)
            updateAttr('stylePaddingBottom', value)
            updateAttr('stylePaddingLeft', value)
          }}
        />
      </div>

      <div className="border-t border-border pt-3">
        <button
          type="button"
          onClick={() => {
            updateAttr('styleWidth', null)
            updateAttr('styleHeight', null)
            updateAttr('styleMarginTop', null)
            updateAttr('styleMarginRight', null)
            updateAttr('styleMarginBottom', null)
            updateAttr('styleMarginLeft', null)
            updateAttr('stylePaddingTop', null)
            updateAttr('stylePaddingRight', null)
            updateAttr('stylePaddingBottom', null)
            updateAttr('stylePaddingLeft', null)
            if (gridContext) {
              updateAttr('gridColumnSpan', null)
              updateAttr('gridRowSpan', null)
            }
          }}
          className="w-full py-1.5 text-xs rounded border border-border hover:bg-accent/50 text-muted-foreground"
        >
          Resetar layout
        </button>
      </div>
    </div>
  )
}
