"use client";

import dynamic from "next/dynamic";
import { HeroSceneFallback } from "@/components/webgl/HeroSceneFallback";

const HeroSceneCanvas = dynamic(
  () =>
    import("@/components/webgl/HeroSceneCanvas").then((mod) => mod.HeroSceneCanvas),
  {
    ssr: false,
    loading: () => <HeroSceneFallback />,
  },
);

type HeroSceneProps = {
  className?: string;
};

export function HeroScene({ className }: HeroSceneProps) {
  return <HeroSceneCanvas className={className} />;
}
