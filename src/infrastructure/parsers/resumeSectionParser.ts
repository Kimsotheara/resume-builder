import type {
  ParsedEducationEntry,
  ParsedExperienceEntry,
  ParsedReferenceEntry,
  ParsedResumeSections,
} from '@/domain/resume.types'

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
const PHONE_PATTERN = /(\+?\d[\d\s().-]{7,}\d)/

const MONTH =
  '(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)'
const YEAR = '(?:19|20)\\d{2}'
const DATE_TOKEN = `(?:${MONTH}\\.?\\s+${YEAR}|${YEAR})`
const DATE_RANGE_PATTERN = new RegExp(`${DATE_TOKEN}\\s*(?:[-–—]|to)\\s*(?:${DATE_TOKEN}|present|current|now)`, 'i')
const DATE_SINGLE_PATTERN = new RegExp(`^${DATE_TOKEN}$`, 'i')

const BULLET_ONLY_PATTERN = /^[•\-*◦‣▪]+$/
const BULLET_PREFIX_PATTERN = /^[•\-*◦‣▪]\s*/

const TITLE_HINT_PATTERN =
  /\b(engineer|developer|manager|designer|analyst|consultant|architect|administrator|specialist|lead|director|officer|intern|programmer|scientist|accountant|marketing|sales|teacher|nurse|technician|assistant|coordinator|executive|freelanc)\w*\b/i

const SECTION_HEADINGS: Record<
  'experience' | 'education' | 'skills' | 'references' | 'languages' | 'contact',
  RegExp
> = {
  experience: /^(work\s+)?experience|employment history$/i,
  education: /^education$/i,
  skills: /^(skills|technical skills|core competencies)$/i,
  references: /^references?$/i,
  languages: /^languages?$/i,
  contact: /^contact(?:\s+(?:info(?:rmation)?|details))?$/i,
}

type SectionKey = keyof typeof SECTION_HEADINGS | 'summary'

function matchHeading(line: string): { key: SectionKey; rest: string } | null {
  const trimmed = line.trim()
  if (!trimmed || trimmed.length > 40) return null

  for (const [key, pattern] of Object.entries(SECTION_HEADINGS) as [SectionKey, RegExp][]) {
    const match = trimmed.match(pattern)
    if (match) return { key, rest: trimmed.slice((match.index ?? 0) + match[0].length).trim() }
  }
  if (/^(?:professional\s+|career\s+)?summary$|^profile$|^objective$|^about(?:\s+me)?$/i.test(trimmed)) {
    return { key: 'summary', rest: '' }
  }
  return null
}

function findPhone(text: string): string | undefined {
  const matches = text.match(new RegExp(PHONE_PATTERN.source, 'g')) ?? []
  return matches.find((m) => !DATE_RANGE_PATTERN.test(m) && !DATE_SINGLE_PATTERN.test(m.trim()))?.trim()
}

function extractDateAnchor(line: string): string | null {
  const trimmed = line.trim()
  const rangeMatch = trimmed.match(DATE_RANGE_PATTERN)
  if (rangeMatch) {
    const rest = (
      trimmed.slice(0, rangeMatch.index ?? 0) + trimmed.slice((rangeMatch.index ?? 0) + rangeMatch[0].length)
    ).trim()
    const restWordCount = rest ? rest.split(/\s+/).length : 0
    return restWordCount <= 5 ? rangeMatch[0] : null
  }
  return DATE_SINGLE_PATTERN.test(trimmed) ? trimmed : null
}

function isDetailLine(line: string): boolean {
  if (BULLET_ONLY_PATTERN.test(line) || BULLET_PREFIX_PATTERN.test(line)) return true
  const wordCount = line.split(/\s+/).filter(Boolean).length
  if (/[.!?]$/.test(line) && wordCount > 4) return true
  return wordCount > 8
}

function stripBullet(line: string): string {
  return line.replace(BULLET_PREFIX_PATTERN, '').trim()
}

function endsSentence(line: string): boolean {
  return /[.!?]$/.test(line.trim())
}

function hasBulletMarker(line: string): boolean {
  return BULLET_PREFIX_PATTERN.test(line) || BULLET_ONLY_PATTERN.test(line)
}

interface RawDatedEntry {
  labels: string[]
  dates: string
  details: string[]
}

/**
 * Split a section's lines into dated entries (a job or a degree).
 *
 * Handles both label orderings seen in the wild:
 *  - label(s) then date  (e.g. "Software Engineer" / "Acme" / "2020 - 2022")
 *  - date then label(s)  (e.g. "2020 - 2022" / "Software Engineer" / "Acme")
 *
 * Wrapped detail lines (a bullet that spilled onto a second visual line) are
 * merged back into the highlight they belong to rather than becoming their own.
 */
function splitDatedEntries(lines: string[]): RawDatedEntry[] {
  const entries: RawDatedEntry[] = []
  let pendingLabels: string[] = []
  const prefaceDetails: string[] = []
  let current: RawDatedEntry | null = null
  let awaitingContinuation = false

  const detailTarget = (): string[] => (current ? current.details : prefaceDetails)

  function appendContinuation(line: string) {
    const target = detailTarget()
    if (target.length) target[target.length - 1] = `${target[target.length - 1]} ${line}`.trim()
    else target.push(line)
  }

  for (const line of lines) {
    const dateAnchor = extractDateAnchor(line)
    if (dateAnchor) {
      current = { labels: [...pendingLabels], dates: dateAnchor, details: [] }
      entries.push(current)
      pendingLabels = []
      awaitingContinuation = false

      const rest = line.replace(dateAnchor, '').trim()
      if (rest) {
        if (isDetailLine(rest)) {
          current.details.push(stripBullet(rest))
          awaitingContinuation = !endsSentence(rest)
        } else {
          current.labels.push(rest)
        }
      }
      continue
    }

    if (hasBulletMarker(line)) {
      const text = stripBullet(line)
      detailTarget().push(text)
      awaitingContinuation = !endsSentence(text)
      continue
    }

    if (awaitingContinuation) {
      appendContinuation(line)
      awaitingContinuation = !endsSentence(line)
      continue
    }

    if (isDetailLine(line)) {
      detailTarget().push(line)
      awaitingContinuation = !endsSentence(line)
      continue
    }

    // A label line. When it directly follows a date (before any highlights) it
    // belongs to the current entry; otherwise it starts the next entry.
    if (current && current.details.length === 0) current.labels.push(line)
    else pendingLabels.push(line)
    awaitingContinuation = false
  }

  if (pendingLabels.length) entries.push({ labels: pendingLabels, dates: '', details: [] })
  if (prefaceDetails.length) {
    if (entries.length) entries[0].details.unshift(...prefaceDetails)
    else entries.push({ labels: [], dates: '', details: prefaceDetails })
  }

  return entries
}

function cleanHighlights(details: string[]): string[] {
  return details.map(stripBullet).filter(Boolean)
}

function toExperienceEntry(entry: RawDatedEntry): ParsedExperienceEntry {
  return {
    role: entry.labels[0] ?? '',
    company: entry.labels.slice(1).join(', '),
    dates: entry.dates,
    highlights: cleanHighlights(entry.details),
  }
}

const SCHOOL_HINT_PATTERN = /universit|college|institute|academy|\bschool\b/i

function toEducationEntry(entry: RawDatedEntry): ParsedEducationEntry {
  const labels = entry.labels
  if (labels.length >= 2 && SCHOOL_HINT_PATTERN.test(labels[0]) && !SCHOOL_HINT_PATTERN.test(labels[1])) {
    return { school: labels[0], degree: labels.slice(1).join(', '), dates: entry.dates }
  }
  return {
    degree: labels[0] ?? '',
    school: labels.slice(1).join(', '),
    dates: entry.dates,
  }
}

// A reference's relationship to the candidate is often printed as a small tag
// beside their job title (e.g. "Software Manager  Teacher"). Split it into its
// own field when the title ends with one of these words.
const RELATION_PATTERN =
  /\s+(friend|teacher|colleague|classmate|mentor|co-?worker|relative|neighbou?r|family|referee|supervisor|professor|tutor)$/i

function splitTitleAndRelation(line: string): { title: string; relation: string } {
  const match = line.match(RELATION_PATTERN)
  if (match && match.index && match.index > 0) {
    return { title: line.slice(0, match.index).trim(), relation: match[1] }
  }
  return { title: line, relation: '' }
}

function groupReferences(lines: string[]): ParsedReferenceEntry[] {
  const entries: ParsedReferenceEntry[] = []

  function ensureCard(startNew: boolean): ParsedReferenceEntry {
    if (startNew || entries.length === 0) {
      const card: ParsedReferenceEntry = { name: '', title: '', company: '', relation: '', phone: '', email: '' }
      entries.push(card)
      return card
    }
    return entries[entries.length - 1]
  }

  for (const line of lines) {
    const last = entries[entries.length - 1] as ParsedReferenceEntry | undefined

    const emailMatch = line.match(EMAIL_PATTERN)
    if (emailMatch) {
      const entry = ensureCard(entries.length > 0 && Boolean(last?.email))
      entry.email = emailMatch[0]
      continue
    }
    const phoneMatch = findPhone(line)
    if (phoneMatch) {
      const entry = ensureCard(entries.length > 0 && Boolean(last?.phone))
      entry.phone = phoneMatch
      continue
    }

    const entry = ensureCard(entries.length > 0 && Boolean(last?.name && last?.title))
    if (!entry.name) {
      const [name, company] = line.split(/\s+[—–-]\s+/)
      entry.name = name?.trim() ?? line
      if (company) entry.company = company.trim()
    } else {
      const { title, relation } = splitTitleAndRelation(line)
      entry.title = title
      if (relation) entry.relation = relation
    }
  }

  return entries.filter((entry) => entry.name || entry.email || entry.phone)
}

/**
 * Derive the candidate's name and professional title from the header lines that
 * appear before the first recognised section. Names are often stacked across
 * multiple lines (e.g. "KIM" / "SOTHEARA"), so leading short lines are joined
 * until a title-like line or a complete name is reached.
 */
function parseHeader(preamble: string[]): { fullName?: string; title?: string } {
  const nameParts: string[] = []
  let title: string | undefined
  let nameDone = false

  for (const line of preamble) {
    if (EMAIL_PATTERN.test(line) || findPhone(line)) continue
    if (TITLE_HINT_PATTERN.test(line)) {
      if (!title) title = line
      nameDone = true
      continue
    }
    if (nameDone) continue
    nameParts.push(line)
    const wordCount = line.split(/\s+/).length
    if (wordCount >= 2 || nameParts.length >= 2) nameDone = true
  }

  return { fullName: nameParts.join(' ').trim() || undefined, title }
}

export function parseResumeSections(rawText: string): ParsedResumeSections {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const email = rawText.match(EMAIL_PATTERN)?.[0]
  let phone = findPhone(rawText)

  const bucket: Record<SectionKey, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    references: [],
    languages: [],
    contact: [],
  }
  const preamble: string[] = []

  let current: SectionKey | null = null
  for (const line of lines) {
    const heading = matchHeading(line)
    if (heading) {
      current = heading.key
      if (heading.rest) bucket[heading.key].push(heading.rest)
      continue
    }

    if (current) {
      bucket[current].push(line)
    } else if (isDetailLine(line)) {
      // A paragraph before any heading is most likely an unlabelled summary.
      bucket.summary.push(line)
    } else {
      preamble.push(line)
    }
  }

  const { fullName, title } = parseHeader(preamble)

  // The contact block holds the phone, email and (usually) the location.
  let location: string | undefined
  for (const line of bucket.contact) {
    if (EMAIL_PATTERN.test(line)) continue
    if (findPhone(line)) {
      phone = line
      continue
    }
    if (!location && line.split(/\s+/).length <= 5) location = line
  }

  const splitLines = (values: string[]): string[] =>
    values.flatMap((line) =>
      line
        .split(/[,•|]/)
        .map((s) => s.trim())
        .filter(Boolean),
    )

  return {
    fullName,
    title,
    location,
    email,
    phone,
    summary: bucket.summary.join(' ').trim() || undefined,
    experienceEntries: splitDatedEntries(bucket.experience)
      .map(toExperienceEntry)
      .filter((entry) => entry.role || entry.company || entry.dates || entry.highlights.length),
    educationEntries: splitDatedEntries(bucket.education)
      .map(toEducationEntry)
      .filter((entry) => entry.degree || entry.school || entry.dates),
    referenceEntries: groupReferences(bucket.references),
    skillLines: splitLines(bucket.skills),
    languageLines: splitLines(bucket.languages),
  }
}
