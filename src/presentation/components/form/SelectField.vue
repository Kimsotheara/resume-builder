<script setup lang="ts" generic="T extends string">
import { Check, ChevronDown } from '@lucide/vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'

interface SelectOption {
  value: T
  label: string
  hint?: string
}

const props = defineProps<{
  modelValue: T
  options: SelectOption[]
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()

const id = useId()
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const isOpen = ref(false)
const activeIndex = ref(0)

const selected = computed(() => props.options.find((o) => o.value === props.modelValue) ?? props.options[0])
const optionId = (index: number) => `${id}-option-${index}`

function open() {
  activeIndex.value = Math.max(
    0,
    props.options.findIndex((o) => o.value === props.modelValue),
  )
  isOpen.value = true
}

function close(refocus = true) {
  isOpen.value = false
  if (refocus) void nextTick(() => trigger.value?.focus())
}

function choose(index: number) {
  emit('update:modelValue', props.options[index].value)
  close()
}

function onKeydown(event: KeyboardEvent) {
  const last = props.options.length - 1
  if (!isOpen.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      open()
    }
    return
  }
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      activeIndex.value = Math.min(last, activeIndex.value + 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      activeIndex.value = Math.max(0, activeIndex.value - 1)
      break
    case 'Home':
      event.preventDefault()
      activeIndex.value = 0
      break
    case 'End':
      event.preventDefault()
      activeIndex.value = last
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      choose(activeIndex.value)
      break
    case 'Escape':
      event.preventDefault()
      close()
      break
    case 'Tab':
      close(false)
      break
  }
}

function onOutsideClick(event: MouseEvent) {
  if (isOpen.value && root.value && !root.value.contains(event.target as Node)) close(false)
}

onMounted(() => document.addEventListener('mousedown', onOutsideClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', onOutsideClick))
</script>

<template>
  <div ref="root" class="relative">
    <span v-if="label" :id="`${id}-label`" class="field-label">{{ label }}</span>

    <button
      :id="id"
      ref="trigger"
      type="button"
      class="flex h-11 w-full items-center justify-between gap-3 rounded-sm border bg-surface-200 px-3.5 text-left font-sans text-[15px] text-ink shadow-sm transition-all hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
      :class="isOpen ? 'border-brand ring-2 ring-brand/20' : 'border-border-strong'"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-labelledby="label ? `${id}-label ${id}` : undefined"
      :aria-controls="`${id}-list`"
      @click="isOpen ? close() : open()"
      @keydown="onKeydown"
    >
      <span class="flex min-w-0 items-baseline gap-2">
        <span class="truncate font-semibold">{{ selected?.label }}</span>
        <span v-if="selected?.hint" class="truncate text-[13px] text-ink-muted">{{ selected.hint }}</span>
      </span>
      <ChevronDown
        :size="18"
        :stroke-width="1.8"
        class="flex-shrink-0 text-ink-muted transition-transform duration-150"
        :class="{ 'rotate-180 text-brand': isOpen }"
      />
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="-translate-y-1 opacity-0"
      leave-active-class="transition duration-75 ease-in"
      leave-to-class="-translate-y-1 opacity-0"
    >
      <ul
        v-if="isOpen"
        :id="`${id}-list`"
        role="listbox"
        tabindex="-1"
        class="absolute left-0 right-0 z-20 m-0 mt-1.5 list-none rounded-md border border-border bg-surface-200 p-1.5 shadow-md"
        :aria-labelledby="label ? `${id}-label` : undefined"
        :aria-activedescendant="optionId(activeIndex)"
      >
        <li
          v-for="(option, index) in options"
          :id="optionId(index)"
          :key="option.value"
          role="option"
          class="flex cursor-pointer items-center justify-between gap-3 rounded-sm px-3 py-2.5 font-sans text-[15px] transition-colors"
          :class="[
            option.value === modelValue ? 'font-semibold text-brand' : 'text-ink',
            index === activeIndex ? (option.value === modelValue ? 'bg-brand-tint' : 'bg-surface-300') : '',
          ]"
          :aria-selected="option.value === modelValue"
          @mouseenter="activeIndex = index"
          @click="choose(index)"
        >
          <span class="flex min-w-0 flex-col">
            <span class="truncate">{{ option.label }}</span>
            <span v-if="option.hint" class="truncate text-[13px] font-normal text-ink-muted">{{ option.hint }}</span>
          </span>
          <Check v-if="option.value === modelValue" :size="16" :stroke-width="2.2" class="flex-shrink-0" />
        </li>
      </ul>
    </Transition>
  </div>
</template>
