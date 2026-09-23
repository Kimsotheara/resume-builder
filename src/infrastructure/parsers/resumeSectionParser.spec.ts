import { describe, expect, it } from 'vitest'

import { parseResumeSections } from './resumeSectionParser'
import extracted from './__fixtures__/kim-sotheara.extracted.txt?raw'

describe('parseResumeSections - two-column CV', () => {
  const parsed = parseResumeSections(extracted)

  it('extracts the header identity fields', () => {
    expect(parsed.fullName).toBe('KIM SOTHEARA')
    expect(parsed.title).toBe('BACKEND ENGINEER')
    expect(parsed.email).toBe('thearakim789@gmail.com')
    expect(parsed.phone).toBe('099 336 936, 016 883 793')
    expect(parsed.location).toBe('Phnom Penh')
  })

  it('keeps the professional summary out of the contact/skills text', () => {
    expect(parsed.summary).toMatch(/^Highly motivated individual/)
    expect(parsed.summary).toMatch(/any challenge\.$/)
    expect(parsed.summary).not.toMatch(/CONTACT|BACKEND ENGINEER|Phnom Penh/)
  })

  it('captures every skill as its own entry', () => {
    expect(parsed.skillLines).toEqual([
      'JAVA',
      'Spring boot',
      'PHP Laravel backpack',
      'Understanding C#',
      'Agile Methodologies',
      'Scrum Framework',
      'Version Control Systems',
      'Other',
      'Microservices Architecture',
      'CQRS Pattern and Clean Architecture',
      'Project Documentation',
      'Database Management',
    ])
  })

  it('keeps role, company, dates and highlights together for each job', () => {
    expect(parsed.experienceEntries).toHaveLength(3)

    const [first, second, third] = parsed.experienceEntries
    expect(first.role).toBe('Full Stack Software Developer')
    expect(first.company).toBe('Kim&Lim soft, Phnom penh')
    expect(first.dates).toBe('November 2021 - Present')
    expect(first.highlights[0]).toBe(
      'Managed project workflow within Agile methodology utilizing tools like JIRA, Confluence and Trello boards',
    )
    expect(first.highlights).toContain('Build a logistics application with Java Spring boot')

    expect(second.role).toBe('Web Developer')
    expect(second.company).toBe('CloudNet Cambodia, Phnom penh')
    expect(second.dates).toBe('December 2018 - October 2021')

    expect(third.role).toBe('IT Support')
    expect(third.company).toBe('Soursday Cambodia, Phnom Penh')
    expect(third.dates).toBe('October 2016 - October 2017')
  })

  it('merges wrapped highlight lines into a single bullet', () => {
    const first = parsed.experienceEntries[0]
    expect(first.highlights).toContain(
      'Designed and build RESTful APIs with Java Spring boot and NestJs for mobile and web applications',
    )
    // The wrapped continuation should not appear as its own highlight.
    expect(first.highlights).not.toContain('and web applications')
  })

  it('parses education entries with degree and school', () => {
    const degrees = parsed.educationEntries.map((e) => e.degree)
    expect(degrees).toContain('Bachelor Degree of Computer Science in Computer Science')

    const bachelor = parsed.educationEntries.find((e) =>
      e.degree.startsWith('Bachelor Degree'),
    )
    expect(bachelor?.school).toBe('Royal University of Phnom Penh(RUPP)')
    expect(bachelor?.dates).toBe('March 2019')
  })

  it('parses references with name, company and contacts', () => {
    expect(parsed.referenceEntries.length).toBeGreaterThanOrEqual(2)
    const [first, second] = parsed.referenceEntries
    expect(first.name).toBe('Sothea San')
    expect(first.company).toBe('CloudNet')
    expect(first.title).toBe('Software Manager')
    expect(first.relation).toBe('Teacher')
    expect(first.email).toBe('ksmart.lion@gmail.com')
    expect(first.phone).toBe('085555977')

    expect(second.name).toBe('Sros Yort')
    expect(second.company).toBe('MBanq')
    expect(second.title).toBe('Lead Software Engineer')
    expect(second.relation).toBe('Friend')
    expect(second.email).toBe('yortsros@gmail.com')
  })
})
