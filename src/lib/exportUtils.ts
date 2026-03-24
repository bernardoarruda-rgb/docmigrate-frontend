import { generateHTML } from '@tiptap/html'
import TurndownService from 'turndown'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { getEditorExtensions } from '@/components/editor/editorExtensions'
import type { JSONContent } from '@tiptap/react'

export type ExportFormat = 'markdown' | 'docx' | 'pdf'

interface ExportPageData {
  title: string
  content: string | null
}

/** Convert Tiptap JSON string to HTML */
function contentToHtml(content: string | null): string {
  if (!content) return ''
  try {
    const json = JSON.parse(content) as JSONContent
    const extensions = getEditorExtensions()
    return generateHTML(json, extensions)
  } catch {
    return ''
  }
}

/** Convert HTML to Markdown via Turndown */
function htmlToMarkdown(html: string): string {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  })
  return turndown.turndown(html)
}

/** Wrap HTML in a full document with basic styling for rendering */
function wrapHtmlDocument(title: string, html: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #1a1a1a; line-height: 1.6; }
  h1 { font-size: 2em; margin-bottom: 0.5em; }
  h2 { font-size: 1.5em; margin-top: 1.5em; }
  h3 { font-size: 1.25em; margin-top: 1.2em; }
  pre { background: #f4f4f5; padding: 16px; border-radius: 6px; overflow-x: auto; }
  code { background: #f4f4f5; padding: 2px 4px; border-radius: 3px; font-size: 0.9em; }
  blockquote { border-left: 3px solid #d4d4d8; margin-left: 0; padding-left: 16px; color: #52525b; }
  img { max-width: 100%; height: auto; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #d4d4d8; padding: 8px 12px; text-align: left; }
  th { background: #f4f4f5; font-weight: 600; }
  a { color: #2563eb; }
</style>
</head>
<body>
<h1>${title}</h1>
${html}
</body>
</html>`
}

/** Export page as Markdown (.md) */
export function exportAsMarkdown(page: ExportPageData): void {
  const html = contentToHtml(page.content)
  const markdown = `# ${page.title}\n\n${htmlToMarkdown(html)}`
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  saveAs(blob, `${sanitizeFilename(page.title)}.md`)
}

/** Export page as DOCX using HTML-in-Word trick */
export function exportAsDocx(page: ExportPageData): void {
  const html = contentToHtml(page.content)

  const docContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>${page.title}</title>
    <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
    <style>
      body { font-family: 'Calibri', sans-serif; font-size: 11pt; line-height: 1.5; }
      h1 { font-size: 20pt; }
      h2 { font-size: 16pt; }
      h3 { font-size: 13pt; }
      pre, code { font-family: 'Consolas', monospace; font-size: 10pt; background: #f4f4f5; }
      blockquote { border-left: 3px solid #d4d4d8; padding-left: 12px; color: #52525b; }
      table { border-collapse: collapse; }
      th, td { border: 1px solid #d4d4d8; padding: 6px 10px; }
      th { background: #f4f4f5; }
    </style>
    </head>
    <body>
    <h1>${page.title}</h1>
    ${html}
    </body>
    </html>`

  const blob = new Blob(['\ufeff' + docContent], {
    type: 'application/msword',
  })
  saveAs(blob, `${sanitizeFilename(page.title)}.doc`)
}

/** Export page as PDF via html2canvas + jsPDF */
export async function exportAsPdf(page: ExportPageData): Promise<void> {
  const html = contentToHtml(page.content)
  const fullHtml = wrapHtmlDocument(page.title, html)

  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.top = '0'
  container.style.width = '800px'
  container.style.background = 'white'
  container.innerHTML = fullHtml
  document.body.appendChild(container)

  try {
    const body = container.querySelector('body') ?? container
    const canvas = await html2canvas(body as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position -= pageHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${sanitizeFilename(page.title)}.pdf`)
  } finally {
    document.body.removeChild(container)
  }
}

/** Export a single page in the given format */
export async function exportPage(
  page: ExportPageData,
  format: ExportFormat,
): Promise<void> {
  switch (format) {
    case 'markdown':
      exportAsMarkdown(page)
      break
    case 'docx':
      exportAsDocx(page)
      break
    case 'pdf':
      await exportAsPdf(page)
      break
  }
}

/** Export all pages of a space as a ZIP */
export async function exportSpaceAsZip(
  spaceName: string,
  pages: ExportPageData[],
  format: ExportFormat,
): Promise<void> {
  const zip = new JSZip()
  const folder = zip.folder(sanitizeFilename(spaceName))
  if (!folder) return

  for (const page of pages) {
    const filename = sanitizeFilename(page.title)
    const html = contentToHtml(page.content)

    switch (format) {
      case 'markdown': {
        const md = `# ${page.title}\n\n${htmlToMarkdown(html)}`
        folder.file(`${filename}.md`, md)
        break
      }
      case 'docx': {
        const docContent = `
          <html xmlns:o="urn:schemas-microsoft-com:office:office"
                xmlns:w="urn:schemas-microsoft-com:office:word"
                xmlns="http://www.w3.org/TR/REC-html40">
          <head><meta charset="utf-8">
          <style>body{font-family:'Calibri',sans-serif;font-size:11pt;line-height:1.5}h1{font-size:20pt}h2{font-size:16pt}h3{font-size:13pt}pre,code{font-family:'Consolas',monospace;font-size:10pt}blockquote{border-left:3px solid #d4d4d8;padding-left:12px;color:#52525b}table{border-collapse:collapse}th,td{border:1px solid #d4d4d8;padding:6px 10px}th{background:#f4f4f5}</style>
          </head>
          <body><h1>${page.title}</h1>${html}</body></html>`
        folder.file(`${filename}.doc`, '\ufeff' + docContent)
        break
      }
      case 'pdf': {
        const fullHtml = wrapHtmlDocument(page.title, html)
        folder.file(`${filename}.html`, fullHtml)
        break
      }
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, `${sanitizeFilename(spaceName)}.zip`)
}

/** Sanitize a string for use as filename */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 100)
}
