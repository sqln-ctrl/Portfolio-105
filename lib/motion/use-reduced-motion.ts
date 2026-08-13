"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export function useMotionEnabled() {
  const reduced = useReducedMotion();
  return !reduced;
}

export function getInitialMotionState(reduced: boolean) {
  if (reduced || prefersReducedMotion()) {
    return { animate: false };
  }
  return { animate: true };
}
