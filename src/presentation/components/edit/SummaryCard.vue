<script setup lang="ts">
import { useResumeStore } from '@/application/stores/resume.store'

const resumeStore = useResumeStore()
</script>

<template>
  <section id="summary" class="card">
    <h2 class="heading-sm">Summary</h2>
    <div class="mt-4">
      <label for="f-summary" class="field-label">A few sentences about you</label>
      <textarea
        id="f-summary"
        class="area"
        rows="3"
        :value="resumeStore.resume.summary"
        @input="resumeStore.updateSummary(($event.target as HTMLTextAreaElement).value)"
      />
    </div>
  </section>
</template>
