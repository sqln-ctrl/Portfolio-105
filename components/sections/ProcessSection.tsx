"use client";

import { SectionMarker } from "@/components/ui/SectionMarker";
import { AmbientBackground } from "@/components/graphics/AmbientBackground";
import { ProcessTimeline } from "@/components/motion/ProcessTimeline";
import { Reveal } from "@/components/motion/Reveal";
import { processSteps } from "@/lib/content/site";

export function ProcessSection() {
  return (
    <section
      className="relative section-pad"
      aria-labelledby="process-heading"
    >
      <AmbientBackground />

      <div className="container-site relative z-10">
        <Reveal blur className="mb-12 max-w-2xl">
          <SectionMarker index="03" label="Process" className="mb-4" />
          <h2 id="process-heading" className="display-heading text-4xl text-paper">
            From insight to shipped product.
          </h2>
        </Reveal>

        <ProcessTimeline steps={processSteps} />
      </div>
    </section>
  );
}
