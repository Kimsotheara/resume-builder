<script setup lang="ts">
import { Check, ChevronDown } from '@lucide/vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: string[]
    placeholder?: string
    disabled?: boolean
  }>(),
  { placeholder: 'Select…', disabled: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const root = ref<HTMLElement | null>(null)
const open = ref(false)

// Keep a value that came from parsing (and isn't in the preset list) selectable.
const mergedOptions = computed(() =>
  props.modelValue && !props.options.includes(props.modelValue) ? [props.modelValue, ...props.options] : props.options,
)

function onDocumentClick(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) open.value = false
}

watch(open, (isOpen) => {
  if (isOpen) document.addEventListener('click', onDocumentClick, true)
  else document.removeEventListener('click', onDocumentClick, true)
})

onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick, true))

function toggle() {
  if (!props.disabled) open.value = !open.value
}

function select(option: string) {
  emit('update:modelValue', option)
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
      <span class="truncate" :class="props.modelValue ? 'text-ink' : 'text-ink-muted'">
        {{ props.modelValue || props.placeholder }}
      </span>
      <ChevronDown
        :size="16"
        :stroke-width="1.5"
        class="shrink-0 text-ink-muted transition-transform"
        :class="{ 'rotate-180': open }"
      />
    </button>

    <div
      v-if="open"
      class="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-64 overflow-auto rounded-md border border-border bg-surface-200 p-1.5 shadow-md"
    >
      <button
        v-for="option in mergedOptions"
        :key="option"
        type="button"
        class="flex w-full items-center justify-between gap-2 rounded-sm px-2.5 py-2 text-left font-sans text-sm transition-colors"
        :class="option === props.modelValue ? 'bg-brand-tint font-semibold text-brand' : 'text-ink hover:bg-surface-300'"
        @click="select(option)"
      >
        <span class="truncate">{{ option }}</span>
        <Check v-if="option === props.modelValue" :size="14" :stroke-width="2" class="shrink-0" />
      </button>
    </div>
  </div>
</template>
