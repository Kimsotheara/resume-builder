<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'

import { useResumeStore } from '@/application/stores/resume.store'
import DateRangeField from '@/presentation/components/edit/DateRangeField.vue'
import SelectField from '@/presentation/components/edit/SelectField.vue'

const resumeStore = useResumeStore()

const DEGREE_OPTIONS = [
  'High School',
  'Secondary School',
  'Primary School',
  'Vocational Certificate',
  'Diploma',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate (PhD)',
  'Postgraduate Diploma',
  'Professional Certification',
]
</script>

<template>
  <section id="education" class="card">
    <div class="flex items-center justify-between">
      <h2 class="heading-sm">Education</h2>
      <button type="button" class="smallbtn" @click="resumeStore.addEducation()">
        <Plus :size="14" :stroke-width="1.5" />
        Add school
      </button>
    </div>

    <div
      v-for="entry in resumeStore.resume.education"
      :key="entry.id"
      class="relative mt-4 box-border rounded-md border border-border bg-surface-100 p-4"
    >
      <button
        type="button"
        class="iconbtn absolute right-3 top-3"
        aria-label="Remove this school"
        @click="resumeStore.removeEducation(entry.id)"
      >
        <Trash2 :size="16" :stroke-width="1.5" />
      </button>
      <div class="grid grid-cols-1 gap-3 pr-10 sm:grid-cols-2">
        <div>
          <label class="field-label">School</label>
          <input
            class="field"
            type="text"
            :value="entry.school"
            @input="resumeStore.updateEducation(entry.id, { school: ($event.target as HTMLInputElement).value })"
          />
        </div>
        <div>
          <label class="field-label">Degree</label>
          <SelectField
            :model-value="entry.degree"
            :options="DEGREE_OPTIONS"
            placeholder="Select a degree"
            @update:model-value="resumeStore.updateEducation(entry.id, { degree: $event })"
          />
        </div>
      </div>

      <div class="mt-3 pr-10">
        <label class="field-label">Dates</label>
        <DateRangeField :dates="entry.dates" @update:dates="resumeStore.updateEducation(entry.id, { dates: $event })" />
      </div>
    </div>

    <p v-if="!resumeStore.resume.education.length" class="mt-4 font-sans text-sm text-ink-muted">
      No schools yet — add your first one.
    </p>
  </section>
</template>
