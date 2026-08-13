"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, registerGsapPlugins } from "@/lib/motion/register-gsap";
import { DURATION, EASE } from "@/lib/motion/easing";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { cn } from "@/lib/utils/cn";

type NavLinkMotionProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function NavLinkMotion({ href, children, className }: NavLinkMotionProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const underline = el.querySelector("[data-nav-underline]");
    if (!underline) return;

    const onEnter = () => {
      gsap.to(underline, { scaleX: 1, duration: DURATION.fast, ease: EASE.out });
    };
    const onLeave = () => {
      gsap.to(underline, { scaleX: 0, duration: DURATION.fast, ease: EASE.out });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <Link
      ref={ref}
      href={href}
      className={cn(
        "relative text-sm text-text-muted transition-colors hover:text-paper",
        className,
      )}
    >
      {children}
      <span
        data-nav-underline
        className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-signal"
        aria-hidden
      />
    </Link>
  );
}

type ScrollHeaderProps = {
  children: React.ReactNode;
};

export function ScrollHeader({ children }: ScrollHeaderProps) {
  const ref = useRef<HTMLElement>(null);
  const lastScroll = useRef(0);

  useEffect(() => {
    const header = ref.current;
    if (!header || prefersReducedMotion()) return;

    const onScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScroll.current;

      if (current < 80) {
        gsap.to(header, { y: 0, duration: 0.35, ease: EASE.out });
      } else if (delta > 4) {
        gsap.to(header, { y: -4, duration: 0.35, ease: EASE.out });
      } else if (delta < -4) {
        gsap.to(header, { y: 0, duration: 0.35, ease: EASE.out });
      }

      lastScroll.current = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={ref}
      className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur-md will-change-transform"
    >
      {children}
    </header>
  );
}

type WorkCardMotionProps = {
  href: string;
  className?: string;
  index: number;
  children: React.ReactNode;
};

export function WorkCardMotion({
  href: _href,
  className,
  index,
  children,
}: WorkCardMotionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const directions = [
    { x: -40, y: 24 },
    { x: 40, y: 24 },
    { x: 0, y: 48 },
  ];
  const dir = directions[index % directions.length];

  useEffect(() => {
    registerGsapPlugins();
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { opacity: 0, x: dir.x, y: dir.y },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: DURATION.slow,
        ease: EASE.out,
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          toggleActions: "play none none reverse",
        },
      },
    );

    const image = el.querySelector("[data-card-image]");
    const meta = el.querySelector("[data-card-meta]");

    const tags = el.querySelector("[data-card-tags]");
    const cta = el.querySelector("[data-card-cta]");

    const onEnter = () => {
      if (image) gsap.to(image, { scale: 1.04, duration: 0.5, ease: EASE.out });
      if (meta) gsap.to(meta, { y: -4, duration: 0.4, ease: EASE.out });
      if (tags) gsap.fromTo(tags, { opacity: 0.6 }, { opacity: 1, duration: 0.35, ease: EASE.out });
      if (cta) gsap.fromTo(cta, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, ease: EASE.out });
    };
    const onLeave = () => {
      if (image) gsap.to(image, { scale: 1, duration: 0.5, ease: EASE.out });
      if (meta) gsap.to(meta, { y: 0, duration: 0.4, ease: EASE.out });
      if (tags) gsap.to(tags, { opacity: 0.85, duration: 0.35, ease: EASE.out });
      if (cta) gsap.to(cta, { opacity: 0, y: 6, duration: 0.3, ease: EASE.out });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [dir.x, dir.y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
