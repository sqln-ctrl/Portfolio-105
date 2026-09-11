"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/motion/register-gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { onLoaderComplete, isLoaderComplete } from "@/lib/loader/loader-gate";
import { CrosshairMark } from "@/components/graphics/AmbientBackground";
import { cn } from "@/lib/utils/cn";

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

type ProcessTimelineProps = {
  steps: ProcessStep[];
};

function ProcessStepCard({ step }: { step: ProcessStep }) {
  return (
    <>
      <CrosshairMark className="process-card__crosshair absolute -left-8 top-8 hidden h-5 w-5 text-signal/50 md:block" />
      <div className="flex items-center gap-4">
        <span className="font-mono text-sm text-signal">{step.step}</span>
        <span className="process-card__rule h-px flex-1 bg-line transition-colors" />
      </div>
      <h3 className="font-display text-2xl font-semibold tracking-tight">{step.title}</h3>
      <p className="max-w-xl text-sm leading-relaxed text-text-muted">{step.description}</p>
    </>
  );
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    let disposed = false;
    const cleanups: Array<() => void> = [];

    let initialized = false;

    const setup = () => {
      if (disposed || initialized) return;
      initialized = true;

      const stepEls = gsap.utils.toArray<HTMLElement>("[data-process-step]", root);
      const fill = root.querySelector<HTMLElement>("[data-process-fill]");
      const track = root.querySelector<HTMLElement>("[data-process-track]");

      stepEls.forEach((step) => {
        const tween = gsap.fromTo(
          step,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 88%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
            onStart: () => step.classList.add("is-active"),
            onReverseComplete: () => step.classList.remove("is-active"),
          },
        );

        cleanups.push(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      });

      if (fill && track) {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          gsap.set(fill, { scaleX: 1, transformOrigin: "top center" });
          const fillTween = gsap.fromTo(
            fill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: track,
                start: "top 75%",
                end: "bottom 55%",
                scrub: 0.4,
                invalidateOnRefresh: true,
              },
            },
          );

          cleanups.push(() => {
            fillTween.scrollTrigger?.kill();
            fillTween.kill();
          });
        });

        mm.add("(max-width: 767px)", () => {
          gsap.set(fill, { scaleY: 1, transformOrigin: "left center" });
          const fillTween = gsap.fromTo(
            fill,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top 80%",
                end: "bottom 60%",
                scrub: 0.4,
                invalidateOnRefresh: true,
              },
            },
          );

          cleanups.push(() => {
            fillTween.scrollTrigger?.kill();
            fillTween.kill();
          });
        });

        cleanups.push(() => mm.revert());
      }

      ScrollTrigger.refresh();
    };

    if (isLoaderComplete()) {
      setup();
    } else {
      const unsubLoader = onLoaderComplete(setup);
      cleanups.push(unsubLoader);
    }

    return () => {
      disposed = true;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [steps.length]);

  return (
    <div ref={rootRef} className="process-timeline">
      <div className="process-timeline__layout relative md:grid md:grid-cols-[auto_1fr] md:gap-12">
        <div
          data-process-track
          className="process-timeline__track relative mb-6 h-px w-full overflow-hidden bg-line md:mb-0 md:h-auto md:w-px md:overflow-visible md:bg-line"
          aria-hidden
        >
          <div
            data-process-fill
            className="process-timeline__fill h-full w-full origin-left bg-gradient-to-r from-signal via-signal/70 to-transparent md:origin-top md:bg-gradient-to-b"
          />
        </div>

        <ol className="flex flex-col gap-6 md:gap-10">
          {steps.map((step, index) => (
            <li
              key={step.step}
              data-process-step
              className={cn(
                "process-card process-card--timeline relative flex flex-col gap-4 rounded-lg border border-line bg-ink-soft/80 p-6 backdrop-blur-sm md:bg-ink-soft/95 md:p-8",
                index === 0 && "is-active",
              )}
            >
              <ProcessStepCard step={step} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
