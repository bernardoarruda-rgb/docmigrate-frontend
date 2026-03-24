import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const headingIdPluginKey = new PluginKey('headingId')

export const HeadingIdExtension = Extension.create({
  name: 'headingId',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: headingIdPluginKey,
        props: {
          decorations(state) {
            const decorations: Decoration[] = []
            const slugCounts = new Map<string, number>()

            state.doc.descendants((node, pos) => {
              if (node.type.name === 'heading') {
                const text = node.textContent
                if (text) {
                  const baseSlug = slugify(text)
                  const count = slugCounts.get(baseSlug) ?? 0
                  const id = count === 0 ? baseSlug : `${baseSlug}-${count}`
                  slugCounts.set(baseSlug, count + 1)
                  decorations.push(
                    Decoration.node(pos, pos + node.nodeSize, { id }),
                  )
                }
              }
            })
            return DecorationSet.create(state.doc, decorations)
          },
        },
      }),
    ]
  },
})
