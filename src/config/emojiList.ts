export interface EmojiCategory {
  name: string
  emojis: string[]
}

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    name: 'Objetos',
    emojis: ['📁', '📂', '📄', '📝', '📋', '📌', '📎', '✏️', '🔖', '📚', '📖', '💼', '🗂️', '🗃️', '📦'],
  },
  {
    name: 'Simbolos',
    emojis: ['⭐', '🔥', '💡', '🎯', '✅', '❌', '⚡', '💎', '🏷️', '🔔', '🔑', '🛡️', '⚙️', '🔧', '🎨'],
  },
  {
    name: 'Natureza',
    emojis: ['🌱', '🌿', '🍀', '🌸', '🌻', '🌈', '☀️', '🌙', '⛈️', '❄️', '🔥', '💧', '🌊', '🍃', '🌺'],
  },
  {
    name: 'Expressoes',
    emojis: ['😊', '😎', '🤔', '💪', '👍', '❤️', '🎉', '🚀', '✨', '💯', '🏆', '🎖️', '🥇', '👋', '🙌'],
  },
]

export const ALL_EMOJIS = EMOJI_CATEGORIES.flatMap((c) => c.emojis)
