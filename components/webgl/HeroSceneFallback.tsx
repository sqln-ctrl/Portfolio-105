"use client";

import { useEffect } from "react";
import { markLoaderHeroReady } from "@/lib/loader/loader-gate";

type HeroSceneFallbackProps = {
  className?: string;
};

export function HeroSceneFallback({ className }: HeroSceneFallbackProps) {
  useEffect(() => {
    markLoaderHeroReady();
  }, []);

  return (
    <div
      className={`hero-visual-fallback ${className ?? ""}`}
      role="img"
      aria-label="Loopcodez mark — static fallback when WebGL or motion is reduced"
    >
      <span className="mark-105-static">∞</span>
    </div>
  );
}


