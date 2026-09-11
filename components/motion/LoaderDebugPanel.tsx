"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getLoaderSnapshot,
  onLoaderDebug,
  setLoaderDebugEnabled,
  type LoaderGateSnapshot,
} from "@/lib/loader/loader-gate";
import { formatLoaderDebugLines, isLoaderDebugEnabled } from "@/lib/loader/loader-debug";

const subscribeDebug = () => () => {};
export function LoaderDebugPanel() {
  const enabled = useSyncExternalStore(subscribeDebug, isLoaderDebugEnabled, () => false);
  const [snapshot, setSnapshot] = useState<LoaderGateSnapshot>(() => getLoaderSnapshot());

  useEffect(() => {
    const active = isLoaderDebugEnabled();

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

