import { describe, it, expect } from 'vitest'
import { templateKeys } from './templateService'

describe('templateKeys', () => {
  it('all returns ["templates"]', () => {
    expect(templateKeys.all).toEqual(['templates'])
  })

  it('lists() returns ["templates", "list"]', () => {
    expect(templateKeys.lists()).toEqual(['templates', 'list'])
  })

  it('detail(id) returns ["templates", "detail", id]', () => {
    expect(templateKeys.detail(3)).toEqual(['templates', 'detail', 3])
    expect(templateKeys.detail(99)).toEqual(['templates', 'detail', 99])
  })

  it('lists key extends all key', () => {
    const listsKey = templateKeys.lists()
    expect(listsKey[0]).toBe(templateKeys.all[0])
  })

  it('detail key extends all key', () => {
    const detailKey = templateKeys.detail(1)
    expect(detailKey[0]).toBe(templateKeys.all[0])
  })
})
