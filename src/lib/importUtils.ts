import mammoth from 'mammoth'
import { marked } from 'marked'
import { generateJSON } from '@tiptap/html'
import { getEditorExtensions } from '@/components/editor/editorExtensions'
import { fileService } from '@/services/fileService'
import { IMPORT } from '@/config/importConfig'
import type { JSONContent } from '@tiptap/react'

export interface ImportResult {
  title: string
  content: JSONContent
  warnings: string[]
}

/** Detect file type from extension */
function getFileType(file: File): 'markdown' | 'docx' | null {
  const name = file.name.toLowerCase()
  if (name.endsWith('.md') || name.endsWith('.markdown')) return 'markdown'
  if (name.endsWith('.docx')) return 'docx'
  return null
}

/** Extract a title from filename (without extension) */
function titleFromFilename(filename: string): string {
  return filename
    .replace(/\.(md|markdown|docx)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase())
}

/** Pre-process markdown text: clean up Google Docs export artifacts */
function preprocessMarkdown(text: string): string {
  const lines = text.split('\n')
  const cleaned: string[] = []
  let inToc = false

  for (const line of lines) {
    // Detect ToC block: lines with internal anchor links, e.g.:
    // "1. [Title](#heading) 3", "[Title](#heading)", "  [Sub](#sub) 5"
    const tocLine = /^\s*(\d+\.?\s*)?\[.+\]\(#.+\)\s*\d*\s*$/.test(line)
    if (tocLine) {
      inToc = true
      continue
    }
    if (inToc && line.trim() === '') {
      // Skip blank lines within ToC block
      continue
    }
    if (inToc) {
      // Non-ToC, non-blank line — end ToC block
      inToc = false
    }

    // Remove Google Docs anchor IDs: "## Title {#anchor-id}" → "## Title"
    const anchorCleaned = line.replace(/\s*\{#[^}]+\}\s*$/, '')

    cleaned.push(anchorCleaned)
  }

  return cleaned.join('\n')
}

/** Convert Markdown file to HTML */
async function markdownToHtml(
  file: File,
): Promise<{ html: string; warnings: string[] }> {
  const text = await file.text()
  const cleanedText = preprocessMarkdown(text)
  const html = await marked.parse(cleanedText)
  return { html, warnings: [] }
}

/**
 * Mammoth style map: maps Google Docs / Word heading styles to correct HTML levels.
 * Google Docs exports headings as "Heading 1", "Heading 2", etc.
 * Without explicit mapping, mammoth may misinterpret custom styles.
 */
const MAMMOTH_STYLE_MAP = [
  // Headings
  "p[style-name='Title'] => h1:fresh",
  "p[style-name='Heading 1'] => h1:fresh",
  "p[style-name='Heading 2'] => h2:fresh",
  "p[style-name='Heading 3'] => h3:fresh",
  "p[style-name='Heading 4'] => h4:fresh",
  "p[style-name='Heading 5'] => h5:fresh",
  "p[style-name='Heading 6'] => h6:fresh",
  "p[style-name='heading 1'] => h1:fresh",
  "p[style-name='heading 2'] => h2:fresh",
  "p[style-name='heading 3'] => h3:fresh",
  "p[style-name='heading 4'] => h4:fresh",
  "p[style-name='Subtitle'] => h2:fresh",
  // Code blocks (Google Docs exports code as these styles)
  "p[style-name='Code'] => pre:fresh > code:fresh",
  "p[style-name='code'] => pre:fresh > code:fresh",
  "p[style-name='Code Block'] => pre:fresh > code:fresh",
  "p[style-name='HTML Code'] => pre:fresh > code:fresh",
  "p[style-name='Normal (Web)'] => pre:fresh > code:fresh",
  "r[style-name='Code'] => code",
  "r[style-name='code'] => code",
  "r[style-name='Inline Code'] => code",
].join('\n')

/** Convert .docx file to HTML with image upload */
async function docxToHtml(
  file: File,
  onProgress?: (message: string) => void,
): Promise<{ html: string; warnings: string[] }> {
  const arrayBuffer = await file.arrayBuffer()
  const warnings: string[] = []
  let imageCount = 0

  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      styleMap: MAMMOTH_STYLE_MAP,
      convertImage: mammoth.images.imgElement(async (image) => {
        imageCount++
        onProgress?.(`Processando imagem ${imageCount}...`)

        try {
          const imageBuffer = await image.readAsArrayBuffer()
          const contentType = image.contentType || 'image/png'
          const extension = contentType.split('/')[1] || 'png'
          const blob = new Blob([imageBuffer], { type: contentType })

          if (blob.size > IMPORT.MAX_IMAGE_SIZE) {
            const sizeMb = (blob.size / 1024 / 1024).toFixed(1)
            warnings.push(
              `Imagem ${imageCount} ignorada (${sizeMb}MB > ${IMPORT.MAX_IMAGE_SIZE / 1024 / 1024}MB)`,
            )
            return { src: '' }
          }

          const imageFile = new File(
            [blob],
            `import-image-${imageCount}.${extension}`,
            { type: contentType },
          )
          const response = await fileService.uploadImage(imageFile)

          if (!response.url) {
            warnings.push(`Imagem ${imageCount}: URL vazia retornada pelo servidor`)
            return { src: '' }
          }

          return { src: response.url }
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'erro desconhecido'
          warnings.push(`Falha ao processar imagem ${imageCount}: ${msg}`)
          return { src: '' }
        }
      }),
    },
  )

  for (const msg of result.messages) {
    if (msg.type === 'warning') {
      warnings.push(msg.message)
    }
  }

  return { html: result.value, warnings }
}

/** Detect if an element looks like a Google Docs ToC entry */
function isTocEntry(el: Element): boolean {
  // Format 1: <p> with internal anchor links (from .docx or .md)
  if (el.tagName === 'P') {
    const links = el.querySelectorAll('a[href^="#"]')
    if (links.length > 0) {
      const text = el.textContent?.trim() ?? ''
      // Match: "1. Title 3", "1.1 Sub 5", "Title 12", numbered entries with page
      if (/\d+\s*$/.test(text) || /^\d+(\.\d+)*\s+/.test(text)) return true
      // Match: just a link to an internal anchor (ToC without page numbers)
      if (links.length === 1 && text.length < 120) return true
    }
    return false
  }
  // Format 2: heading that says "Sumário" / "Table of Contents" / "Índice"
  if (/^H[1-6]$/.test(el.tagName)) {
    const text = el.textContent?.trim().toLowerCase() ?? ''
    if (/^(sumário|sumario|table of contents|índice|indice|contents)/.test(text)) {
      return true
    }
  }
  return false
}

/** Ensure table has proper structure with <thead>/<tbody> and <th> for header row */
function normalizeTable(table: HTMLTableElement): void {
  const rows = Array.from(table.querySelectorAll('tr'))
  if (rows.length === 0) return

  // If first row has no <th>, promote first row cells to <th>
  const firstRow = rows[0]
  const firstCells = Array.from(firstRow.querySelectorAll('td'))
  if (firstCells.length > 0 && firstRow.querySelectorAll('th').length === 0) {
    for (const td of firstCells) {
      const th = table.ownerDocument.createElement('th')
      th.innerHTML = td.innerHTML
      td.replaceWith(th)
    }
  }
}

/** Max chars for a heading — longer text is likely a paragraph, not a heading */
const MAX_HEADING_TEXT_LENGTH = 100

/** Normalize heading levels and fix mis-tagged headings */
function normalizeHeadings(doc: Document): void {
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  if (headings.length <= 1) return

  // Count headings by level
  const levels = headings.map((h) => parseInt(h.tagName[1]))
  const minLevel = Math.min(...levels)
  const h1Count = levels.filter((l) => l === 1).length

  // If most headings are H1, shift all down except the first
  if (h1Count > 2 && minLevel === 1) {
    let isFirst = true
    for (const heading of headings) {
      const level = parseInt(heading.tagName[1])
      if (level === 1 && isFirst) {
        isFirst = false
        continue
      }
      if (level === 1) {
        const newTag = doc.createElement('h2')
        newTag.innerHTML = heading.innerHTML
        heading.replaceWith(newTag)
      }
    }
  }

  // Demote headings that are too long (likely paragraphs mistagged as headings)
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const text = heading.textContent?.trim() ?? ''
    if (text.length > MAX_HEADING_TEXT_LENGTH) {
      const p = doc.createElement('p')
      p.innerHTML = heading.innerHTML
      heading.replaceWith(p)
    }
  })
}

/** Sanitize HTML before Tiptap conversion */
function sanitizeHtml(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const body = doc.body

  // Remove target="_blank" from anchor links (href="#...")
  doc.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.removeAttribute('target')
  })

  // Fix Google Docs broken internal links: Google converts internal doc references
  // to Google Search URLs like "https://www.google.com/search?q=%23section-name"
  // Convert them back to anchor links (#section-name)
  doc.querySelectorAll('a[href*="google.com/search"]').forEach((a) => {
    const href = a.getAttribute('href') ?? ''
    const match = href.match(/[?&]q=%23([^&]+)/)
    if (match) {
      const anchor = decodeURIComponent(match[1])
      a.setAttribute('href', `#${anchor}`)
      a.removeAttribute('target')
    }
  })

  // Remove Google Docs table of contents — format 1: <ul> with internal links
  const firstChild = body.firstElementChild
  if (firstChild && firstChild.tagName === 'UL') {
    const links = firstChild.querySelectorAll('a[href^="#"]')
    if (links.length > 3) {
      firstChild.remove()
    }
  }

  // Remove Google Docs table of contents — format 2: heading + consecutive paragraphs with anchors
  // Scan all children for a ToC block (heading "Sumário" followed by anchor paragraphs)
  const children = Array.from(body.children)
  const tocCandidates: Element[] = []
  let foundTocHeading = false

  for (const child of children) {
    if (isTocEntry(child)) {
      if (/^H[1-6]$/.test(child.tagName)) foundTocHeading = true
      tocCandidates.push(child)
    } else if (tocCandidates.length > 0) {
      // Allow one blank paragraph inside ToC block
      if (child.tagName === 'P' && !child.textContent?.trim()) {
        tocCandidates.push(child)
        continue
      }
      break
    }
  }
  // Remove if we found a ToC heading + entries, OR 3+ consecutive ToC entries
  if ((foundTocHeading && tocCandidates.length >= 2) || tocCandidates.length >= 3) {
    for (const el of tocCandidates) {
      el.remove()
    }
  }

  // Normalize tables: ensure header row uses <th> for proper Tiptap Table parsing
  doc.querySelectorAll('table').forEach((table) => {
    normalizeTable(table)
  })

  // Detect code blocks: consecutive paragraphs with monospace font (Google Docs pattern)
  const monoFonts = ['courier', 'consolas', 'monospace', 'source code', 'fira code', 'jetbrains']
  const codeBlockGroups: Element[][] = []
  let currentGroup: Element[] = []

  for (const child of Array.from(body.children)) {
    if (child.tagName === 'P') {
      const style = child.getAttribute('style') ?? ''
      const spans = child.querySelectorAll('span[style]')
      const hasMono = monoFonts.some((f) => style.toLowerCase().includes(f)) ||
        (spans.length > 0 && Array.from(spans).every((s) =>
          monoFonts.some((f) => (s.getAttribute('style') ?? '').toLowerCase().includes(f))
        ))

      if (hasMono) {
        currentGroup.push(child)
        continue
      }
    }
    if (currentGroup.length >= 2) {
      codeBlockGroups.push([...currentGroup])
    }
    currentGroup = []
  }
  if (currentGroup.length >= 2) {
    codeBlockGroups.push([...currentGroup])
  }

  // Replace monospace paragraph groups with <pre><code>
  for (const group of codeBlockGroups) {
    const lines = group.map((el) => el.textContent ?? '')
    const pre = doc.createElement('pre')
    const code = doc.createElement('code')
    code.textContent = lines.join('\n')
    pre.appendChild(code)
    group[0].replaceWith(pre)
    for (let i = 1; i < group.length; i++) {
      group[i].remove()
    }
  }

  // Normalize heading levels (fix all-H1 issue from Google Docs)
  normalizeHeadings(doc)

  // Remove empty headings (leftover from ToC removal or conversion artifacts)
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    if (!heading.textContent?.trim()) {
      heading.remove()
    }
  })

  // Remove anchor ID artifacts from headings: "Title {#anchor-id}" → "Title"
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT)
    let textNode: Text | null
    while ((textNode = walker.nextNode() as Text | null)) {
      if (textNode.textContent && /\{#[^}]+\}/.test(textNode.textContent)) {
        textNode.textContent = textNode.textContent.replace(/\s*\{#[^}]+\}/g, '')
      }
    }
  })

  // Remove Unicode Private Use Area characters (Google Docs icon artifacts like )
  const textWalker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT)
  let textNode: Text | null
  while ((textNode = textWalker.nextNode() as Text | null)) {
    if (textNode.textContent) {
      // Remove PUA chars: U+E000–U+F8FF (BMP PUA), also common Google Docs artifacts
      textNode.textContent = textNode.textContent.replace(/[\uE000-\uF8FF]/g, '')
    }
  }

  // Remove images with empty src (failed uploads)
  doc.querySelectorAll('img').forEach((img) => {
    if (!img.src || img.src === 'about:blank' || img.src.endsWith('/')) {
      const parent = img.parentElement
      img.remove()
      // Remove empty paragraph left behind
      if (parent && parent.tagName === 'P' && !parent.textContent?.trim() && !parent.querySelector('img')) {
        parent.remove()
      }
    }
  })

  return body.innerHTML
}

/** Remove null attrs bloat from Tiptap JSON (Google Docs imports) */
function cleanTiptapAttrs(node: JSONContent): JSONContent {
  if (node.attrs) {
    const cleaned: Record<string, unknown> = {}
    let hasNonNull = false
    for (const [key, value] of Object.entries(node.attrs)) {
      if (value !== null && value !== undefined) {
        cleaned[key] = value
        hasNonNull = true
      }
    }
    node.attrs = hasNonNull ? cleaned : undefined
  }

  // Fix links: anchor hrefs should not have target="_blank"
  if (node.marks) {
    for (const mark of node.marks) {
      if (mark.type === 'link' && mark.attrs?.href?.startsWith('#')) {
        delete mark.attrs.target
      }
    }
  }

  if (node.content) {
    node.content = node.content.map(cleanTiptapAttrs)
  }

  return node
}

/** Heuristic: detect if a paragraph node looks like a code block */
const CODE_PATTERNS = [
  /^(import|export|const|let|var|function|class|interface|type|enum)\s/,
  /^(if|else|for|while|switch|return|throw|try|catch|await|async)\s*[\({]/,
  /[{};]\s*$/,
  /^\s*(\/\/|\/\*|\*\/|\*\s)/,
  /=>\s*[{(]/,
  /\.\w+\(/,
  /^\s*[}\])]+[;,]?\s*$/,
]

function looksLikeCode(texts: string[]): boolean {
  if (texts.length < 3) return false
  let codeLines = 0
  for (const text of texts) {
    const trimmed = text.trim()
    if (!trimmed) continue
    if (CODE_PATTERNS.some((p) => p.test(trimmed))) codeLines++
  }
  return codeLines / texts.length > 0.3
}

/** Convert code-like paragraph nodes (with hardBreaks) to codeBlock nodes */
function convertCodeParagraphs(doc: JSONContent): JSONContent {
  if (!doc.content) return doc

  const newContent: JSONContent[] = []
  for (const node of doc.content) {
    if (node.type === 'paragraph' && node.content) {
      // Count hardBreaks — code blocks from Google Docs have many
      const hardBreaks = node.content.filter((c) => c.type === 'hardBreak').length
      if (hardBreaks >= 3) {
        // Extract text lines (split by hardBreak)
        const lines: string[] = []
        let currentLine = ''
        for (const child of node.content) {
          if (child.type === 'hardBreak') {
            lines.push(currentLine)
            currentLine = ''
          } else if (child.type === 'text') {
            currentLine += child.text ?? ''
          }
        }
        if (currentLine) lines.push(currentLine)

        if (looksLikeCode(lines)) {
          newContent.push({
            type: 'codeBlock',
            content: [{ type: 'text', text: lines.join('\n') }],
          })
          continue
        }
      }
    }
    newContent.push(node)
  }

  return { ...doc, content: newContent }
}

/** Convert HTML string to Tiptap JSONContent */
function htmlToTiptapJson(html: string): JSONContent {
  const cleanHtml = sanitizeHtml(html.trim())
  if (!cleanHtml) {
    return { type: 'doc', content: [{ type: 'paragraph' }] }
  }

  const extensions = getEditorExtensions()
  let json = generateJSON(cleanHtml, extensions) as JSONContent
  json = cleanTiptapAttrs(json)
  json = convertCodeParagraphs(json)
  return json
}

/** Main import function: converts .md or .docx to Tiptap JSONContent */
export async function importFile(
  file: File,
  onProgress?: (message: string) => void,
): Promise<ImportResult> {
  const fileType = getFileType(file)
  if (!fileType) {
    throw new Error('Formato de arquivo nao suportado. Use .md ou .docx.')
  }

  if (file.size > IMPORT.MAX_FILE_SIZE) {
    throw new Error('Arquivo muito grande. O tamanho maximo e 10MB.')
  }

  onProgress?.('Lendo arquivo...')

  let html: string
  let warnings: string[]

  if (fileType === 'markdown') {
    const result = await markdownToHtml(file)
    html = result.html
    warnings = result.warnings
  } else {
    onProgress?.('Convertendo documento...')
    const result = await docxToHtml(file, onProgress)
    html = result.html
    warnings = result.warnings
  }

  onProgress?.('Convertendo para formato do editor...')
  const content = htmlToTiptapJson(html)
  const title = titleFromFilename(file.name)

  return { title, content, warnings }
}
