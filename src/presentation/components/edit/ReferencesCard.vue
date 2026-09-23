<script setup lang="ts">
import { Plus, Trash2 } from '@lucide/vue'

import { useResumeStore } from '@/application/stores/resume.store'

const resumeStore = useResumeStore()
</script>

<template>
  <section id="references" class="card">
    <div class="flex items-center justify-between">
      <h2 class="heading-sm">References</h2>
      <button type="button" class="smallbtn" @click="resumeStore.addReference()">
        <Plus :size="14" :stroke-width="1.5" />
        Add reference
      </button>
    </div>

    <div
      v-for="entry in resumeStore.resume.references"
      :key="entry.id"
      class="relative mt-4 box-border rounded-md border border-border bg-surface-100 p-4"
    >
      <button
        type="button"
        class="iconbtn absolute right-3 top-3"
        aria-label="Remove this reference"
        @click="resumeStore.removeReference(entry.id)"
      >
        <Trash2 :size="16" :stroke-width="1.5" />
      </button>
      <div class="grid grid-cols-1 gap-3 pr-10 sm:grid-cols-2">
        <div>
          <label class="field-label">Name</label>
          <input
            class="field"
            type="text"
            :value="entry.name"
            @input="resumeStore.updateReference(entry.id, { name: ($event.target as HTMLInputElement).value })"
          />
        </div>
        <div>
          <label class="field-label">Title</label>
          <input
            class="field"
            type="text"
            :value="entry.title"
            @input="resumeStore.updateReference(entry.id, { title: ($event.target as HTMLInputElement).value })"
          />
        </div>
        <div>
          <label class="field-label">Company</label>
          <input
            class="field"
            type="text"
            :value="entry.company"
            @input="resumeStore.updateReference(entry.id, { company: ($event.target as HTMLInputElement).value })"
          />
        </div>
        <div>
          <label class="field-label">Relationship</label>
          <input
            class="field"
            type="text"
            placeholder="e.g. Manager, Teacher"
            :value="entry.relation"
            @input="resumeStore.updateReference(entry.id, { relation: ($event.target as HTMLInputElement).value })"
          />
        </div>
        <div>
          <label class="field-label">Phone</label>
          <input
            class="field"
            type="tel"
            :value="entry.phone"
            @input="resumeStore.updateReference(entry.id, { phone: ($event.target as HTMLInputElement).value })"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="field-label">Email</label>
          <input
            class="field"
            type="email"
            :value="entry.email"
            @input="resumeStore.updateReference(entry.id, { email: ($event.target as HTMLInputElement).value })"
          />
        </div>
      </div>
    </div>

    <p v-if="!resumeStore.resume.references.length" class="mt-4 font-sans text-sm text-ink-muted">
      No references yet — add one if your target role expects them.
    </p>
  </section>
</template>
