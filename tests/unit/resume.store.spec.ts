import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useResumeStore } from '@/application/stores/resume.store'

describe('useResumeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('starts empty', () => {
    const store = useResumeStore()
    expect(store.hasContent).toBe(false)
    expect(store.resume.experience).toEqual([])
  })

  it('adds and removes an experience entry', () => {
    const store = useResumeStore()
    const id = store.addExperience()
    expect(store.resume.experience).toHaveLength(1)

    store.updateExperience(id, { company: 'Acme', role: 'Engineer', dates: '2020 - 2022' })
    expect(store.resume.experience[0]).toMatchObject({ company: 'Acme', role: 'Engineer' })

    store.removeExperience(id)
    expect(store.resume.experience).toHaveLength(0)
  })

  it('deduplicates skills', () => {
    const store = useResumeStore()
    store.addSkill('Vue')
    store.addSkill('Vue')
    store.addSkill('TypeScript')
    expect(store.resume.skills).toEqual(['Vue', 'TypeScript'])
  })

  it('syncs the accent color to the selected template default', () => {
    const store = useResumeStore()
    store.setActiveTemplate('signal')
    expect(store.resume.meta.activeTemplateId).toBe('signal')
    expect(store.resume.meta.accentColor).toBe('#db2777')
  })

  it('applies parsed sections without clobbering unrelated fields', () => {
    const store = useResumeStore()
    store.updatePersonalInfo({ location: 'Remote' })

    store.applyParsedSections({
      fullName: 'Jordan Lee',
      email: 'jordan@example.com',
      phone: undefined,
      summary: 'Backend engineer.',
      experienceLines: ['Built the payments service'],
      educationLines: ['State University', 'BS Computer Science'],
      skillLines: ['Go', 'Postgres'],
    })

    expect(store.resume.personalInfo.fullName).toBe('Jordan Lee')
    expect(store.resume.personalInfo.location).toBe('Remote')
    expect(store.resume.experience[0]?.highlights).toEqual(['Built the payments service'])
    expect(store.resume.education[0]?.school).toBe('State University')
    expect(store.resume.skills).toEqual(['Go', 'Postgres'])
  })
})
