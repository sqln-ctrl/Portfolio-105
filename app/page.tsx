import { ScrollParticleBridge } from "@/components/motion/ScrollParticleBridge";
import { AboutSection } from "@/components/sections/AboutSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhatWeBuildSection } from "@/components/sections/WhatWeBuildSection";
import { WorkSection } from "@/components/sections/WorkSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ScrollParticleBridge />
      <ServicesSection />
      <WhatWeBuildSection />
      <WorkSection />
      <ProcessSection />
      <AboutSection />
      <CtaSection />
    </>
  );
}
