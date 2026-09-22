<script setup lang="ts">
import { Plus, Trash2, X } from '@lucide/vue'

import { useResumeStore } from '@/application/stores/resume.store'

const resumeStore = useResumeStore()
</script>

<template>
  <section id="experience" class="card">
    <div class="flex items-center justify-between">
      <h2 class="heading-sm">Experience</h2>
      <button type="button" class="smallbtn" @click="resumeStore.addExperience()">
        <Plus :size="14" :stroke-width="1.5" />
        Add role
      </button>
    </div>

    <div
      v-for="entry in resumeStore.resume.experience"
      :key="entry.id"
      class="relative mt-4 box-border rounded-md border border-border bg-surface-100 p-4"
    >
      <button
        type="button"
        class="iconbtn absolute right-3 top-3"
        aria-label="Remove this role"
        @click="resumeStore.removeExperience(entry.id)"
      >
        <Trash2 :size="16" :stroke-width="1.5" />
      </button>

      <div class="grid grid-cols-1 gap-3 pr-10 sm:grid-cols-[1.4fr_1.2fr_1fr]">
        <div>
          <label class="field-label">Company</label>
          <input
            class="field"
            type="text"
            :value="entry.company"
            @input="resumeStore.updateExperience(entry.id, { company: ($event.target as HTMLInputElement).value })"
          />
        </div>
        <div>
          <label class="field-label">Role</label>
          <input
            class="field"
            type="text"
            :value="entry.role"
            @input="resumeStore.updateExperience(entry.id, { role: ($event.target as HTMLInputElement).value })"
          />
        </div>
        <div>
          <label class="field-label">Dates</label>
          <input
            class="field"
            type="text"
            placeholder="Jan 2022 – Present"
            :value="entry.dates"
            @input="resumeStore.updateExperience(entry.id, { dates: ($event.target as HTMLInputElement).value })"
          />
        </div>
      </div>

      <div class="mt-3">
        <label class="field-label">Highlights</label>
        <div v-for="(highlight, index) in entry.highlights" :key="index" class="mt-1.5 flex items-start gap-2">
          <span class="leading-[22px] text-ink-muted">•</span>
          <input
            class="field h-9"
            type="text"
            :value="highlight"
            @input="resumeStore.updateHighlight(entry.id, index, ($event.target as HTMLInputElement).value)"
          />
          <button
            type="button"
            class="iconbtn h-9 w-9"
            aria-label="Remove highlight"
            @click="resumeStore.removeHighlight(entry.id, index)"
          >
            <X :size="14" :stroke-width="1.5" />
          </button>
        </div>
        <a
          href="#"
          class="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:text-brand-hover"
          @click.prevent="resumeStore.addHighlight(entry.id)"
        >
          <Plus :size="12" :stroke-width="1.5" />
          Add highlight
        </a>
      </div>
    </div>

    <p v-if="!resumeStore.resume.experience.length" class="mt-4 font-sans text-sm text-ink-muted">
      No roles yet — add your first one.
    </p>
  </section>
</template>
