# Loopcodez design system

## Visual thesis: Open Loop

An idea becomes more useful when different minds connect. The infinity symbol represents automation, consistency, and ongoing support; its scroll-driven separation reveals the parts that make up a complete product. The visual identity is Loopcodez throughout public pages, metadata, navigation, and the favicon.

Three directions were considered before implementation:

| Direction | Character | Decision |
| --- | --- | --- |
| Open Loop | Charcoal, ivory, acid lime; clear glass; editorial type | Selected for a recognisable brand object and calm baseline |
| Optical Lab | White field, cobalt accents, dense technical annotations | Too clinical for the founders’ independent studio voice |
| Chromatic Playground | Saturated colour fields and constant kinetic type | Too much visual competition with the glass scene |

## Palette

| Token | Value | Role |
| --- | --- | --- |
| Ink | `#10120f` | Main background |
| Paper | `#f0f0e8` | Primary text and neutral actions |
| Signal | `#d2ef83` | Identity, active services, final invitation |
| Secondary surface | `#1b2018` | Studio section |
| Process surface | `#e7ebdf` | Light chapter for reading |
| Muted text | `#afb5aa` | Supporting text |

The current overrides live in `styles/loopcodez.css`, loaded after the retained route styles. Avoid reintroducing orange or gold as a studio accent. Client project artwork retains its own identity.

## Typography and composition

DM Sans carries navigation, content, and oversized display text. Instrument Serif italics add a human counterpoint to words such as “motion.” JetBrains Mono remains available for technical project metadata. Keep the page readable without a canvas or JavaScript.

The hero uses a left-aligned headline and a large glass mark behind and beside it. Curated work uses staggered panels, followed by a studio statement, six interactive expertise tabs, a light process chapter, a lab invitation, and a large contact footer. Spacing is compact between chapters. There is no decorative wire grid or numerical section labelling.

Mobile gets its own composition: a smaller central mark, a separated text area, single-column work, a two-column process, and a large navigation menu. Always check actual phone widths, short viewports, keyboard focus, and overflow after changing type sizes.

## Interaction

Scrolling breaks the loop into glass sections, and scrolling back reassembles it. Pointer tilt is subtle and does not change content. Crystals and small particles establish depth. Users can pause the hero animation. Reduced-motion users receive a stable composition with no scrub or idle animation.

Services use accessible tabs with focus/keyboard navigation and animated details. Navigation uses real links with a brief outgoing/incoming curtain; modifier clicks, downloads, external links, and same-page anchors preserve their normal behaviour. A short entrance loader exits automatically without gating HTML. Reduced motion skips the loader, curtain, idle animation, and scroll movement.

Inner pages share expressive two-line headings but use distinct compositions: an editorial work archive, alternating service sculptures, a light studio-values chapter and founder monograms, a visual lab collection, and a split project-brief page. Custom case studies support text, split, and statement chapters. The admin uses the same palette with quieter controls and clear saved/unsaved states.

## References

See [the reference review](docs/references.md). These sites inform craft, content clarity, and interaction principles. Their layouts, assets, logos, code, and copy are not imported into Loopcodez.
