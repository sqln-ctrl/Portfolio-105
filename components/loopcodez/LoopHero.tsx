"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap, registerGsapPlugins } from "@/lib/motion/register-gsap";
import { LoopMark } from "./LoopMark";
import { type SiteSettings } from "@/lib/content/settings";

const LoopScene = dynamic(() => import("./LoopScene"), { ssr: false });

export function LoopHero({ settings }: { settings: SiteSettings }) {
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    registerGsapPlugins();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.from(".loop-hero-intro", { y: 32, opacity: 0, duration: 1.1, stagger: 0.12, ease: "power3.out", clearProps: "all" });
        gsap.to(".loop-hero-copy", { y: -60, opacity: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "55% top", scrub: true } });
      }, ref);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section className="loop-hero" ref={ref} aria-labelledby="loop-hero-title">
      <div className="loop-hero-sticky">
        <div className="loop-scene-fallback" aria-hidden="true"><LoopMark /></div>
        <LoopScene paused={paused} />
        <div className="loop-hero-top loop-hero-intro"><span>{settings.studioTagline}</span><span>Design & technology studio</span></div>
        <div className="loop-hero-copy">
          <p className="loop-eyebrow loop-hero-intro"><span className="loop-star">✳</span> {settings.heroEyebrow}</p>
          <h1 id="loop-hero-title" className="loop-hero-intro">{settings.heroLineOne}<br /><em>{settings.heroLineTwo}</em></h1>
          <p className="loop-hero-description loop-hero-intro">{settings.heroDescription}</p>
          <Link href="/work" className="loop-pill loop-hero-intro">Explore our work <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="loop-hero-bottom">
          <a href="#selected-work" className="loop-scroll-cue"><span aria-hidden="true">↓</span> Scroll to break the loop</a>
          <div className="loop-object-label"><span className="loop-live-dot" /> An idea is only the beginning.<br /><span className="loop-object-caption">Let’s see where it takes us.</span></div>
          <button className="loop-motion-toggle" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Play motion" : "Pause motion"}<span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button>
        </div>
      </div>
    </section>
  );
}
