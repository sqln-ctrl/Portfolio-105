"use client";
import { useSyncExternalStore } from "react";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
const subscribe = (listener: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};
export function useReducedMotion() { return useSyncExternalStore(subscribe, prefersReducedMotion, () => true); }
export function useMotionEnabled() { return !useReducedMotion(); }
export function getInitialMotionState(reduced: boolean) { return { animate: !(reduced || prefersReducedMotion()) }; }
