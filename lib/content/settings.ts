export type SiteSettings = {
  heroEyebrow: string; heroLineOne: string; heroLineTwo: string; heroDescription: string;
  studioTagline: string; workHeading: string; workSubtitle: string; aboutStatement: string;
  footerHeading: string; homepageCount: number;
};

export const defaultSettings: SiteSettings = {
  heroEyebrow: "A new perspective on digital", heroLineOne: "Ideas in", heroLineTwo: "motion.",
  heroDescription: "We connect thoughtful design with powerful code. Websites, products, and intelligent systems that move your business forward.",
  studioTagline: "Independent minds. Infinite possibilities.", workHeading: "Less ordinary.", workSubtitle: "More possibility.",
  aboutStatement: "We’re Umer and Saqlain. A designer’s eye and an engineer’s curiosity, working as one. We turn the ‘what if’ into something you can use, feel, and build on.",
  footerHeading: "Let’s make it happen.", homepageCount: 4,
};
