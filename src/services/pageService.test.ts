import { describe, it, expect } from 'vitest'
import { pageKeys } from './pageService'

describe('pageKeys', () => {
  it('all returns ["pages"]', () => {
    expect(pageKeys.all).toEqual(['pages'])
  })

  it('lists(spaceId) returns ["pages", "list", spaceId]', () => {
    expect(pageKeys.lists(1)).toEqual(['pages', 'list', 1])
    expect(pageKeys.lists(42)).toEqual(['pages', 'list', 42])
  })

  it('detail(id) returns ["pages", "detail", id]', () => {
    expect(pageKeys.detail(5)).toEqual(['pages', 'detail', 5])
    expect(pageKeys.detail(100)).toEqual(['pages', 'detail', 100])
  })

  it('lists key extends all key', () => {
    const listsKey = pageKeys.lists(1)
    expect(listsKey[0]).toBe(pageKeys.all[0])
  })

  it('detail key extends all key', () => {
    const detailKey = pageKeys.detail(1)
    expect(detailKey[0]).toBe(pageKeys.all[0])
  })
})
