"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LoopMark } from "@/components/loopcodez/LoopMark";
import { completeLoader } from "@/lib/loader/loader-gate";
const links = [{ href: "/work", label: "Work" }, { href: "/services", label: "Expertise" }, { href: "/about", label: "About" }, { href: "/lab", label: "Lab" }];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const path = usePathname();
  useEffect(() => { completeLoader(); }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = Array.from(document.querySelectorAll<HTMLElement>("#main-content, .loop-footer"));
    const previousInert = background.map(element => element.inert);
    background.forEach(element => { element.inert = true; });
    menu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); button.current?.focus(); }
      if (event.key === "Tab") {
        const items = [button.current, ...Array.from(menu.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])].filter(Boolean) as HTMLElement[];
        const first = items[0]; const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const closeOnDesktop = () => { if (window.innerWidth >= 768) setOpen(false); };
    document.addEventListener("keydown", keyboard); window.addEventListener("resize", closeOnDesktop);
    return () => { document.body.style.overflow = previous; background.forEach((element,index) => { element.inert = previousInert[index]; }); document.removeEventListener("keydown", keyboard); window.removeEventListener("resize", closeOnDesktop); };
  }, [open]);
  return <header className="loop-header">
    <Link href="/" className="loop-brand" aria-label="Loopcodez home" onClick={() => setOpen(false)}><LoopMark /><span>loopcodez<span className="loop-brand-period">.</span></span></Link>
    <nav className="loop-desktop-nav" aria-label="Primary">{links.map((link) => <Link key={link.href} href={link.href} aria-current={path === link.href ? "page" : undefined}>{link.label}<span className="loop-nav-dot" /></Link>)}</nav>
    <Link className="loop-header-contact" href="/contact">Let’s talk <span aria-hidden="true">↗</span></Link>
    <button className="loop-menu-toggle" ref={button} aria-label={open ? "Close menu" : "Open menu"} aria-controls="loop-mobile-menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Close −" : "Menu +"}</button>
    {open && <div className="loop-mobile-menu" id="loop-mobile-menu" ref={menu}><nav aria-label="Mobile primary">{[...links, { href: "/contact", label: "Let’s talk" }].map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<span>↗</span></Link>)}</nav><p>Independent minds.<br />Infinite possibilities.</p></div>}
  </header>;
}

