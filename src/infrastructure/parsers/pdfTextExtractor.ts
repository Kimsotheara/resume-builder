import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const doc = await pdfjsLib.getDocument({ data: buffer, standardFontDataUrl: '/standard_fonts/' }).promise

  const pageTexts: string[] = []
  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
    const page = await doc.getPage(pageNumber)
    const content = await page.getTextContent()

    let pageText = ''
    for (const item of content.items) {
      if (!('str' in item)) continue
      pageText += item.str
      pageText += item.hasEOL ? '\n' : ' '
    }
    pageTexts.push(pageText)
  }

  return pageTexts
    .join('\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .trim()
}
