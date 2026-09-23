<script setup lang="ts">
import AppHeader from '@/presentation/components/layout/AppHeader.vue'
import EducationCard from '@/presentation/components/edit/EducationCard.vue'
import ExperienceCard from '@/presentation/components/edit/ExperienceCard.vue'
import LanguagesCard from '@/presentation/components/edit/LanguagesCard.vue'
import PersonalInfoCard from '@/presentation/components/edit/PersonalInfoCard.vue'
import ReferencesCard from '@/presentation/components/edit/ReferencesCard.vue'
import SectionNav from '@/presentation/components/edit/SectionNav.vue'
import SkillsCard from '@/presentation/components/edit/SkillsCard.vue'
import SummaryCard from '@/presentation/components/edit/SummaryCard.vue'
</script>

<template>
  <div class="min-h-screen bg-surface-100">
    <AppHeader current-step="edit" />

    <div class="mx-auto box-border max-w-[1184px] p-6 lg:p-12">
      <div class="mb-8">
        <h1 class="m-0 font-display text-[28px] font-semibold leading-[34px] text-ink">Tell us about you</h1>
        <p class="mt-1 font-sans text-[15px] leading-[22px] text-ink-muted">
          We pulled this from your upload — check it over and fill in anything missing.
        </p>
      </div>

      <div class="flex flex-col items-start gap-8 lg:flex-row">
        <div class="flex min-w-0 flex-1 flex-col gap-6">
          <PersonalInfoCard />
          <SummaryCard />
          <ExperienceCard />
          <EducationCard />
          <SkillsCard />
          <LanguagesCard />
          <ReferencesCard />
        </div>
        <SectionNav />
      </div>
    </div>
  </div>
</template>
