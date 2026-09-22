import type { ParsedResumeSections } from '@/domain/resume.types'

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
const PHONE_PATTERN = /(\+?\d[\d\s().-]{7,}\d)/

const SECTION_HEADINGS: Record<'experience' | 'education' | 'skills', RegExp> = {
  experience: /^(work\s+)?experience|employment history$/i,
  education: /^education$/i,
  skills: /^(skills|technical skills|core competencies)$/i,
}

type SectionKey = keyof typeof SECTION_HEADINGS | 'summary' | null

function detectHeading(line: string): SectionKey {
  const trimmed = line.trim()
  if (!trimmed || trimmed.length > 40) return null
  if (SECTION_HEADINGS.experience.test(trimmed)) return 'experience'
  if (SECTION_HEADINGS.education.test(trimmed)) return 'education'
  if (SECTION_HEADINGS.skills.test(trimmed)) return 'skills'
  if (/^summary|^profile|^objective$/i.test(trimmed)) return 'summary'
  return null
}

/**
 * Best-effort heuristic split of raw resume text into rough sections.
 * This is intentionally forgiving — the user reviews and corrects everything
 * on the Edit step, so false positives here are cheap to fix by hand.
 */
export function parseResumeSections(rawText: string): ParsedResumeSections {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const email = rawText.match(EMAIL_PATTERN)?.[0]
  const phone = rawText.match(PHONE_PATTERN)?.[0]?.trim()
  const fullName = lines.find((line) => !detectHeading(line) && !EMAIL_PATTERN.test(line) && !PHONE_PATTERN.test(line))

  const sections: ParsedResumeSections = {
    fullName,
    email,
    phone,
    summary: undefined,
    experienceLines: [],
    educationLines: [],
    skillLines: [],
  }

  let current: SectionKey = null
  const summaryLines: string[] = []

  for (const line of lines) {
    const heading = detectHeading(line)
    if (heading) {
      current = heading
      continue
    }
    if (line === fullName) continue
    if (line === email || line === phone) continue

    switch (current) {
      case 'summary':
        summaryLines.push(line)
        break
      case 'experience':
        sections.experienceLines.push(line)
        break
      case 'education':
        sections.educationLines.push(line)
        break
      case 'skills':
        sections.skillLines.push(
          ...line
            .split(/[,•|]/)
            .map((s) => s.trim())
            .filter(Boolean),
        )
        break
      default:
        // Text before any recognized heading is treated as the summary.
        if (!sections.experienceLines.length && !sections.educationLines.length) {
          summaryLines.push(line)
        }
    }
  }

  sections.summary = summaryLines.join(' ').trim() || undefined
  return sections
}
