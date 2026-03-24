import { Extension } from '@tiptap/core'
import { Plugin, PluginKey, NodeSelection } from '@tiptap/pm/state'

const DRAG_HANDLE_KEY = new PluginKey('dragHandle')

const NON_DRAGGABLE_TYPES = new Set(['accordionItem', 'column', 'listItem'])

const GRIP_ICON = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"',
  ' fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">',
  '<circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>',
  '<circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>',
  '</svg>',
].join('')

export const DragHandleExtension = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    const editorInstance = this.editor

    return [
      new Plugin({
        key: DRAG_HANDLE_KEY,

        view(view) {
          const maybeWrapper = view.dom.parentElement
          if (!maybeWrapper) {
            return { update() {}, destroy() {} }
          }
          const wrapper: HTMLElement = maybeWrapper

          wrapper.style.position = 'relative'

          const handle = document.createElement('div')
          handle.className = 'drag-handle'
          handle.draggable = true
          handle.contentEditable = 'false'
          handle.tabIndex = -1
          handle.innerHTML = GRIP_ICON
          wrapper.appendChild(handle)

          let blockPos: number | null = null
          let isDragging = false

          function positionHandle(blockDOM: HTMLElement) {
            const wrapperRect = wrapper.getBoundingClientRect()
            const blockRect = blockDOM.getBoundingClientRect()
            handle.style.display = 'flex'
            handle.style.top = `${blockRect.top - wrapperRect.top + wrapper.scrollTop + 4}px`
          }

          function hideHandle() {
            handle.style.display = 'none'
            blockPos = null
          }

          function resolveBlock(event: MouseEvent) {
            try {
              const posInfo = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              })
              if (!posInfo) return null

              const $pos = view.state.doc.resolve(posInfo.pos)
              if ($pos.depth < 1) return null

              const pos = $pos.before(1)
              const node = view.state.doc.nodeAt(pos)
              if (!node) return null
              if (NON_DRAGGABLE_TYPES.has(node.type.name)) return null

              const dom = view.nodeDOM(pos)
              if (!(dom instanceof HTMLElement)) return null

              return { pos, dom }
            } catch {
              return null
            }
          }

          function onMouseMove(event: MouseEvent) {
            if (isDragging || !editorInstance.isEditable) return
            if (event.target === handle || handle.contains(event.target as Node)) return

            const block = resolveBlock(event)
            if (!block) {
              hideHandle()
              return
            }

            blockPos = block.pos
            positionHandle(block.dom)
          }

          function onMouseLeave(event: MouseEvent) {
            if (isDragging) return
            const related = event.relatedTarget
            if (related === handle || (related instanceof Node && handle.contains(related))) return
            hideHandle()
          }

          handle.addEventListener('mouseleave', (event) => {
            if (isDragging) return
            const related = event.relatedTarget
            if (related instanceof Node && view.dom.contains(related)) return
            hideHandle()
          })

          handle.addEventListener('mousedown', (e) => {
            e.preventDefault()
            if (blockPos === null) return

            try {
              const tr = view.state.tr.setSelection(
                NodeSelection.create(view.state.doc, blockPos)
              )
              view.dispatch(tr)
            } catch {
              // Node can't be NodeSelected
            }
          })

          handle.addEventListener('dragstart', (e) => {
            if (blockPos === null || !e.dataTransfer) return
            isDragging = true

            const node = view.state.doc.nodeAt(blockPos)
            if (!node) return

            try {
              const { selection } = view.state
              if (!(selection instanceof NodeSelection) || selection.from !== blockPos) {
                const tr = view.state.tr.setSelection(
                  NodeSelection.create(view.state.doc, blockPos)
                )
                view.dispatch(tr)
              }
            } catch {
              // Continue anyway
            }

            const slice = view.state.doc.slice(blockPos, blockPos + node.nodeSize)
            view.dragging = { slice, move: true }

            e.dataTransfer.setData('text/plain', node.textContent || ' ')
            e.dataTransfer.effectAllowed = 'move'

            const blockDOM = view.nodeDOM(blockPos)
            if (blockDOM instanceof HTMLElement) {
              e.dataTransfer.setDragImage(blockDOM, 0, 0)
            }

            handle.style.display = 'none'
          })

          handle.addEventListener('dragend', () => {
            isDragging = false
          })

          view.dom.addEventListener('mousemove', onMouseMove)
          view.dom.addEventListener('mouseleave', onMouseLeave)

          return {
            update() {
              if (blockPos !== null && !isDragging) {
                try {
                  const node = view.state.doc.nodeAt(blockPos)
                  if (!node) hideHandle()
                } catch {
                  hideHandle()
                }
              }
            },
            destroy() {
              handle.remove()
              view.dom.removeEventListener('mousemove', onMouseMove)
              view.dom.removeEventListener('mouseleave', onMouseLeave)
            },
          }
        },
      }),
    ]
  },
})
