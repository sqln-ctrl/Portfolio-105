"use client";

import dynamic from "next/dynamic";
import { HeroSceneBootFallback } from "@/components/webgl/HeroSceneBootFallback";

const HeroSceneCanvas = dynamic(
  () =>
    import("@/components/webgl/HeroSceneCanvas").then((mod) => mod.HeroSceneCanvas),
  {
    ssr: false,
    loading: () => <HeroSceneBootFallback />,
  },
);

type HeroSceneProps = {
  className?: string;
};

export function HeroScene({ className }: HeroSceneProps) {
  return <HeroSceneCanvas className={className} />;
}
