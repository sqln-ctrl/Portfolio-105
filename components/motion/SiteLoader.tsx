"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, registerGsapPlugins } from "@/lib/motion/register-gsap";
import { EASE } from "@/lib/motion/easing";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import {
  clearLoaderPending,
  getLoaderProgress,
  isLoaderCriticalReady,
  LOADER_MAX_MS,
  LOADER_MIN_MS,
  markLoaderDomReady,
  markLoaderFontsReady,
  markLoaderSeen,
  notifyLoaderComplete,
  setLoaderActive,
  shouldRunLoader,
} from "@/lib/loader/loader-gate";

export function SiteLoader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useLayoutEffect(() => {
    registerGsapPlugins();

    const finishWithoutLoader = () => {
      clearLoaderPending();
      document.body.classList.remove("site-loader-active");
      setLoaderActive(false);
      notifyLoaderComplete();
      setIsDone(true);
    };

    if (prefersReducedMotion()) {
      finishWithoutLoader();
      return;
    }

    if (!shouldRunLoader()) {
      finishWithoutLoader();
      return;
    }

    setIsRunning(true);
    setLoaderActive(true);
    document.body.classList.add("site-loader-active");

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const bar = barRef.current;
    const count = countRef.current;

    if (!overlay || !panel || !bar || !count) {
      finishWithoutLoader();
      return;
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", markLoaderDomReady, { once: true });
    } else {
      markLoaderDomReady();
    }

    document.fonts.ready.then(markLoaderFontsReady).catch(markLoaderFontsReady);

    const counter = { value: 0 };
    const start = performance.now();
    let exited = false;
    let exitScheduled = false;
    let pollId = 0;
    let minTimerId = 0;

    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(panel, { yPercent: 0 });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-loader-mark]",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: EASE.out },
      );
      gsap.fromTo(
        "[data-loader-brand]",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45, delay: 0.08, ease: EASE.out },
      );
    }, overlay);

    const syncProgress = () => {
      const progress = getLoaderProgress();
      gsap.to(bar, {
        scaleX: Math.max(0.06, progress),
        duration: 0.3,
        ease: EASE.out,
        overwrite: true,
        transformOrigin: "left center",
      });
      const target = Math.round(progress * 105);
      if (target > counter.value) {
        counter.value = target;
        count.textContent = String(counter.value).padStart(3, "0");
      }
    };

    const exit = () => {
      if (exited) return;
      exited = true;
      window.clearInterval(pollId);
      window.clearTimeout(minTimerId);

      counter.value = 105;
      count.textContent = "105";
      gsap.to(bar, { scaleX: 1, duration: 0.2, ease: EASE.out });

      const tl = gsap.timeline({
        onComplete: () => {
          clearLoaderPending();
          markLoaderSeen();
          document.body.classList.remove("site-loader-active");
          setLoaderActive(false);
          notifyLoaderComplete();
          setIsRunning(false);
          setIsDone(true);
        },
      });

      tl.to(count, { opacity: 0.4, duration: 0.15, ease: EASE.out }, 0)
        .to(
          panel,
          {
            yPercent: -100,
            duration: 0.95,
            ease: "power3.inOut",
          },
          0.12,
        )
        .to(
          overlay,
          {
            autoAlpha: 0,
            duration: 0.35,
            ease: EASE.out,
          },
          0.72,
        );
    };

    const evaluateExit = () => {
      syncProgress();
      const elapsed = performance.now() - start;

      if (elapsed >= LOADER_MAX_MS) {
        exit();
        return;
      }

      if (!isLoaderCriticalReady()) return;

      if (elapsed < LOADER_MIN_MS) {
        if (!exitScheduled) {
          exitScheduled = true;
          minTimerId = window.setTimeout(exit, LOADER_MIN_MS - elapsed);
          window.clearInterval(pollId);
        }
        return;
      }

      exit();
    };

    pollId = window.setInterval(evaluateExit, 48);
    evaluateExit();

    return () => {
      window.clearInterval(pollId);
      window.clearTimeout(minTimerId);
      ctx.revert();
      document.body.classList.remove("site-loader-active");
      setLoaderActive(false);
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={overlayRef}
      className={`site-loader ${isRunning ? "is-active" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Studio 105"
    >
      <div ref={panelRef} className="site-loader__panel">
        <div className="site-loader__grid" aria-hidden />
        <div className="site-loader__inner">
          <p data-loader-brand className="site-loader__brand">
            Studio 105
          </p>
          <span data-loader-mark className="site-loader__mark" aria-hidden>
            105
          </span>
          <div className="site-loader__track" aria-hidden>
            <div ref={barRef} className="site-loader__bar" />
          </div>
          <span ref={countRef} className="site-loader__count" aria-hidden>
            000
          </span>
          <p className="site-loader__status">Initializing</p>
        </div>
      </div>
    </div>
  );
}
