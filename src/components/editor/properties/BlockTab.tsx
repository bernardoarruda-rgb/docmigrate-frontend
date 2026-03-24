import type { Editor } from '@tiptap/core'
import type { SectionPadding, SectionLayout, SectionGridGap } from '../SectionExtension'
import { GRID_COLUMNS_OPTIONS, GRID_GAP } from '@/config/editorStyles'
import type { GridGapKey } from '@/config/editorStyles'
import type { ButtonVariant, ButtonAlign } from '../ButtonExtension'
import type { CardVariant } from '../CardExtension'
import type { SpacerSize } from '../SpacerExtension'
import type { EmbedAspectRatio, EmbedWidth } from '../EmbedExtension'
import { SPACER_HEIGHTS } from '../SpacerExtension'

interface BlockTabProps {
  editor: Editor
  nodeType: string
  attrs: Record<string, unknown>
  updateAttr: (key: string, value: unknown) => void
}

function SectionControls({ attrs, updateAttr }: { attrs: Record<string, unknown>; updateAttr: (k: string, v: unknown) => void }) {
  const paddingY = (attrs.paddingY || 'md') as SectionPadding
  const layout = (attrs.layout || 'flow') as SectionLayout
  const gridColumns = (attrs.gridColumns || 3) as number
  const gridGap = (attrs.gridGap || 'md') as SectionGridGap
  const isGrid = layout === 'grid'

  const paddingOptions: { value: SectionPadding; label: string }[] = [
    { value: 'none', label: 'Nenhum' },
    { value: 'sm', label: 'P' },
    { value: 'md', label: 'M' },
    { value: 'lg', label: 'G' },
    { value: 'xl', label: 'XG' },
  ]

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Layout</label>
        <div className="flex gap-1">
          {(['flow', 'grid'] as SectionLayout[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => updateAttr('layout', l)}
              className={`flex-1 py-1 text-xs rounded border ${layout === l ? 'bg-accent font-medium border-primary' : 'border-border hover:bg-accent/50'}`}
            >
              {l === 'flow' ? 'Fluxo' : 'Grid'}
            </button>
          ))}
        </div>
      </div>
      {isGrid && (
        <>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Colunas</label>
            <div className="flex gap-1">
              {GRID_COLUMNS_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => updateAttr('gridColumns', n)}
                  className={`flex-1 py-1 text-xs rounded border ${gridColumns === n ? 'bg-accent font-medium border-primary' : 'border-border hover:bg-accent/50'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Espacamento</label>
            <div className="flex gap-1">
              {(Object.keys(GRID_GAP) as GridGapKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => updateAttr('gridGap', k)}
                  className={`flex-1 py-1 text-xs rounded border ${gridGap === k ? 'bg-accent font-medium border-primary' : 'border-border hover:bg-accent/50'}`}
                >
                  {GRID_GAP[k].label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Padding vertical</label>
        <div className="flex gap-1">
          {paddingOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateAttr('paddingY', opt.value)}
              className={`flex-1 py-1 text-xs rounded border ${paddingY === opt.value ? 'bg-accent font-medium border-primary' : 'border-border hover:bg-accent/50'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Cor de fundo (secao)</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={(attrs.backgroundColor as string) || '#ffffff'}
            onChange={(e) => updateAttr('backgroundColor', e.target.value)}
            className="h-7 w-7 rounded border cursor-pointer"
          />
          <input
            type="color"
            value={(attrs.textColor as string) || '#000000'}
            onChange={(e) => updateAttr('textColor', e.target.value)}
            className="h-7 w-7 rounded border cursor-pointer"
          />
          <span className="text-xs text-muted-foreground">Fundo / Texto</span>
          {!!(attrs.backgroundColor || attrs.textColor) && (
            <button
              type="button"
              onClick={() => { updateAttr('backgroundColor', null); updateAttr('textColor', null) }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ButtonControls({ attrs, updateAttr }: { attrs: Record<string, unknown>; updateAttr: (k: string, v: unknown) => void }) {
  const variant = (attrs.variant || 'primary') as ButtonVariant
  const align = (attrs.align || 'left') as ButtonAlign

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Texto</label>
        <input
          type="text"
          value={(attrs.text as string) || ''}
          onChange={(e) => updateAttr('text', e.target.value)}
          className="w-full h-7 px-2 text-xs rounded border bg-background"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Link (URL)</label>
        <input
          type="url"
          value={(attrs.href as string) || ''}
          onChange={(e) => updateAttr('href', e.target.value)}
          className="w-full h-7 px-2 text-xs rounded border bg-background"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Variante</label>
        <div className="flex gap-1">
          {(['primary', 'outline', 'ghost'] as ButtonVariant[]).map((v) => (
            <button key={v} type="button" onClick={() => updateAttr('variant', v)}
              className={`flex-1 py-1 text-xs rounded border ${variant === v ? 'bg-accent font-medium border-primary' : 'border-border hover:bg-accent/50'}`}
            >
              {v === 'primary' ? 'Cheio' : v === 'outline' ? 'Borda' : 'Texto'}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Alinhamento</label>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as ButtonAlign[]).map((a) => (
            <button key={a} type="button" onClick={() => updateAttr('align', a)}
              className={`flex-1 py-1 text-xs rounded border ${align === a ? 'bg-accent font-medium border-primary' : 'border-border hover:bg-accent/50'}`}
            >
              {a === 'left' ? 'Esquerda' : a === 'center' ? 'Centro' : 'Direita'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function CardControls({ attrs, updateAttr }: { attrs: Record<string, unknown>; updateAttr: (k: string, v: unknown) => void }) {
  const variant = (attrs.variant || 'bordered') as CardVariant
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">Variante</label>
      <div className="flex gap-1">
        {(['bordered', 'elevated', 'filled'] as CardVariant[]).map((v) => (
          <button key={v} type="button" onClick={() => updateAttr('variant', v)}
            className={`flex-1 py-1 text-xs rounded border ${variant === v ? 'bg-accent font-medium border-primary' : 'border-border hover:bg-accent/50'}`}
          >
            {v === 'bordered' ? 'Borda' : v === 'elevated' ? 'Elevado' : 'Preenchido'}
          </button>
        ))}
      </div>
    </div>
  )
}

function SpacerControls({ attrs, updateAttr }: { attrs: Record<string, unknown>; updateAttr: (k: string, v: unknown) => void }) {
  const size = (attrs.size || 'md') as SpacerSize
  const options: { value: SpacerSize; label: string }[] = [
    { value: 'sm', label: `P (${SPACER_HEIGHTS.sm}px)` },
    { value: 'md', label: `M (${SPACER_HEIGHTS.md}px)` },
    { value: 'lg', label: `G (${SPACER_HEIGHTS.lg}px)` },
    { value: 'xl', label: `XG (${SPACER_HEIGHTS.xl}px)` },
  ]
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">Tamanho</label>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button key={opt.value} type="button" onClick={() => updateAttr('size', opt.value)}
            className={`flex-1 py-1 text-xs rounded border ${size === opt.value ? 'bg-accent font-medium border-primary' : 'border-border hover:bg-accent/50'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function CalloutControls({ attrs, updateAttr }: { attrs: Record<string, unknown>; updateAttr: (k: string, v: unknown) => void }) {
  const type = (attrs.type as string) || 'info'
  const options = [
    { value: 'info', label: 'Info' },
    { value: 'warning', label: 'Aviso' },
    { value: 'success', label: 'Sucesso' },
    { value: 'error', label: 'Erro' },
  ]
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">Tipo</label>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button key={opt.value} type="button" onClick={() => updateAttr('type', opt.value)}
            className={`flex-1 py-1 text-xs rounded border ${type === opt.value ? 'bg-accent font-medium border-primary' : 'border-border hover:bg-accent/50'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function EmbedControls({ attrs, updateAttr }: { attrs: Record<string, unknown>; updateAttr: (k: string, v: unknown) => void }) {
  const aspectRatio = (attrs.aspectRatio || '16:9') as EmbedAspectRatio
  const width = (attrs.width || '100%') as EmbedWidth

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">URL</label>
        <input
          type="url"
          value={(attrs.url as string) || ''}
          onChange={(e) => updateAttr('url', e.target.value)}
          className="w-full h-7 px-2 text-xs rounded border bg-background"
          placeholder="https://..."
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Proporcao</label>
        <div className="flex gap-1">
          {(['16:9', '4:3', '1:1', 'custom'] as EmbedAspectRatio[]).map((r) => (
            <button key={r} type="button" onClick={() => updateAttr('aspectRatio', r)}
              className={`flex-1 py-1 text-xs rounded border ${aspectRatio === r ? 'bg-accent font-medium border-primary' : 'border-border hover:bg-accent/50'}`}
            >
              {r === 'custom' ? 'Fixo' : r}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Largura embed</label>
        <div className="flex gap-1">
          {(['100%', '75%', '50%'] as EmbedWidth[]).map((w) => (
            <button key={w} type="button" onClick={() => updateAttr('width', w)}
              className={`flex-1 py-1 text-xs rounded border ${width === w ? 'bg-accent font-medium border-primary' : 'border-border hover:bg-accent/50'}`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
      {aspectRatio === 'custom' && (
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Altura (px)</label>
          <input
            type="number"
            value={(attrs.height as number) || 400}
            onChange={(e) => updateAttr('height', Math.max(100, Math.min(1200, Number(e.target.value) || 400)))}
            min={100}
            max={1200}
            className="w-full h-7 px-2 text-xs rounded border bg-background"
          />
        </div>
      )}
    </div>
  )
}

function ImageControls({ attrs, updateAttr }: { attrs: Record<string, unknown>; updateAttr: (k: string, v: unknown) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">URL da imagem</label>
        <input
          type="url"
          value={(attrs.src as string) || ''}
          onChange={(e) => updateAttr('src', e.target.value)}
          className="w-full h-7 px-2 text-xs rounded border bg-background"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Texto alternativo</label>
        <input
          type="text"
          value={(attrs.alt as string) || ''}
          onChange={(e) => updateAttr('alt', e.target.value)}
          className="w-full h-7 px-2 text-xs rounded border bg-background"
        />
      </div>
    </div>
  )
}

const BLOCK_CONTROLS: Record<string, React.ComponentType<{ attrs: Record<string, unknown>; updateAttr: (k: string, v: unknown) => void }>> = {
  section: SectionControls,
  buttonBlock: ButtonControls,
  cardBlock: CardControls,
  spacer: SpacerControls,
  callout: CalloutControls,
  embedBlock: EmbedControls,
  image: ImageControls,
}

const NODE_TYPE_LABELS: Record<string, string> = {
  paragraph: 'Paragrafo',
  heading: 'Titulo',
  bulletList: 'Lista',
  orderedList: 'Lista numerada',
  blockquote: 'Citacao',
  codeBlock: 'Bloco de codigo',
  horizontalRule: 'Linha horizontal',
  section: 'Secao',
  buttonBlock: 'Botao',
  cardBlock: 'Card',
  callout: 'Callout',
  accordion: 'Acordeao',
  accordionItem: 'Item do acordeao',
  spacer: 'Espacador',
  embedBlock: 'Embed',
  image: 'Imagem',
  columns: 'Colunas',
  column: 'Coluna',
  listItem: 'Item de lista',
}

export function BlockTab({ nodeType, attrs, updateAttr }: BlockTabProps) {
  const Controls = BLOCK_CONTROLS[nodeType]
  const label = NODE_TYPE_LABELS[nodeType] || nodeType

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium bg-accent/50 px-2 py-0.5 rounded">{label}</span>
      </div>
      {Controls ? (
        <Controls attrs={attrs} updateAttr={updateAttr} />
      ) : (
        <p className="text-xs text-muted-foreground">
          Este bloco nao possui propriedades especificas.
        </p>
      )}
    </div>
  )
}
