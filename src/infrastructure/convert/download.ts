import JSZip from 'jszip'

export interface OutputFile {
  name: string
  blob: Blob
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function zipFiles(files: OutputFile[]): Promise<Blob> {
  const zip = new JSZip()
  const used = new Set<string>()
  for (const file of files) {
    let name = file.name
    for (let n = 2; used.has(name); n += 1) name = file.name.replace(/(\.[^.]+)?$/, ` (${n})$1`)
    used.add(name)
    zip.file(name, file.blob)
  }
  return zip.generateAsync({ type: 'blob' })
}

export function baseName(filename: string): string {
  return filename.replace(/\.[^.]+$/, '')
}
