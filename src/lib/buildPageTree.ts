import type { PageListItem } from '@/types/page'

export interface PageTreeNode extends PageListItem {
  children: PageTreeNode[]
}

export function buildPageTree(pages: PageListItem[]): PageTreeNode[] {
  const map = new Map<number, PageTreeNode>()
  const roots: PageTreeNode[] = []

  // Create nodes
  for (const page of pages) {
    map.set(page.id, { ...page, children: [] })
  }

  // Build tree
  for (const page of pages) {
    const node = map.get(page.id)!
    if (page.parentPageId && map.has(page.parentPageId)) {
      map.get(page.parentPageId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  // Sort children by sortOrder
  const sortChildren = (nodes: PageTreeNode[]) => {
    nodes.sort((a, b) => a.sortOrder - b.sortOrder)
    for (const node of nodes) {
      sortChildren(node.children)
    }
  }

  sortChildren(roots)
  return roots
}
