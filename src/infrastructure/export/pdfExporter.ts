import html2pdf from 'html2pdf.js'

/** Renders a DOM node to a PDF and triggers a download — entirely client-side. */
export async function exportElementToPdf(element: HTMLElement, filename: string): Promise<void> {
  await html2pdf()
    .set({
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
    })
    .from(element)
    .save()
}

/** Renders a DOM node to a PNG data URL and triggers a download. */
export async function exportElementToPng(element: HTMLElement, filename: string): Promise<void> {
  const worker = html2pdf()
    .set({ html2canvas: { scale: 2, useCORS: true } })
    .from(element)
  const canvas: HTMLCanvasElement = await worker.toCanvas().get('canvas')
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}
