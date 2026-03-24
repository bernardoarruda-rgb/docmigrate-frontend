import { icons } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { FolderOpen } from 'lucide-react'
import { parseIcon } from '@/lib/iconUtils'

interface IconRendererProps {
  icon: string | null
  iconColor?: string | null
  size?: number
  className?: string
}

export function IconRenderer({ icon, iconColor, size = 24, className = '' }: IconRendererProps) {
  if (!icon) {
    return <FolderOpen size={size} className={`text-muted-foreground ${className}`} />
  }

  const parsed = parseIcon(icon)

  switch (parsed.type) {
    case 'lucide': {
      const LucideComponent = icons[parsed.value as keyof typeof icons] as LucideIcon | undefined
      if (!LucideComponent) {
        return <FolderOpen size={size} className={`text-muted-foreground ${className}`} />
      }
      return (
        <LucideComponent
          size={size}
          style={iconColor ? { color: iconColor } : undefined}
          className={className}
        />
      )
    }
    case 'emoji':
      return (
        <span style={{ fontSize: `${size}px`, lineHeight: 1 }} className={className}>
          {parsed.value}
        </span>
      )
    case 'upload':
      return (
        <img
          src={parsed.value}
          alt=""
          width={size}
          height={size}
          className={`object-contain ${className}`}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )
    default:
      return <FolderOpen size={size} className={`text-muted-foreground ${className}`} />
  }
}
