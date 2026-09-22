<script setup lang="ts">
import { Check } from '@lucide/vue'
import { computed } from 'vue'

const props = defineProps<{
  currentStep: 'upload' | 'edit' | 'templates' | 'preview'
}>()

const steps = [
  { key: 'upload', label: 'Upload', number: 1, route: '/upload' },
  { key: 'edit', label: 'Edit', number: 2, route: '/edit' },
  { key: 'templates', label: 'Template', number: 3, route: '/templates' },
  { key: 'preview', label: 'Preview', number: 4, route: '/preview' },
] as const

const currentIndex = computed(() => steps.findIndex((s) => s.key === props.currentStep))

function stateOf(index: number): 'done' | 'active' | 'upcoming' {
  if (index < currentIndex.value) return 'done'
  if (index === currentIndex.value) return 'active'
  return 'upcoming'
}
</script>

<template>
  <div class="box-border w-full border-b border-border bg-surface-200 px-12 py-6">
    <div class="mx-auto flex max-w-[640px] items-center">
      <template v-for="(step, index) in steps" :key="step.key">
        <router-link :to="step.route" class="flex items-center gap-2">
          <span
            class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-sans text-[13px] font-semibold"
            :class="{
              'bg-accent text-on-brand': stateOf(index) === 'done',
              'bg-brand text-on-brand': stateOf(index) === 'active',
              'border border-border-strong bg-surface-300 text-ink-muted': stateOf(index) === 'upcoming',
            }"
          >
            <Check v-if="stateOf(index) === 'done'" :size="14" :stroke-width="2.5" />
            <template v-else>{{ step.number }}</template>
          </span>
          <span
            class="font-sans text-[13px] font-semibold"
            :class="stateOf(index) === 'upcoming' ? 'text-ink-muted' : 'text-ink'"
          >
            {{ step.label }}
          </span>
        </router-link>
        <div
          v-if="index < steps.length - 1"
          class="mx-3 h-px flex-1"
          :class="stateOf(index) === 'done' ? 'bg-accent' : 'bg-border'"
        />
      </template>
    </div>
  </div>
</template>
