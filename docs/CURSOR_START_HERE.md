# Studio 105 — Cursor Start Here

## Mission
Build a completely new Studio 105 website from a blank repository. Do not migrate, redesign, scrape, or reuse the previous portfolio.

Studio 105 is a new agency founded by Umer and Saqlain, roommates whose origin story is Room 105. The number 105 is brand context and can become a visual motif, but the old portfolio's visual language is not a reference.

## Mandatory reset
- Do not copy the previous portfolio's theme, components, graphics, icons, 3D assets, layout, CSS, frontend architecture, or content structure.
- Do not import projects automatically from GitHub.
- GitHub repositories are background references only. Later, the founders will explicitly choose which projects to present.
- Start with a fresh Next.js + TypeScript codebase.

## Read these first
1. `00_STUDIO_105_DOCUMENT_INDEX.docx`
2. `01_MASTER_STRATEGY.docx`
3. `02_DESIGN_DIRECTION.docx`
4. `03_UX_IA_PAGE_FLOW.docx`
5. `04_MOTION_INTERACTION.docx`
6. `05_3D_CREATIVE_TECH.docx`
7. `06_TECHNICAL_ARCHITECTURE.docx`
8. `07_CURSOR_AGENT_MANUAL.docx`
9. `08_CONTENT_PROJECTS.docx`
10. `09_ROADMAP_QA_LAUNCH.docx`

## Install / enable these Cursor plugins
Install the current official/marketplace versions. Use the Marketplace if a slug differs.

```text
/add-plugin figma
/add-plugin gsap
/add-plugin superpowers
/add-plugin react-doctor
/add-plugin context7-plugin
/add-plugin browse
/add-plugin browserstack
/add-plugin vercel
```

Also enable the Magic Patterns marketplace plugin for visual exploration. It is a prototyping aid, not a source to copy from.

If any plugin requires authentication, stop and ask the human to complete the sign-in. Never invent credentials or put secrets in code.

## First task
Before writing the homepage:
1. Read all docs.
2. Summarize the constraints.
3. Create `/docs/DECISIONS.md`.
4. Propose 3 original visual directions for Studio 105.
5. Choose one direction only after human review.
6. Establish tokens, typography, grid, buttons, cards, nav, spacing, and responsive behavior.
7. Build the first static pass before adding advanced WebGL.

## Design rule
The supplied service screenshot is a reference for the six business capabilities only. Do not clone its theme or card treatment.

Services:
- AI Agents
- Automations
- Web Development
- App Development
- Ecommerce Solutions
- Content Management

## 3D rule
Blender is NOT required for v1. Prefer procedural Three.js geometry, SVG, CSS, shaders, 2.5D/depth effects, and properly licensed/open GLB assets when needed. The first signature 3D experiment should explore a procedural 105 mark/object.

## Quality gate
No feature is complete until Cursor:
- runs the site;
- checks desktop and mobile;
- captures screenshots;
- verifies spacing, typography, hierarchy, overflow, and motion states;
- checks reduced motion;
- checks keyboard access for interactive content;
- runs relevant diagnostics;
- records any major decision in `/docs/DECISIONS.md`.

## Working style
Think like a senior product designer + creative technologist + frontend engineer. Explore before coding. Prefer simple, reversible implementations. Keep motion and WebGL modular. Do not add libraries just because they are fashionable.

## Founder GitHub references
Umer: https://github.com/SMPanther
Saqlain: https://github.com/sqln-ctrl

Use these only when a founder explicitly selects a project for the Studio 105 portfolio.
