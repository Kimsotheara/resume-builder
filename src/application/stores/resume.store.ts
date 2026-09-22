import { defineStore } from 'pinia'

import { templateDefinitions } from '@/application/templates/templateThemes'
import type { EducationEntry, ExperienceEntry, ParsedResumeSections, ResumeData } from '@/domain/resume.types'

const STORAGE_KEY = 'resume-builder:draft'

function createId(): string {
  return crypto.randomUUID()
}

function emptyResume(): ResumeData {
  return {
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    meta: {
      activeTemplateId: 'clarity',
      accentColor: '#2563eb',
    },
  }
}

function loadDraft(): ResumeData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ResumeData) : null
  } catch {
    return null
  }
}

export const useResumeStore = defineStore('resume', {
  state: (): { resume: ResumeData } => ({
    resume: loadDraft() ?? emptyResume(),
  }),

  getters: {
    hasContent: (state): boolean =>
      Boolean(
        state.resume.personalInfo.fullName ||
        state.resume.summary ||
        state.resume.experience.length ||
        state.resume.education.length ||
        state.resume.skills.length,
      ),
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.resume))
      } catch {
        // localStorage may be unavailable (private mode, quota) — autosave is best-effort only.
      }
    },

    resetResume() {
      this.resume = emptyResume()
      this.persist()
    },

    replaceResume(data: Partial<ResumeData>) {
      this.resume = { ...emptyResume(), ...data }
      this.persist()
    },

    updatePersonalInfo(patch: Partial<ResumeData['personalInfo']>) {
      Object.assign(this.resume.personalInfo, patch)
      this.persist()
    },

    updateSummary(summary: string) {
      this.resume.summary = summary
      this.persist()
    },

    addExperience() {
      const entry: ExperienceEntry = {
        id: createId(),
        company: '',
        role: '',
        dates: '',
        highlights: [''],
      }
      this.resume.experience.push(entry)
      this.persist()
      return entry.id
    },

    updateExperience(id: string, patch: Partial<Omit<ExperienceEntry, 'id' | 'highlights'>>) {
      const entry = this.resume.experience.find((e) => e.id === id)
      if (!entry) return
      Object.assign(entry, patch)
      this.persist()
    },

    removeExperience(id: string) {
      this.resume.experience = this.resume.experience.filter((e) => e.id !== id)
      this.persist()
    },

    addHighlight(experienceId: string) {
      const entry = this.resume.experience.find((e) => e.id === experienceId)
      if (!entry) return
      entry.highlights.push('')
      this.persist()
    },

    updateHighlight(experienceId: string, index: number, value: string) {
      const entry = this.resume.experience.find((e) => e.id === experienceId)
      if (!entry) return
      entry.highlights[index] = value
      this.persist()
    },

    removeHighlight(experienceId: string, index: number) {
      const entry = this.resume.experience.find((e) => e.id === experienceId)
      if (!entry) return
      entry.highlights.splice(index, 1)
      this.persist()
    },

    addEducation() {
      const entry: EducationEntry = { id: createId(), school: '', degree: '', dates: '' }
      this.resume.education.push(entry)
      this.persist()
      return entry.id
    },

    updateEducation(id: string, patch: Partial<Omit<EducationEntry, 'id'>>) {
      const entry = this.resume.education.find((e) => e.id === id)
      if (!entry) return
      Object.assign(entry, patch)
      this.persist()
    },

    removeEducation(id: string) {
      this.resume.education = this.resume.education.filter((e) => e.id !== id)
      this.persist()
    },

    addSkill(skill: string) {
      const trimmed = skill.trim()
      if (!trimmed || this.resume.skills.includes(trimmed)) return
      this.resume.skills.push(trimmed)
      this.persist()
    },

    removeSkill(skill: string) {
      this.resume.skills = this.resume.skills.filter((s) => s !== skill)
      this.persist()
    },

    setActiveTemplate(templateId: string) {
      this.resume.meta.activeTemplateId = templateId
      const template = templateDefinitions.find((t) => t.id === templateId)
      if (template) this.resume.meta.accentColor = template.theme.accentColor
      this.persist()
    },

    setAccentColor(color: string) {
      this.resume.meta.accentColor = color
      this.persist()
    },

    /**
     * Best-effort import from an uploaded resume. Section text can't be reliably
     * split into individual roles/schools by heuristics alone, so each block
     * lands as one editable entry — the user refines it on the Edit step.
     */
    applyParsedSections(sections: ParsedResumeSections) {
      if (sections.fullName) this.resume.personalInfo.fullName = sections.fullName
      if (sections.email) this.resume.personalInfo.email = sections.email
      if (sections.phone) this.resume.personalInfo.phone = sections.phone
      if (sections.summary) this.resume.summary = sections.summary

      if (sections.experienceLines.length) {
        this.resume.experience.push({
          id: createId(),
          company: '',
          role: '',
          dates: '',
          highlights: sections.experienceLines,
        })
      }

      if (sections.educationLines.length) {
        this.resume.education.push({
          id: createId(),
          school: sections.educationLines[0] ?? '',
          degree: sections.educationLines.slice(1).join(' '),
          dates: '',
        })
      }

      for (const skill of sections.skillLines) {
        this.addSkill(skill)
      }

      this.persist()
    },
  },
})
