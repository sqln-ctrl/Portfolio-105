"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/motion/register-gsap";
import { DURATION, EASE } from "@/lib/motion/easing";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { isLoaderComplete, onLoaderComplete } from "@/lib/loader/loader-gate";
import { AmbientBackground, CrosshairMark, WireGlobe } from "@/components/graphics/AmbientBackground";
import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/Button";

const exploreLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/lab", label: "Lab" },
  { href: "/notes", label: "Notes" },
];

const connectLinks = [
  { href: "/contact", label: "Start a project" },
  { href: "https://github.com/SMPanther", label: "Umer · GitHub", external: true },
  { href: "https://github.com/sqln-ctrl", label: "Saqlain · GitHub", external: true },
  { href: "/contact", label: "Email us" },
];

const capabilityTags = ["Design", "Build", "Ship", "AI Systems", "Web Products", "Automations"];

type FooterLinkProps = {
  href: string;
  label: string;
  index: string;
  external?: boolean;
};

function FooterLink({ href, label, index, external }: FooterLinkProps) {
  return (
    <li>
      <Link
        href={href}
        className="footer-link group flex items-baseline gap-4 py-2"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <span className="footer-link__index font-mono text-[10px] tracking-widest text-text-subtle transition-colors group-hover:text-signal">
          {index}
        </span>
        <span className="footer-link__label relative font-display text-lg font-medium tracking-tight text-paper-muted transition-colors group-hover:text-paper">
          {label}
          <span
            className="footer-link__rule absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-[var(--duration-base)] group-hover:scale-x-100"
            aria-hidden
          />
        </span>
        {external && (
          <span className="footer-link__arrow text-xs text-text-subtle transition-all group-hover:translate-x-0.5 group-hover:text-signal">
            ↗
          </span>
        )}
      </Link>
    </li>
  );
}

type FooterMotionProps = {
  year: number;
};

export function FooterMotion({ year }: FooterMotionProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    let ctx: gsap.Context | undefined;

    const setup = () => {
      ctx?.revert();

      ctx = gsap.context(() => {
        const line = root.querySelector("[data-footer-line]");
        const headline = root.querySelector("[data-footer-headline]");
        const watermark = root.querySelector("[data-footer-watermark]");
        const globe = root.querySelector("[data-footer-globe]");
        const items = root.querySelectorAll("[data-footer-item]");

        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: DURATION.slow,
              ease: EASE.out,
              scrollTrigger: {
                trigger: root,
                start: "top 92%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            },
          );
        }

        if (headline) {
          gsap.fromTo(
            headline,
            { opacity: 0, y: 40, filter: "blur(10px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: DURATION.slow,
              ease: EASE.out,
              scrollTrigger: {
                trigger: root,
                start: "top 88%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            },
          );
        }

        if (watermark) {
          gsap.fromTo(
            watermark,
            { opacity: 0, x: 48 },
            {
              opacity: 1,
              x: 0,
              duration: DURATION.slow,
              ease: EASE.out,
              scrollTrigger: {
                trigger: root,
                start: "top 90%",
                toggleActions: "play none none reverse",
                invalidateOnRefresh: true,
              },
            },
          );

          gsap.to(watermark, {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
        }

        if (globe) {
          gsap.to(globe, {
            rotate: 24,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
        }

        gsap.fromTo(
          items,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.base,
            stagger: 0.06,
            ease: EASE.out,
            scrollTrigger: {
              trigger: root,
              start: "top 84%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          },
        );
      }, root);

      ScrollTrigger.refresh();
    };

    if (isLoaderComplete()) {
      setup();
    } else {
      const unsub = onLoaderComplete(setup);
      return () => {
        unsub();
        ctx?.revert();
      };
    }

    return () => ctx?.revert();
  }, [year]);

  return (
    <footer ref={rootRef} className="site-footer relative overflow-hidden border-t border-line bg-ink">
      <AmbientBackground />

      <div
        data-footer-watermark
        className="footer-watermark pointer-events-none absolute select-none"
        aria-hidden
      >
        105
      </div>

      <div className="container-site relative z-10 section-pad !pb-10 !pt-14 md:!pb-12 md:!pt-20">
        <div
          data-footer-item
          className="footer-rail mb-8 flex flex-wrap items-center justify-between gap-4 border border-line/80 bg-ink-soft/40 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-text-subtle backdrop-blur-sm md:mb-10 md:px-5"
        >
          <span className="flex items-center gap-2">
            <CrosshairMark className="h-3.5 w-3.5 text-signal/70" />
            a shared idea · Origin
          </span>
          <span className="hidden text-signal/80 sm:inline">Design · Build · Ship</span>
          <span>Est. {year}</span>
        </div>

        <div
          data-footer-line
          className="mb-10 h-px w-full origin-left bg-gradient-to-r from-signal via-line-strong to-transparent md:mb-14"
          aria-hidden
        />

        <div className="grid-site items-start gap-y-12 lg:gap-y-16">
          <div className="col-span-12 lg:col-span-7 xl:col-span-6">
            <div data-footer-item className="mb-5 flex items-center gap-3">
              <span className="mark-105" aria-hidden>
                105
              </span>
              <p className="font-display text-xl font-semibold tracking-tight text-paper">Loopcodez</p>
            </div>

            <h2
              data-footer-headline
              id="footer-heading"
              className="display-heading max-w-2xl text-3xl text-paper md:text-[clamp(2.25rem,1.5rem+2.5vw,3.5rem)]"
            >
              Built to mean something.
            </h2>

            <p data-footer-item className="mt-5 max-w-lg text-sm leading-relaxed text-text-muted md:text-base">
              Two roommates. One room. A studio that turns ambitious ideas into shipped digital products — with
              typography, motion, and engineering in the same stack.
            </p>

            <div data-footer-item className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.28}>
                <Button href="/contact">Let&apos;s talk →</Button>
              </Magnetic>
              <Link
                href="/work"
                className="text-link-underline text-sm text-text-muted transition-colors hover:text-signal"
              >
                View selected work
              </Link>
            </div>
          </div>

          <div
            data-footer-item
            className="relative col-span-12 flex items-center justify-center lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-8"
          >
            <div className="footer-visual relative flex aspect-square w-full max-w-[15rem] items-center justify-center md:max-w-[17rem]">
              <div
                className="absolute inset-0 rounded-full opacity-60"
                aria-hidden
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--color-signal) 16%, transparent), transparent 68%)",
                }}
              />
              <div
                data-footer-globe
                className="footer-visual__globe text-signal/45"
              >
                <WireGlobe className="h-full w-full" />
              </div>
              <CrosshairMark className="absolute -left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-signal/50" />
              <div className="footer-visual__frame absolute inset-3 rounded-lg border border-line-strong/80" aria-hidden />
              <p className="absolute -bottom-1 left-1/2 w-max -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.24em] text-text-subtle">
                Infinite possibilities
              </p>
            </div>
          </div>

          <nav
            data-footer-item
            className="col-span-12 sm:col-span-6 lg:col-span-4"
            aria-labelledby="footer-explore"
          >
            <p id="footer-explore" className="footer-col-label mb-4">
              Explore
            </p>
            <ul className="space-y-1">
              {exploreLinks.map((link, index) => (
                <FooterLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  index={String(index + 1).padStart(2, "0")}
                />
              ))}
            </ul>
          </nav>

          <nav
            data-footer-item
            className="col-span-12 sm:col-span-6 lg:col-span-4 lg:col-start-5"
            aria-labelledby="footer-connect"
          >
            <p id="footer-connect" className="footer-col-label mb-4">
              Connect
            </p>
            <ul className="space-y-1">
              {connectLinks.map((link, index) => (
                <FooterLink
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  label={link.label}
                  index={String(index + 1).padStart(2, "0")}
                  external={link.external}
                />
              ))}
            </ul>
          </nav>

          <div
            data-footer-item
            className="col-span-12 flex flex-col gap-4 border-t border-line pt-8 lg:col-span-4 lg:col-start-9 lg:border-t-0 lg:pt-0"
          >
            <p className="footer-col-label">Capabilities</p>
            <ul className="flex flex-wrap gap-2">
              {capabilityTags.map((tag) => (
                <li key={tag}>
                  <span className="footer-tag">{tag}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-text-subtle">
              a shared idea · {year}
            </p>
          </div>
        </div>

        <div
          data-footer-item
          className="footer-marquee mt-12 overflow-hidden border-t border-line pt-6 md:mt-16"
          aria-hidden
        >
          <div className="footer-marquee__track flex w-max gap-10 font-mono text-[10px] uppercase tracking-[0.35em] text-text-subtle/70">
            {[...capabilityTags, ...capabilityTags].map((tag, index) => (
              <span key={`${tag}-${index}`} className="flex items-center gap-10">
                {tag}
                <span className="text-signal/50">◆</span>
              </span>
            ))}
          </div>
        </div>

        <div
          data-footer-item
          className="mt-6 flex flex-col gap-3 text-[11px] text-text-subtle sm:flex-row sm:items-center sm:justify-between"
        >
          <p>© {year} Loopcodez. Crafted in a shared idea.</p>
          <p className="font-mono uppercase tracking-widest">Design · Build · Ship</p>
        </div>
      </div>
    </footer>
  );
}


