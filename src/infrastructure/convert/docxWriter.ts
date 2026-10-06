import JSZip from 'jszip'

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

// Khmer is a complex script, so Word picks its font from w:cs. Khmer UI ships with Windows;
// Word falls back to another Khmer font on systems that lack it.
const RUN_PROPS = '<w:rPr><w:rFonts w:cs="Khmer UI"/><w:lang w:bidi="km-KH"/></w:rPr>'

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function paragraph(text: string): string {
  if (!text) return '<w:p/>'
  return `<w:p><w:r>${RUN_PROPS}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`
}

/** Builds a minimal .docx where each string becomes one paragraph (empty string = blank line). */
export async function buildDocx(paragraphs: string[]): Promise<Blob> {
  const zip = new JSZip()
  zip.file(
    '[Content_Types].xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
      '</Types>',
  )
  zip.file(
    '_rels/.rels',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
      '</Relationships>',
  )
  zip.file(
    'word/document.xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' +
      paragraphs.map(paragraph).join('') +
      '</w:body></w:document>',
  )
  return zip.generateAsync({ type: 'blob', mimeType: DOCX_MIME })
}
