# Studio 105 — Decisions Log

Use this file for significant design, UX, technical, asset, dependency, and performance decisions.

---

### 2026-08-12 — Fresh build mandate confirmed

**Context:** Studio 105 is a new agency site built from a blank repository. Documentation pack reviewed in full.

**Options considered:** Migrate old portfolio; partial reuse of prior theme/components; full greenfield build.

**Decision:** Full greenfield build. No migration, scraping, or reuse of previous portfolio visual language, components, or architecture.

**Why:** Founders and documentation explicitly require a new flagship product that proves craft independently of prior work.

**Trade-offs:** Slower initial build; all tokens, components, and content must be authored from scratch.

**Reversible?:** No

**Related docs/screenshots:** `01_MASTER_STRATEGY.docx`, `AGENTS.md`, `CURSOR_START_HERE.md`

---

### 2026-08-12 — Core stack locked for v1

**Context:** Technical architecture doc specifies production stack for the flagship site.

**Options considered:** Alternative frameworks (Astro, Remix); alternative motion/3D libraries.

**Decision:** Next.js + React + TypeScript + Tailwind/CSS variables + GSAP + ScrollTrigger + Lenis + Three.js, deployed on Vercel.

**Why:** Matches documented architecture; strong ecosystem for SSR/SEO, motion coordination, and procedural WebGL.

**Trade-offs:** Client-side weight must be managed; WebGL and motion modules need strict lazy-loading and cleanup discipline.

**Reversible?:** Partially (framework change would be costly)

**Related docs/screenshots:** `06_TECHNICAL_ARCHITECTURE.docx`

---

### 2026-08-12 — 3D approach: procedural first, no Blender dependency

**Context:** v1 must ship without Blender as a prerequisite.

**Options considered:** Blender-authored hero assets; Spline prototypes; procedural Three.js geometry.

**Decision:** Procedural Three.js for the signature 105 object; SVG/CSS/shaders for supporting graphics; licensed GLB only when justified.

**Why:** Documented priority; keeps asset pipeline code-driven and reversible.

**Trade-offs:** Hero object complexity capped by procedural skill; external assets require license tracking in `ASSETS.md`.

**Reversible?:** Yes

**Related docs/screenshots:** `05_3D_CREATIVE_TECH.docx`

---

### 2026-08-12 — Service taxonomy fixed for v1

**Context:** Founders supplied a service reference screenshot for capability names only.

**Options considered:** Rename/reorganize services; adopt screenshot visual treatment.

**Decision:** Keep six service names exactly: AI Agents, Automations, Web Development, App Development, Ecommerce Solutions, Content Management. Do not clone screenshot theme or card treatment.

**Why:** Explicit documentation rule; names are the only inherited element from the reference.

**Trade-offs:** Visual differentiation must come entirely from the new design system.

**Reversible?:** Yes (names can change with founder approval)

**Related docs/screenshots:** `08_CONTENT_PROJECTS.docx`, service reference screenshot

---

### 2026-08-12 — Portfolio intake: manual curation only

**Context:** Founder GitHub profiles exist but must not auto-populate the site.

**Options considered:** Auto-import repos; manual `projects.json` curation.

**Decision:** Maintain a manually curated content file. Each project requires explicit founder approval before publication.

**Why:** Documentation and content strategy require honest, selected proof—not a repo dump.

**Trade-offs:** Launch may use 3–5 placeholders until projects are approved.

**Reversible?:** No (policy)

**Related docs/screenshots:** `08_CONTENT_PROJECTS.docx`

---

### 2026-08-12 — Visual direction: pending founder review

**Context:** Design direction doc recommends exploring 2–3 territories before committing. Three original directions proposed (see project kickoff summary).

**Options considered:**
1. **Room Registry** — archival room-number system, warm human-tech baseline
2. **Signal Atelier** — precision editorial grid with kinetic motion layer
3. **Assembly Lab** — engineered disassembly aesthetic tied to procedural 105 object

**Decision:** **Signal Atelier (Direction B)** as structural foundation, with **Room Registry (Direction A)** warm accents — per `02_DESIGN_DIRECTION.docx` recommendation (Precision/Atelier + Kinetic motion + Human-Tech warmth).

**Why:** Documentation explicitly recommends this hybrid. User approved continuation without override. Wire 105 object deferred to M4; static Panel 105 placeholder in M1/M2.

**Trade-offs:** Homepage and token work blocked until direction is chosen.

**Reversible?:** Yes

**Related docs/screenshots:** `02_DESIGN_DIRECTION.docx`, `CURSOR_START_HERE.md`

---

### 2026-08-12 — M1 shell: design tokens and typography locked

**Context:** Milestone M1 requires Next.js scaffold, nav, footer, typography, and responsive layout before motion/WebGL.

**Options considered:** Clash Display, Geist, Instrument Serif, Fraunces for display; Inter, IBM Plex Sans for body.

**Decision:** Syne (display) + DM Sans (body) + JetBrains Mono (utility labels). Token palette: ink `#0B0F14`, paper `#F4EFE6`, signal `#C9A227`, fog `#2A3344`.

**Why:** Syne gives kinetic character without default tech-landing feel; DM Sans is highly legible; mono labels match instrument-panel nav spec.

**Trade-offs:** Syne is less editorial than a serif direction; can revisit if founders prefer more atelier tone.

**Reversible?:** Yes

**Related docs/screenshots:** `styles/tokens.css`, desktop/mobile homepage screenshots (2026-08-12)

---

### 2026-08-12 — M2 static homepage pass complete

**Context:** Homepage flow per `03_UX_IA_PAGE_FLOW.docx` — hero, work, services, process, about, CTA.

**Decision:** All six homepage sections built as static server components. Placeholder projects marked "Coming soon". 105 WebGL object deferred to M4; CSS grid placeholder used.

**Why:** Documentation requires static pass before advanced WebGL; honest placeholders until founders approve real projects.

**Trade-offs:** Hero lacks interactive proof until M4; contact form is UI-only (no backend).

**Reversible?:** Yes

**Related docs/screenshots:** `app/page.tsx`, `components/sections/*`

---

### 2026-08-12 — M3 motion system: GSAP + Lenis integrated

**Context:** Milestone M3 requires coherent motion language — hero sequence, scroll reveals, magnetic CTAs, pinned process, reduced-motion fallbacks.

**Decision:** Added `gsap` + `lenis`. Motion modules: `LenisProvider`, `Reveal`, `LineReveal`, `Magnetic`, hero timeline, work card scroll entry, service glyph hover, process pin (desktop), page enter fade, nav underline + header scroll offset.

**Why:** Matches `04_MOTION_INTERACTION.docx` vocabulary without SplitText (Club plugin). Unified Lenis ↔ ScrollTrigger sync via gsap ticker.

**Trade-offs:** Homepage sections are now client components where motion is applied; bundle size increased. Custom cursor deferred. Audio deferred to phase two.

**Reversible?:** Yes

**Related docs/screenshots:** `components/motion/*`, `lib/motion/*`

---

### 2026-08-12 — M4 WebGL: procedural Panel 105 hero object

**Context:** Milestone M4 requires signature procedural 105 object with interaction states, performance discipline, and graceful fallback.

**Decision:** Implemented Panel 105 — three box-constructed digits (1, 0, 5) with gold wire edges. Architecture: `hero-state.ts`, `create-hero-105-object.ts`, `create-hero-scene.ts`, `HeroSceneCanvas.tsx` (lazy via `next/dynamic`, SSR off). Unified state drives assembly, pointer tilt, hold-to-explode, and scroll morph.

**Why:** Matches `05_3D_CREATIVE_TECH.docx` Panel 105 form; no Blender/external GLB. IntersectionObserver pauses render off-screen; DPR capped at 2.

**Trade-offs:** Digit forms are abstract panels, not typographic perfection; mobile skips pointer tilt but supports hold-to-explode. Single hero renderer only (no section WebGL yet).

**Reversible?:** Yes

**Related docs/screenshots:** `lib/webgl/*`, `components/webgl/*`, `docs/ASSETS.md`

---

### 2026-08-12 — M5 projects: case study system and curated content file

**Context:** Milestone M5 requires case study template, manual curation, and honest draft placeholders until founders approve real work.

**Decision:** Created `lib/content/projects.ts` with full `CaseStudy` schema (4 draft projects). Built case study template components, editorial work archive with category filter, prev/next navigation, and `docs/PROJECTS_INTAKE.md` for founder workflow. All drafts marked `approved: false` with visible banner.

**Why:** Matches content docs — no GitHub auto-import; representative stories demonstrate template without false claims of live client work.

**Trade-offs:** Imagery still placeholder; slugs changed from generic alpha/beta/gamma to descriptive slugs (old URLs will 404 unless redirected).

**Reversible?:** Yes

**Related docs/screenshots:** `app/work/*`, `components/case-study/*`, `docs/PROJECTS_INTAKE.md`

---

### 2026-08-12 — Founder-selected live projects: Andaaz & GameVault

**Context:** Founders provided two deployed Vercel URLs for portfolio inclusion.

**Decision:** Added approved live case studies for **Andaaz — Luxury Watches** (`behreadab-store.vercel.app`) and **GameVault Account Manager** (`gamevault-eta.vercel.app`). Removed generic draft entries replaced by these ships. AI Task Agent and Workflow Automation remain drafts.

**Why:** Explicit founder project selection per content intake rules — not GitHub auto-import.

**Trade-offs:** Project screenshots not yet captured locally; accent gradients used on cards until assets are added. Case study copy based on live site review; founders should verify role claims and metrics.

**Reversible?:** Yes

**Related docs/screenshots:** `lib/content/projects.ts`

---

### 2026-08-12 — M6 QA pass: a11y, SEO, error states

**Context:** Milestone M6 requires accessibility, SEO, performance safeguards, and error handling before launch.

**Decision:** Added custom 404/error pages, skip-to-content link, keyboard-accessible mobile nav, contact form labels + live status, WebGL capability fallback, sitemap.xml, robots.txt, favicon, per-page metadata with Open Graph, and `aria-pressed` on work filters.

**Why:** Closes P0/P1 gaps from `09_ROADMAP_QA_LAUNCH.docx` without adding analytics or production domain (M7).

**Trade-offs:** Contact form still has no backend; OG image asset not yet designed; production URL defaults to `studio105.dev` placeholder.

**Reversible?:** Yes

**Related docs/screenshots:** `app/not-found.tsx`, `app/sitemap.ts`, `lib/seo/metadata.ts`

---

### 2026-08-12 — Visual direction pivot: Trionn-inspired (founder request)

**Context:** Founder reported Process scroll jank, 105 reading as "201" on rotation, plain pages, disliked gold/navy theme. Requested Trionn.com as primary reference for motion, graphics, and 3D energy — not old portfolio/GitHub aesthetic.

**Decision:** Retheme to deep black + white + amber/orange accent + cool rim light. Full-viewport hero with centered WebGL. Rebuilt 105 as canvas-text billboards that always face camera (no full Y spin). Removed Process ScrollTrigger pin. Added ambient grid/glow/noise, wire globe, custom service SVG icons, Trionn-style underlined CTAs.

**Why:** Addresses readability, scroll bugs, and liveliness while following founder's explicit reference change.

**Trade-offs:** Closer to Trionn energy — must keep Studio 105 identity (Room 105, 105 object) distinct in copy and mark.

**Reversible?:** Yes

**Related docs/screenshots:** Trionn.com reference, `styles/tokens.css`, `lib/webgl/create-hero-105-object.ts`

---

