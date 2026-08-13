"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsapPlugins } from "@/lib/motion/register-gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import { shouldUseLightMotion } from "@/lib/motion/device-profile";
import {
  getHeroBridgeSnapshot,
  subscribeHeroBridge,
} from "@/lib/webgl/hero-bridge";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  targetSection: string | null;
};

const COLORS = ["#ff5c1a", "#ff7a45", "#c4784a", "#e8dcc8"];

export function ScrollParticleBridge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const dissolveRef = useRef(0);
  const explodeRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion() || shouldUseLightMotion()) return;

    registerGsapPlugins();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const unsub = subscribeHeroBridge((s) => {
      dissolveRef.current = s.dissolveAmount;
      explodeRef.current = s.explodeAmount;
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const heroStage = document.querySelector(".hero-stage");
    const workSection = document.querySelector("#work-section");
    const servicesSection = document.querySelector("#services-section");

    if (heroStage) {
      gsap.to(
        {},
        {
          scrollTrigger: {
            trigger: heroStage,
            start: "20% top",
            end: "bottom top",
            scrub: 0.4,
            onUpdate(self) {
              const progress = self.progress;
              if (progress > 0.05 && particlesRef.current.length < 180) {
                const snap = getHeroBridgeSnapshot();
                const spawnCount = Math.floor(progress * 4) + 1;
                for (let i = 0; i < spawnCount; i++) {
                  particlesRef.current.push(
                    createParticle(
                      snap.visualCenterX * window.innerWidth +
                        (Math.random() - 0.5) * 120,
                      snap.visualCenterY * window.innerHeight +
                        (Math.random() - 0.5) * 80,
                      "work",
                    ),
                  );
                }
              }
            },
          },
        },
      );
    }

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dissolve = dissolveRef.current;
      const explode = explodeRef.current;
      if (dissolve < 0.02 && explode < 0.05 && particlesRef.current.length === 0) {
        return;
      }

      const workRect = workSection?.getBoundingClientRect();
      const servicesRect = servicesSection?.getBoundingClientRect();

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life += 1;

        if (p.targetSection === "work" && workRect && workRect.top < window.innerHeight) {
          const tx = workRect.left + workRect.width * 0.3;
          const ty = workRect.top + 80;
          p.vx += (tx - p.x) * 0.002;
          p.vy += (ty - p.y) * 0.002;
        }

        if (p.targetSection === "services" && servicesRect && servicesRect.top < window.innerHeight) {
          const tx = servicesRect.left + servicesRect.width * 0.6;
          const ty = servicesRect.top + 40;
          p.vx += (tx - p.x) * 0.0015;
          p.vy += (ty - p.y) * 0.0015;
        }

        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.15;
        p.x += p.vx;
        p.y += p.vy;

        const alpha = Math.max(0, 1 - p.life / p.maxLife) * (0.4 + dissolve * 0.6);
        if (alpha <= 0.01) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      if (explode > 0.3) {
        const snap = getHeroBridgeSnapshot();
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push(
            createParticle(
              snap.visualCenterX * window.innerWidth,
              snap.visualCenterY * window.innerHeight,
              null,
              explode * 8,
            ),
          );
        }
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      unsub();
    };
  }, []);

  if (prefersReducedMotion()) return null;

  return (
    <canvas
      ref={canvasRef}
      className="scroll-particle-bridge"
      aria-hidden
    />
  );
}

function createParticle(
  x: number,
  y: number,
  targetSection: string | null,
  speedMul = 1,
): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = (1 + Math.random() * 3) * speedMul;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 2,
    life: 0,
    maxLife: 120 + Math.random() * 80,
    size: 1.5 + Math.random() * 2.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
    targetSection,
  };
}
