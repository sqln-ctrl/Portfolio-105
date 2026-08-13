"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/motion/register-gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

export function HeroFrameLines() {
  const ref = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    if (prefersReducedMotion()) return;

    registerGsapPlugins();

    svg.querySelectorAll("line[data-line], path[data-line]").forEach((el) => {
      const line = el as SVGGeometryElement;
      const length = line.getTotalLength();
      gsap.set(line, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0.6,
      });
      gsap.to(line, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.1,
        delay: 0.5,
        ease: "power3.out",
      });
    });

    gsap.fromTo(
      svg.querySelectorAll("circle[data-line]"),
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.85,
        ease: "power3.out",
      },
    );
  }, []);

  return (
    <svg
      ref={ref}
      className="hero-frame-lines"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      aria-hidden
    >
      <line data-line x1="120" y1="140" x2="420" y2="140" stroke="currentColor" strokeWidth="1" />
      <line data-line x1="120" y1="140" x2="120" y2="340" stroke="currentColor" strokeWidth="1" />
      <circle data-line cx="120" cy="140" r="4" fill="currentColor" />
      <line data-line x1="1320" y1="760" x2="1320" y2="560" stroke="currentColor" strokeWidth="1" />
      <line data-line x1="1020" y1="760" x2="1320" y2="760" stroke="currentColor" strokeWidth="1" />
      <circle data-line cx="1320" cy="760" r="4" fill="currentColor" />
    </svg>
  );
}
