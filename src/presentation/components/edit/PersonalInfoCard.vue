<script setup lang="ts">
import { Trash2, Upload } from '@lucide/vue'
import { ref } from 'vue'

import { useResumeStore } from '@/application/stores/resume.store'

const resumeStore = useResumeStore()
const fileInput = ref<HTMLInputElement | null>(null)
const isReadingPhoto = ref(false)

const MAX_PHOTO_DIMENSION = 480

function readFileAsImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => resolve(img)
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

/** Downscales the upload to keep the autosaved localStorage draft small. */
function toResizedDataUrl(img: HTMLImageElement): string {
  const scale = Math.min(1, MAX_PHOTO_DIMENSION / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return img.src
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.85)
}

async function onPhotoSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  isReadingPhoto.value = true
  try {
    const img = await readFileAsImage(file)
    resumeStore.updatePersonalInfo({ photo: toResizedDataUrl(img) })
  } catch {
    // Unreadable image file — leave the existing photo (if any) untouched.
  } finally {
    isReadingPhoto.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function removePhoto() {
  resumeStore.updatePersonalInfo({ photo: '' })
}
</script>

<template>
  <section id="personal-info" class="card">
    <h2 class="heading-sm">Personal info</h2>

    <div class="mt-4 flex items-center gap-4">
      <div class="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-300">
        <img
          v-if="resumeStore.resume.personalInfo.photo"
          :src="resumeStore.resume.personalInfo.photo"
          alt="Profile photo"
          class="h-full w-full object-cover"
        />
        <Upload v-else :size="18" :stroke-width="1.5" class="text-ink-muted" />
      </div>
      <div class="flex flex-col gap-1">
        <span class="field-label mb-0">Photo</span>
        <div class="flex items-center gap-2">
          <button type="button" class="smallbtn" :disabled="isReadingPhoto" @click="fileInput?.click()">
            <Upload :size="14" :stroke-width="1.5" />
            {{ isReadingPhoto ? 'Uploading…' : resumeStore.resume.personalInfo.photo ? 'Replace' : 'Upload' }}
          </button>
          <button
            v-if="resumeStore.resume.personalInfo.photo"
            type="button"
            class="smallbtn"
            @click="removePhoto"
          >
            <Trash2 :size="14" :stroke-width="1.5" />
            Remove
          </button>
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onPhotoSelected" />
      </div>
    </div>

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
