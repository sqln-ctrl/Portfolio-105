# Motion and 3D

## Signature object

The mark follows a closed infinity curve with a small depth offset at its crossing. A single tube surface is split into 64 desktop sections (40 on mobile), preserving consistent normals at the joined boundaries. Each section owns a local center, outward vector, and deterministic rotation vector.

The initial state is assembled. Scroll progress across the hero maps to eased separation; the sections move outward and rotate. Reversing scroll reassembles the same object. No physics engine or imported model is involved.

The glass uses Three.js `MeshPhysicalMaterial` with transmission, thickness, a modest index of refraction, and clearcoat. Procedural studio lighting supplies its reflections. Floating octahedral crystals share geometry/material resources; a single `Points` object supplies the particle field.

## Ownership

`LoopScene` owns the renderer, animation frame, camera, environment map, materials, geometries, resize observer, visibility observer, pointer handler, and media-query listener. Cleanup cancels animation, disconnects observers, removes handlers, disposes GPU resources, and removes the canvas.

The loop stops rendering outside the viewport and when the page is hidden. Pixel ratio is capped at 1.7 on desktop and 1.3 on small screens. Mobile reduces fragments and particles. Resizing updates the camera and framing; the initial device allocation remains fixed until remount.

## Accessibility

- An HTML headline, description, and links always render immediately.
- A vector mark is visible while WebGL starts or is unavailable.
- WebGL context loss restores the vector fallback; restoration resumes rendering.
- Reduced motion disables idle animation, pointer motion, and fragmentation; the CSS hero has no long sticky scroll interval.
- Pause returns the object to its assembled state and stops idle animation. The control has `aria-pressed` and an explicit label.
- GSAP contexts and media queries are reverted on unmount.
- Native touch scrolling stays available; decorative canvas does not receive pointer events.

## Page and section transitions

The CSS entrance overlay exits after roughly 1.4 seconds and never blocks pointer input. RouteTransition covers same-origin page navigation in 0.32 seconds and reveals the next route in 0.65 seconds, with a timeout recovery. External links, modifiers, same-page anchors, and admin routes keep native navigation. Reduced motion bypasses interception entirely.

PageEnter reveals route headings, service chapters, work cards, founder cards, lab cards, case-study chapters, and the project form. The homepage process draws its connecting line as the steps enter. Service tabs animate detail changes. Inner SVG/CSS sculptures communicate connected systems, app surfaces, and continuous iteration without allocating additional WebGL scenes.

Animation contexts and listeners are cleaned up on unmount. Static HTML remains readable if JavaScript is unavailable. CSS artwork loops and transitions are disabled under reduced motion. Keep decorative movement slower than reading and avoid increasing scroll distances solely to extend animation time.

## Official API references

- [Three.js physical materials](https://threejs.org/docs/pages/MeshPhysicalMaterial.html)
- [Three.js tube geometry](https://threejs.org/docs/pages/TubeGeometry.html)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- Installed guide: `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`

When increasing material complexity or object counts, inspect frame pacing on a physical phone. Do not equate a desktop screenshot with a performance benchmark.
