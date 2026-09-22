<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useTemplateRegistry } from '@/application/composables/useTemplateRegistry'
import { usePdfExport } from '@/application/composables/usePdfExport'
import { useResumeStore } from '@/application/stores/resume.store'
import AppHeader from '@/presentation/components/layout/AppHeader.vue'
import CustomizePanel from '@/presentation/components/preview/CustomizePanel.vue'
import ExportPanel from '@/presentation/components/preview/ExportPanel.vue'

const PAGE_WIDTH = 794
const FRAME_WIDTH = 720
const SCALE = FRAME_WIDTH / PAGE_WIDTH

const resumeStore = useResumeStore()
const { getAll, getComponent } = useTemplateRegistry()
const { isExporting, error, downloadPdf, downloadPng } = usePdfExport()

const activeTemplate = computed(
  () => getAll().find((t) => t.id === resumeStore.resume.meta.activeTemplateId) ?? getAll()[0],
)
const activeComponent = computed(() => getComponent(activeTemplate.value.family))
const effectiveTheme = computed(() => ({
  ...activeTemplate.value.theme,
  accentColor: resumeStore.resume.meta.accentColor || activeTemplate.value.theme.accentColor,
}))

const resumeElement = ref<HTMLElement | null>(null)
const naturalHeight = ref(1123)
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (!resumeElement.value) return
  resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (entry) naturalHeight.value = entry.target.scrollHeight
  })
  resizeObserver.observe(resumeElement.value)
})
onBeforeUnmount(() => resizeObserver?.disconnect())

const frameStyle = computed(() => ({
  width: `${FRAME_WIDTH}px`,
  height: `${Math.max(naturalHeight.value * SCALE, 200)}px`,
}))

/**
 * Exports must render at true size, decoupled from the on-screen preview's visual scale-down.
 * A cloned, off-DOM copy is fragile with html2canvas (it re-clones the live document itself and
 * can measure a detached/repositioned copy as zero-height), so instead the real, attached element
 * is temporarily un-scaled in place, captured, then restored.
 */
async function withRealSizeExport<T>(action: (element: HTMLElement) => Promise<T>): Promise<T | undefined> {
  const el = resumeElement.value
  const frame = el?.parentElement
  if (!el || !frame) return undefined

  const prevTransform = el.style.transform
  const prevOverflow = frame.style.overflow
  const prevHeight = frame.style.height
  el.style.transform = 'none'
  frame.style.overflow = 'visible'
  frame.style.height = 'auto'

  try {
    return await action(el)
  } finally {
    el.style.transform = prevTransform
    frame.style.overflow = prevOverflow
    frame.style.height = prevHeight
  }
}

function fileBaseName(): string {
  const name = resumeStore.resume.personalInfo.fullName.trim() || 'resume'
  return name.replace(/\s+/g, '-').toLowerCase()
}

function onDownloadPdf() {
  withRealSizeExport((el) => downloadPdf(el, `${fileBaseName()}.pdf`))
}

function onDownloadPng() {
  withRealSizeExport((el) => downloadPng(el, `${fileBaseName()}.png`))
}

function onPrint() {
  if (!resumeElement.value) return
  resumeElement.value.id = 'resume-print-root'
  window.print()
}
</script>

<template>
  <div class="min-h-screen bg-surface-100">
    <AppHeader current-step="preview" />

    <div class="mx-auto box-border max-w-[1184px] p-6 lg:p-12">
      <h1 class="m-0 font-display text-[28px] font-semibold leading-[34px] text-ink">Preview &amp; export</h1>
      <p class="mb-8 mt-1 font-sans text-[15px] leading-[22px] text-ink-muted">
        This is exactly what downloads — check the page breaks before you export.
      </p>

      <div class="flex flex-col items-center gap-8 xl:flex-row xl:items-start">
        <div class="flex-shrink-0 overflow-hidden rounded-sm bg-white shadow-md" :style="frameStyle">
          <div ref="resumeElement" class="origin-top-left" :style="{ transform: `scale(${SCALE})` }">
            <component :is="activeComponent" :resume="resumeStore.resume" :theme="effectiveTheme" />
          </div>
        </div>

        <div class="flex w-full max-w-[720px] flex-shrink-0 flex-col gap-5 xl:w-80 xl:max-w-none">
          <CustomizePanel :active-template="activeTemplate" />
          <ExportPanel
            :is-exporting="isExporting"
            :error="error"
            @download-pdf="onDownloadPdf"
            @download-png="onDownloadPng"
            @print="onPrint"
          />
        </div>
      </div>
    </div>
  </div>
</template>
