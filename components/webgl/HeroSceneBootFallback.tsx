"use client";

import { useEffect } from "react";
import { markLoaderHeroReady } from "@/lib/loader/loader-gate";
import { HeroSceneFallback } from "@/components/webgl/HeroSceneFallback";

/** Shown while HeroSceneCanvas chunk loads — signals loader that hero shell exists */
export function HeroSceneBootFallback({ className }: { className?: string }) {
  useEffect(() => {
    markLoaderHeroReady();
  }, []);

  return <HeroSceneFallback className={className} />;
}
