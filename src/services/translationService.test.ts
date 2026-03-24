import { describe, it, expect } from 'vitest'
import { translationKeys } from './translationService'

describe('translationKeys', () => {
  it('generates correct list key', () => {
    expect(translationKeys.list(42)).toEqual(['translations', 'list', 42])
  })

  it('generates correct detail key', () => {
    expect(translationKeys.detail(42, 'en')).toEqual(['translations', 'detail', 42, 'en'])
  })

  it('generates unique keys per language', () => {
    const enKey = translationKeys.detail(1, 'en')
    const esKey = translationKeys.detail(1, 'es')
    expect(enKey).not.toEqual(esKey)
  })
})
