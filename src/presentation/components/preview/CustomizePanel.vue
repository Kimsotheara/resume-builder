<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useResumeStore } from '@/application/stores/resume.store'
import type { TemplateDefinition } from '@/domain/resume.types'

defineProps<{
  activeTemplate: TemplateDefinition
}>()

const resumeStore = useResumeStore()
const router = useRouter()

const SWATCHES = [
  { color: '#1f2937', label: 'Charcoal' },
  { color: '#0f6f66', label: 'Teal' },
  { color: '#7c3aed', label: 'Violet' },
  { color: '#b45309', label: 'Amber' },
  { color: '#be123c', label: 'Crimson' },
  { color: '#2f6b3a', label: 'Forest' },
]
</script>

<template>
  <div class="card">
    <h2 class="heading-sm">Customize</h2>

    <div class="mt-4">
      <span class="font-sans text-[13px] font-semibold text-ink-muted">Accent color</span>
      <div class="mt-2.5 flex gap-2.5">
        <button
          v-for="swatch in SWATCHES"
          :key="swatch.color"
          type="button"
          class="swatch"
          :class="{ 'swatch-sel': resumeStore.resume.meta.accentColor === swatch.color }"
          :style="{ background: swatch.color }"
          :aria-label="swatch.label"
          @click="resumeStore.setAccentColor(swatch.color)"
        />
      </div>
    </div>

    <div class="mt-4">
      <span class="font-sans text-[13px] font-semibold text-ink-muted">Template</span>
      <div class="mt-2 flex items-center justify-between rounded-sm bg-surface-300 px-3 py-2.5">
        <span class="font-sans text-sm font-semibold text-ink">{{ activeTemplate.name }}</span>
        <a
          href="#"
          class="font-sans text-[13px] font-semibold text-brand hover:text-brand-hover"
          @click.prevent="router.push('/templates')"
        >
          Change
        </a>
      </div>
    </div>
  </div>
</template>
