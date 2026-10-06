<script setup lang="ts">
import { FileOutput, FilePen, FileType } from '@lucide/vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const buildRoutes = ['/upload', '/edit', '/templates', '/preview']

const links = [
  { to: '/upload', label: 'Build a resume', short: 'Build', icon: FilePen, matches: buildRoutes },
  { to: '/convert/pdf', label: 'Convert PDF', short: 'PDF', icon: FileOutput, matches: ['/convert/pdf'] },
  { to: '/convert/word', label: 'Convert Word', short: 'Word', icon: FileType, matches: ['/convert/word'] },
]

function isActive(matches: string[]) {
  return matches.includes(route.path)
}
</script>

<template>
  <nav
    class="sticky top-0 z-30 flex h-16 w-full flex-shrink-0 items-center gap-4 border-b border-border bg-surface-200/85 px-4 shadow-sm backdrop-blur-md sm:gap-8 sm:px-8 lg:px-12"
  >
    <router-link to="/" class="group flex flex-shrink-0 items-center gap-2.5" aria-label="Resume Builder home">
      <span
        class="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand to-[#7c3aed] text-on-brand shadow-md transition-transform group-hover:scale-105"
      >
        <FilePen :size="18" :stroke-width="2" />
      </span>
      <span class="hidden font-display text-xl font-semibold tracking-tight text-ink sm:inline">Resume Builder</span>
    </router-link>

    <span class="hidden h-6 w-px flex-shrink-0 bg-border sm:block" />

    <div class="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto sm:flex-none rounded-full bg-surface-300 p-1">
      <router-link
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex flex-1 flex-shrink-0 items-center justify-center gap-2 rounded-full px-3 sm:flex-none sm:px-4 py-1.5 font-sans text-sm font-semibold transition-all"
        :class="
          isActive(link.matches)
            ? 'bg-surface-200 text-brand shadow-sm'
            : 'text-ink-muted hover:bg-surface-200/60 hover:text-ink'
        "
        :aria-current="isActive(link.matches) ? 'page' : undefined"
      >
        <component :is="link.icon" :size="16" :stroke-width="1.8" class="hidden sm:block" />
        <span class="sm:hidden">{{ link.short }}</span>
        <span class="hidden sm:inline">{{ link.label }}</span>
      </router-link>
    </div>
  </nav>
</template>
