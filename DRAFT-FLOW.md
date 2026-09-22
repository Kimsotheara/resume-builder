# Resume Builder — Draft Flow & Project Plan

## 1. Purpose

A frontend-only Vue.js app that lets a user:

1. Upload a sample/existing resume (PDF, DOCX, or image).
2. Extract or manually confirm the resume content (name, contact, experience, education, skills, etc.).
3. Choose from 20+ modern/creative templates.
4. Preview the resume rendered in the chosen template.
5. Download the final resume as a PDF.

**Constraints**

- Frontend only — **Vue.js** (Vue 3 + Composition API recommended).
- No backend, no server, no database.
- No persisted storage beyond the browser session (in-memory app state; optional `localStorage` only as a "remember my draft" convenience, not a requirement).
- All parsing, rendering, and PDF export happen client-side in the browser.

---

## 2. High-Level User Flow

```
┌──────────────┐     ┌───────────────┐     ┌────────────────┐     ┌─────────────────┐     ┌───────────────┐
│  1. Landing   │ ──> │ 2. Upload/    │ ──> │ 3. Review &    │ ──> │ 4. Choose        │ ──> │ 5. Preview &   │
│     Page      │     │    Start Blank│     │    Edit Data   │     │    Template      │     │    Export PDF  │
└──────────────┘     └───────────────┘     └────────────────┘     └─────────────────┘     └───────────────┘
```

### Step 1 — Landing Page

- App intro + CTA: "Upload your resume" or "Start from scratch."
- Optional: show a carousel/grid preview of a few templates to hook the user.

### Step 2 — Upload Sample Resume

- User uploads a file: `.pdf`, `.docx`, or image (`.png`/`.jpg`).
- Client-side parsing:
  - **PDF** → parse text with `pdf.js`.
  - **DOCX** → parse with `mammoth.js` or `docx-preview`.
  - **Image** → optional OCR with `tesseract.js` (stretch goal; can be skipped in MVP).
- Fallback: if parsing fails or user skips upload, show a blank structured form.
- Parsed text is passed through a lightweight heuristic/regex parser to bucket into sections (name, email, phone, summary, experience, education, skills). This is best-effort — user always gets to review/correct in the next step.

### Step 3 — Review & Edit Data

- A structured form (not raw text) with sections:
  - Personal Info (name, title, email, phone, location, links)
  - Summary / Objective
  - Work Experience (repeatable: company, role, dates, bullet points)
  - Education (repeatable: school, degree, dates)
  - Skills (tag input)
  - Optional sections: Projects, Certifications, Languages, Awards
- Data is held in a central reactive store (Pinia) — this is the single source of truth used by every template.
- User can add/remove/reorder sections and entries (drag-and-drop reordering is a nice-to-have).

### Step 4 — Choose Template

- Gallery/grid view of 20+ templates with live thumbnail previews (rendered from the user's _actual_ data, not static images, so the preview is accurate).
- Filter/sort by style tag: `Modern`, `Creative`, `Minimal`, `Bold`, `Colorful`, `Two-column`, `Timeline`, `Photo`, `ATS-friendly`, etc.
- Clicking a template sets it as "active" and jumps to the live preview.
- Switching templates must be instant and non-destructive (data doesn't change, only the presentation layer).

### Step 5 — Preview & Export PDF

- Full-page live preview of the resume in the selected template, using the same data model.
- Controls: accent color picker, font pairing selector (optional), zoom.
- "Download PDF" button:
  - Render the resume DOM to PDF client-side using `html2canvas` + `jsPDF`, **or** `html2pdf.js` (wraps both), for pixel-accurate output.
  - Enforce A4/Letter page sizing and print CSS (`@media print`) so on-screen and exported versions match.
- Optional: "Download as image (PNG)" or "Print" as secondary export options.

---

## 3. Architecture Overview

```
resume-builder/
├── public/
├── src/
│   ├── assets/                # fonts, icons, template thumbnails
│   ├── components/
│   │   ├── upload/
│   │   │   ├── FileUpload.vue
│   │   │   └── ParsePreview.vue
│   │   ├── form/
│   │   │   ├── PersonalInfoForm.vue
│   │   │   ├── ExperienceForm.vue
│   │   │   ├── EducationForm.vue
│   │   │   ├── SkillsForm.vue
│   │   │   └── SectionManager.vue
│   │   ├── templates/
│   │   │   ├── TemplateGallery.vue
│   │   │   ├── TemplateCard.vue
│   │   │   └── resumes/           # one component per template
│   │   │       ├── ModernOne.vue
│   │   │       ├── ModernTwo.vue
│   │   │       ├── CreativeOne.vue
│   │   │       ├── ... (20+ total)
│   │   ├── preview/
│   │   │   ├── ResumePreview.vue
│   │   │   └── ExportControls.vue
│   │   └── common/                # buttons, steppers, modals
│   ├── composables/
│   │   ├── useResumeParser.js     # pdf.js / mammoth.js glue
│   │   ├── usePdfExport.js        # html2pdf.js glue
│   │   └── useTemplateRegistry.js # maps template id -> component + meta
│   ├── stores/
│   │   └── resume.store.js        # Pinia: single source of truth for resume data
│   ├── router/
│   │   └── index.js               # steps as routes: /upload, /edit, /templates, /preview
│   ├── data/
│   │   └── templates.json         # template metadata (id, name, tags, thumbnail)
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js
```

### Key Design Decisions

- **State management:** Pinia store holds the normalized resume JSON. Every template component is a "pure" renderer that takes this JSON as props — this decouples data from presentation and makes adding new templates trivial.
- **Templates as components:** Each template is its own Vue SFC with its own scoped CSS/layout, but they all consume the same `resume` object shape. This lets you scale past 20 templates without touching shared logic.
- **Routing as a stepper:** Vue Router (or a simple step-state) drives the 5-step flow so users can go back/forward without losing data.
- **PDF export:** Render the _actual visible_ template DOM node (off-screen if needed at fixed A4 pixel dimensions) through `html2pdf.js`. Keeps visual parity between preview and export without needing a backend renderer.
- **No backend:** All parsing (`pdf.js`, `mammoth.js`), state (Pinia), and export (`html2pdf.js`) run entirely in-browser. No API calls, no persistence beyond optional `localStorage` autosave.

---

## 4. Suggested Tech Stack

| Concern             | Library                                |
| ------------------- | -------------------------------------- |
| Framework           | Vue 3 (`<script setup>`)               |
| Build tool          | Vite                                   |
| State management    | Pinia                                  |
| Routing             | Vue Router                             |
| Styling             | Tailwind CSS (fast to theme templates) |
| PDF parsing         | `pdf.js` (`pdfjs-dist`)                |
| DOCX parsing        | `mammoth.js`                           |
| PDF export          | `html2pdf.js` (html2canvas + jsPDF)    |
| Drag & drop reorder | `vuedraggable`                         |
| Icons               | `lucide-vue-next` or `heroicons`       |

---

## 5. Data Model (shared by all templates)

```json
{
  "personalInfo": {
    "fullName": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "linkedin": "",
    "photoUrl": ""
  },
  "summary": "",
  "experience": [{ "company": "", "role": "", "startDate": "", "endDate": "", "current": false, "bullets": [""] }],
  "education": [{ "school": "", "degree": "", "field": "", "startDate": "", "endDate": "" }],
  "skills": [""],
  "projects": [{ "name": "", "description": "", "link": "" }],
  "certifications": [{ "name": "", "issuer": "", "date": "" }],
  "languages": [{ "name": "", "level": "" }],
  "meta": {
    "activeTemplateId": "modern-01",
    "accentColor": "#2563eb"
  }
}
```

---

## 6. Template Plan (20+ Modern & Creative)

Group into style families so design effort is reusable (shared layout skeletons, different theming):

1. **Modern Minimal** (x5) — clean single-column, generous whitespace, subtle accent color, sans-serif.
2. **Modern Two-Column** (x5) — sidebar for contact/skills, main column for experience; good for photo + icons.
3. **Creative/Bold** (x5) — color blocks, asymmetric layout, bold typography, accent shapes.
4. **Timeline-Style** (x3) — vertical timeline for experience/education, good for career-progression storytelling.
5. **Compact/ATS-Friendly** (x2+) — plain single-column, no graphics, optimized for applicant tracking systems.

Each template component receives: `resume` (data object) + `accentColor` prop, and is responsible only for layout/typography — keeping the data contract identical is what makes "20+ templates" tractable.

---

## 7. Implementation Steps (Build Order)

### Phase 0 — Project Setup

1. `npm create vite@latest resume-builder -- --template vue`
2. Install deps: `pinia`, `vue-router`, `tailwindcss`, `pdfjs-dist`, `mammoth`, `html2pdf.js`, `vuedraggable`.
3. Set up folder structure (see §3), Tailwind config, base layout/App shell with a step indicator.

### Phase 1 — Data Layer

4. Define the resume data shape in `stores/resume.store.js` with sensible defaults + actions (`updatePersonalInfo`, `addExperience`, `removeExperience`, `reorderSkills`, etc.).
5. Wire up `localStorage` persistence (optional autosave) via a Pinia plugin — purely a convenience, not a backend.

### Phase 2 — Upload & Parse

6. Build `FileUpload.vue` (drag-and-drop + file picker, accepts pdf/docx).
7. Implement `useResumeParser.js`:
   - PDF branch: extract text via `pdf.js`.
   - DOCX branch: extract text/html via `mammoth.js`.
   - Run a best-effort section splitter (regex/heuristics for headings like "Experience", "Education", "Skills").
8. Build `ParsePreview.vue` to show parsed sections before committing them to the store, with a "skip / start blank" escape hatch.

### Phase 3 — Edit Form

9. Build form components for each section (Personal Info, Summary, Experience, Education, Skills, + optional sections).
10. Add add/remove/reorder controls (use `vuedraggable` for experience/education/skills lists).
11. Bind every field directly to the Pinia store (v-model through computed getters/setters).

### Phase 4 — Template Gallery

12. Build `templates.json` metadata (id, name, tags, thumbnail path) for 20+ templates.
13. Build the first 3-4 template components fully (one per style family) to validate the shared data contract.
14. Build `TemplateGallery.vue` — grid of `TemplateCard.vue`, each rendering a **live mini-preview** (scaled-down actual template component, not a static image) using the current resume data.
15. Implement `useTemplateRegistry.js` to map `templateId -> component` (dynamic `defineAsyncComponent` per template for lazy loading, keeps bundle size sane at 20+ templates).
16. Flesh out remaining templates by cloning the closest style family and restyling (fonts, colors, spacing, section order).

### Phase 5 — Preview & PDF Export

17. Build `ResumePreview.vue`: full-size render of the active template at fixed page dimensions (A4/Letter), with print-safe CSS (`@page`, `@media print`).
18. Build `usePdfExport.js` using `html2pdf.js`:
    - Target the preview DOM node.
    - Configure page size, margins, image quality/scale for crisp text.
    - Trigger download as `<FullName>-resume.pdf`.
19. Add `ExportControls.vue`: accent color picker, download PDF button, (optional) download PNG, print button.

### Phase 6 — Polish

20. Responsive design for mobile/tablet (at least for upload/edit steps; preview can be desktop-first).
21. Empty/error states: parse failure, unsupported file type, missing required fields before export.
22. Accessibility pass: form labels, focus states, contrast on template accent colors.
23. Performance: lazy-load template components, compress/cache thumbnail previews.
24. QA: test PDF export fidelity across all 20+ templates (page breaks for long content, font embedding, image scaling).

---

## 8. Open Questions / Decisions Needed

- **OCR for scanned/image resumes**: include `tesseract.js` in MVP, or defer as a stretch goal? _(Recommendation: defer — adds bundle size/complexity, most resumes are text-based PDF/DOCX.)_
- **Multi-page resumes**: does PDF export need to support automatic page breaks for long content? _(Recommendation: yes — required for realistic resumes; `html2pdf.js` supports page-break CSS rules.)_
- **Autosave**: use `localStorage` to survive page refresh, or keep everything purely in-memory per session? _(Recommendation: light `localStorage` autosave — improves UX, still no backend/server involved.)_
- **Template count strategy**: hand-build all 20+ individually, or build 4-5 layout "skeletons" with theme variants (color/font/spacing) to reach 20+ faster? _(Recommendation: skeleton + theme-variant approach for speed, while still art-directing 3-4 fully bespoke "flagship" templates for visual variety.)_

---

## 9. Next Step

Once this plan is confirmed, scaffold the Vite + Vue 3 project (Phase 0) and set up the Pinia data store (Phase 1) as the foundation everything else builds on.
