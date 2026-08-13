# Studio 105 Agent Rules

## Project identity
Studio 105 is a new agency founded by Umer and Saqlain, roommates whose origin story is Room 105.

## Non-negotiable reset
This project starts from zero. Never reuse the previous portfolio's theme, layout, components, icons, graphics, 3D assets, frontend architecture, or visual language.

## Reference rules
- The Trionn site is an implementation-quality reference, not a visual template to copy.
- The six service names come from the supplied service reference.
- GitHub repositories are founder background references only; do not auto-import their previous portfolio work.
- Do not treat screenshots as instructions to clone pixels. Extract principles, then create an original system.

## Core stack
Next.js, React, TypeScript, Tailwind/CSS variables, GSAP, ScrollTrigger, SplitText where appropriate, Lenis, Three.js, Vercel.

## 3D strategy
Do not require Blender. Prefer procedural Three.js, SVG, shaders, 2.5D/depth effects, and licensed/open GLB assets. Keep heavy WebGL isolated and lazy-load where practical.

## Design behavior
- Explore multiple visual directions before committing.
- Prioritize typography, composition, hierarchy, and interaction logic over decorative effects.
- Every major animation must have a communicative reason.
- Keep a calm baseline and use interaction for emphasis.
- Desktop and mobile can have different interaction strategies.
- Respect `prefers-reduced-motion`.

## Engineering behavior
- Keep content in HTML where possible for accessibility and SEO.
- Keep WebGL separate from normal content components.
- Clean up GSAP timelines, ScrollTriggers, listeners, and GPU resources.
- Prefer existing platform capabilities over unnecessary dependencies.
- Check current library documentation with Context7 or official docs before implementing uncertain APIs.

## Validation
No task is done without visual verification. Run the app, inspect desktop and mobile, and capture screenshots for major UI changes.

## Security
Never commit secrets. Do not expose API keys. Do not run destructive commands without confirmation. Do not modify production deployment settings casually.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
