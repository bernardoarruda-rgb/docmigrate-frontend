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
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

/** Convert Markdown file to HTML */
async function markdownToHtml(
  file: File,
): Promise<{ html: string; warnings: string[] }> {
  const text = await file.text()
  const html = await marked.parse(text)
  return { html, warnings: [] }
}

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
              `Imagem ${imageCount} ignorada (${sizeMb}MB > 1MB)`,
            )
            return { src: '' }
          }

          const imageFile = new File(
            [blob],
            `import-image-${imageCount}.${extension}`,
            { type: contentType },
          )
          const response = await fileService.uploadImage(imageFile)
          return { src: response.url }
        } catch {
          warnings.push(`Falha ao processar imagem ${imageCount}`)
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

/** Convert HTML string to Tiptap JSONContent */
function htmlToTiptapJson(html: string): JSONContent {
  const cleanHtml = html.trim()
  if (!cleanHtml) {
    return { type: 'doc', content: [{ type: 'paragraph' }] }
  }

  const extensions = getEditorExtensions()
  return generateJSON(cleanHtml, extensions) as JSONContent
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
