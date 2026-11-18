# Project memory

## Product intent & audience

- StudyKit: free bilingual educational web app for students
- Core features: study task management, exam countdowns, smart notes, in-browser PDF merging
- PDF merging is client-side only (no server upload)
- Bilingual support (specific languages not yet confirmed)

## Brand personality & voice

- Educational, helpful, student-friendly
- Production-quality presentation expected

## Visual design & UX direction

- Hero section includes a transparent educational illustration
- Navy is used as an accent/decoration color in the design
- Layout, colors, fonts, and existing sections are considered stable baseline — avoid altering previously completed design work
- Recent design iteration involved decorative navy corner layers in the hero, which were removed to restore prior state

## Decisions, constraints & rationale

- Stack: Vite + React + Tailwind CSS + Lucide React icons
- Path alias `@/` maps to `src/` for module imports
- No additional UI/theme/icon packages beyond what the template provides
- User strongly prefers preserving existing work; changes should be incremental and reversible
- Typecheck, lint, and production build are expected to pass after changes

## Open questions & assumptions

- Which two languages does "bilingual" refer to? (not yet confirmed)
- Specific routing structure and page list not yet documented
- Notes feature details (format, storage mechanism) unknown
- Task management data persistence approach unknown (localStorage vs. other)