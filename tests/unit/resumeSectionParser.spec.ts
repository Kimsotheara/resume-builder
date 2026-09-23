import { describe, expect, it } from 'vitest'

import { parseResumeSections } from '@/infrastructure/parsers/resumeSectionParser'

describe('parseResumeSections', () => {
  it('extracts name, email, phone and summary before the first heading', () => {
    const raw = `Alex Rivera
alex.rivera@email.com
(415) 555-0148
Product designer with 6 years of experience.

Experience
Senior Product Designer
Northwind Labs
Jan 2022 - Present
Led the design system rewrite across the product.
Shipped three major releases with the mobile team.

Education
Rhode Island School of Design
BFA Graphic Design
2016 - 2020

Skills
Figma, Design systems, Prototyping`

    const result = parseResumeSections(raw)

    expect(result.fullName).toBe('Alex Rivera')
    expect(result.email).toBe('alex.rivera@email.com')
    expect(result.phone).toContain('415')
    expect(result.summary).toContain('Product designer')

    expect(result.experienceEntries).toHaveLength(1)
    expect(result.experienceEntries[0]).toMatchObject({
      role: 'Senior Product Designer',
      company: 'Northwind Labs',
      dates: 'Jan 2022 - Present',
    })
    expect(result.experienceEntries[0].highlights).toContain('Led the design system rewrite across the product.')

    expect(result.educationEntries).toHaveLength(1)
    expect(result.educationEntries[0]).toMatchObject({
      school: 'Rhode Island School of Design',
      degree: 'BFA Graphic Design',
      dates: '2016 - 2020',
    })

    expect(result.skillLines).toEqual(['Figma', 'Design systems', 'Prototyping'])
  })

  it('splits multiple dated roles into separate experience entries', () => {
    const raw = `Jordan Lee
jordan@example.com

Experience
Engineering Manager
Acme Corp
2021 - Present
Grew the platform team from 3 to 12 engineers.

Software Engineer
Acme Corp
2018 - 2021
Built the payments service from scratch.`

    const result = parseResumeSections(raw)

    expect(result.experienceEntries).toHaveLength(2)
    expect(result.experienceEntries[0].dates).toBe('2021 - Present')
    expect(result.experienceEntries[1].dates).toBe('2018 - 2021')
    expect(result.experienceEntries[1].role).toBe('Software Engineer')
  })

  it('groups reference lines into contact cards by content, not position', () => {
    const raw = `Sam Lee
sam@example.com
555-100-2000

References
Jamie Fox — Acme Inc
Engineering Director
555-201-0100
jamie@acme.com`

    const result = parseResumeSections(raw)

    expect(result.referenceEntries).toHaveLength(1)
    expect(result.referenceEntries[0]).toMatchObject({
      name: 'Jamie Fox',
      company: 'Acme Inc',
      title: 'Engineering Director',
      phone: '555-201-0100',
      email: 'jamie@acme.com',
    })
  })

  it('returns empty arrays when the text has no recognizable structure', () => {
    const result = parseResumeSections('   \n  \n')
    expect(result.experienceEntries).toEqual([])
    expect(result.educationEntries).toEqual([])
    expect(result.referenceEntries).toEqual([])
    expect(result.skillLines).toEqual([])
    expect(result.fullName).toBeUndefined()
  })
})
