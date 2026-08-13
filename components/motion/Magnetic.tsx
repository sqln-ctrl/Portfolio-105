"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion/register-gsap";
import { DURATION, EASE } from "@/lib/motion/easing";
import { isTouchDevice, prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { cn } from "@/lib/utils/cn";

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: keyof React.JSX.IntrinsicElements;
};

export function Magnetic({
  children,
  className,
  strength = 0.28,
  as: Tag = "div",
}: MagneticProps) {
  const ref = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    if (prefersReducedMotion() || isTouchDevice()) return;

    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      gsap.to(inner, {
        x: x * strength,
        y: y * strength,
        duration: DURATION.fast,
        ease: EASE.out,
      });
    };

    const onLeave = () => {
      gsap.to(inner, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: EASE.spring,
      });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(inner);
    };
  }, [strength]);

  return (
    // @ts-expect-error dynamic tag ref typing
    <Tag ref={ref} className={cn("inline-flex", className)}>
      <span ref={innerRef} className="inline-flex items-center justify-center">
        {children}
      </span>
    </Tag>
  );
}
