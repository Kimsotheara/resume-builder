<script setup lang="ts">
import { computed } from 'vue'

import { resolveFontStack } from '@/application/templates/templateFonts'
import type { ResumeData, TemplateTheme } from '@/domain/resume.types'

const props = defineProps<{
  resume: ResumeData
  theme: TemplateTheme
}>()

const fontStack = computed(() => resolveFontStack(props.theme.fontFamily))
</script>

<template>
  <div
    class="box-border w-[794px] min-h-[1120px] bg-white px-16 py-14 text-[#111111]"
    :style="{ fontFamily: fontStack }"
  >
    <h1 class="m-0 text-xl font-bold">{{ (resume.personalInfo.fullName || 'Your Name').toUpperCase() }}</h1>
    <div class="mt-1.5 text-xs text-[#555555]">
      {{
        [
          resume.personalInfo.email,
          resume.personalInfo.phone,
          resume.personalInfo.location,
          resume.personalInfo.website,
        ]
          .filter(Boolean)
          .join(' · ')
      }}
    </div>
    <div class="mt-4 h-px bg-[#111111]" />

    <template v-if="resume.summary">
      <h2 class="mt-5 text-xs font-bold tracking-[0.4px]" :style="{ color: theme.accentColor }">SUMMARY</h2>
      <p class="mt-2.5 text-[13px] leading-5 text-[#222222]">{{ resume.summary }}</p>
    </template>

    <template v-if="resume.experience.length">
      <h2 class="mt-5 text-xs font-bold tracking-[0.4px]" :style="{ color: theme.accentColor }">EXPERIENCE</h2>
      <div v-for="entry in resume.experience" :key="entry.id" class="mt-3">
        <div class="flex items-baseline justify-between gap-3">
          <span class="text-[13px] font-bold"
            >{{ entry.company }}<template v-if="entry.company && entry.role"> — </template>{{ entry.role }}</span
          >
          <span class="whitespace-nowrap text-[11px] text-[#555555]">{{ entry.dates }}</span>
        </div>
        <ul class="mt-1.5 list-none pl-0 text-[13px] leading-[19px] text-[#222222]">
          <li v-for="(highlight, i) in entry.highlights.filter(Boolean)" :key="i">- {{ highlight }}</li>
        </ul>
      </div>
    </template>

    <template v-if="resume.education.length">
      <h2 class="mt-5 text-xs font-bold tracking-[0.4px]" :style="{ color: theme.accentColor }">EDUCATION</h2>
      <div v-for="entry in resume.education" :key="entry.id" class="mt-2.5 flex items-baseline justify-between gap-3">
        <span class="text-[13px] font-bold"
          >{{ entry.school }}<template v-if="entry.school && entry.degree"> — </template>{{ entry.degree }}</span
        >
        <span class="whitespace-nowrap text-[11px] text-[#555555]">{{ entry.dates }}</span>
      </div>
    </template>

    <template v-if="resume.skills.length">
      <h2 class="mt-5 text-xs font-bold tracking-[0.4px]" :style="{ color: theme.accentColor }">SKILLS</h2>
      <div class="mt-2 text-[13px] text-[#222222]">{{ resume.skills.join(', ') }}</div>
    </template>
  </div>
</template>
