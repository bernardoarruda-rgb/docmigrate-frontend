const WORDS_PER_MINUTE = 200

export function estimateReadingTime(plainText: string | null | undefined): number {
  if (!plainText) return 0
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
}
