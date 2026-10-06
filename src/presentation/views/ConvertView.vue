<script setup lang="ts">
import { AlertCircle, Check, ChevronLeft, ChevronRight, Download, Eye, FileText, UploadCloud, X } from '@lucide/vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { formatSize, MAX_FILES, useConverter } from '@/application/composables/useConverter'
import SelectField from '@/presentation/components/form/SelectField.vue'
import ConvertNav from '@/presentation/components/layout/ConvertNav.vue'
import { downloadBlob } from '@/infrastructure/convert/download'
import { convertPdf, getPdfPageCount, type PdfTarget } from '@/infrastructure/convert/pdfConverters'
import { convertWord, LegacyDocError, type PageSize, type WordTarget } from '@/infrastructure/convert/wordConverters'

const props = defineProps<{ kind: 'pdf' | 'word' }>()

interface FormatOption {
  value: string
  title: string
  ext: string
  description: string
  note: string
}

const config = {
  pdf: {
    title: 'Convert PDF',
    subtitle:
      'Turn a PDF into an editable Word file, a set of page images or plain text. Nothing leaves this browser tab.',
    dropTitle: 'Drop PDF files here',
    accept: '.pdf',
    formats: [
      {
        value: 'docx',
        title: 'Word document',
        ext: '.docx',
        description: 'Editable text, with the layout kept as closely as possible.',
        note: 'Text is editable in Word. The layout can shift slightly from the original.',
      },
      {
        value: 'png',
        title: 'Images',
        ext: '.png',
        description: 'One image per page.',
        note: 'One image per page. Download all pages together as a .zip.',
      },
      {
        value: 'txt',
        title: 'Plain text',
        ext: '.txt',
        description: 'Text only, no layout.',
        note: 'Plain text keeps the words and drops layout, fonts and images.',
      },
    ] as FormatOption[],
  },
  word: {
    title: 'Convert Word',
    subtitle:
      'Save a Word document as a PDF that looks the same on every device, or pull the text out. Nothing leaves this browser tab.',
    dropTitle: 'Drop Word files here',
    accept: '.docx,.doc',
    formats: [
      {
        value: 'pdf',
        title: 'PDF document',
        ext: '.pdf',
        description: 'Looks the same on every device.',
        note: 'The PDF looks the same on every device. Fonts are embedded.',
      },
      {
        value: 'txt',
        title: 'Plain text',
        ext: '.txt',
        description: 'Text only, no layout.',
        note: 'Plain text keeps the words and drops layout, fonts and images.',
      },
      {
        value: 'html',
        title: 'Web page',
        ext: '.html',
        description: 'Headings and lists kept, styles dropped.',
        note: 'Headings and lists are kept. Fonts and page layout are dropped.',
      },
    ] as FormatOption[],
  },
}[props.kind]

const format = ref(config.formats[0].value)
const keepLayout = ref(true)
const pageRange = ref('')
const embedFonts = ref(true)
const pageSize = ref<PageSize>('A4')
const PAGE_SIZES: Array<{ value: PageSize; label: string; hint: string }> = [
  { value: 'A4', label: 'A4', hint: '210 × 297 mm' },
  { value: 'Letter', label: 'Letter', hint: '8.5 × 11 in' },
]

const converter = useConverter<string>({
  accept: props.kind === 'pdf' ? /\.pdf$/i : /\.docx?$/i,
  acceptMessage:
    props.kind === 'pdf' ? 'Only PDF files can be converted here.' : 'Only Word files can be converted here.',
  target: () => format.value,
  probe: props.kind === 'pdf' ? getPdfPageCount : undefined,
  validate:
    props.kind === 'word' ? (file) => (/\.doc$/i.test(file.name) ? new LegacyDocError().message : null) : undefined,
  convert: (file, target, onProgress, signal) =>
    props.kind === 'pdf'
      ? convertPdf(
          file,
          target as PdfTarget,
          { keepLayout: keepLayout.value, pages: pageRange.value },
          onProgress,
          signal,
        )
      : convertWord(file, target as WordTarget, { pageSize: pageSize.value }, onProgress, signal),
})
const { items, notice, previewItem, doneItems, isBusy } = converter

const currentFormat = computed(() => config.formats.find((f) => f.value === format.value) ?? config.formats[0])

watch(format, () => converter.resetResults())

const fileInput = ref<HTMLInputElement | null>(null)
const isDragOver = ref(false)

function onPick(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files) void converter.addFiles(input.files)
  input.value = ''
}

function onDrop(event: DragEvent) {
  isDragOver.value = false
  if (event.dataTransfer?.files) void converter.addFiles(event.dataTransfer.files)
}

// ---- preview ----
const page = ref(1)
const previewUrls = ref<string[]>([])

const outputs = computed(() => previewItem.value?.result?.files ?? [])
const isImages = computed(() => outputs.value.length > 0 && outputs.value.every((f) => f.name.endsWith('.png')))
const isPdfOutput = computed(() => outputs.value[0]?.name.endsWith('.pdf') ?? false)
const isHtmlOutput = computed(() => outputs.value[0]?.name.endsWith('.html') ?? false)
const textPages = computed(() => previewItem.value?.result?.textPages ?? [])
const pageCount = computed(() =>
  isImages.value ? outputs.value.length : isPdfOutput.value || isHtmlOutput.value ? 1 : textPages.value.length,
)
const showNav = computed(() => isImages.value && pageCount.value > 1)
const htmlSource = ref('')

function revokeUrls() {
  previewUrls.value.forEach((url) => URL.revokeObjectURL(url))
  previewUrls.value = []
}

watch(previewItem, async (item) => {
  revokeUrls()
  page.value = 1
  htmlSource.value = ''
  if (!item?.result) return
  previewUrls.value = item.result.files.map((f) => URL.createObjectURL(f.blob))
  if (item.result.files[0]?.name.endsWith('.html')) htmlSource.value = await item.result.files[0].blob.text()
})
onBeforeUnmount(revokeUrls)

const previewName = computed(
  () => (isImages.value ? outputs.value[page.value - 1]?.name : outputs.value[0]?.name) ?? '',
)
const previewNote = computed(() => currentFormat.value.note)

function downloadLabel(count: number) {
  return count > 1 ? 'Download .zip' : `Download ${currentFormat.value.ext}`
}

async function downloadCurrent() {
  if (!previewItem.value) return
  if (isImages.value) {
    const file = outputs.value[page.value - 1]
    downloadBlob(file.blob, file.name)
  } else {
    await converter.downloadItem(previewItem.value)
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface-100">
    <ConvertNav />

    <div class="mx-auto box-border max-w-[1184px] px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
      <h1 class="m-0 font-display text-[28px] font-semibold leading-[34px] text-ink">{{ config.title }}</h1>
      <p class="mb-8 mt-1 max-w-[620px] font-sans text-[15px] leading-[22px] text-ink-muted">{{ config.subtitle }}</p>

      <div class="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div
            class="flex flex-wrap items-center gap-5 rounded-md border-2 border-dashed border-border-strong bg-surface-200 p-6 transition-colors"
            :class="{ '!border-brand !bg-brand-tint': isDragOver }"
            @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false"
            @drop.prevent="onDrop"
          >
            <div
              class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-surface-300 text-ink-muted"
            >
              <UploadCloud :size="24" :stroke-width="1.5" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="heading-sm">{{ config.dropTitle }}</div>
              <div class="mt-0.5 font-sans text-[13px] leading-[18px] text-ink-muted">
                Up to {{ MAX_FILES }} files, 50 MB each
              </div>
            </div>
            <button type="button" class="smallbtn !px-[18px] !py-2.5 !text-sm" @click="fileInput?.click()">
              Choose files
            </button>
            <input ref="fileInput" type="file" multiple :accept="config.accept" class="hidden" @change="onPick" />
          </div>

          <p v-if="notice" class="mt-3 font-sans text-sm text-danger" role="alert">{{ notice }}</p>

          <template v-if="items.length">
            <div class="mt-8 flex items-center justify-between">
              <h2 class="heading-sm">
                Files <span class="font-medium text-ink-muted">· {{ items.length }}</span>
              </h2>
              <button
                type="button"
                class="border-none bg-transparent p-0 font-sans text-[13px] font-semibold text-ink-muted hover:text-ink"
                @click="converter.clearAll()"
              >
                Clear all
              </button>
            </div>

            <ul class="m-0 mt-3 flex list-none flex-col gap-2 p-0">
              <li
                v-for="item in items"
                :key="item.id"
                class="grid grid-cols-[40px_minmax(0,1fr)] sm:grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-4 rounded-md border bg-surface-200 p-4"
                :class="item.status === 'error' ? 'border-danger' : 'border-border'"
              >
                <div class="flex h-10 w-10 items-center justify-center rounded-sm bg-surface-300 text-ink-muted">
                  <FileText :size="20" :stroke-width="1.5" />
                </div>

                <div class="min-w-0">
                  <div class="truncate font-sans text-[15px] font-semibold leading-[22px] text-ink">
                    {{ item.file.name }}
                  </div>

                  <div
                    v-if="item.status === 'error'"
                    class="mt-0.5 flex items-start gap-1.5 font-sans text-[13px] font-semibold leading-[18px] text-danger"
                  >
                    <AlertCircle :size="14" :stroke-width="1.8" class="mt-0.5 flex-shrink-0" />
                    <span>{{ item.error }}</span>
                  </div>
                  <template v-else>
                    <div
                      class="flex flex-wrap items-center gap-1.5 font-sans text-[13px] leading-[18px] text-ink-muted"
                    >
                      <span v-if="item.pages">{{ item.pages }} page{{ item.pages === 1 ? '' : 's' }} ·</span>
                      <span>{{ formatSize(item.file.size) }}</span>
                      <template v-if="item.status === 'done'">
                        <span class="text-border-strong">·</span>
                        <span class="inline-flex items-center gap-1 font-semibold text-success">
                          <Check :size="13" :stroke-width="2.2" />Converted
                        </span>
                      </template>
                    </div>
                    <div v-if="item.status === 'converting'" class="mt-2.5 flex items-center gap-3">
                      <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-300">
                        <div class="h-full bg-brand transition-all" :style="{ width: `${item.progress}%` }" />
                      </div>
                      <span class="font-sans text-[13px] font-semibold text-ink">Converting… {{ item.progress }}%</span>
                    </div>
                  </template>
                </div>

                <div class="col-span-2 flex flex-wrap justify-end gap-2 sm:col-span-1">
                  <template v-if="item.status === 'done'">
                    <button type="button" class="smallbtn" @click="converter.togglePreview(item.id)">
                      <Eye :size="14" :stroke-width="1.5" />{{
                        previewItem?.id === item.id ? 'Hide preview' : 'Preview'
                      }}
                    </button>
                    <button type="button" class="smallbtn" @click="converter.downloadItem(item)">
                      <Download :size="14" :stroke-width="1.5" />{{ downloadLabel(item.result?.files.length ?? 1) }}
                    </button>
                  </template>
                  <button
                    v-else-if="item.status === 'converting'"
                    type="button"
                    class="border-none bg-transparent p-0 font-sans text-[13px] font-semibold text-ink-muted hover:text-ink"
                    @click="converter.cancel(item.id)"
                  >
                    Cancel
                  </button>
                  <button
                    v-else
                    type="button"
                    class="border-none bg-transparent p-0 font-sans text-[13px] font-semibold text-ink-muted hover:text-ink"
                    @click="converter.remove(item.id)"
                  >
                    Remove
                  </button>
                </div>
              </li>
            </ul>
          </template>
        </div>

        <aside class="box-border rounded-md border border-border bg-surface-200 p-5">
          <fieldset class="m-0 border-none p-0">
            <legend class="heading-sm mb-3 p-0">Convert to</legend>
            <div class="flex flex-col gap-2">
              <label
                v-for="option in config.formats"
                :key="option.value"
                class="flex cursor-pointer items-start gap-3 rounded-sm border bg-surface-200 p-3"
                :class="format === option.value ? 'border-brand bg-brand-tint' : 'border-border'"
              >
                <input
                  v-model="format"
                  type="radio"
                  name="fmt"
                  :value="option.value"
                  class="mt-[3px] h-4 w-4 flex-shrink-0 accent-brand"
                />
                <span>
                  <span class="block font-sans text-[15px] font-semibold leading-[22px] text-ink">
                    {{ option.title }} <span class="font-medium text-ink-muted">{{ option.ext }}</span>
                  </span>
                  <span class="mt-0.5 block font-sans text-[13px] leading-[18px] text-ink-muted">{{
                    option.description
                  }}</span>
                </span>
              </label>
            </div>
          </fieldset>

          <div class="my-5 h-px bg-border" />

          <h2 class="heading-sm">Options</h2>
          <template v-if="kind === 'pdf'">
            <label class="mt-3 flex items-center gap-2.5 font-sans text-[15px] leading-[22px] text-ink">
              <input v-model="keepLayout" type="checkbox" class="m-0 h-4 w-4 accent-brand" />Keep original layout
            </label>
            <div class="mt-3.5">
              <label class="field-label" for="pages">Pages</label>
              <input id="pages" v-model="pageRange" class="field" type="text" placeholder="All pages" />
              <div class="mt-1.5 font-sans text-[13px] leading-[18px] text-ink-muted">For example 1-3, 5</div>
            </div>
          </template>
          <template v-else>
            <label class="mt-3 flex items-center gap-2.5 font-sans text-[15px] leading-[22px] text-ink">
              <input v-model="embedFonts" type="checkbox" class="m-0 h-4 w-4 accent-brand" />Embed fonts
            </label>
            <div class="mt-3.5">
              <SelectField v-model="pageSize" label="Page size" :options="PAGE_SIZES" />
            </div>
          </template>

          <button
            type="button"
            class="btn-primary mt-6 w-full"
            :disabled="isBusy || !items.length"
            @click="converter.convertAll()"
          >
            Convert files
          </button>
          <button
            type="button"
            class="btn-secondary mt-2.5 w-full !py-[11px] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!doneItems.length"
            @click="converter.downloadAll()"
          >
            Download all (.zip)
          </button>
          <p class="m-0 mt-3.5 font-sans text-[13px] leading-[18px] text-ink-muted">
            Conversion runs on your device, so large files can take a minute.
          </p>
        </aside>
      </div>

      <section v-if="previewItem?.result" class="mt-8">
        <div class="overflow-hidden rounded-md border border-border bg-surface-200">
          <div class="flex flex-wrap items-center gap-4 border-b border-border px-4 py-3">
            <div class="min-w-0 flex-1">
              <div class="truncate font-sans text-[15px] font-semibold leading-[22px] text-ink">{{ previewName }}</div>
              <div class="font-sans text-[13px] leading-[18px] text-ink-muted">
                Converted from {{ previewItem.file.name }}
              </div>
            </div>
            <div v-if="showNav" class="flex items-center gap-2">
              <button
                type="button"
                class="smallbtn !h-8 !w-8 !justify-center !p-0"
                aria-label="Previous page"
                :disabled="page <= 1"
                @click="page -= 1"
              >
                <ChevronLeft :size="16" :stroke-width="1.5" />
              </button>
              <span class="min-w-[80px] text-center font-sans text-[13px] font-semibold text-ink"
                >Page {{ page }} of {{ pageCount }}</span
              >
              <button
                type="button"
                class="smallbtn !h-8 !w-8 !justify-center !p-0"
                aria-label="Next page"
                :disabled="page >= pageCount"
                @click="page += 1"
              >
                <ChevronRight :size="16" :stroke-width="1.5" />
              </button>
            </div>
            <button type="button" class="smallbtn" @click="downloadCurrent">
              <Download :size="14" :stroke-width="1.5" />Download
            </button>
            <button
              type="button"
              class="smallbtn !h-8 !w-8 !justify-center !p-0"
              aria-label="Close preview"
              @click="converter.togglePreview(previewItem.id)"
            >
              <X :size="14" :stroke-width="1.5" />
            </button>
          </div>

          <div class="box-border h-[480px] overflow-auto bg-surface-300 p-4 sm:p-8">
            <img
              v-if="isImages"
              :src="previewUrls[page - 1]"
              :alt="previewName"
              class="mx-auto block max-w-full bg-white shadow-sm"
            />
            <iframe
              v-else-if="isPdfOutput"
              :src="previewUrls[0]"
              title="PDF preview"
              class="mx-auto block h-full w-full max-w-[640px] border-none bg-white shadow-sm"
            />
            <iframe
              v-else-if="isHtmlOutput"
              :srcdoc="htmlSource"
              sandbox=""
              title="HTML preview"
              class="mx-auto block h-full w-full max-w-[640px] border-none bg-white shadow-sm"
            />
            <div
              v-else
              class="mx-auto box-border max-w-[560px] whitespace-pre-wrap bg-white p-8 font-mono text-xs leading-[18px] text-[#1a1a1a] shadow-sm"
            >
              {{ textPages.join('\n\n') }}
            </div>
          </div>

          <div class="border-t border-border px-4 py-3">
            <p class="m-0 font-sans text-[13px] leading-[18px] text-ink-muted">{{ previewNote }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
