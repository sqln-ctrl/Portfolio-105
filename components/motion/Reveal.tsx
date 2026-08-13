"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/motion/register-gsap";
import { DURATION, EASE } from "@/lib/motion/easing";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { cn } from "@/lib/utils/cn";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  stagger?: number;
  as?: keyof React.JSX.IntrinsicElements;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  blur = false,
  stagger = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    const targets = stagger > 0 ? el.children : el;

    const tween = gsap.fromTo(
      targets,
      {
        opacity: 0,
        y,
        filter: blur ? "blur(10px)" : "blur(0px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: DURATION.base,
        delay,
        ease: EASE.out,
        stagger: stagger > 0 ? stagger : undefined,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y, blur, stagger]);

  return (
    // @ts-expect-error dynamic tag ref typing
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
