import { ref } from 'vue'

import { extractTextFromDocx } from '@/infrastructure/parsers/docxTextExtractor'
import { extractTextFromPdf } from '@/infrastructure/parsers/pdfTextExtractor'
import { parseResumeSections } from '@/infrastructure/parsers/resumeSectionParser'
import type { ParsedResumeSections } from '@/domain/resume.types'

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const ACCEPTED_EXTENSIONS = ['pdf', 'docx']

export class UnsupportedFileError extends Error {}
export class FileTooLargeError extends Error {}

function fileExtension(file: File): string {
  return file.name.split('.').pop()?.toLowerCase() ?? ''
}

export function useResumeParser() {
  const isParsing = ref(false)
  const error = ref<string | null>(null)

  async function parseFile(file: File): Promise<ParsedResumeSections> {
    error.value = null

    if (file.size > MAX_UPLOAD_BYTES) {
      throw new FileTooLargeError('File is larger than 10 MB.')
    }

    const extension = fileExtension(file)
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      throw new UnsupportedFileError('Only PDF or DOCX files are supported.')
    }

    isParsing.value = true
    try {
      const rawText = extension === 'pdf' ? await extractTextFromPdf(file) : await extractTextFromDocx(file)
      return parseResumeSections(rawText)
    } catch (cause) {
      console.error('Resume parsing failed:', cause)
      error.value = 'We could not read that file. You can still fill in the form by hand.'
      throw cause
    } finally {
      isParsing.value = false
    }
  }

  return { isParsing, error, parseFile }
}
