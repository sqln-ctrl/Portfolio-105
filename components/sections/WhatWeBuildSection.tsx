"use client";

import { SectionMarker } from "@/components/ui/SectionMarker";
import { Reveal } from "@/components/motion/Reveal";
import { whatWeBuild } from "@/lib/content/site";

export function WhatWeBuildSection() {
  return (
    <section
      id="what-we-build"
      className="relative border-b border-line bg-ink-soft/40 py-[clamp(3rem,2.5rem+2vw,5rem)]"
      aria-labelledby="what-we-build-heading"
    >
      <div className="container-site">
        <Reveal className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionMarker index="→" label="Output" className="mb-3" />
            <h2
              id="what-we-build-heading"
              className="display-heading text-3xl text-paper md:text-4xl"
            >
              What we build.
            </h2>
          </div>
          <p className="max-w-md text-sm text-text-muted">
            Services describe what you can hire us for. This is what actually
            comes out of the studio.
          </p>
        </Reveal>

        <Reveal stagger={0.06} className="what-we-build-grid">
          {whatWeBuild.map((item) => (
            <article key={item.label} className="what-we-build-item">
              <h3 className="what-we-build-label">{item.label}</h3>
              <p className="what-we-build-detail">{item.detail}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
