"use client";

import { useEffect, useRef } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { gsap, registerGsapPlugins } from "@/lib/motion/register-gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { Button } from "@/components/ui/Button";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { siteCopy } from "@/lib/content/site";

export function CtaSection() {
  const { cta } = siteCopy;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const card = cardRef.current;
    if (!card || prefersReducedMotion()) return;

    gsap.fromTo(
      card,
      { scale: 0.98, opacity: 0.85 },
      {
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 92%",
          end: "top 60%",
          scrub: 0.35,
        },
      },
    );

    const glow = card.querySelector("[data-cta-glow]");
    if (glow) {
      gsap.to(glow, {
        opacity: 0.55,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "top 50%",
          scrub: 0.4,
        },
      });
    }
  }, []);

  return (
    <section className="section-pad" aria-labelledby="cta-heading">
      <div className="container-site">
        <Reveal>
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-lg border border-line-strong bg-fog/10 px-8 py-12 md:px-12 md:py-16"
          >
            <div
              data-cta-glow
              className="pointer-events-none absolute inset-0 opacity-0"
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--color-signal) 14%, transparent), transparent 65%)",
              }}
            />
            <div className="relative z-[1]">
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}

