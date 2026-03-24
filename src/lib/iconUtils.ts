import { ICON } from '@/config/constants'

export type IconType = 'lucide' | 'emoji' | 'upload'

export interface ParsedIcon {
  type: IconType
  value: string
}

export function parseIcon(icon: string): ParsedIcon {
  if (icon.startsWith(ICON.PREFIX_LUCIDE)) {
    return { type: 'lucide', value: icon.slice(ICON.PREFIX_LUCIDE.length) }
  }
  if (icon.startsWith(ICON.PREFIX_EMOJI)) {
    return { type: 'emoji', value: icon.slice(ICON.PREFIX_EMOJI.length) }
  }
  if (icon.startsWith(ICON.PREFIX_UPLOAD)) {
    return { type: 'upload', value: icon.slice(ICON.PREFIX_UPLOAD.length) }
  }
  return { type: 'lucide', value: icon }
}

export function formatLucideIcon(name: string): string {
  return `${ICON.PREFIX_LUCIDE}${name}`
}

export function formatEmojiIcon(emoji: string): string {
  return `${ICON.PREFIX_EMOJI}${emoji}`
}

export function formatUploadIcon(url: string): string {
  return `${ICON.PREFIX_UPLOAD}${url}`
}
