# Loopcodez Agent Rules

## Project identity
Loopcodez is an independent design and development studio founded by Umer and Saqlain. The current identity is Open Loop: an infinity mark, charcoal and ivory, electric lime, transparent crystals, and purposeful motion. Public branding must use Loopcodez.

## Non-negotiable reset
The current redesign is original. Never import or revive the previous portfolio's theme, layout, components, icons, graphics, 3D assets, frontend architecture, or visual language.

## Current source of truth
Read README.md, design.md, deployment.md, docs/architecture.md, docs/motion.md, docs/content.md, and docs/qa.md before relevant changes. The old docs/source text pack and uppercase historical decision documents are archival; their old identity and visual instructions are superseded.

## Database boundary
The user explicitly manages Supabase setup manually. Put SQL, migrations, seeds, role bootstrap, and verification queries in supabase/. Do not create a hosted project or execute database queries unless the user changes this instruction. Website code and local checks remain in scope.

## Studio permissions
The database owner role is labelled Super admin; editor is labelled Admin. Admins can manage content and enquiries but cannot add admins or change membership. Team-access APIs must verify the owner role on every request, independently of the UI. Do not add a production preview/authentication bypass.

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

