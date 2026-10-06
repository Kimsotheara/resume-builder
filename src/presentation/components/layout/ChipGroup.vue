<script setup lang="ts" generic="T extends string">
defineProps<{
  options: Array<{ value: T; label: string }>
  modelValue: T
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2" role="radiogroup" :aria-label="label">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="radio"
      class="chip"
      :class="{ 'chip-on': modelValue === option.value }"
      :aria-checked="modelValue === option.value"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
