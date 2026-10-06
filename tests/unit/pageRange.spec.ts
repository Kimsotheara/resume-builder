import { describe, expect, it } from 'vitest'

import { parsePageRange } from '@/infrastructure/convert/pageRange'

describe('parsePageRange', () => {
  it('returns every page for empty input', () => {
    expect(parsePageRange('', 3)).toEqual([1, 2, 3])
  })

  it('parses ranges and single pages, deduplicated and sorted', () => {
    expect(parsePageRange('5, 1-3, 2', 10)).toEqual([1, 2, 3, 5])
  })

  it('clamps ranges to the page count', () => {
    expect(parsePageRange('2-99', 4)).toEqual([2, 3, 4])
  })

  it('rejects invalid input', () => {
    expect(() => parsePageRange('abc', 4)).toThrow()
    expect(() => parsePageRange('3-1', 4)).toThrow()
    expect(() => parsePageRange('9', 4)).toThrow()
  })
})
