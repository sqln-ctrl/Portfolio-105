# Studio 105 — Project Intake

How founders add and approve portfolio projects.

## Rules

- GitHub repos are **not** auto-imported. Umer and Saqlain select projects manually.
- Each project must pass the selection matrix before `approved: true`.
- No project goes live without founder sign-off on title, role, claims, and assets.

## Selection matrix

| Criterion | Question |
|---|---|
| Visual quality | Does it look good enough to show? |
| Technical depth | Does it demonstrate engineering ability? |
| Fit | Does it support Studio 105 services? |
| Story | Can we explain problem, approach, and result? |
| Ownership | Can we accurately claim the work and role? |
| Assets | Do we have screenshots/media rights? |

## Adding a project

1. Copy an entry in `lib/content/projects.ts` or duplicate the structure below.
2. Set `featured: true` for homepage visibility (max 3–5).
3. Set `approved: false` until founders review.
4. Fill all case study fields per the template in `03_UX_IA_PAGE_FLOW.docx`.
5. Add screenshots to `public/images/work/[slug]/` when available.
6. Set `approved: true` and `status: "live"` after review.
7. Log the decision in `docs/DECISIONS.md`.

## Required fields

```typescript
{
  slug: "your-project-slug",
  title: "Project Name",
  category: "Web Development", // matches service taxonomy
  serviceSlug: "web-development",
  role: "Design & Engineering",
  timeline: "8 weeks",
  year: "2025",
  featured: true,
  status: "live",
  approved: true,
  outcome: "One-line measurable result.",
  problem: "...",
  insight: "...",
  approach: ["...", "..."],
  designDecisions: ["...", "..."],
  technologies: ["Next.js", "..."],
  interactionDetail: "Optional — motion/3D/interaction notes",
  results: ["...", "..."],
  reflection: "...",
  liveUrl: "https://...",   // optional
  githubUrl: "https://...", // optional — only if public/shareable
}
```

## Founder GitHub (reference only)

- Umer: https://github.com/SMPanther
- Saqlain: https://github.com/sqln-ctrl

Do not scrape or bulk-import repositories into the site.
