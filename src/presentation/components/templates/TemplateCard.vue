<script setup lang="ts">
import { Check } from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useTemplateRegistry } from '@/application/composables/useTemplateRegistry'
import type { ResumeData, TemplateDefinition } from '@/domain/resume.types'

const PAGE_WIDTH = 794

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

// The card's on-screen width varies by breakpoint (1/2/3-column grid), so the
// preview scale is measured rather than hardcoded — otherwise it clips on narrow cards.
const previewBox = ref<HTMLElement | null>(null)
const scale = ref(0.46)
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (!previewBox.value) return
  resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (entry) scale.value = entry.contentRect.width / PAGE_WIDTH
  })
  resizeObserver.observe(previewBox.value)
})
onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <div class="tcard" :class="{ 'tcard-sel': isSelected }">
    <div ref="previewBox" class="relative h-[220px] w-full overflow-hidden bg-white">
      <div
        v-if="isSelected"
        class="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-on-brand"
      >
        <Check :size="14" :stroke-width="2.5" />
      </div>
      <div
        class="pointer-events-none absolute left-0 top-0 h-[1120px] w-[794px] origin-top-left"
        :style="{ transform: `scale(${scale})` }"
      >
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
