import { ref } from 'vue'

import { exportElementToPdf, exportElementToPng } from '@/infrastructure/export/pdfExporter'

export function usePdfExport() {
  const isExporting = ref(false)
  const error = ref<string | null>(null)

  async function downloadPdf(element: HTMLElement, filename: string) {
    error.value = null
    isExporting.value = true
    try {
      await exportElementToPdf(element, filename)
    } catch {
      error.value = 'Could not generate the PDF. Please try again.'
    } finally {
      isExporting.value = false
    }
  }

  async function downloadPng(element: HTMLElement, filename: string) {
    error.value = null
    isExporting.value = true
    try {
      await exportElementToPng(element, filename)
    } catch {
      error.value = 'Could not generate the image. Please try again.'
    } finally {
      isExporting.value = false
    }
  }

  return { isExporting, error, downloadPdf, downloadPng }
}
