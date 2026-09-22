<script setup lang="ts">
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
const chipBg = computed(() => props.theme.secondaryColor ?? props.theme.accentColor)
</script>

<template>
  <div class="box-border flex w-[794px] min-h-[1120px] bg-white text-[#111827]" :style="{ fontFamily: fontStack }">
    <aside class="box-border w-[260px] flex-shrink-0 px-[30px] py-10 text-[#e5e7eb]" :style="{ background: theme.accentColor }">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-full text-[20px] font-bold text-[#f1f3f6]"
        :style="{ background: chipBg }"
      >
        {{ initials.toUpperCase() }}
      </div>
      <div class="mt-[18px] text-[19px] font-bold text-white">{{ resume.personalInfo.fullName || 'Your Name' }}</div>
      <div class="mt-1 text-xs text-[#cbd3df]">{{ resume.personalInfo.title }}</div>
      <div class="my-5 h-px bg-[rgba(255,255,255,0.16)]" />

      <div class="text-[10px] font-bold uppercase tracking-[0.6px] text-[#b7c0cd]">Contact</div>
      <div class="mt-2.5 text-[11px] leading-[18px] text-[#d1d5db]">
        <div v-if="resume.personalInfo.email">{{ resume.personalInfo.email }}</div>
        <div v-if="resume.personalInfo.phone">{{ resume.personalInfo.phone }}</div>
        <div v-if="resume.personalInfo.location">{{ resume.personalInfo.location }}</div>
        <div v-if="resume.personalInfo.website">{{ resume.personalInfo.website }}</div>
      </div>

      <template v-if="resume.skills.length">
        <div class="my-5 h-px bg-[rgba(255,255,255,0.16)]" />
        <div class="text-[10px] font-bold uppercase tracking-[0.6px] text-[#b7c0cd]">Skills</div>
        <div class="mt-2.5 flex flex-wrap gap-1.5">
          <span
            v-for="skill in resume.skills"
            :key="skill"
            class="rounded-full px-2 py-1 text-[10px] text-white"
            :style="{ background: chipBg }"
          >
            {{ skill }}
          </span>
        </div>
      </template>

      <template v-if="resume.education.length">
        <div class="my-5 h-px bg-[rgba(255,255,255,0.16)]" />
        <div class="text-[10px] font-bold uppercase tracking-[0.6px] text-[#b7c0cd]">Education</div>
        <div v-for="entry in resume.education" :key="entry.id" class="mt-2.5">
          <div class="text-xs font-bold text-white">{{ entry.school }}</div>
          <div class="mt-0.5 text-[11px] text-[#d1d5db]">{{ entry.degree }}</div>
          <div class="mt-0.5 text-[10px] text-[#9aa4b2]">{{ entry.dates }}</div>
        </div>
      </template>
    </aside>

    <main class="box-border flex-1 px-9 py-10">
      <template v-if="resume.summary">
        <h2 class="m-0 text-xs font-bold uppercase tracking-[0.6px] text-[#1f2937]">Summary</h2>
        <p class="mt-2.5 text-[13px] leading-5 text-[#374151]">{{ resume.summary }}</p>
      </template>

      <template v-if="resume.experience.length">
        <h2 class="m-0 mt-6 text-xs font-bold uppercase tracking-[0.6px] text-[#1f2937]">Experience</h2>
        <div v-for="entry in resume.experience" :key="entry.id" class="mt-4 first:mt-2.5">
          <div class="flex items-baseline justify-between gap-3">
            <span class="text-sm font-bold text-[#111827]"
              >{{ entry.company }}<template v-if="entry.company && entry.role"> — </template>{{ entry.role }}</span
            >
            <span class="whitespace-nowrap text-[11px] text-[#6b7280]">{{ entry.dates }}</span>
          </div>
          <ul class="mt-1.5 list-disc pl-4 text-[13px] leading-5 text-[#374151]">
            <li v-for="(highlight, i) in entry.highlights.filter(Boolean)" :key="i">{{ highlight }}</li>
          </ul>
        </div>
      </template>
    </main>
  </div>
</template>
