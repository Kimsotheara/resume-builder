import html2pdf from 'html2pdf.js'
import mammoth from 'mammoth'

import { baseName } from './download'
import type { ConvertResult } from './pdfConverters'

export type WordTarget = 'pdf' | 'txt' | 'html'
export type PageSize = 'A4' | 'Letter'

export interface WordOptions {
  pageSize: PageSize
}

export class LegacyDocError extends Error {
  constructor() {
    super('This is an older .doc file. Save it as .docx in Word, then try again.')
  }
}

const PAGE_WIDTH_PX: Record<PageSize, number> = { A4: 794, Letter: 816 }

function assertDocx(file: File) {
  if (/\.doc$/i.test(file.name)) throw new LegacyDocError()
  if (!/\.docx$/i.test(file.name)) throw new Error('Only .docx files can be converted.')
}

export async function convertWord(
  file: File,
  target: WordTarget,
  options: WordOptions,
  onProgress: (fraction: number) => void,
  signal: AbortSignal,
): Promise<ConvertResult & { html?: string }> {
  assertDocx(file)
  const name = baseName(file.name)
  const arrayBuffer = await file.arrayBuffer()
  onProgress(0.2)

  const text = (await mammoth.extractRawText({ arrayBuffer })).value.trim()
  if (target === 'txt') {
    onProgress(1)
    return {
      files: [{ name: `${name}.txt`, blob: new Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' }) }],
      textPages: [text],
    }
  }

  const bodyHtml = (await mammoth.convertToHtml({ arrayBuffer })).value
  if (signal.aborted) throw new DOMException('Cancelled', 'AbortError')
  onProgress(0.5)

  if (target === 'html') {
    const html =
      `<!doctype html>\n<html><head><meta charset="utf-8"><title>${name.replace(/</g, '&lt;')}</title></head>\n` +
      `<body>\n${bodyHtml}\n</body></html>`
    onProgress(1)
    return { files: [{ name: `${name}.html`, blob: new Blob([html], { type: 'text/html;charset=utf-8' }) }], html }
  }

  const holder = document.createElement('div')
  holder.style.cssText = `width:${PAGE_WIDTH_PX[options.pageSize]}px;box-sizing:border-box;padding:56px 60px;background:#fff;color:#1a1a1a;font:14px/1.5 Georgia,'Times New Roman','Noto Sans Khmer',serif;`
  holder.innerHTML = bodyHtml
  // html2pdf renders its own copy of the element, so the holder is deliberately left detached and unpositioned.
  try {
    // Make sure the Khmer web font is ready before the page is rasterised, otherwise it falls back to blanks.
    await Promise.all([400, 700].map((weight) => document.fonts.load(`${weight} 14px "Noto Sans Khmer"`, text)))
    await document.fonts.ready
    const blob: Blob = await html2pdf()
      .set({
        margin: 0,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'pt', format: options.pageSize.toLowerCase(), orientation: 'portrait' },
      })
      .from(holder)
      .outputPdf('blob')
    onProgress(1)
    return { files: [{ name: `${name}.pdf`, blob }] }
  } finally {
    holder.innerHTML = ''
  }
}
