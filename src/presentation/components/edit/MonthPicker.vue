<script setup lang="ts">
import { Calendar, ChevronLeft, ChevronRight } from '@lucide/vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string // "YYYY-MM"
    placeholder?: string
    disabled?: boolean
  }>(),
  { placeholder: 'Select month', disabled: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3))

const root = ref<HTMLElement | null>(null)
const open = ref(false)
const viewYear = ref(new Date().getFullYear())

const selected = computed(() => {
  const [year, month] = (props.modelValue ?? '').split('-')
  const y = Number(year)
  const m = Number(month)
  if (!y || !m) return null
  return { year: y, monthIndex: m - 1 }
})

const label = computed(() => (selected.value ? `${MONTHS[selected.value.monthIndex]} ${selected.value.year}` : ''))

function onDocumentClick(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) open.value = false
}

watch(open, (isOpen) => {
  if (isOpen) {
    viewYear.value = selected.value?.year ?? new Date().getFullYear()
    document.addEventListener('click', onDocumentClick, true)
  } else {
    document.removeEventListener('click', onDocumentClick, true)
  }
})

onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick, true))

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

function isSelected(monthIndex: number): boolean {
  return selected.value?.year === viewYear.value && selected.value?.monthIndex === monthIndex
}

function select(monthIndex: number) {
  emit('update:modelValue', `${viewYear.value}-${String(monthIndex + 1).padStart(2, '0')}`)
  open.value = false
}

function clear() {
  emit('update:modelValue', '')
  open.value = false
}
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="field flex items-center justify-between gap-2 text-left"
      :class="{ 'cursor-not-allowed opacity-50': props.disabled, 'border-brand bg-surface-200': open }"
      :disabled="props.disabled"
      @click="toggle"
    >
      <span :class="label ? 'text-ink' : 'text-ink-muted'">{{ label || props.placeholder }}</span>
      <Calendar :size="16" :stroke-width="1.5" class="shrink-0 text-ink-muted" />
    </button>

    <div
      v-if="open"
      class="absolute left-0 top-[calc(100%+6px)] z-30 w-[248px] max-w-[calc(100vw-2rem)] rounded-md border border-border bg-surface-200 p-3 shadow-md"
    >
      <div class="mb-2 flex items-center justify-between">
        <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-sm text-ink-muted hover:bg-surface-300 hover:text-ink"
          aria-label="Previous year"
          @click="viewYear -= 1"
        >
          <ChevronLeft :size="16" :stroke-width="1.5" />
        </button>
        <span class="font-display text-sm font-semibold text-ink">{{ viewYear }}</span>
        <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-sm text-ink-muted hover:bg-surface-300 hover:text-ink"
          aria-label="Next year"
          @click="viewYear += 1"
        >
          <ChevronRight :size="16" :stroke-width="1.5" />
        </button>
      </div>

      <div class="grid grid-cols-3 gap-1.5">
        <button
          v-for="(month, index) in MONTHS_SHORT"
          :key="month"
          type="button"
          class="rounded-sm px-2 py-1.5 font-sans text-[13px] font-medium transition-colors"
          :class="isSelected(index) ? 'bg-brand text-on-brand' : 'text-ink hover:bg-surface-300'"
          @click="select(index)"
        >
          {{ month }}
        </button>
      </div>

      <button
        v-if="label"
        type="button"
        class="mt-2.5 w-full rounded-sm py-1.5 font-sans text-[12px] font-semibold text-ink-muted hover:text-danger"
        @click="clear"
      >
        Clear
      </button>
    </div>
  </div>
</template>
