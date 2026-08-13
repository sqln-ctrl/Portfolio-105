"use client";

import { useEffect, useRef } from "react";
import { SectionMarker } from "@/components/ui/SectionMarker";
import { ServiceMicroVisual } from "@/components/graphics/ServiceMicroVisual";
import { AmbientBackground } from "@/components/graphics/AmbientBackground";
import { Reveal } from "@/components/motion/Reveal";
import { gsap, registerGsapPlugins } from "@/lib/motion/register-gsap";
import { EASE } from "@/lib/motion/easing";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { services } from "@/lib/content/site";

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const cards = section.querySelectorAll("[data-service-card]");

    cards.forEach((card) => {
      const caps = card.querySelector("[data-service-caps]");
      const visual = card.querySelector("[data-service-visual]");

      const onEnter = () => {
        if (caps) gsap.to(caps, { opacity: 1, y: 0, duration: 0.4, ease: EASE.out });
        if (visual) gsap.to(visual, { scale: 1.04, duration: 0.45, ease: EASE.out });
      };
      const onLeave = () => {
        if (caps) gsap.to(caps, { opacity: 0, y: 8, duration: 0.35, ease: EASE.out });
        if (visual) gsap.to(visual, { scale: 1, duration: 0.45, ease: EASE.out });
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
    });

    return () => {
      cards.forEach((card) => card.replaceWith(card.cloneNode(true)));
    };
  }, []);

  return (
    <section
      id="services-section"
      ref={sectionRef}
      className="relative section-pad overflow-hidden border-y border-line"
      aria-labelledby="services-heading"
    >
      <AmbientBackground />

      <div className="container-site relative z-10">
        <Reveal blur>
          <SectionMarker index="01" label="Services" className="mb-4" />
          <h2
            id="services-heading"
            className="display-heading mb-4 max-w-3xl text-4xl text-paper"
          >
            Six ways we help teams ship.
          </h2>
          <p className="mb-12 max-w-2xl body-lg">
            From AI agents to commerce systems — each capability built to solve
            a real problem.
          </p>
        </Reveal>

        <Reveal stagger={0.07} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <article
              key={service.slug}
              data-service-card
              className="service-card group flex flex-col gap-4 rounded-lg border border-line bg-ink-soft/70 p-6 backdrop-blur-sm md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-text-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-paper">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-sm text-signal">{service.tagline}</p>
                </div>
                <ServiceMicroVisual slug={service.slug} />
              </div>
              <p className="text-sm leading-relaxed text-text-muted">
                {service.description}
              </p>
              <ul
                data-service-caps
                className="service-caps mt-auto flex flex-wrap gap-2 border-t border-line pt-4 opacity-0 translate-y-2"
              >
                {service.capabilities.map((cap) => (
                  <li key={cap} className="service-cap-tag">
                    {cap}
                  </li>
                ))}
              </ul>
              <p className="border-t border-line pt-4 text-sm text-paper-muted">
                <span className="text-signal">Outcome · </span>
                {service.outcome}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
