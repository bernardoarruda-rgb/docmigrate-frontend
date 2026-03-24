import { describe, it, expect } from 'vitest'
import { buildPageTree } from '@/lib/buildPageTree'
import type { PageListItem } from '@/types/page'

function makePage(overrides: Partial<PageListItem> & { id: number }): PageListItem {
  return {
    title: `Page ${overrides.id}`,
    description: null,
    icon: null,
    iconColor: null,
    backgroundColor: null,
    sortOrder: 0,
    language: 'pt-BR',
    spaceId: 1,
    parentPageId: null,
    level: 1,
    hasChildren: false,
    createdAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('buildPageTree', () => {
  it('returns empty array when given empty input', () => {
    const result = buildPageTree([])
    expect(result).toEqual([])
  })

  it('returns flat pages as roots sorted by sortOrder', () => {
    const pages: PageListItem[] = [
      makePage({ id: 1, sortOrder: 3 }),
      makePage({ id: 2, sortOrder: 1 }),
      makePage({ id: 3, sortOrder: 2 }),
    ]

    const result = buildPageTree(pages)

    expect(result).toHaveLength(3)
    expect(result[0].id).toBe(2)
    expect(result[1].id).toBe(3)
    expect(result[2].id).toBe(1)
    expect(result[0].children).toEqual([])
    expect(result[1].children).toEqual([])
    expect(result[2].children).toEqual([])
  })

  it('builds a nested hierarchy correctly', () => {
    const pages: PageListItem[] = [
      makePage({ id: 1, parentPageId: null }),
      makePage({ id: 2, parentPageId: 1 }),
      makePage({ id: 3, parentPageId: 2 }),
    ]

    const result = buildPageTree(pages)

    expect(result).toHaveLength(1)

    const root = result[0]
    expect(root.id).toBe(1)
    expect(root.children).toHaveLength(1)

    const child = root.children[0]
    expect(child.id).toBe(2)
    expect(child.children).toHaveLength(1)

    const grandchild = child.children[0]
    expect(grandchild.id).toBe(3)
    expect(grandchild.children).toHaveLength(0)
  })

  it('sorts children by sortOrder within a parent', () => {
    const pages: PageListItem[] = [
      makePage({ id: 1, parentPageId: null, sortOrder: 0 }),
      makePage({ id: 2, parentPageId: 1, sortOrder: 3 }),
      makePage({ id: 3, parentPageId: 1, sortOrder: 1 }),
      makePage({ id: 4, parentPageId: 1, sortOrder: 2 }),
    ]

    const result = buildPageTree(pages)

    expect(result).toHaveLength(1)
    const children = result[0].children
    expect(children).toHaveLength(3)
    expect(children[0].id).toBe(3)
    expect(children[0].sortOrder).toBe(1)
    expect(children[1].id).toBe(4)
    expect(children[1].sortOrder).toBe(2)
    expect(children[2].id).toBe(2)
    expect(children[2].sortOrder).toBe(3)
  })

  it('treats orphan pages (parentPageId points to non-existent page) as roots', () => {
    const pages: PageListItem[] = [
      makePage({ id: 1, parentPageId: null }),
      makePage({ id: 2, parentPageId: 999 }),
    ]

    const result = buildPageTree(pages)

    expect(result).toHaveLength(2)
    const ids = result.map((n) => n.id)
    expect(ids).toContain(1)
    expect(ids).toContain(2)
  })
})
