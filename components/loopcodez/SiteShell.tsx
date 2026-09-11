"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { SiteLoader } from "@/components/motion/SiteLoader";
import { RouteTransition } from "@/components/motion/RouteTransition";

export function SiteShell({ children, footer }: { children:ReactNode;footer:ReactNode }) {
  const path=usePathname();
  if(path.startsWith('/admin')) return <main id="main-content">{children}</main>;
  return <LenisProvider><div id="site-app"><SiteLoader /><RouteTransition /><SiteHeader /><main id="main-content">{children}</main>{footer}</div></LenisProvider>;
}

