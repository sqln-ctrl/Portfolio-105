import type { LoaderGateSnapshot } from "@/lib/loader/loader-gate";

export function isLoaderDebugEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      process.env.NODE_ENV === "development" &&
      new URLSearchParams(window.location.search).get("debugLoader") === "true"
    );
  } catch {
    return false;
  }
}

export function formatLoaderDebugLines(snapshot: LoaderGateSnapshot): string[] {
  const row = (label: string, ok: boolean) =>
    `${label.padEnd(10, ".")} ${ok ? "READY" : "WAIT"}`;

  return [
    row("DOM", snapshot.dom),
    row("Fonts", snapshot.fonts),
    row("Hero", snapshot.hero),
    row("Critical", snapshot.criticalReady),
    `Phase .... ${snapshot.phase.toUpperCase()}`,
    `Elapsed .. ${Math.round(snapshot.elapsedMs)}ms`,
  ];
}
