import type { CSSProperties } from 'react'
import { STYLE_SHADOWS } from '@/config/editorStyles'

type ShadowKey = keyof typeof STYLE_SHADOWS

interface StyleAttrs {
  styleMarginTop?: string | null
  styleMarginBottom?: string | null
  styleMarginLeft?: string | null
  styleMarginRight?: string | null
  stylePaddingTop?: string | null
  stylePaddingBottom?: string | null
  stylePaddingLeft?: string | null
  stylePaddingRight?: string | null
  styleBgColor?: string | null
  styleTextColor?: string | null
  styleBorderColor?: string | null
  styleBorderWidth?: string | null
  styleBorderRadius?: string | null
  styleBorderStyle?: string | null
  styleShadow?: string | null
  styleWidth?: string | null
  styleHeight?: string | null
  gridColumnSpan?: number | null
  gridRowSpan?: number | null
  [key: string]: unknown
}

export function buildStyleObject(attrs: StyleAttrs): CSSProperties {
  const style: CSSProperties = {}

  if (attrs.styleMarginTop) style.marginTop = attrs.styleMarginTop
  if (attrs.styleMarginBottom) style.marginBottom = attrs.styleMarginBottom
  if (attrs.styleMarginLeft) style.marginLeft = attrs.styleMarginLeft
  if (attrs.styleMarginRight) style.marginRight = attrs.styleMarginRight
  if (attrs.stylePaddingTop) style.paddingTop = attrs.stylePaddingTop
  if (attrs.stylePaddingBottom) style.paddingBottom = attrs.stylePaddingBottom
  if (attrs.stylePaddingLeft) style.paddingLeft = attrs.stylePaddingLeft
  if (attrs.stylePaddingRight) style.paddingRight = attrs.stylePaddingRight
  if (attrs.styleBgColor) style.backgroundColor = attrs.styleBgColor
  if (attrs.styleTextColor) style.color = attrs.styleTextColor
  if (attrs.styleBorderColor) style.borderColor = attrs.styleBorderColor
  if (attrs.styleBorderWidth) style.borderWidth = attrs.styleBorderWidth
  if (attrs.styleBorderRadius) style.borderRadius = attrs.styleBorderRadius
  if (attrs.styleBorderStyle) style.borderStyle = attrs.styleBorderStyle as CSSProperties['borderStyle']
  if (attrs.styleShadow && attrs.styleShadow !== 'none') {
    const shadow = STYLE_SHADOWS[attrs.styleShadow as ShadowKey]
    if (shadow) style.boxShadow = shadow.css
  }
  if (attrs.styleWidth) style.width = attrs.styleWidth
  if (attrs.styleHeight) style.height = attrs.styleHeight
  if (attrs.gridColumnSpan && attrs.gridColumnSpan > 1) style.gridColumn = `span ${attrs.gridColumnSpan}`
  if (attrs.gridRowSpan && attrs.gridRowSpan > 1) style.gridRow = `span ${attrs.gridRowSpan}`

  return style
}

export function buildStyleString(attrs: StyleAttrs): string {
  const parts: string[] = []

  if (attrs.styleMarginTop) parts.push(`margin-top: ${attrs.styleMarginTop}`)
  if (attrs.styleMarginBottom) parts.push(`margin-bottom: ${attrs.styleMarginBottom}`)
  if (attrs.styleMarginLeft) parts.push(`margin-left: ${attrs.styleMarginLeft}`)
  if (attrs.styleMarginRight) parts.push(`margin-right: ${attrs.styleMarginRight}`)
  if (attrs.stylePaddingTop) parts.push(`padding-top: ${attrs.stylePaddingTop}`)
  if (attrs.stylePaddingBottom) parts.push(`padding-bottom: ${attrs.stylePaddingBottom}`)
  if (attrs.stylePaddingLeft) parts.push(`padding-left: ${attrs.stylePaddingLeft}`)
  if (attrs.stylePaddingRight) parts.push(`padding-right: ${attrs.stylePaddingRight}`)
  if (attrs.styleBgColor) parts.push(`background-color: ${attrs.styleBgColor}`)
  if (attrs.styleTextColor) parts.push(`color: ${attrs.styleTextColor}`)
  if (attrs.styleBorderColor) parts.push(`border-color: ${attrs.styleBorderColor}`)
  if (attrs.styleBorderWidth) parts.push(`border-width: ${attrs.styleBorderWidth}`)
  if (attrs.styleBorderRadius) parts.push(`border-radius: ${attrs.styleBorderRadius}`)
  if (attrs.styleBorderStyle) parts.push(`border-style: ${attrs.styleBorderStyle}`)
  if (attrs.styleShadow && attrs.styleShadow !== 'none') {
    const shadow = STYLE_SHADOWS[attrs.styleShadow as ShadowKey]
    if (shadow) parts.push(`box-shadow: ${shadow.css}`)
  }
  if (attrs.styleWidth) parts.push(`width: ${attrs.styleWidth}`)
  if (attrs.styleHeight) parts.push(`height: ${attrs.styleHeight}`)
  if (attrs.gridColumnSpan && Number(attrs.gridColumnSpan) > 1) parts.push(`grid-column: span ${attrs.gridColumnSpan}`)
  if (attrs.gridRowSpan && Number(attrs.gridRowSpan) > 1) parts.push(`grid-row: span ${attrs.gridRowSpan}`)

  return parts.join('; ')
}

export function hasAnyStyle(attrs: StyleAttrs): boolean {
  return !!(
    attrs.styleMarginTop ||
    attrs.styleMarginBottom ||
    attrs.styleMarginLeft ||
    attrs.styleMarginRight ||
    attrs.stylePaddingTop ||
    attrs.stylePaddingBottom ||
    attrs.stylePaddingLeft ||
    attrs.stylePaddingRight ||
    attrs.styleBgColor ||
    attrs.styleTextColor ||
    attrs.styleBorderColor ||
    attrs.styleBorderWidth ||
    attrs.styleBorderRadius ||
    attrs.styleBorderStyle ||
    (attrs.styleShadow && attrs.styleShadow !== 'none') ||
    attrs.styleWidth ||
    attrs.styleHeight
  )
}

export const GLOBAL_STYLE_ATTR_NAMES = [
  'styleMarginTop',
  'styleMarginBottom',
  'styleMarginLeft',
  'styleMarginRight',
  'stylePaddingTop',
  'stylePaddingBottom',
  'stylePaddingLeft',
  'stylePaddingRight',
  'styleBgColor',
  'styleTextColor',
  'styleBorderColor',
  'styleBorderWidth',
  'styleBorderRadius',
  'styleBorderStyle',
  'styleShadow',
  'styleWidth',
  'styleHeight',
] as const
