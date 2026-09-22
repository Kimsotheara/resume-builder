import mammoth from 'mammoth'

/** Extracts raw text from a DOCX file entirely in the browser. */
export async function extractTextFromDocx(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  return result.value
}
