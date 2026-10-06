/** Parses "1-3, 5" into sorted unique 1-based page numbers within [1, total]. Empty input means all pages. */
export function parsePageRange(input: string, total: number): number[] {
  const trimmed = input.trim()
  if (!trimmed) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set<number>()
  for (const part of trimmed.split(',')) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/)
    if (!match) throw new Error(`"${part.trim()}" is not a valid page range. Try something like 1-3, 5.`)
    const start = Number(match[1])
    const end = match[2] ? Number(match[2]) : start
    if (start < 1 || end < start) throw new Error(`"${part.trim()}" is not a valid page range.`)
    for (let page = start; page <= Math.min(end, total); page += 1) pages.add(page)
  }

  if (pages.size === 0) throw new Error(`This file only has ${total} page${total === 1 ? '' : 's'}.`)
  return [...pages].sort((a, b) => a - b)
}
