<script setup lang="ts">
import { ArrowRight, FileText, LayoutGrid, ShieldCheck, Upload } from '@lucide/vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface-100">
    <nav class="flex h-20 flex-shrink-0 items-center justify-between border-b border-border bg-surface-200 px-12">
      <span class="font-display text-xl font-semibold text-ink">Resume Builder</span>
      <div class="flex items-center gap-8">
        <router-link to="/templates" class="font-sans text-sm font-semibold text-ink-muted hover:text-ink">
          Templates
        </router-link>
        <a href="#features" class="font-sans text-sm font-semibold text-ink-muted hover:text-ink">How it works</a>
        <router-link to="/upload" class="btn-primary">Start building</router-link>
      </div>
    </nav>

    <section class="flex flex-shrink-0 flex-col items-center px-12 pb-[72px] pt-16 text-center">
      <h1 class="m-0 max-w-[720px] font-display text-[40px] font-semibold leading-[46px] text-ink">
        Build a resume that gets read, not skimmed.
      </h1>
      <p class="mt-4 max-w-[560px] font-sans text-base leading-[26px] text-ink-muted">
        Upload what you already have, or start fresh. Pick from templates built for how hiring actually works, then
        export a polished PDF in minutes.
      </p>
      <div class="mt-8 flex items-center gap-4">
        <router-link to="/upload" class="btn-primary">
          <Upload :size="18" :stroke-width="1.5" />
          Upload your resume
        </router-link>
        <router-link to="/edit" class="btn-secondary">Start from scratch</router-link>
      </div>
      <div class="mt-5 flex items-center gap-1.5 text-ink-muted">
        <ShieldCheck :size="14" :stroke-width="1.5" />
        <span class="font-sans text-[13px] leading-[18px]">No sign-up. Nothing leaves your browser.</span>
      </div>
    </section>

    <section
      id="features"
      class="grid flex-shrink-0 grid-cols-1 gap-8 border-y border-border bg-surface-200 px-12 py-16 sm:grid-cols-3"
    >
      <div class="flex flex-col">
        <div class="flex h-12 w-12 items-center justify-center rounded-md bg-brand-tint text-brand">
          <FileText :size="24" :stroke-width="1.5" />
        </div>
        <h3 class="mt-4 font-display text-xl font-semibold leading-[26px] text-ink">Parses what you already have</h3>
        <p class="mt-2 font-sans text-[15px] leading-[22px] text-ink-muted">
          Upload a PDF or Word doc and we'll pull your experience, education and skills into an editable form.
        </p>
      </div>
      <div class="flex flex-col">
        <div class="flex h-12 w-12 items-center justify-center rounded-md bg-brand-tint text-brand">
          <LayoutGrid :size="24" :stroke-width="1.5" />
        </div>
        <h3 class="mt-4 font-display text-xl font-semibold leading-[26px] text-ink">20+ templates, one dataset</h3>
        <p class="mt-2 font-sans text-[15px] leading-[22px] text-ink-muted">
          Switch designs any time before you export — your content stays exactly as you wrote it.
        </p>
      </div>
      <div class="flex flex-col">
        <div class="flex h-12 w-12 items-center justify-center rounded-md bg-brand-tint text-brand">
          <ShieldCheck :size="24" :stroke-width="1.5" />
        </div>
        <h3 class="mt-4 font-display text-xl font-semibold leading-[26px] text-ink">
          Everything stays in your browser
        </h3>
        <p class="mt-2 font-sans text-[15px] leading-[22px] text-ink-muted">
          No accounts, no servers. Parsing, editing and the PDF export all happen on your device.
        </p>
      </div>
    </section>

    <section class="border-t border-border bg-brand-tint px-12 py-16 text-center">
      <h2 class="m-0 font-display text-[28px] font-semibold leading-[34px] text-ink">Ready to build yours?</h2>
      <p class="mb-6 mt-2 font-sans text-[15px] leading-[22px] text-ink-muted">
        Takes about five minutes, start to a finished PDF.
      </p>
      <router-link to="/upload" class="btn-primary">
        Start building
        <ArrowRight :size="16" :stroke-width="1.5" />
      </router-link>
    </section>
  </div>
</template>
