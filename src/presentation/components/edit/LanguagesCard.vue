<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'

import { useResumeStore } from '@/application/stores/resume.store'
import SelectField from '@/presentation/components/edit/SelectField.vue'

const resumeStore = useResumeStore()

const LANGUAGE_OPTIONS = [
  'English',
  'Khmer',
  'Chinese (Mandarin)',
  'Cantonese',
  'French',
  'Spanish',
  'German',
  'Japanese',
  'Korean',
  'Thai',
  'Vietnamese',
  'Hindi',
  'Arabic',
  'Portuguese',
  'Russian',
  'Italian',
  'Indonesian',
  'Malay',
  'Tagalog',
]

const LEVEL_OPTIONS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic']
</script>

<template>
  <section id="languages" class="card">
    <div class="flex items-center justify-between">
      <h2 class="heading-sm">Languages</h2>
      <button type="button" class="smallbtn" @click="resumeStore.addLanguage()">
        <Plus :size="14" :stroke-width="1.5" />
        Add language
      </button>
    </div>

    <div
      v-for="entry in resumeStore.resume.languages"
      :key="entry.id"
      class="relative mt-4 box-border rounded-md border border-border bg-surface-100 p-4"
    >
      <button
        type="button"
        class="iconbtn absolute right-3 top-3"
        aria-label="Remove this language"
        @click="resumeStore.removeLanguage(entry.id)"
      >
        <Trash2 :size="16" :stroke-width="1.5" />
      </button>
      <div class="grid grid-cols-1 gap-3 pr-10 sm:grid-cols-2">
        <div>
          <label class="field-label">Language</label>
          <SelectField
            :model-value="entry.name"
            :options="LANGUAGE_OPTIONS"
            placeholder="Select a language"
            @update:model-value="resumeStore.updateLanguage(entry.id, { name: $event })"
          />
        </div>
        <div>
          <label class="field-label">Level</label>
          <SelectField
            :model-value="entry.level"
            :options="LEVEL_OPTIONS"
            placeholder="Select a level"
            @update:model-value="resumeStore.updateLanguage(entry.id, { level: $event })"
          />
        </div>
      </div>
    </div>

    <p v-if="!resumeStore.resume.languages.length" class="mt-4 font-sans text-sm text-ink-muted">
      No languages yet — add one if it's relevant to the role.
    </p>
  </section>
</template>
