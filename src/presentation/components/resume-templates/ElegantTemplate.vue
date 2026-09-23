<script setup lang="ts">
import { computed } from 'vue'

import { resolveFontStack } from '@/application/templates/templateFonts'
import type { ResumeData, TemplateTheme } from '@/domain/resume.types'

/**
 * "Elegant" — a centred, executive single-column CV. Large tracked name,
 * dotted contact line, and section headings framed by a thin double rule.
 * Reads formal and print-classic; pairs best with a serif theme.
 */
const props = defineProps<{
  resume: ResumeData
  theme: TemplateTheme
}>()

const fontStack = computed(() => resolveFontStack(props.theme.fontFamily))

const contactParts = computed(() =>
  [
    props.resume.personalInfo.phone,
    props.resume.personalInfo.email,
    props.resume.personalInfo.location,
    props.resume.personalInfo.website,
  ].filter(Boolean),
)
</script>

<template>
  <div class="box-border w-[794px] min-h-[1120px] bg-white px-[70px] py-14 text-[#1f2937]" :style="{ fontFamily: fontStack }">
    <!-- Header -->
    <header class="text-center">
      <h1 class="m-0 text-[34px] font-semibold uppercase tracking-[6px] text-[#1a1a1a]">
        {{ resume.personalInfo.fullName || 'Your Name' }}
      </h1>
      <div v-if="resume.personalInfo.title" class="mt-2 text-[13px] uppercase tracking-[3px]" :style="{ color: theme.accentColor }">
        {{ resume.personalInfo.title }}
      </div>
      <div class="mx-auto mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11.5px] text-[#4b5563]">
        <template v-for="(part, i) in contactParts" :key="i">
          <span v-if="i > 0" :style="{ color: theme.accentColor }">•</span>
          <span>{{ part }}</span>
        </template>
      </div>
    </header>

    <div class="mt-8 border-t-2 border-double" :style="{ borderColor: theme.accentColor }" />

    <!-- Summary -->
    <section v-if="resume.summary" class="mt-6">
      <p class="m-0 text-center text-[13px] italic leading-[21px] text-[#4b5563]">{{ resume.summary }}</p>
    </section>

    <!-- Experience -->
    <section v-if="resume.experience.length" class="mt-8">
      <div class="flex items-center gap-4">
        <span class="h-px flex-1" :style="{ background: theme.accentColor, opacity: 0.4 }" />
        <h2 class="m-0 text-[14px] font-semibold uppercase tracking-[3px]" :style="{ color: theme.accentColor }">Experience</h2>
        <span class="h-px flex-1" :style="{ background: theme.accentColor, opacity: 0.4 }" />
      </div>
      <div v-for="entry in resume.experience" :key="entry.id" class="mt-5">
        <div class="flex items-baseline justify-between gap-3">
          <span class="text-[14.5px] font-semibold text-[#111827]">{{ entry.role || entry.company }}</span>
          <span class="whitespace-nowrap text-[11.5px] italic text-[#6b7280]">{{ entry.dates }}</span>
        </div>
        <div v-if="entry.role && entry.company" class="text-[12.5px] italic text-[#4b5563]">{{ entry.company }}</div>
        <ul class="mt-2 list-disc pl-5 text-[12.5px] leading-[20px] text-[#374151]">
          <li v-for="(highlight, i) in entry.highlights.filter(Boolean)" :key="i">{{ highlight }}</li>
        </ul>
      </div>
    </section>

    <!-- Education -->
    <section v-if="resume.education.length" class="mt-8">
      <div class="flex items-center gap-4">
        <span class="h-px flex-1" :style="{ background: theme.accentColor, opacity: 0.4 }" />
        <h2 class="m-0 text-[14px] font-semibold uppercase tracking-[3px]" :style="{ color: theme.accentColor }">Education</h2>
        <span class="h-px flex-1" :style="{ background: theme.accentColor, opacity: 0.4 }" />
      </div>
      <div v-for="entry in resume.education" :key="entry.id" class="mt-4 flex items-baseline justify-between gap-3">
        <div>
          <div class="text-[13.5px] font-semibold text-[#111827]">{{ entry.degree }}</div>
          <div class="text-[12.5px] italic text-[#4b5563]">{{ entry.school }}</div>
        </div>
        <span class="whitespace-nowrap text-[11.5px] italic text-[#6b7280]">{{ entry.dates }}</span>
      </div>
    </section>

    <!-- Skills -->
    <section v-if="resume.skills.length" class="mt-8">
      <div class="flex items-center gap-4">
        <span class="h-px flex-1" :style="{ background: theme.accentColor, opacity: 0.4 }" />
        <h2 class="m-0 text-[14px] font-semibold uppercase tracking-[3px]" :style="{ color: theme.accentColor }">Skills</h2>
        <span class="h-px flex-1" :style="{ background: theme.accentColor, opacity: 0.4 }" />
      </div>
      <div class="mt-4 flex flex-wrap justify-center gap-x-2 gap-y-1.5 text-[12.5px] text-[#374151]">
        <template v-for="(skill, i) in resume.skills" :key="skill">
          <span v-if="i > 0" :style="{ color: theme.accentColor }">•</span>
          <span>{{ skill }}</span>
        </template>
      </div>
    </section>

    <!-- Languages -->
    <section v-if="resume.languages.length" class="mt-8">
      <div class="flex items-center gap-4">
        <span class="h-px flex-1" :style="{ background: theme.accentColor, opacity: 0.4 }" />
        <h2 class="m-0 text-[14px] font-semibold uppercase tracking-[3px]" :style="{ color: theme.accentColor }">Languages</h2>
        <span class="h-px flex-1" :style="{ background: theme.accentColor, opacity: 0.4 }" />
      </div>
      <div class="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[12.5px] text-[#374151]">
        <span v-for="lang in resume.languages" :key="lang.id">
          {{ lang.name }}<span v-if="lang.level" class="text-[#6b7280]"> — {{ lang.level }}</span>
        </span>
      </div>
    </section>

    <!-- References -->
    <section v-if="resume.references.length" class="mt-8">
      <div class="flex items-center gap-4">
        <span class="h-px flex-1" :style="{ background: theme.accentColor, opacity: 0.4 }" />
        <h2 class="m-0 text-[14px] font-semibold uppercase tracking-[3px]" :style="{ color: theme.accentColor }">References</h2>
        <span class="h-px flex-1" :style="{ background: theme.accentColor, opacity: 0.4 }" />
      </div>
      <div class="mt-4 grid grid-cols-2 gap-x-8 gap-y-4 text-center">
        <div v-for="entry in resume.references" :key="entry.id">
          <div class="text-[13px] font-semibold text-[#111827]">{{ entry.name }}</div>
          <div v-if="entry.title || entry.company" class="text-[12px] italic text-[#4b5563]">
            {{ [entry.title, entry.company].filter(Boolean).join(', ') }}
          </div>
          <div v-if="entry.relation" class="text-[11.5px] text-[#6b7280]">{{ entry.relation }}</div>
          <div class="text-[11.5px] text-[#6b7280]">{{ [entry.phone, entry.email].filter(Boolean).join('  •  ') }}</div>
        </div>
      </div>
    </section>
  </div>
</template>
