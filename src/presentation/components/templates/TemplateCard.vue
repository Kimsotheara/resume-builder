<script setup lang="ts">
import { Check } from '@lucide/vue'
import { computed } from 'vue'

import { useTemplateRegistry } from '@/application/composables/useTemplateRegistry'
import type { ResumeData, TemplateDefinition } from '@/domain/resume.types'

const props = defineProps<{
  template: TemplateDefinition
  resume: ResumeData
  isSelected: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const { getComponent } = useTemplateRegistry()
const component = computed(() => getComponent(props.template.family))
</script>

<template>
  <div class="tcard" :class="{ 'tcard-sel': isSelected }">
    <div class="relative h-[220px] w-full overflow-hidden bg-white">
      <div
        v-if="isSelected"
        class="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-on-brand"
      >
        <Check :size="14" :stroke-width="2.5" />
      </div>
      <div class="pointer-events-none absolute left-0 top-0 h-[1120px] w-[794px] origin-top-left scale-[0.46]">
        <component :is="component" :resume="resume" :theme="template.theme" />
      </div>
    </div>
    <div class="tfooter">
      <span class="tname">{{ template.name }}</span>
      <span class="ttag">{{ template.tags.join(' · ') }}</span>
      <button type="button" class="usebtn" :class="{ 'usebtn-sel': isSelected }" @click="emit('select', template.id)">
        <template v-if="isSelected">
          <Check :size="14" :stroke-width="2" />
          Selected
        </template>
        <template v-else>Use this template</template>
      </button>
    </div>
  </div>
</template>
