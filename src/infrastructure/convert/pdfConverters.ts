import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

import { baseName, type OutputFile } from './download'
import { buildDocx } from './docxWriter'
import { parsePageRange } from './pageRange'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export type PdfTarget = 'docx' | 'png' | 'txt'

export interface PdfOptions {
  keepLayout: boolean
  pages: string
}

export interface ConvertResult {
  files: OutputFile[]
  /** Text shown in the preview for docx/txt outputs. One entry per source page. */
  textPages?: string[]
}

export class ScannedPdfError extends Error {
  constructor() {
    super("Can't read this file. It looks like a scan, and scanned PDFs aren't supported yet.")
  }
}

type PdfDocument = Awaited<ReturnType<typeof pdfjsLib.getDocument>['promise']>

async function openPdf(file: File): Promise<PdfDocument> {
  const data = await file.arrayBuffer()
  try {
    return await pdfjsLib.getDocument({ data, standardFontDataUrl: '/standard_fonts/' }).promise
  } catch {
    throw new Error("Can't open this file. It may be damaged or password protected.")
  }
}

export async function getPdfPageCount(file: File): Promise<number> {
  const doc = await openPdf(file)
  const count = doc.numPages
  await doc.cleanup()
  return count
}

/** Returns the text of one page as lines, grouped by vertical position. */
async function pageLines(doc: PdfDocument, pageNumber: number): Promise<string[]> {
  const page = await doc.getPage(pageNumber)
  const content = await page.getTextContent()
  const lines: string[] = []
  let current = ''
  let lastY: number | null = null

  for (const item of content.items) {
    if (!('str' in item)) continue
    const y = item.transform[5]
    if (lastY !== null && Math.abs(y - lastY) > 2 && current) {
      lines.push(current.trim())
      current = ''
    }
    current += item.str
    if (item.hasEOL) {
      lines.push(current.trim())
      current = ''
    }
    lastY = y
  }
  if (current.trim()) lines.push(current.trim())
  return lines.map((line) => line.replace(/\s+/g, ' ')).filter((line, i, all) => line || all[i - 1])
}

function reflow(lines: string[]): string[] {
  const paragraphs: string[] = []
  let current: string[] = []
  for (const line of lines) {
    if (line) {
      current.push(line)
    } else if (current.length) {
      paragraphs.push(current.join(' '))
      current = []
    }
  }
  if (current.length) paragraphs.push(current.join(' '))
  return paragraphs
}

function throwIfCancelled(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Cancelled', 'AbortError')
}

export async function convertPdf(
  file: File,
  target: PdfTarget,
  options: PdfOptions,
  onProgress: (fraction: number) => void,
  signal: AbortSignal,
): Promise<ConvertResult> {
  const doc = await openPdf(file)
  try {
    const pages = parsePageRange(options.pages, doc.numPages)
    const name = baseName(file.name)
    const done = (index: number) => onProgress((index + 1) / pages.length)

    if (target === 'png') {
      const files: OutputFile[] = []
      for (const [index, pageNumber] of pages.entries()) {
        throwIfCancelled(signal)
        const page = await doc.getPage(pageNumber)
        const viewport = page.getViewport({ scale: 2 })
        const canvas = document.createElement('canvas')
        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)
        await page.render({ canvas, viewport }).promise
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
        if (!blob) throw new Error('Could not render a page as an image.')
        files.push({ name: `${name}-${pageNumber}.png`, blob })
        done(index)
      }
      return { files }
    }

    const textPages: string[][] = []
    for (const [index, pageNumber] of pages.entries()) {
      throwIfCancelled(signal)
      textPages.push(await pageLines(doc, pageNumber))
      done(index)
    }
    if (!textPages.some((lines) => lines.some(Boolean))) throw new ScannedPdfError()

    const previews = textPages.map((lines) => lines.join('\n'))
    if (target === 'txt') {
      const text = previews.join('\n\n')
      return {
        files: [{ name: `${name}.txt`, blob: new Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' }) }],
        textPages: previews,
      }
    }

    const paragraphs = options.keepLayout
      ? textPages.flatMap((lines, i) => (i ? ['', ...lines] : lines))
      : reflow(textPages.flatMap((lines) => [...lines, '']))
    return { files: [{ name: `${name}.docx`, blob: await buildDocx(paragraphs) }], textPages: previews }
  } finally {
    await doc.cleanup()
  }
}
