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
const bandColor = computed(() => props.theme.secondaryColor ?? props.theme.accentColor)
</script>

<template>
  <div class="box-border flex w-[794px] min-h-[1120px] bg-white text-[#111827]" :style="{ fontFamily: fontStack }">
    <aside
      class="box-border w-[254px] flex-shrink-0 px-7 py-10 text-[#e5e7eb]"
      :style="{ background: theme.accentColor }"
    >
      <div class="flex justify-center">
        <img
          v-if="resume.personalInfo.photo"
          :src="resume.personalInfo.photo"
          alt=""
          class="h-[120px] w-[120px] rounded-full border-4 border-white/20 object-cover"
        />
        <div
          v-else
          class="flex h-[120px] w-[120px] items-center justify-center rounded-full border-4 border-white/20 text-[28px] font-bold text-white"
          :style="{ background: bandColor }"
        >
          {{ initials.toUpperCase() }}
        </div>
      </div>

      <div class="mt-8 text-[10px] font-bold uppercase tracking-[1.2px] text-white/60">Contact</div>
      <div class="mt-3 flex flex-col gap-2 text-[11px] leading-[15px] text-[#dbe1ea]">
        <div v-if="resume.personalInfo.phone" class="flex items-start gap-2">
          <Phone :size="12" :stroke-width="1.75" class="mt-[1px] flex-shrink-0 text-white/55" />
          <span>{{ resume.personalInfo.phone }}</span>
        </div>
        <div v-if="resume.personalInfo.email" class="flex items-start gap-2">
          <Mail :size="12" :stroke-width="1.75" class="mt-[1px] flex-shrink-0 text-white/55" />
          <span class="break-all">{{ resume.personalInfo.email }}</span>
        </div>
        <div v-if="resume.personalInfo.location" class="flex items-start gap-2">
          <MapPin :size="12" :stroke-width="1.75" class="mt-[1px] flex-shrink-0 text-white/55" />
          <span>{{ resume.personalInfo.location }}</span>
        </div>
        <div v-if="resume.personalInfo.website" class="flex items-start gap-2">
          <Globe :size="12" :stroke-width="1.75" class="mt-[1px] flex-shrink-0 text-white/55" />
          <span class="break-all">{{ resume.personalInfo.website }}</span>
        </div>
      </div>

      <template v-if="resume.education.length">
        <div class="my-5 h-px bg-white/15" />
        <div class="text-[10px] font-bold uppercase tracking-[1.2px] text-white/60">Education</div>
        <div v-for="entry in resume.education" :key="entry.id" class="mt-3">
          <div class="text-[12px] font-bold text-white">{{ entry.degree || entry.school }}</div>
          <div v-if="entry.degree && entry.school" class="mt-0.5 text-[11px] text-[#dbe1ea]">{{ entry.school }}</div>
          <div class="mt-0.5 text-[10px] text-white/55">{{ entry.dates }}</div>
        </div>
      </template>

      <template v-if="resume.skills.length">
        <div class="my-5 h-px bg-white/15" />
        <div class="text-[10px] font-bold uppercase tracking-[1.2px] text-white/60">Skills</div>
        <div class="mt-3 flex flex-col gap-1.5 text-[11px] text-[#dbe1ea]">
          <div v-for="skill in resume.skills" :key="skill">{{ skill }}</div>
        </div>
      </template>

      <template v-if="resume.languages.length">
        <div class="my-5 h-px bg-white/15" />
        <div class="text-[10px] font-bold uppercase tracking-[1.2px] text-white/60">Languages</div>
        <div class="mt-3 flex flex-col gap-1.5 text-[11px] text-[#dbe1ea]">
          <div v-for="lang in resume.languages" :key="lang.id" class="flex items-baseline justify-between gap-2">
            <span>{{ lang.name }}</span>
            <span v-if="lang.level" class="text-[10px] text-white/55">{{ lang.level }}</span>
          </div>
        </div>
      </template>
    </aside>

    <main class="box-border flex flex-1 flex-col">
      <header class="box-border px-9 py-9" :style="{ background: bandColor }">
        <h1 class="m-0 text-[26px] font-extrabold text-white">{{ resume.personalInfo.fullName || 'Your Name' }}</h1>
        <div class="mt-1.5 text-[13px] font-medium uppercase tracking-[0.8px] text-white/80">
          {{ resume.personalInfo.title }}
        </div>
      </header>

      <div class="box-border flex-1 px-9 py-8">
        <template v-if="resume.summary">
          <h2 class="m-0 text-xs font-bold uppercase tracking-[0.8px]" :style="{ color: theme.accentColor }">
            About me
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
              <div class="text-[12px] font-bold text-[#111827]">{{ entry.name }}</div>
              <div class="text-[11px] text-[#6b7280]">{{ [entry.title, entry.company].filter(Boolean).join(' · ') }}</div>
              <div class="mt-0.5 text-[11px] text-[#6b7280]">
                {{ [entry.phone, entry.email].filter(Boolean).join('  ·  ') }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>
