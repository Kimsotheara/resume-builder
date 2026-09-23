<script setup lang="ts">
import { computed } from 'vue'

import MonthPicker from '@/presentation/components/edit/MonthPicker.vue'

const props = withDefaults(
  defineProps<{
    dates: string
    allowPresent?: boolean
  }>(),
  { allowPresent: true },
)

const emit = defineEmits<{ 'update:dates': [value: string] }>()

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

interface RangeModel {
  startValue: string // native <input type="month"> value: "YYYY-MM"
  endValue: string
  present: boolean
}

// "2021-11" -> "November 2021" (the human-readable form we store for templates)
function valueToLabel(value: string): string {
  if (!value) return ''
  const [year, month] = value.split('-')
  const name = MONTHS[Number(month) - 1] ?? ''
  return [name, year].filter(Boolean).join(' ')
}

// "November 2021" -> "2021-11" (the value the native month picker understands)
function labelToValue(text: string): string {
  const trimmed = text.trim()
  const monthIndex = MONTHS.findIndex((m) => new RegExp(`^${m.slice(0, 3)}`, 'i').test(trimmed) && /[A-Za-z]/.test(trimmed))
  const year = trimmed.match(/(?:19|20)\d{2}/)?.[0]
  if (year && monthIndex >= 0) return `${year}-${String(monthIndex + 1).padStart(2, '0')}`
  return ''
}

const model = computed<RangeModel>(() => {
  const [left, right] = (props.dates ?? '').split(/\s*[-–—]\s*|\s+to\s+/i)
  const present = /^(present|current|now|ongoing)$/i.test((right ?? '').trim())
  return {
    startValue: labelToValue(left ?? ''),
    endValue: present ? '' : labelToValue(right ?? ''),
    present,
  }
})

function compose(next: RangeModel): string {
  const start = valueToLabel(next.startValue)
  const end = next.present ? 'Present' : valueToLabel(next.endValue)
  if (start && end) return `${start} - ${end}`
  return start || end
}

function update(patch: Partial<RangeModel>) {
  emit('update:dates', compose({ ...model.value, ...patch }))
}
</script>

<template>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <div>
      <span class="field-label">Start</span>
      <MonthPicker
        :model-value="model.startValue"
        placeholder="Start month"
        @update:model-value="update({ startValue: $event })"
      />
    </div>

    <div>
      <div class="flex items-center justify-between">
        <span class="field-label">End</span>
        <label v-if="props.allowPresent" class="flex cursor-pointer items-center gap-1.5 text-[12px] text-ink-muted">
          <input
            type="checkbox"
            :checked="model.present"
            @change="update({ present: ($event.target as HTMLInputElement).checked })"
          />
          Present
        </label>
      </div>
      <MonthPicker
        :model-value="model.endValue"
        :disabled="model.present"
        :placeholder="model.present ? 'Present' : 'End month'"
        @update:model-value="update({ endValue: $event })"
      />
    </div>
  </div>
</template>
