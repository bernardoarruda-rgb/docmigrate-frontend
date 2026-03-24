export interface IconCategory {
  name: string
  icons: string[]
}

export const ICON_CATEGORIES: IconCategory[] = [
  {
    name: 'Documentos',
    icons: ['File', 'FileText', 'Files', 'FolderOpen', 'Folder', 'FolderClosed', 'BookOpen', 'Book', 'Notebook', 'ScrollText', 'FileCode', 'FileSpreadsheet', 'FileImage', 'FilePen', 'FileCheck'],
  },
  {
    name: 'Comunicacao',
    icons: ['Mail', 'MessageSquare', 'MessageCircle', 'Phone', 'Video', 'Megaphone', 'Bell', 'Send', 'Inbox', 'AtSign'],
  },
  {
    name: 'Ferramentas',
    icons: ['Settings', 'Wrench', 'Hammer', 'Paintbrush', 'Scissors', 'Pen', 'Pencil', 'Eraser', 'Ruler', 'Compass'],
  },
  {
    name: 'Navegacao',
    icons: ['House', 'Map', 'MapPin', 'Navigation', 'Globe', 'Compass', 'Signpost', 'Route', 'Locate', 'Search'],
  },
  {
    name: 'Midia',
    icons: ['Image', 'Camera', 'Film', 'Music', 'Headphones', 'Mic', 'Play', 'Pause', 'Volume2', 'Monitor'],
  },
  {
    name: 'Pessoas',
    icons: ['User', 'Users', 'UserPlus', 'UserCheck', 'Heart', 'ThumbsUp', 'Star', 'Award', 'Crown', 'Smile'],
  },
  {
    name: 'Dados',
    icons: ['ChartBar', 'ChartPie', 'TrendingUp', 'Activity', 'Database', 'Server', 'HardDrive', 'Cloud', 'Wifi', 'Signal'],
  },
  {
    name: 'Seguranca',
    icons: ['Lock', 'LockOpen', 'Shield', 'ShieldCheck', 'Key', 'Eye', 'EyeOff', 'ScanFace', 'Bug', 'TriangleAlert'],
  },
  {
    name: 'Negocios',
    icons: ['Briefcase', 'Building2', 'Store', 'Banknote', 'CreditCard', 'Receipt', 'ShoppingCart', 'Package', 'Truck', 'Clock'],
  },
  {
    name: 'Outros',
    icons: ['Zap', 'Flame', 'Rocket', 'Target', 'Gift', 'Puzzle', 'Lightbulb', 'Sparkles', 'Rainbow', 'Leaf'],
  },
]

export const ALL_ICONS = ICON_CATEGORIES.flatMap((c) => c.icons)
