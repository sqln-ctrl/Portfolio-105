"use client";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { services } from "@/lib/content/site";
import { LoopMark } from "./LoopMark";
import { gsap } from "@/lib/motion/register-gsap";

export function ServicesExperience() {
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement|null)[]>([]);
  const service = services[active];
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => { gsap.from("[data-service-detail]", { opacity:0, y:18, stagger:0.07, duration:0.5, ease:"power3.out" }); },panel);
    return () => context.revert();
  },[active]);
  return <div className="loop-expertise-stage"><div className="loop-expertise-tabs" role="tablist" aria-label="Explore our services" aria-orientation="vertical">{services.map((item,index) => <button key={item.slug} ref={(node) => { buttons.current[index]=node; }} role="tab" id={`service-tab-${item.slug}`} aria-selected={active===index} aria-controls="loop-service-panel" tabIndex={active===index?0:-1} onClick={() => setActive(index)} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onKeyDown={(event) => { let next=index; if(event.key==='ArrowDown') next=(index+1)%services.length; else if(event.key==='ArrowUp') next=(index+services.length-1)%services.length; else if(event.key==='Home') next=0; else if(event.key==='End') next=services.length-1; else return; event.preventDefault();setActive(next);buttons.current[next]?.focus(); }}><span>{item.title}</span><span aria-hidden="true">↗</span></button>)}</div><div className="loop-expertise-panel" ref={panel} role="tabpanel" id="loop-service-panel" aria-labelledby={`service-tab-${service.slug}`} tabIndex={0}><div className={`loop-service-orbit orbit-${active}`} aria-hidden="true"><LoopMark /><span /><span /></div><span className="loop-eyebrow" data-service-detail>Built around your ambitions</span><h3 data-service-detail>{service.tagline}</h3><p data-service-detail>{service.description}</p><div className="loop-service-tags" data-service-detail>{service.capabilities.map((item) => <span key={item}>{item}</span>)}</div><Link data-service-detail href={`/services#${service.slug}`} className="loop-text-link">Explore {service.title.toLowerCase()} <span>↗</span></Link></div></div>;
}
