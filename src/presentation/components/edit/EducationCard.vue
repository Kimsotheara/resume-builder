<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'

import { useResumeStore } from '@/application/stores/resume.store'

const resumeStore = useResumeStore()
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
      <div class="grid grid-cols-1 gap-3 pr-10 sm:grid-cols-[1.6fr_1.4fr_1fr]">
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
          <input
            class="field"
            type="text"
            :value="entry.degree"
            @input="resumeStore.updateEducation(entry.id, { degree: ($event.target as HTMLInputElement).value })"
          />
        </div>
        <div>
          <label class="field-label">Dates</label>
          <input
            class="field"
            type="text"
            placeholder="2015 – 2019"
            :value="entry.dates"
            @input="resumeStore.updateEducation(entry.id, { dates: ($event.target as HTMLInputElement).value })"
          />
        </div>
      </div>
    </div>

    <p v-if="!resumeStore.resume.education.length" class="mt-4 font-sans text-sm text-ink-muted">
      No schools yet — add your first one.
    </p>
  </section>
</template>
