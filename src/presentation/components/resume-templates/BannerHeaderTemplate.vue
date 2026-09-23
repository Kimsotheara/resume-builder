<script setup lang="ts">
import { Globe, Mail, MapPin, Phone } from '@lucide/vue'
import { computed } from 'vue'

import { resolveFontStack } from '@/application/templates/templateFonts'
import type { ResumeData, TemplateTheme } from '@/domain/resume.types'

const props = defineProps<{
  resume: ResumeData
  theme: TemplateTheme
}>()

const fontStack = computed(() => resolveFontStack(props.theme.fontFamily))
const initials = computed(() => {
  const name = props.resume.personalInfo.fullName.trim()
  if (!name) return '–'
  const parts = name.split(/\s+/)
  return (parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')
})
const hasContactRow = computed(
  () =>
    props.resume.personalInfo.phone ||
    props.resume.personalInfo.email ||
    props.resume.personalInfo.location ||
    props.resume.personalInfo.website,
)
</script>

<template>
  <div class="box-border w-[794px] min-h-[1120px] bg-white text-[#111827]" :style="{ fontFamily: fontStack }">
    <header
      class="box-border flex items-center gap-5 px-14 py-9 text-white"
      :style="{ background: theme.accentColor }"
    >
      <img
        v-if="resume.personalInfo.photo"
        :src="resume.personalInfo.photo"
        alt=""
        class="h-[76px] w-[76px] flex-shrink-0 rounded-full border-2 border-white/40 object-cover"
      />
      <div
        v-else
        class="flex h-[76px] w-[76px] flex-shrink-0 items-center justify-center rounded-full border-2 border-white/40 bg-white/15 text-[22px] font-bold text-white"
      >
        {{ initials.toUpperCase() }}
      </div>
      <div>
        <h1 class="m-0 text-[28px] font-extrabold">{{ resume.personalInfo.fullName || 'Your Name' }}</h1>
        <div class="mt-1 text-[13px] font-medium uppercase tracking-[0.8px] opacity-90">
          {{ resume.personalInfo.title }}
        </div>
      </div>
    </header>

    <div
      v-if="hasContactRow"
      class="box-border flex flex-wrap gap-x-6 gap-y-1.5 border-b border-[#e5e7eb] px-14 py-3.5 text-[11px] text-[#4b5563]"
    >
      <span v-if="resume.personalInfo.phone" class="inline-flex items-center gap-1.5">
        <Phone :size="12" :stroke-width="1.75" :style="{ color: theme.accentColor }" />{{ resume.personalInfo.phone }}
      </span>
      <span v-if="resume.personalInfo.email" class="inline-flex items-center gap-1.5">
        <Mail :size="12" :stroke-width="1.75" :style="{ color: theme.accentColor }" />{{ resume.personalInfo.email }}
      </span>
      <span v-if="resume.personalInfo.location" class="inline-flex items-center gap-1.5">
        <MapPin :size="12" :stroke-width="1.75" :style="{ color: theme.accentColor }" />{{
          resume.personalInfo.location
        }}
      </span>
      <span v-if="resume.personalInfo.website" class="inline-flex items-center gap-1.5">
        <Globe :size="12" :stroke-width="1.75" :style="{ color: theme.accentColor }" />{{
          resume.personalInfo.website
        }}
      </span>
    </div>

    <div class="box-border flex gap-8 px-14 py-8">
      <aside class="w-[210px] flex-shrink-0">
        <template v-if="resume.education.length">
          <h2 class="m-0 text-xs font-bold uppercase tracking-[0.8px]" :style="{ color: theme.accentColor }">
            Education
          </h2>
          <div v-for="entry in resume.education" :key="entry.id" class="mt-2.5">
            <div class="text-[12px] font-bold text-[#111827]">{{ entry.school }}</div>
            <div class="mt-0.5 text-[11px] text-[#6b7280]">{{ entry.degree }}</div>
            <div class="mt-0.5 text-[10px] text-[#9ca3af]">{{ entry.dates }}</div>
          </div>
        </template>

        <template v-if="resume.skills.length">
          <h2
            class="mt-6 text-xs font-bold uppercase tracking-[0.8px] first:mt-0"
            :style="{ color: theme.accentColor }"
          >
            Skills
          </h2>
          <ul class="mt-2.5 list-disc space-y-1.5 pl-4 text-[12px] leading-[17px] text-[#374151]">
            <li v-for="skill in resume.skills" :key="skill">{{ skill }}</li>
          </ul>
        </template>

        <template v-if="resume.languages.length">
          <h2
            class="mt-6 text-xs font-bold uppercase tracking-[0.8px] first:mt-0"
            :style="{ color: theme.accentColor }"
          >
            Languages
          </h2>
          <div class="mt-2.5 flex flex-col gap-1.5 text-[12px] text-[#374151]">
            <div v-for="lang in resume.languages" :key="lang.id" class="flex items-baseline justify-between gap-2">
              <span>{{ lang.name }}</span>
              <span v-if="lang.level" class="text-[10px] text-[#9ca3af]">{{ lang.level }}</span>
            </div>
          </div>
        </template>
      </aside>

      <main class="min-w-0 flex-1">
        <template v-if="resume.summary">
          <h2 class="m-0 text-xs font-bold uppercase tracking-[0.8px]" :style="{ color: theme.accentColor }">
            Profile
          </h2>
          <p class="mt-2.5 text-[13px] leading-5 text-[#374151]">{{ resume.summary }}</p>
        </template>

        <template v-if="resume.experience.length">
          <h2
            class="mt-6 text-xs font-bold uppercase tracking-[0.8px] first:mt-0"
            :style="{ color: theme.accentColor }"
          >
            Experience
          </h2>
          <div v-for="entry in resume.experience" :key="entry.id" class="mt-3.5">
            <div class="flex items-baseline justify-between gap-3">
              <span class="text-sm font-bold text-[#111827]"
                >{{ entry.role }}<template v-if="entry.role && entry.company"> — </template>{{ entry.company }}</span
              >
              <span class="whitespace-nowrap text-[11px] text-[#6b7280]">{{ entry.dates }}</span>
            </div>
            <ul class="mt-1.5 list-disc pl-4 text-[13px] leading-5 text-[#374151]">
              <li v-for="(highlight, i) in entry.highlights.filter(Boolean)" :key="i">{{ highlight }}</li>
            </ul>
          </div>
        </template>

        <template v-if="resume.references.length">
          <h2
            class="mt-6 text-xs font-bold uppercase tracking-[0.8px] first:mt-0"
            :style="{ color: theme.accentColor }"
          >
            References
          </h2>
          <div class="mt-2.5 grid grid-cols-2 gap-x-6 gap-y-3">
            <div v-for="entry in resume.references" :key="entry.id">
              <div class="text-[12px] font-bold text-[#111827]">
                {{ entry.name }}
                <span v-if="entry.relation" class="ml-1 text-[10px] font-normal text-[#9ca3af]">({{ entry.relation }})</span>
              </div>
              <div class="text-[11px] text-[#6b7280]">{{ [entry.title, entry.company].filter(Boolean).join(' · ') }}</div>
              <div class="mt-0.5 text-[11px] text-[#6b7280]">
                {{ [entry.phone, entry.email].filter(Boolean).join('  ·  ') }}
              </div>
            </div>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>
