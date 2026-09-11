"use client";
import { useLayoutEffect } from "react";
import { LoopMark } from "@/components/loopcodez/LoopMark";
import { completeLoader } from "@/lib/loader/loader-gate";
export function SiteLoader() {
  useLayoutEffect(() => { completeLoader(); }, []);
  return <div className="loop-entrance" aria-hidden="true"><LoopMark /><span>loopcodez</span><p>Automate. Create. Keep going.</p><i /></div>;
}
