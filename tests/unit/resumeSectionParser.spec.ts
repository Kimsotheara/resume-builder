import { describe, expect, it } from 'vitest'

import { parseResumeSections } from '@/infrastructure/parsers/resumeSectionParser'

describe('parseResumeSections', () => {
  it('extracts name, email, phone and summary before the first heading', () => {
    const raw = `Alex Rivera
alex.rivera@email.com
(415) 555-0148
Product designer with 6 years of experience.

Experience
Northwind Labs, Senior Product Designer, 2022 - Present

Education
Rhode Island School of Design

Skills
Figma, Design systems, Prototyping`

    const result = parseResumeSections(raw)

    expect(result.fullName).toBe('Alex Rivera')
    expect(result.email).toBe('alex.rivera@email.com')
    expect(result.phone).toContain('415')
    expect(result.summary).toContain('Product designer')
    expect(result.experienceLines).toContain('Northwind Labs, Senior Product Designer, 2022 - Present')
    expect(result.educationLines).toContain('Rhode Island School of Design')
    expect(result.skillLines).toEqual(['Figma', 'Design systems', 'Prototyping'])
  })

  it('returns empty arrays when the text has no recognizable structure', () => {
    const result = parseResumeSections('   \n  \n')
    expect(result.experienceLines).toEqual([])
    expect(result.educationLines).toEqual([])
    expect(result.skillLines).toEqual([])
    expect(result.fullName).toBeUndefined()
  })
})
