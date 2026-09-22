<script setup lang="ts">
import { useResumeStore } from '@/application/stores/resume.store'

const resumeStore = useResumeStore()
</script>

<template>
  <section id="personal-info" class="card">
    <h2 class="heading-sm">Personal info</h2>
    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label for="f-name" class="field-label">Full name</label>
        <input
          id="f-name"
          class="field"
          type="text"
          :value="resumeStore.resume.personalInfo.fullName"
          @input="resumeStore.updatePersonalInfo({ fullName: ($event.target as HTMLInputElement).value })"
        />
      </div>
      <div>
        <label for="f-title" class="field-label">Title</label>
        <input
          id="f-title"
          class="field"
          type="text"
          :value="resumeStore.resume.personalInfo.title"
          @input="resumeStore.updatePersonalInfo({ title: ($event.target as HTMLInputElement).value })"
        />
      </div>
      <div>
        <label for="f-email" class="field-label">Email</label>
        <input
          id="f-email"
          class="field"
          type="email"
          :value="resumeStore.resume.personalInfo.email"
          @input="resumeStore.updatePersonalInfo({ email: ($event.target as HTMLInputElement).value })"
        />
      </div>
      <div>
        <label for="f-phone" class="field-label">Phone</label>
        <input
          id="f-phone"
          class="field"
          type="tel"
          :value="resumeStore.resume.personalInfo.phone"
          @input="resumeStore.updatePersonalInfo({ phone: ($event.target as HTMLInputElement).value })"
        />
      </div>
      <div>
        <label for="f-loc" class="field-label">Location</label>
        <input
          id="f-loc"
          class="field"
          type="text"
          :value="resumeStore.resume.personalInfo.location"
          @input="resumeStore.updatePersonalInfo({ location: ($event.target as HTMLInputElement).value })"
        />
      </div>
      <div>
        <label for="f-web" class="field-label">Website / LinkedIn</label>
        <input
          id="f-web"
          class="field"
          type="text"
          :value="resumeStore.resume.personalInfo.website"
          @input="resumeStore.updatePersonalInfo({ website: ($event.target as HTMLInputElement).value })"
        />
      </div>
    </div>
  </section>
</template>
