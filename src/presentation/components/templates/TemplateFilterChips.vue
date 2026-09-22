<script setup lang="ts">
import type { TemplateTag } from '@/domain/resume.types'

const FILTERS: Array<TemplateTag | 'All'> = ['All', 'Modern', 'Creative', 'Minimal', 'Two-column', 'Timeline', 'ATS-friendly']

defineProps<{
  activeFilter: TemplateTag | 'All'
}>()

const emit = defineEmits<{
  select: [filter: TemplateTag | 'All']
}>()
</script>

<template>
  <div class="mb-8 flex flex-wrap gap-2">
    <button
      v-for="filter in FILTERS"
      :key="filter"
      type="button"
      class="chip"
      :class="{ 'chip-on': activeFilter === filter }"
      @click="emit('select', filter)"
    >
      {{ filter }}
    </button>
  </div>
</template>
