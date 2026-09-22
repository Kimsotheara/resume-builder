<script setup lang="ts">
import { Loader2, Upload } from '@lucide/vue'
import { ref } from 'vue'

const props = defineProps<{
  isParsing: boolean
}>()

const emit = defineEmits<{
  fileSelected: [file: File]
}>()

const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function handleDrop(event: DragEvent) {
  isDragOver.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) emit('fileSelected', file)
}

function handleChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) emit('fileSelected', file)
}

function openPicker() {
  fileInput.value?.click()
}
</script>

<template>
  <div
    class="mt-8 flex h-[260px] w-full flex-col items-center justify-center gap-2.5 rounded-md border-2 border-dashed border-border-strong bg-surface-200 transition-colors"
    :class="{ 'border-brand bg-brand-tint': isDragOver }"
    @dragover.prevent="isDragOver = true"
    @dragleave.prevent="isDragOver = false"
    @drop.prevent="handleDrop"
  >
    <div class="flex h-14 w-14 items-center justify-center rounded-full bg-brand-tint text-brand">
      <Loader2 v-if="props.isParsing" :size="24" :stroke-width="1.5" class="animate-spin" />
      <Upload v-else :size="24" :stroke-width="1.5" />
    </div>
    <span class="font-display text-base font-semibold leading-[22px] text-ink">
      {{ props.isParsing ? 'Reading your resume…' : 'Drag and drop your resume here' }}
    </span>
    <template v-if="!props.isParsing">
      <span class="font-sans text-[13px] leading-[18px] text-ink-muted">or</span>
      <button type="button" class="btn-secondary" @click="openPicker">Choose a file</button>
      <span class="mt-1 font-sans text-[13px] leading-[18px] text-ink-muted">PDF or DOCX · up to 10 MB</span>
    </template>
    <input ref="fileInput" type="file" accept=".pdf,.docx" class="hidden" @change="handleChange" />
  </div>
</template>
