"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/motion/register-gsap";
import { LoopMark } from "@/components/loopcodez/LoopMark";
export function RouteTransition() {
  const router=useRouter(); const pathname=usePathname();
  const curtain=useRef<HTMLDivElement>(null); const moving=useRef(false);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>{
    const element=curtain.current;if(!element)return;
    if(timer.current)clearTimeout(timer.current);
    if(moving.current)gsap.to(element,{yPercent:-101,duration:.65,ease:"power3.inOut",onComplete:()=>{moving.current=false;gsap.set(element,{visibility:"hidden",yPercent:101});}});
  },[pathname]);
  useEffect(()=>{
    const element=curtain.current;if(!element)return;
    const click=(event:MouseEvent)=>{
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
      const link=(event.target as Element)?.closest<HTMLAnchorElement>("a[href]");
      if(!link||link.target||link.hasAttribute("download")||link.dataset.noTransition!==undefined)return;
      const url=new URL(link.href);
      if(url.origin!==window.location.origin||url.pathname===window.location.pathname||url.pathname.startsWith("/api/")||url.pathname.startsWith("/admin"))return;
      event.preventDefault();if(moving.current)return;moving.current=true;
      gsap.set(element,{visibility:"visible",yPercent:101});
      gsap.to(element,{yPercent:0,duration:.32,ease:"power2.inOut",onComplete:()=>{
        router.push(url.pathname+url.search+url.hash);
        timer.current=setTimeout(()=>{gsap.to(element,{yPercent:-101,duration:.4,onComplete:()=>{moving.current=false;gsap.set(element,{visibility:"hidden"});}})},2500);
      }});
    };
    document.addEventListener("click",click,true);
    return()=>{document.removeEventListener("click",click,true);gsap.killTweensOf(element);if(timer.current)clearTimeout(timer.current)};
  },[router]);
  return <div ref={curtain} className="loop-route-curtain" aria-hidden="true"><LoopMark/><span>Keep the loop going.</span></div>;
}
