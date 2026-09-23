<script setup lang="ts">
import { Briefcase, GraduationCap, Globe, Mail, MapPin, Phone, User } from '@lucide/vue'
import { computed } from 'vue'

import { resolveFontStack } from '@/application/templates/templateFonts'
import type { ResumeData, TemplateTheme } from '@/domain/resume.types'

/**
 * "Professional" — a LiveCareer-style two-column CV: a solid accent sidebar
 * with an initials avatar, icon-led contact rows and skill bars, beside a
 * clean main column whose section headers carry an accent marker + rule.
 */
const props = defineProps<{
  resume: ResumeData
  theme: TemplateTheme
}>()

const fontStack = computed(() => resolveFontStack(props.theme.fontFamily))
const secondary = computed(() => props.theme.secondaryColor ?? props.theme.accentColor)
const initials = computed(() => {
  const name = props.resume.personalInfo.fullName.trim()
  if (!name) return '–'
  const parts = name.split(/\s+/)
  return (parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')
})
</script>

<template>
  <div class="box-border flex w-[794px] min-h-[1120px] bg-white text-[#1f2937]" :style="{ fontFamily: fontStack }">
    <!-- Sidebar -->
    <aside class="box-border w-[270px] flex-shrink-0 px-7 py-9 text-[#e8ecf1]" :style="{ background: theme.accentColor }">
      <div class="flex flex-col items-center text-center">
        <div
          class="flex h-[86px] w-[86px] items-center justify-center rounded-full text-[28px] font-bold text-white ring-4 ring-white/20"
          :style="{ background: secondary }"
        >
          {{ initials.toUpperCase() }}
        </div>
        <div class="mt-4 text-[20px] font-bold leading-tight text-white">
          {{ resume.personalInfo.fullName || 'Your Name' }}
        </div>
        <div v-if="resume.personalInfo.title" class="mt-1 text-[12px] uppercase tracking-[1px] text-white/75">
          {{ resume.personalInfo.title }}
        </div>
      </div>

      <div class="my-6 h-px bg-white/20" />

      <div class="text-[11px] font-bold uppercase tracking-[1.2px] text-white/90">Contact</div>
      <div class="mt-3 space-y-2.5 text-[11.5px] leading-[16px] text-white/85">
        <div v-if="resume.personalInfo.phone" class="flex items-start gap-2.5">
          <Phone :size="14" class="mt-px flex-shrink-0" /><span>{{ resume.personalInfo.phone }}</span>
        </div>
        <div v-if="resume.personalInfo.email" class="flex items-start gap-2.5">
          <Mail :size="14" class="mt-px flex-shrink-0" /><span class="break-all">{{ resume.personalInfo.email }}</span>
        </div>
        <div v-if="resume.personalInfo.location" class="flex items-start gap-2.5">
          <MapPin :size="14" class="mt-px flex-shrink-0" /><span>{{ resume.personalInfo.location }}</span>
        </div>
        <div v-if="resume.personalInfo.website" class="flex items-start gap-2.5">
          <Globe :size="14" class="mt-px flex-shrink-0" /><span class="break-all">{{ resume.personalInfo.website }}</span>
        </div>
      </div>

      <template v-if="resume.skills.length">
        <div class="my-6 h-px bg-white/20" />
        <div class="text-[11px] font-bold uppercase tracking-[1.2px] text-white/90">Skills</div>
        <div class="mt-3 space-y-2.5">
          <div v-for="skill in resume.skills" :key="skill">
            <div class="text-[11.5px] text-white/90">{{ skill }}</div>
            <div class="mt-1 h-[5px] w-full overflow-hidden rounded-full bg-white/20">
              <div class="h-full rounded-full bg-white/85" style="width: 88%" />
            </div>
          </div>
        </div>
      </template>

      <template v-if="resume.education.length">
        <div class="my-6 h-px bg-white/20" />
        <div class="text-[11px] font-bold uppercase tracking-[1.2px] text-white/90">Education</div>
        <div v-for="entry in resume.education" :key="entry.id" class="mt-3">
          <div class="text-[12px] font-bold text-white">{{ entry.degree }}</div>
          <div class="mt-0.5 text-[11.5px] text-white/85">{{ entry.school }}</div>
          <div class="mt-0.5 text-[10.5px] text-white/60">{{ entry.dates }}</div>
        </div>
      </template>
    </aside>

    <!-- Main -->
    <main class="box-border flex-1 px-9 py-9">
      <template v-if="resume.summary">
        <div class="flex items-center gap-2.5">
          <span class="flex h-7 w-7 items-center justify-center rounded-md text-white" :style="{ background: theme.accentColor }">
            <User :size="15" />
          </span>
          <h2 class="m-0 text-[14px] font-bold uppercase tracking-[1px]" :style="{ color: theme.accentColor }">
            Profile
          </h2>
        </div>
        <div class="mt-2 h-px w-full" :style="{ background: theme.accentColor, opacity: 0.25 }" />
        <p class="mt-3 text-[13px] leading-[20px] text-[#374151]">{{ resume.summary }}</p>
      </template>

      <template v-if="resume.experience.length">
        <div class="mt-7 flex items-center gap-2.5">
          <span class="flex h-7 w-7 items-center justify-center rounded-md text-white" :style="{ background: theme.accentColor }">
            <Briefcase :size="15" />
          </span>
          <h2 class="m-0 text-[14px] font-bold uppercase tracking-[1px]" :style="{ color: theme.accentColor }">
            Experience
          </h2>
        </div>
        <div class="mt-2 h-px w-full" :style="{ background: theme.accentColor, opacity: 0.25 }" />
        <div v-for="entry in resume.experience" :key="entry.id" class="mt-4">
          <div class="flex items-baseline justify-between gap-3">
            <span class="text-[14px] font-bold text-[#111827]">{{ entry.role || entry.company }}</span>
            <span class="whitespace-nowrap text-[11px] font-medium text-[#6b7280]">{{ entry.dates }}</span>
          </div>
          <div v-if="entry.role && entry.company" class="text-[12.5px] font-medium" :style="{ color: secondary }">
            {{ entry.company }}
          </div>
          <ul class="mt-1.5 list-disc pl-4 text-[12.5px] leading-[19px] text-[#374151]">
            <li v-for="(highlight, i) in entry.highlights.filter(Boolean)" :key="i">{{ highlight }}</li>
          </ul>
        </div>
      </template>

      <template v-if="!resume.summary && !resume.experience.length">
        <div class="flex items-center gap-2.5">
          <span class="flex h-7 w-7 items-center justify-center rounded-md text-white" :style="{ background: theme.accentColor }">
            <GraduationCap :size="15" />
          </span>
          <h2 class="m-0 text-[14px] font-bold uppercase tracking-[1px]" :style="{ color: theme.accentColor }">
            Overview
          </h2>
        </div>
        <p class="mt-3 text-[13px] leading-[20px] text-[#6b7280]">Add a summary and experience to fill this section.</p>
      </template>
    </main>
  </div>
</template>
