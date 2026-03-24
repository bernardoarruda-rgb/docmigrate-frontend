import { Extension } from '@tiptap/core'
import { STYLE_SHADOWS } from '@/config/editorStyles'

const STYLED_NODE_TYPES = [
  'paragraph',
  'heading',
  'bulletList',
  'orderedList',
  'listItem',
  'blockquote',
  'codeBlock',
  'horizontalRule',
  'section',
  'buttonBlock',
  'cardBlock',
  'callout',
  'accordion',
  'accordionItem',
  'spacer',
  'embedBlock',
  'image',
  'columns',
  'column',
]

type ShadowKey = keyof typeof STYLE_SHADOWS

function makeCssAttr(attrName: string, cssProperty: string) {
  return {
    default: null,
    parseHTML: (element: HTMLElement) => {
      const value = element.style.getPropertyValue(cssProperty)
      return value || null
    },
    renderHTML: (attributes: Record<string, unknown>) => {
      const value = attributes[attrName]
      if (!value) return {}
      return { style: `${cssProperty}: ${value}` }
    },
  }
}

export const GlobalStyleExtension = Extension.create({
  name: 'globalStyles',

  addGlobalAttributes() {
    return [
      {
        types: STYLED_NODE_TYPES,
        attributes: {
          styleMarginTop: makeCssAttr('styleMarginTop', 'margin-top'),
          styleMarginBottom: makeCssAttr('styleMarginBottom', 'margin-bottom'),
          styleMarginLeft: makeCssAttr('styleMarginLeft', 'margin-left'),
          styleMarginRight: makeCssAttr('styleMarginRight', 'margin-right'),
          stylePaddingTop: makeCssAttr('stylePaddingTop', 'padding-top'),
          stylePaddingBottom: makeCssAttr('stylePaddingBottom', 'padding-bottom'),
          stylePaddingLeft: makeCssAttr('stylePaddingLeft', 'padding-left'),
          stylePaddingRight: makeCssAttr('stylePaddingRight', 'padding-right'),
          styleBgColor: makeCssAttr('styleBgColor', 'background-color'),
          styleTextColor: makeCssAttr('styleTextColor', 'color'),
          styleBorderColor: makeCssAttr('styleBorderColor', 'border-color'),
          styleBorderWidth: makeCssAttr('styleBorderWidth', 'border-width'),
          styleBorderRadius: makeCssAttr('styleBorderRadius', 'border-radius'),
          styleBorderStyle: makeCssAttr('styleBorderStyle', 'border-style'),
          styleShadow: {
            default: null,
            parseHTML: () => null,
            renderHTML: (attributes: Record<string, unknown>) => {
              const value = attributes.styleShadow as string | null
              if (!value || value === 'none') return {}
              const shadow = STYLE_SHADOWS[value as ShadowKey]
              if (!shadow) return {}
              return { style: `box-shadow: ${shadow.css}` }
            },
          },
          styleWidth: makeCssAttr('styleWidth', 'width'),
          styleHeight: makeCssAttr('styleHeight', 'height'),
          gridColumnSpan: {
            default: null,
            parseHTML: (element: HTMLElement) => {
              const val = element.style.getPropertyValue('grid-column')
              const match = val?.match(/span\s+(\d+)/)
              return match ? Number(match[1]) : null
            },
            renderHTML: (attributes: Record<string, unknown>) => {
              const value = attributes.gridColumnSpan as number | null
              if (!value || value <= 1) return {}
              return { style: `grid-column: span ${value}` }
            },
          },
          gridRowSpan: {
            default: null,
            parseHTML: (element: HTMLElement) => {
              const val = element.style.getPropertyValue('grid-row')
              const match = val?.match(/span\s+(\d+)/)
              return match ? Number(match[1]) : null
            },
            renderHTML: (attributes: Record<string, unknown>) => {
              const value = attributes.gridRowSpan as number | null
              if (!value || value <= 1) return {}
              return { style: `grid-row: span ${value}` }
            },
          },
        },
      },
    ]
  },
})
