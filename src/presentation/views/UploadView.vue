<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useResumeParser } from '@/application/composables/useResumeParser'
import { useResumeStore } from '@/application/stores/resume.store'
import AppHeader from '@/presentation/components/layout/AppHeader.vue'
import FileDropzone from '@/presentation/components/upload/FileDropzone.vue'

const router = useRouter()
const resumeStore = useResumeStore()
const { isParsing, error, parseFile } = useResumeParser()

const uploadError = ref<string | null>(null)

async function onFileSelected(file: File) {
  uploadError.value = null
  try {
    const sections = await parseFile(file)
    resumeStore.applyParsedSections(sections)
    router.push('/edit')
  } catch {
    uploadError.value = error.value ?? 'Something went wrong reading that file.'
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center bg-surface-100">
    <AppHeader current-step="upload" />

    <div class="flex w-full max-w-[640px] flex-col items-center px-6 pt-14 text-center">
      <h1 class="m-0 font-display text-[28px] font-semibold leading-[34px] text-ink">Add your resume</h1>
      <p class="mt-2 max-w-[480px] font-sans text-[15px] leading-[22px] text-ink-muted">
        Upload a PDF or Word file and we'll pull out the details — you can fix anything by hand on the next step.
      </p>

      <FileDropzone :is-parsing="isParsing" @file-selected="onFileSelected" />

      <p v-if="uploadError" class="mt-4 font-sans text-sm text-danger">{{ uploadError }}</p>

      <div class="mt-8 flex w-full items-center gap-4">
        <span class="h-px flex-1 bg-border" />
        <span class="font-sans text-[13px] text-ink-muted">or</span>
        <span class="h-px flex-1 bg-border" />
      </div>

      <router-link
        to="/edit"
        class="mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-brand hover:text-brand-hover"
      >
        Start with a blank resume instead
        <ArrowRight :size="16" :stroke-width="1.5" />
      </router-link>
    </div>
  </div>
</template>
