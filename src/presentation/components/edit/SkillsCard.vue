<script setup lang="ts">
import { Plus, X } from '@lucide/vue'
import { ref } from 'vue'

import { useResumeStore } from '@/application/stores/resume.store'

const resumeStore = useResumeStore()
const isAdding = ref(false)
const draft = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function startAdding() {
  isAdding.value = true
  draft.value = ''
  requestAnimationFrame(() => inputRef.value?.focus())
}

function commit() {
  resumeStore.addSkill(draft.value)
  draft.value = ''
  isAdding.value = false
}
</script>

<template>
  <section id="skills" class="card">
    <h2 class="heading-sm">Skills</h2>
    <div class="mt-4 flex flex-wrap gap-2">
      <span
        v-for="skill in resumeStore.resume.skills"
        :key="skill"
        class="inline-flex items-center gap-1.5 rounded-full bg-surface-300 px-3 py-1.5 font-sans text-[13px] text-ink"
      >
        {{ skill }}
        <button type="button" class="flex border-none bg-transparent p-0 text-ink-muted" aria-label="Remove skill" @click="resumeStore.removeSkill(skill)">
          <X :size="12" :stroke-width="1.5" />
        </button>
      </span>

      <input
        v-if="isAdding"
        ref="inputRef"
        v-model="draft"
        class="h-8 w-40 rounded-full border border-border-strong bg-surface-300 px-3 font-sans text-[13px] text-ink"
        type="text"
        placeholder="Type a skill and press Enter"
        @keydown.enter.prevent="commit"
        @blur="commit"
      />
      <button
        v-else
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border-strong bg-transparent px-3 py-1.5 font-sans text-[13px] font-semibold text-ink-muted"
        @click="startAdding"
      >
        <Plus :size="12" :stroke-width="1.5" />
        Add skill
      </button>
    </div>
  </section>
</template>
