import { computed, onBeforeUnmount, ref } from 'vue'

import { downloadBlob, zipFiles, type OutputFile } from '@/infrastructure/convert/download'
import type { ConvertResult } from '@/infrastructure/convert/pdfConverters'

export const MAX_FILES = 20
export const MAX_FILE_BYTES = 50 * 1024 * 1024

export type ItemStatus = 'ready' | 'converting' | 'done' | 'error'

export interface ConvertItem {
  id: number
  file: File
  status: ItemStatus
  progress: number
  pages: number | null
  error: string | null
  result: ConvertResult | null
  controller: AbortController | null
}

export type ConvertFn<T extends string> = (
  file: File,
  target: T,
  onProgress: (fraction: number) => void,
  signal: AbortSignal,
) => Promise<ConvertResult>

export function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function useConverter<T extends string>(config: {
  accept: RegExp
  acceptMessage: string
  target: () => T
  convert: ConvertFn<T>
  probe?: (file: File) => Promise<number>
  validate?: (file: File) => string | null
}) {
  const items = ref<ConvertItem[]>([])
  const notice = ref<string | null>(null)
  const previewId = ref<number | null>(null)
  let nextId = 1

  const doneItems = computed(() => items.value.filter((item) => item.status === 'done'))
  const isBusy = computed(() => items.value.some((item) => item.status === 'converting'))
  const previewItem = computed(() => items.value.find((item) => item.id === previewId.value) ?? null)

  async function addFiles(files: FileList | File[]) {
    notice.value = null
    for (const file of Array.from(files)) {
      if (items.value.length >= MAX_FILES) {
        notice.value = `You can add up to ${MAX_FILES} files at a time.`
        break
      }
      const item: ConvertItem = {
        id: nextId++,
        file,
        status: 'ready',
        progress: 0,
        pages: null,
        error: null,
        result: null,
        controller: null,
      }
      const problem =
        config.validate?.(file) ??
        (!config.accept.test(file.name)
          ? config.acceptMessage
          : file.size > MAX_FILE_BYTES
            ? 'This file is over the 50 MB limit.'
            : null)
      if (problem) {
        item.status = 'error'
        item.error = problem
      }
      items.value.push(item)
      if (!problem && config.probe) {
        const tracked = items.value[items.value.length - 1]
        config
          .probe(file)
          .then((pages) => (tracked.pages = pages))
          .catch((e: unknown) => {
            tracked.status = 'error'
            tracked.error = e instanceof Error ? e.message : 'Could not read this file.'
          })
      }
    }
  }

  function remove(id: number) {
    const item = items.value.find((i) => i.id === id)
    item?.controller?.abort()
    items.value = items.value.filter((i) => i.id !== id)
    if (previewId.value === id) previewId.value = null
  }

  function clearAll() {
    items.value.forEach((item) => item.controller?.abort())
    items.value = []
    previewId.value = null
    notice.value = null
  }

  function cancel(id: number) {
    const item = items.value.find((i) => i.id === id)
    item?.controller?.abort()
  }

  /** Output formats changed, so earlier results no longer match the selection. */
  function resetResults() {
    for (const item of items.value) {
      if (item.status === 'done') {
        item.status = 'ready'
        item.result = null
      }
    }
    previewId.value = null
  }

  async function convertOne(item: ConvertItem) {
    const controller = new AbortController()
    item.controller = controller
    item.status = 'converting'
    item.progress = 0
    item.error = null
    try {
      item.result = await config.convert(
        item.file,
        config.target(),
        (fraction) => (item.progress = Math.round(fraction * 100)),
        controller.signal,
      )
      item.status = 'done'
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        item.status = 'ready'
      } else {
        item.status = 'error'
        item.error = e instanceof Error ? e.message : 'Something went wrong converting this file.'
      }
    } finally {
      item.controller = null
    }
  }

  async function convertAll() {
    notice.value = null
    const pending = items.value.filter((item) => item.status === 'ready' || item.status === 'done')
    if (!pending.length) {
      notice.value = 'Add a file first.'
      return
    }
    await Promise.all(pending.map(convertOne))
  }

  function outputsOf(item: ConvertItem): OutputFile[] {
    return item.result?.files ?? []
  }

  async function downloadItem(item: ConvertItem) {
    const files = outputsOf(item)
    if (files.length === 1) downloadBlob(files[0].blob, files[0].name)
    else if (files.length > 1) downloadBlob(await zipFiles(files), `${item.file.name.replace(/\.[^.]+$/, '')}.zip`)
  }

  async function downloadAll() {
    const files = doneItems.value.flatMap(outputsOf)
    if (files.length) downloadBlob(await zipFiles(files), 'converted-files.zip')
  }

  function togglePreview(id: number) {
    previewId.value = previewId.value === id ? null : id
  }

  onBeforeUnmount(() => items.value.forEach((item) => item.controller?.abort()))

  return {
    items,
    notice,
    previewId,
    previewItem,
    doneItems,
    isBusy,
    addFiles,
    remove,
    clearAll,
    cancel,
    resetResults,
    convertAll,
    downloadItem,
    downloadAll,
    togglePreview,
  }
}
