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
    class="box-border w-[794px] min-h-[1120px] bg-[#fffdfa] px-16 py-14 text-[#2c241b]"
    :style="{ fontFamily: fontStack }"
  >
    <h1 class="m-0 text-[26px] font-bold">{{ resume.personalInfo.fullName || 'Your Name' }}</h1>
    <div class="mt-1 text-[13px] text-[#6b5f4f]">{{ resume.personalInfo.title }}</div>
    <div class="mt-2 text-xs text-[#857a68]">
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

    <template v-if="resume.summary">
      <h2 class="mt-7 text-xs font-bold uppercase tracking-[0.8px] text-[#4a4030]">Summary</h2>
      <p class="mt-3 text-[13px] leading-[21px] text-[#4a4030]">{{ resume.summary }}</p>
    </template>

    <template v-if="resume.experience.length">
      <h2 class="mt-7 text-xs font-bold uppercase tracking-[0.8px] text-[#4a4030]">Experience</h2>
      <div class="mt-3">
        <div v-for="entry in resume.experience" :key="entry.id" class="relative pb-5 pl-[22px] last:pb-0">
          <span class="absolute left-0 top-1 h-[9px] w-[9px] rounded-full" :style="{ background: theme.accentColor }" />
          <div class="absolute bottom-[-2px] left-1 top-3.5 w-px bg-[#e7ded0] last:hidden" />
          <div class="flex items-baseline justify-between gap-3">
            <span class="text-sm font-bold"
              >{{ entry.role }}<template v-if="entry.role && entry.company"> — </template>{{ entry.company }}</span
            >
            <span class="whitespace-nowrap text-[11px] text-[#857a68]">{{ entry.dates }}</span>
          </div>
          <ul class="mt-1.5 list-disc pl-4 text-[13px] leading-5 text-[#4a4030]">
            <li v-for="(highlight, i) in entry.highlights.filter(Boolean)" :key="i">{{ highlight }}</li>
          </ul>
        </div>
      </div>
    </template>

    <template v-if="resume.education.length">
      <h2 class="mt-7 text-xs font-bold uppercase tracking-[0.8px] text-[#4a4030]">Education</h2>
      <div class="mt-3">
        <div v-for="entry in resume.education" :key="entry.id" class="relative pb-5 pl-[22px] last:pb-0">
          <span class="absolute left-0 top-1 h-[9px] w-[9px] rounded-full" :style="{ background: theme.accentColor }" />
          <div class="flex items-baseline justify-between gap-3">
            <span class="text-sm font-bold"
              >{{ entry.school }}<template v-if="entry.school && entry.degree"> — </template>{{ entry.degree }}</span
            >
            <span class="whitespace-nowrap text-[11px] text-[#857a68]">{{ entry.dates }}</span>
          </div>
        </div>
      </div>
    </template>

    <template v-if="resume.skills.length">
      <h2 class="mt-7 text-xs font-bold uppercase tracking-[0.8px] text-[#4a4030]">Skills</h2>
      <div class="mt-2.5 text-[13px] text-[#4a4030]">{{ resume.skills.join('  ·  ') }}</div>
    </template>
  </div>
</template>
