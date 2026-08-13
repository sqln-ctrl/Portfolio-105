"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/motion/register-gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

export function AboutRoomVisual() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    registerGsapPlugins();
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el.querySelectorAll("[data-about-layer]"),
      { opacity: 0, y: 30, rotateX: 12 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%" },
      },
    );
  }, []);

  return (
    <div ref={ref} className="about-room-visual" role="img" aria-label="Room 105 — studio origin visual">
      <div data-about-layer className="about-room-layer about-room-layer--back">
        <span className="about-room-grid" />
      </div>
      <div data-about-layer className="about-room-layer about-room-layer--mid">
        <p className="about-room-number">105</p>
      </div>
      <div data-about-layer className="about-room-layer about-room-layer--front">
        <div className="about-room-doorframe" />
        <p className="about-room-caption">Room 105 · Where it started</p>
      </div>
      <div className="about-room-shards" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="about-room-shard" style={{ ["--i" as string]: i }} />
        ))}
      </div>
    </div>
  );
}
