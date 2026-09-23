import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

// Vertical distance (in PDF points) within which two text items are treated as
// belonging to the same visual line.
const LINE_Y_TOLERANCE = 4
// Minimum width of a blank vertical band that qualifies as a column gutter.
const MIN_GUTTER_WIDTH = 12
// Minimum items required on each side for a gutter to count as a real column split.
const MIN_COLUMN_ITEMS = 4

interface PositionedItem {
  x: number
  y: number
  w: number
  str: string
}

/**
 * Group positioned text items into visual lines and return them in reading
 * order (top-to-bottom, left-to-right within a line).
 *
 * pdf.js yields items in content-stream order, which frequently does not match
 * the visual order a human reads (headings can come after their body text,
 * dates after the role, etc.). Rebuilding lines from the item geometry gives us
 * a dependable top-to-bottom order for the section parser to work with.
 */
function buildLines(items: PositionedItem[]): string[] {
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x)
  const lines: string[] = []
  let group: PositionedItem[] = []
  let anchorY: number | null = null

  const flush = () => {
    if (!group.length) return
    const ordered = [...group].sort((a, b) => a.x - b.x)
    let text = ''
    let prevEnd: number | null = null
    for (const item of ordered) {
      if (prevEnd !== null && item.x - prevEnd > 1) text += ' '
      text += item.str
      prevEnd = item.x + item.w
    }
    text = text.replace(/\s+/g, ' ').trim()
    if (text) lines.push(text)
    group = []
  }

  for (const item of sorted) {
    if (anchorY === null || Math.abs(item.y - anchorY) <= LINE_Y_TOLERANCE) {
      group.push(item)
      if (anchorY === null) anchorY = item.y
    } else {
      flush()
      group = [item]
      anchorY = item.y
    }
  }
  flush()
  return lines
}

/**
 * Detect the x-coordinate of a column gutter for two-column layouts (e.g. a CV
 * with a sidebar). Returns the midpoint of the widest blank vertical band that
 * has enough content on both sides, or null for single-column pages.
 */
function detectColumnSplit(items: PositionedItem[]): number | null {
  if (items.length < MIN_COLUMN_ITEMS * 2) return null
  const minX = Math.min(...items.map((i) => i.x))
  const maxX = Math.max(...items.map((i) => i.x + i.w))
  if (maxX - minX < 150) return null

  const step = 3
  let best: { center: number; width: number } | null = null
  let gapStart: number | null = null

  for (let x = minX; x <= maxX; x += step) {
    const crosses = items.some((i) => i.x < x && i.x + i.w > x)
    if (!crosses) {
      if (gapStart === null) gapStart = x
      continue
    }
    if (gapStart !== null) {
      const end = x - step
      const center = (gapStart + end) / 2
      const width = end - gapStart
      const left = items.filter((i) => i.x + i.w / 2 < center).length
      const right = items.filter((i) => i.x + i.w / 2 >= center).length
      if (left >= MIN_COLUMN_ITEMS && right >= MIN_COLUMN_ITEMS && width >= MIN_GUTTER_WIDTH) {
        if (!best || width > best.width) best = { center, width }
      }
      gapStart = null
    }
  }

  return best?.center ?? null
}

function orderPageItems(items: PositionedItem[]): string[] {
  const split = detectColumnSplit(items)
  if (split === null) return buildLines(items)

  const left = items.filter((i) => i.x + i.w / 2 < split)
  const right = items.filter((i) => i.x + i.w / 2 >= split)
  return [...buildLines(left), ...buildLines(right)]
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const doc = await pdfjsLib.getDocument({ data: buffer, standardFontDataUrl: '/standard_fonts/' }).promise

  const pageBlocks: string[] = []
  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
    const page = await doc.getPage(pageNumber)
    const content = await page.getTextContent()

    const items: PositionedItem[] = []
    for (const item of content.items) {
      if (!('str' in item) || !item.str.trim()) continue
      items.push({
        x: item.transform[4],
        y: item.transform[5],
        w: item.width,
        str: item.str,
      })
    }

    pageBlocks.push(orderPageItems(items).join('\n'))
  }

  return pageBlocks.join('\n').trim()
}
