<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useTemplateRegistry } from '@/application/composables/useTemplateRegistry'
import { useResumeStore } from '@/application/stores/resume.store'
import type { TemplateTag } from '@/domain/resume.types'
import AppHeader from '@/presentation/components/layout/AppHeader.vue'
import TemplateCard from '@/presentation/components/templates/TemplateCard.vue'
import TemplateFilterChips from '@/presentation/components/templates/TemplateFilterChips.vue'

const router = useRouter()
const resumeStore = useResumeStore()
const { getAll } = useTemplateRegistry()

const activeFilter = ref<TemplateTag | 'All'>('All')

const templates = computed(() => {
  const all = getAll()
  if (activeFilter.value === 'All') return all
  return all.filter((t) => t.tags.includes(activeFilter.value as TemplateTag))
})

function selectTemplate(id: string) {
  resumeStore.setActiveTemplate(id)
  router.push('/preview')
}
</script>

<template>
  <div class="min-h-screen bg-surface-100">
    <AppHeader current-step="templates" />

    <div class="mx-auto box-border max-w-[1184px] p-6 lg:p-12">
      <h1 class="m-0 font-display text-[28px] font-semibold leading-[34px] text-ink">Choose your template</h1>
      <p class="mb-8 mt-1 font-sans text-[15px] leading-[22px] text-ink-muted">
        Your content stays exactly the same — switch anytime before you export.
      </p>

      <TemplateFilterChips :active-filter="activeFilter" @select="activeFilter = $event" />

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <TemplateCard
          v-for="template in templates"
          :key="template.id"
          :template="template"
          :resume="resumeStore.resume"
          :is-selected="resumeStore.resume.meta.activeTemplateId === template.id"
          @select="selectTemplate"
        />
      </div>
    </div>
  </div>
</template>
