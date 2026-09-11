"use client";

import { SectionMarker } from "@/components/ui/SectionMarker";
import { TextLink } from "@/components/ui/TextLink";
import { AboutRoomVisual } from "@/components/graphics/AboutRoomVisual";
import { Reveal } from "@/components/motion/Reveal";
import { siteCopy } from "@/lib/content/site";

export function AboutSection() {
  const { about } = siteCopy;

  return (
    <section
      className="section-pad border-t border-line bg-ink-soft"
      aria-labelledby="about-heading"
    >
      <div className="container-site grid-site items-center">
        <Reveal className="col-span-12 lg:col-span-5">
          <AboutRoomVisual />
        </Reveal>
        <Reveal delay={0.1} className="col-span-12 lg:col-span-6 lg:col-start-7">
          <SectionMarker index="04" label="About" className="mb-4" />
          <p className="origin-marker">
            <span>a shared idea</span>
            <span className="origin-marker__sep">/</span>
            <span>Origin / 001</span>
          </p>
          <h2
            id="about-heading"
            className="display-heading mb-6 text-4xl text-paper"
          >
            {about.title}
          </h2>
          <p className="body-lg">{about.body}</p>
          <div className="mt-8 flex flex-wrap gap-6">
            <TextLink href="/about">Meet the studio</TextLink>
            <TextLink href="https://github.com/SMPanther" showArrow={false}>
              Umer on GitHub ↗
            </TextLink>
            <TextLink href="https://github.com/sqln-ctrl" showArrow={false}>
              Saqlain on GitHub ↗
            </TextLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

