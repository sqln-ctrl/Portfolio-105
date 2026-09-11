"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/motion/register-gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { shouldUseLightMotion } from "@/lib/motion/device-profile";
import { cn } from "@/lib/utils/cn";

type ScrubFadeProps = {
  children: React.ReactNode;
  className?: string;
  /** ScrollTrigger end offset relative to trigger height, e.g. "bottom top" */
  end?: string;
  y?: number;
  opacity?: number;
};

/** Trionn-style scroll-linked fade — hero handoffs, section exits */
export function ScrubFade({
  children,
  className,
  end = "bottom top",
  y = -48,
  opacity = 0,
}: ScrubFadeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const el = ref.current;
    if (!el || prefersReducedMotion() || shouldUseLightMotion()) return;

    const tween = gsap.to(el, {
      opacity,
      y,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end,
        scrub: 0.45,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [end, opacity, y]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
