"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/motion/register-gsap";
import { DURATION, EASE } from "@/lib/motion/easing";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { isLoaderComplete, onLoaderComplete } from "@/lib/loader/loader-gate";
import { cn } from "@/lib/utils/cn";

type LineRevealProps = {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
};

export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
}: LineRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    registerGsapPlugins();
    const root = ref.current;
    if (!root) return;

    const lineEls = root.querySelectorAll("[data-line]");

    const runReveal = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      if (prefersReducedMotion()) {
        gsap.set(lineEls, { opacity: 1, y: 0, filter: "none" });
        return;
      }

      const ctx = gsap.context(() => {
        gsap.set(lineEls, { opacity: 0, y: 28, filter: "blur(12px)" });

        gsap.to(lineEls, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: DURATION.slow,
          stagger: 0.12,
          delay,
          ease: EASE.out,
        });
      }, root);

      return () => ctx.revert();
    };

    let cleanup: (() => void) | undefined;

    if (isLoaderComplete()) {
      cleanup = runReveal();
    } else {
      const unsub = onLoaderComplete(() => {
        cleanup = runReveal();
      });
      return () => {
        unsub();
        cleanup?.();
      };
    }

    return () => cleanup?.();
  }, [delay, lines]);

  return (
    <span ref={ref} className={cn("block", className)}>
      {lines.map((line) => (
        <span
          key={line}
          data-line
          className={cn("block overflow-hidden", lineClassName)}
        >
          {line}
        </span>
      ))}
    </span>
  );
}
