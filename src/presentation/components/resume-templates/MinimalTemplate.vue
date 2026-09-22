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
    class="box-border w-[794px] min-h-[1120px] bg-white px-16 py-14 text-[#14171c]"
    :style="{ fontFamily: fontStack }"
  >
    <h1 class="m-0 text-[28px] font-bold tracking-[-0.3px] text-[#14171c]">
      {{ resume.personalInfo.fullName || 'Your Name' }}
    </h1>
    <div class="mt-1 text-[13px] uppercase tracking-[1px] text-[#8a8f98]">{{ resume.personalInfo.title }}</div>
    <div class="mt-2 text-xs text-[#6b7280]">
      {{
        [
          resume.personalInfo.email,
          resume.personalInfo.phone,
          resume.personalInfo.location,
          resume.personalInfo.website,
        ]
          .filter(Boolean)
          .join('  ·  ')
      }}
    </div>
    <div class="mt-[18px] h-[3px] w-12" :style="{ background: theme.accentColor }" />

    <template v-if="resume.summary">
      <h2 class="mt-7 text-xs font-bold uppercase tracking-[0.8px]" :style="{ color: theme.accentColor }">
        Summary
      </h2>
      <p class="mt-2.5 text-[13px] leading-[21px] text-[#374151]">{{ resume.summary }}</p>
    </template>

    <template v-if="resume.experience.length">
      <h2 class="mt-7 text-xs font-bold uppercase tracking-[0.8px]" :style="{ color: theme.accentColor }">
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

    <template v-if="resume.education.length">
      <h2 class="mt-7 text-xs font-bold uppercase tracking-[0.8px]" :style="{ color: theme.accentColor }">
        Education
      </h2>
      <div v-for="entry in resume.education" :key="entry.id" class="flex items-baseline justify-between gap-3">
        <span class="text-sm font-bold text-[#111827]"
          >{{ entry.school }}<template v-if="entry.school && entry.degree"> — </template>{{ entry.degree }}</span
        >
        <span class="whitespace-nowrap text-[11px] text-[#6b7280]">{{ entry.dates }}</span>
      </div>
    </template>

    <template v-if="resume.skills.length">
      <h2 class="mt-7 text-xs font-bold uppercase tracking-[0.8px]" :style="{ color: theme.accentColor }">
        Skills
      </h2>
      <div class="mt-2 text-[13px] text-[#374151]">{{ resume.skills.join('  ·  ') }}</div>
    </template>
  </div>
</template>
