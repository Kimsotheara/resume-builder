export interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  website: string
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
  relation: string
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

export type TemplateFamily =
  | 'minimal'
  | 'sidebar'
  | 'bold-header'
  | 'timeline'
  | 'plain'
  | 'photo-sidebar'
  | 'banner-header'
  | 'professional'
  | 'elegant'

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

export interface ParsedExperienceEntry {
  role: string
  company: string
  dates: string
  highlights: string[]
}

export interface ParsedEducationEntry {
  degree: string
  school: string
  dates: string
}

export interface ParsedReferenceEntry {
  name: string
  title: string
  company: string
  relation: string
  phone: string
  email: string
}

export interface ParsedResumeSections {
  fullName?: string
  title?: string
  location?: string
  email?: string
  phone?: string
  summary?: string
  experienceEntries: ParsedExperienceEntry[]
  educationEntries: ParsedEducationEntry[]
  referenceEntries: ParsedReferenceEntry[]
  skillLines: string[]
  languageLines: string[]
}
