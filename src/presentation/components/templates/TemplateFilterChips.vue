<script setup lang="ts">
import type { TemplateTag } from '@/domain/resume.types'
import ChipGroup from '@/presentation/components/layout/ChipGroup.vue'

const FILTERS: Array<TemplateTag | 'All'> = [
  'All',
  'Modern',
  'Creative',
  'Minimal',
  'Two-column',
  'Timeline',
  'ATS-friendly',
]
const OPTIONS = FILTERS.map((filter) => ({ value: filter, label: filter }))

defineProps<{
  activeFilter: TemplateTag | 'All'
}>()

const emit = defineEmits<{
  select: [filter: TemplateTag | 'All']
}>()
</script>

<template>
  <ChipGroup
    class="mb-8"
    label="Template style"
    :options="OPTIONS"
    :model-value="activeFilter"
    @update:model-value="emit('select', $event)"
  />
</template>
