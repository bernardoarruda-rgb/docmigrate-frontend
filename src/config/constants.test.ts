import { describe, it, expect } from 'vitest'
import { AUTOSAVE, PAGE_LOCK, FIELD_LIMITS, PAGINATION, IMAGE_UPLOAD, EDITOR, LANGUAGES, TRANSLATION_STATUS } from './constants'

describe('constants', () => {
  describe('AUTOSAVE', () => {
    it('DEBOUNCE_MS is a positive number', () => {
      expect(AUTOSAVE.DEBOUNCE_MS).toBeGreaterThan(0)
      expect(typeof AUTOSAVE.DEBOUNCE_MS).toBe('number')
    })
  })

  describe('PAGE_LOCK', () => {
    it('TIMEOUT_MINUTES is 30', () => {
      expect(PAGE_LOCK.TIMEOUT_MINUTES).toBe(30)
    })
  })

  describe('FIELD_LIMITS', () => {
    it('TITLE_MAX is a positive number', () => {
      expect(FIELD_LIMITS.TITLE_MAX).toBeGreaterThan(0)
    })

    it('DESCRIPTION_MAX is a positive number', () => {
      expect(FIELD_LIMITS.DESCRIPTION_MAX).toBeGreaterThan(0)
    })

    it('DESCRIPTION_MAX is greater than TITLE_MAX', () => {
      expect(FIELD_LIMITS.DESCRIPTION_MAX).toBeGreaterThan(FIELD_LIMITS.TITLE_MAX)
    })
  })

  describe('PAGINATION', () => {
    it('DEFAULT_PAGE_SIZE is positive and less than MAX_PAGE_SIZE', () => {
      expect(PAGINATION.DEFAULT_PAGE_SIZE).toBeGreaterThan(0)
      expect(PAGINATION.DEFAULT_PAGE_SIZE).toBeLessThanOrEqual(PAGINATION.MAX_PAGE_SIZE)
    })
  })

  describe('IMAGE_UPLOAD', () => {
    it('MAX_SIZE_BYTES equals MAX_SIZE_MB * 1024 * 1024', () => {
      expect(IMAGE_UPLOAD.MAX_SIZE_BYTES).toBe(IMAGE_UPLOAD.MAX_SIZE_MB * 1024 * 1024)
    })
  })

  describe('EDITOR', () => {
    it('HEADING_LEVELS contains valid levels', () => {
      expect(EDITOR.HEADING_LEVELS.length).toBeGreaterThan(0)
      for (const level of EDITOR.HEADING_LEVELS) {
        expect(level).toBeGreaterThanOrEqual(1)
        expect(level).toBeLessThanOrEqual(6)
      }
    })
  })

  describe('LANGUAGES', () => {
    it('has pt-BR as original', () => {
      expect(LANGUAGES.ORIGINAL).toBe('pt-BR')
    })

    it('has labels for all available languages', () => {
      for (const lang of LANGUAGES.AVAILABLE) {
        expect(LANGUAGES.LABELS[lang]).toBeDefined()
      }
    })

    it('translatable excludes original', () => {
      expect(LANGUAGES.TRANSLATABLE).not.toContain('pt-BR')
    })
  })

  describe('TRANSLATION_STATUS', () => {
    it('has all expected statuses', () => {
      expect(TRANSLATION_STATUS.AUTO).toBe('automatica')
      expect(TRANSLATION_STATUS.REVIEWED).toBe('revisada')
      expect(TRANSLATION_STATUS.OUTDATED).toBe('desatualizada')
    })
  })
})
