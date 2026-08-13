"use client";

import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { siteCopy } from "@/lib/content/site";

export function CtaSection() {
  const { cta } = siteCopy;

  return (
    <section className="section-pad" aria-labelledby="cta-heading">
      <div className="container-site">
        <Reveal>
          <div className="rounded-lg border border-line-strong bg-fog/10 px-8 py-12 md:px-12 md:py-16">
            <SectionMarker index="05" label="Contact" className="mb-4" />
            <h2
              id="cta-heading"
              className="display-heading mb-4 max-w-2xl text-3xl text-paper md:text-4xl"
            >
              {cta.title}
            </h2>
            <p className="mb-8 max-w-xl body-lg">{cta.body}</p>
            <Magnetic strength={0.3}>
              <Button href="/contact">{cta.button}</Button>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
