import type { TemplateTheme } from '@/domain/resume.types'

const FONT_STACKS: Record<TemplateTheme['fontFamily'], string> = {
  sans: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"Courier New", Courier, monospace',
}

export function resolveFontStack(fontFamily: TemplateTheme['fontFamily']): string {
  return FONT_STACKS[fontFamily]
}
