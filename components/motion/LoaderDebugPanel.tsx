"use client";

import { useEffect, useState } from "react";
import {
  getLoaderSnapshot,
  onLoaderDebug,
  setLoaderDebugEnabled,
  type LoaderGateSnapshot,
} from "@/lib/loader/loader-gate";
import { formatLoaderDebugLines, isLoaderDebugEnabled } from "@/lib/loader/loader-debug";

export function LoaderDebugPanel() {
  const [enabled, setEnabled] = useState(false);
  const [snapshot, setSnapshot] = useState<LoaderGateSnapshot>(() => getLoaderSnapshot());

  useEffect(() => {
    const active = isLoaderDebugEnabled();
    setEnabled(active);
    setLoaderDebugEnabled(active);
    if (!active) return;
    return onLoaderDebug(setSnapshot);
  }, []);

  if (!enabled) return null;

  return (
    <div className="loader-debug-panel" aria-live="polite">
      {formatLoaderDebugLines(snapshot).map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
}
