/**
 * Domain layer: the shared shape every template renderer and every editing
 * form reads and writes. This is the one contract the rest of the app
 * depends on — templates never receive anything but this shape.
 */

export interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  /** Data URL of an uploaded headshot; empty string when none is set. */
  photo: string
}

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  dates: string
  highlights: string[]
}

export interface EducationEntry {
  id: string
  school: string
  degree: string
  dates: string
}

export interface ReferenceEntry {
  id: string
  name: string
  title: string
  company: string
  phone: string
  email: string
}

export interface LanguageEntry {
  id: string
  name: string
  level: string
}

export interface ResumeMeta {
  activeTemplateId: string
  accentColor: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  references: ReferenceEntry[]
  languages: LanguageEntry[]
  meta: ResumeMeta
}

export type TemplateFamily = 'minimal' | 'sidebar' | 'bold-header' | 'timeline' | 'plain' | 'photo-sidebar' | 'banner-header'

export type TemplateTag = 'Modern' | 'Creative' | 'Minimal' | 'Two-column' | 'Timeline' | 'ATS-friendly'

export interface TemplateTheme {
  accentColor: string
  secondaryColor?: string
  fontFamily: 'sans' | 'serif' | 'mono'
}

export interface TemplateDefinition {
  id: string
  name: string
  family: TemplateFamily
  tags: TemplateTag[]
  theme: TemplateTheme
}

export type ParseSource = 'pdf' | 'docx'

export interface ParsedResumeSections {
  fullName?: string
  email?: string
  phone?: string
  summary?: string
  experienceLines: string[]
  educationLines: string[]
  skillLines: string[]
}
