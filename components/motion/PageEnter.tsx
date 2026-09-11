"use client";
import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, registerGsapPlugins } from "@/lib/motion/register-gsap";

export function PageEnter({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || pathname.startsWith("/admin")) return;
    registerGsapPlugins();
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        if (pathname !== "/") gsap.from(root.querySelectorAll("h1, .section-marker, .body-lg"), { y: 30, opacity: 0, duration: .8, stagger: .08, ease: "power3.out", clearProps: "all" });
        root.querySelectorAll("section:not(.loop-hero) h2, .loop-lab h2, .case-study-block h2, .case-custom-section h2").forEach((heading) => {
          gsap.from(heading, { y: 25, opacity: .25, duration: .8, ease: "power3.out", scrollTrigger: { trigger: heading, start: "top 92%", toggleActions: "play none none reverse" } });
        });
        root.querySelectorAll(".service-card, .founder-card, .lab-card, .expertise-chapter, .studio-values article, .archive-project, .contact-brief, .case-custom-section, .case-study-block").forEach((card, index) => {
          gsap.from(card, { y: 35, opacity: .2, duration: .75, delay: Math.min(index%3*.07,.14), ease: "power3.out", scrollTrigger: { trigger: card, start: "top 94%", toggleActions: "play none none reverse" } });
        });
        root.querySelectorAll(".loop-project-image").forEach((card,index) => {
          gsap.fromTo(card, { y: 22, rotate: index%2 ? 1.2 : -1.2 }, { y: -18, rotate: 0, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1 } });
        });
        const process = root.querySelector(".loop-process-steps");
        if (process) {
          gsap.fromTo(process, { "--process-progress": 0 }, { "--process-progress": 1, ease: "none", scrollTrigger: { trigger: process, start: "top 85%", end: "bottom 40%", scrub: .7 } });
          gsap.from(process.children, { y: 38, opacity: .2, stagger: .15, duration: .7, ease: "power3.out", scrollTrigger: { trigger: process, start: "top 87%", toggleActions: "play none none reverse" } });
        }
        root.querySelectorAll(".origin-timeline-item").forEach((item,index) => gsap.from(item,{x:20,opacity:.2,duration:.6,delay:index*.08,scrollTrigger:{trigger:item,start:"top 92%"}}));
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, [pathname]);
  return <div ref={ref}>{children}</div>;
}
