import { describe, it, expect } from 'vitest'
import { extractPlainText } from './extractPlainText'

describe('extractPlainText', () => {
  it('returns empty string for null input', () => {
    expect(extractPlainText(null)).toBe('')
  })

  it('returns empty string for invalid JSON', () => {
    expect(extractPlainText('not valid json')).toBe('')
  })

  it('extracts text from a simple paragraph', () => {
    const content = JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world' }],
        },
      ],
    })
    expect(extractPlainText(content)).toBe('Hello world')
  })

  it('extracts text from nested content (heading + paragraph)', () => {
    const content = JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'heading',
          content: [{ type: 'text', text: 'Title' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Body text' }],
        },
      ],
    })
    const result = extractPlainText(content)
    expect(result).toContain('Title')
    expect(result).toContain('Body text')
  })

  it('respects maxLength parameter', () => {
    const content = JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'A very long text that should be truncated' }],
        },
      ],
    })
    const result = extractPlainText(content, 10)
    expect(result.length).toBeLessThanOrEqual(10)
  })

  it('handles empty document', () => {
    const content = JSON.stringify({ type: 'doc', content: [] })
    expect(extractPlainText(content)).toBe('')
  })
})
