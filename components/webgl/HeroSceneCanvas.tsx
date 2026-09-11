"use client";
import { HeroSceneFallback } from "@/components/webgl/HeroSceneFallback";
/** Compatibility entry point for retained experiments. The active scene is LoopScene. */
export function HeroSceneCanvas({ className }: { className?: string }) {
  return <HeroSceneFallback className={className} />;
}
