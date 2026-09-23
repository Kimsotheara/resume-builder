<script setup lang="ts">
import { Check } from '@lucide/vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useScrollSpy } from '@/application/composables/useScrollSpy'

const sections = [
  { id: 'personal-info', label: 'Personal info' },
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'languages', label: 'Languages' },
  { id: 'references', label: 'References' },
]

const { activeId } = useScrollSpy(sections.map((s) => s.id))
const activeIndex = computed(() => sections.findIndex((s) => s.id === activeId.value))
const router = useRouter()

function stateOf(index: number): 'done' | 'active' | 'upcoming' {
  if (index < activeIndex.value) return 'done'
  if (index === activeIndex.value) return 'active'
  return 'upcoming'
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="card w-full flex-shrink-0 p-4 lg:sticky lg:top-6 lg:w-80">
    <span class="font-sans text-[13px] font-semibold uppercase tracking-[0.4px] text-ink-muted">Sections</span>
    <nav class="mt-3 flex flex-col gap-0.5">
      <a
        v-for="(section, index) in sections"
        :key="section.id"
        href="#"
        class="flex items-center gap-2.5 rounded-sm px-2.5 py-2"
        :class="{ 'bg-brand-tint': stateOf(index) === 'active' }"
        @click.prevent="scrollTo(section.id)"
      >
        <span
          class="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-border-strong text-on-brand"
          :class="{
            'border-accent bg-accent': stateOf(index) === 'done',
            'border-2 border-brand': stateOf(index) === 'active',
          }"
        >
          <Check v-if="stateOf(index) === 'done'" :size="10" :stroke-width="2.5" />
        </span>
        <span
          class="font-sans text-sm"
          :class="stateOf(index) === 'active' ? 'font-semibold text-brand' : 'text-ink-muted'"
        >
          {{ section.label }}
        </span>
      </a>
    </nav>
    <div class="my-4 h-px bg-border" />
    <button type="button" class="btn-primary w-full box-border py-3" @click="router.push('/templates')">
      Continue to templates
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M5 12h14" />
        <path d="M13 5l7 7-7 7" />
      </svg>
    </button>
    <router-link to="/" class="mt-3 block text-center font-sans text-[13px] text-ink-muted">
      Save &amp; exit
    </router-link>
  </div>
</template>
