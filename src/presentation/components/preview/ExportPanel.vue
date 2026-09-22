<script setup lang="ts">
import { Download, Image, Loader2, Printer } from '@lucide/vue'

defineProps<{
  isExporting: boolean
  error: string | null
}>()

const emit = defineEmits<{
  downloadPdf: []
  downloadPng: []
  print: []
}>()
</script>

<template>
  <div class="card">
    <h2 class="heading-sm">Export</h2>

    <button type="button" class="btn-primary mt-3.5 box-border w-full" :disabled="isExporting" @click="emit('downloadPdf')">
      <Loader2 v-if="isExporting" :size="18" :stroke-width="1.5" class="animate-spin" />
      <Download v-else :size="18" :stroke-width="1.5" />
      Download PDF
    </button>

    <div class="mt-2.5 flex gap-2.5">
      <button type="button" class="btn-secondary flex-1 box-border px-0 py-2.5 text-[13px]" :disabled="isExporting" @click="emit('downloadPng')">
        <Image :size="14" :stroke-width="1.5" />
        PNG
      </button>
      <button type="button" class="btn-secondary flex-1 box-border px-0 py-2.5 text-[13px]" :disabled="isExporting" @click="emit('print')">
        <Printer :size="14" :stroke-width="1.5" />
        Print
      </button>
    </div>

    <p v-if="error" class="mt-3 font-sans text-[13px] leading-[18px] text-danger">{{ error }}</p>
    <p v-else class="mt-3 font-sans text-[13px] leading-[18px] text-ink-muted">
      Exports render entirely in your browser — nothing is uploaded.
    </p>
  </div>
</template>
