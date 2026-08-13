"use client";

import { SectionMarker } from "@/components/ui/SectionMarker";
import { AmbientBackground, CrosshairMark } from "@/components/graphics/AmbientBackground";
import { Reveal } from "@/components/motion/Reveal";
import { processSteps } from "@/lib/content/site";

export function ProcessSection() {
  return (
    <section
      className="relative section-pad overflow-hidden"
      aria-labelledby="process-heading"
    >
      <AmbientBackground />

      <div className="container-site relative z-10">
        <Reveal blur className="mb-12 max-w-2xl">
          <SectionMarker index="03" label="Process" className="mb-4" />
          <h2
            id="process-heading"
            className="display-heading text-4xl text-paper"
          >
            From insight to shipped product.
          </h2>
        </Reveal>

        <div className="relative">
          <div
            className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-signal via-line-strong to-transparent md:block"
            aria-hidden
          />

          <ol className="flex flex-col gap-6">
            {processSteps.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.08} y={24}>
                <li className="process-card group relative flex flex-col gap-4 rounded-lg border border-line bg-ink-soft/80 p-6 backdrop-blur-sm md:ml-12 md:p-8">
                  <CrosshairMark className="absolute -left-8 top-8 hidden h-5 w-5 text-signal/50 md:block" />
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-signal">{step.step}</span>
                    <span className="h-px flex-1 bg-line group-hover:bg-signal/40 transition-colors" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="max-w-xl text-sm leading-relaxed text-text-muted">
                    {step.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
