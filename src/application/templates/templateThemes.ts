import type { TemplateDefinition } from '@/domain/resume.types'

/**
 * Every template on the gallery is one of five layout families rendered by
 * `presentation/components/resume-templates/*`. A "template" here is just a
 * family + a theme (colors, font). This keeps 24 templates driven by five
 * actual layout components instead of 24 near-duplicate ones.
 */
export const templateDefinitions: TemplateDefinition[] = [
  // Minimal — single column, colored accent rule under the name
  {
    id: 'clarity',
    name: 'Clarity',
    family: 'minimal',
    tags: ['Minimal', 'Modern'],
    theme: { accentColor: '#2563eb', fontFamily: 'sans' },
  },
  {
    id: 'meridian',
    name: 'Meridian',
    family: 'minimal',
    tags: ['Minimal', 'Modern'],
    theme: { accentColor: '#2f6b3a', fontFamily: 'sans' },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    family: 'minimal',
    tags: ['Minimal', 'Modern'],
    theme: { accentColor: '#7c3aed', fontFamily: 'sans' },
  },
  {
    id: 'ember',
    name: 'Ember',
    family: 'minimal',
    tags: ['Minimal', 'Modern'],
    theme: { accentColor: '#c2410c', fontFamily: 'sans' },
  },
  {
    id: 'slate',
    name: 'Slate',
    family: 'minimal',
    tags: ['Minimal', 'Modern'],
    theme: { accentColor: '#475569', fontFamily: 'sans' },
  },

  // Sidebar — two-column with a solid-color sidebar
  {
    id: 'ledger',
    name: 'Ledger',
    family: 'sidebar',
    tags: ['Two-column', 'Modern'],
    theme: { accentColor: '#1f2937', secondaryColor: '#4b5768', fontFamily: 'sans' },
  },
  {
    id: 'northbound',
    name: 'Northbound',
    family: 'sidebar',
    tags: ['Two-column', 'Modern'],
    theme: { accentColor: '#0f6f66', secondaryColor: '#41a196', fontFamily: 'sans' },
  },
  {
    id: 'cobalt',
    name: 'Cobalt',
    family: 'sidebar',
    tags: ['Two-column', 'Modern'],
    theme: { accentColor: '#1e3a8a', secondaryColor: '#3b5bb0', fontFamily: 'sans' },
  },
  {
    id: 'maroon',
    name: 'Maroon',
    family: 'sidebar',
    tags: ['Two-column', 'Modern'],
    theme: { accentColor: '#7f1d1d', secondaryColor: '#a34444', fontFamily: 'sans' },
  },
  {
    id: 'ink',
    name: 'Ink',
    family: 'sidebar',
    tags: ['Two-column', 'Modern'],
    theme: { accentColor: '#111827', secondaryColor: '#4c3f8f', fontFamily: 'sans' },
  },

  // Bold header — colored header block, creative
  {
    id: 'signal',
    name: 'Signal',
    family: 'bold-header',
    tags: ['Creative', 'Modern'],
    theme: { accentColor: '#db2777', fontFamily: 'sans' },
  },
  {
    id: 'confetti',
    name: 'Confetti',
    family: 'bold-header',
    tags: ['Creative', 'Modern'],
    theme: { accentColor: '#7c3aed', fontFamily: 'sans' },
  },
  {
    id: 'citrus',
    name: 'Citrus',
    family: 'bold-header',
    tags: ['Creative', 'Modern'],
    theme: { accentColor: '#ea580c', fontFamily: 'sans' },
  },
  {
    id: 'current',
    name: 'Current',
    family: 'bold-header',
    tags: ['Creative', 'Modern'],
    theme: { accentColor: '#2563eb', fontFamily: 'sans' },
  },
  {
    id: 'verdant',
    name: 'Verdant',
    family: 'bold-header',
    tags: ['Creative', 'Modern'],
    theme: { accentColor: '#16a34a', fontFamily: 'sans' },
  },

  // Timeline — serif, vertical timeline dots
  {
    id: 'milestone',
    name: 'Milestone',
    family: 'timeline',
    tags: ['Timeline', 'Creative'],
    theme: { accentColor: '#b45309', fontFamily: 'serif' },
  },
  {
    id: 'waypoint',
    name: 'Waypoint',
    family: 'timeline',
    tags: ['Timeline', 'Creative'],
    theme: { accentColor: '#475569', fontFamily: 'serif' },
  },
  {
    id: 'heritage',
    name: 'Heritage',
    family: 'timeline',
    tags: ['Timeline', 'Creative'],
    theme: { accentColor: '#9f1239', fontFamily: 'serif' },
  },
  {
    id: 'voyage',
    name: 'Voyage',
    family: 'timeline',
    tags: ['Timeline', 'Creative'],
    theme: { accentColor: '#0f766e', fontFamily: 'serif' },
  },
  {
    id: 'legacy',
    name: 'Legacy',
    family: 'timeline',
    tags: ['Timeline', 'Creative'],
    theme: { accentColor: '#1e3a8a', fontFamily: 'serif' },
  },

  // Plain — ATS-friendly, no graphics, high contrast
  {
    id: 'plainscript',
    name: 'Plainscript',
    family: 'plain',
    tags: ['ATS-friendly', 'Minimal'],
    theme: { accentColor: '#111111', fontFamily: 'mono' },
  },
  {
    id: 'standard',
    name: 'Standard',
    family: 'plain',
    tags: ['ATS-friendly', 'Minimal'],
    theme: { accentColor: '#111111', fontFamily: 'sans' },
  },
  {
    id: 'ledgerline',
    name: 'Ledgerline',
    family: 'plain',
    tags: ['ATS-friendly', 'Minimal'],
    theme: { accentColor: '#374151', fontFamily: 'sans' },
  },
  {
    id: 'baseline',
    name: 'Baseline',
    family: 'plain',
    tags: ['ATS-friendly', 'Minimal'],
    theme: { accentColor: '#1d4ed8', fontFamily: 'sans' },
  },
]
