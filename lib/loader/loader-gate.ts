import { shouldUseLightMotion } from "@/lib/motion/device-profile";

export const LOADER_PENDING_CLASS = "site-loader-pending";
export const LOADER_ACTIVE_CLASS = "site-loader-active";
export const LOADER_DONE_CLASS = "site-loader-done";

/** Inlined in <head> — must run before first paint to prevent content flash */
export const LOADER_CRITICAL_CSS = [
  "html.site-loader-pending,html.site-loader-pending body{overflow:hidden!important;height:100%!important;touch-action:none!important}",
  "html.site-loader-pending body{position:fixed!important;inset:0!important;width:100%!important}",
  "html.site-loader-pending #site-app{visibility:hidden!important;opacity:0!important;pointer-events:none!important;position:fixed!important;inset:0!important;overflow:hidden!important}",
  "html.site-loader-pending .site-loader-static{display:flex!important}",
  "body.site-loader-active{overflow:hidden!important;position:fixed!important;inset:0!important;width:100%!important;touch-action:none!important}",
  "body.site-loader-active #site-app{visibility:hidden!important;opacity:0!important;pointer-events:none!important;position:fixed!important;inset:0!important;overflow:hidden!important}",
  ".site-loader{display:none!important}",
  "html.site-loader-pending .site-loader,body.site-loader-active .site-loader{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}",
  "html.site-loader-done .site-loader{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}",
  "html.site-loader-done #site-app,html:not(.site-loader-pending):not(.site-loader-active) #site-app{visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:static!important;overflow:visible!important;touch-action:auto!important}",
  "html.site-loader-done,html.site-loader-done body{overflow:auto!important;height:auto!important;touch-action:auto!important;position:static!important}",
].join("");

export const LOADER_BLOCK_SCRIPT = `(function(){var k="loopcodez-loader-seen";function hideLoader(){var el=document.querySelector(".site-loader");if(el){el.style.display="none";el.style.visibility="hidden";el.style.opacity="0";el.style.pointerEvents="none"}document.documentElement.classList.add("site-loader-done")}function finish(){document.documentElement.classList.remove("site-loader-pending");document.documentElement.style.overflow="";document.documentElement.style.backgroundColor="";document.body.classList.remove("site-loader-active");document.body.style.position="";document.body.style.inset="";document.body.style.width="";document.body.style.overflow="";document.body.style.top="";hideLoader();try{sessionStorage.setItem(k,"1")}catch(e){}window.dispatchEvent(new CustomEvent("loopcodez:loader-force-exit"))}try{if(sessionStorage.getItem(k)!=="1"){document.documentElement.classList.add("site-loader-pending");document.documentElement.style.overflow="hidden";document.documentElement.style.backgroundColor="#050505";window.setTimeout(finish,4000)}}catch(e){document.documentElement.classList.add("site-loader-pending");document.documentElement.style.overflow="hidden";document.documentElement.style.backgroundColor="#050505";window.setTimeout(finish,4000)}})();`;

const LOADER_SESSION_KEY = "loopcodez-loader-seen";

export const LOADER_MIN_MS = 700;
export const LOADER_MAX_MS = 4000;

export type LoaderPhase = "idle" | "running" | "exiting" | "complete";

type LoaderGate = {
  fonts: boolean;
  hero: boolean;
  dom: boolean;
};

export type LoaderGateSnapshot = {
  phase: LoaderPhase;
  dom: boolean;
  fonts: boolean;
  hero: boolean;
  criticalReady: boolean;
  progress: number;
  elapsedMs: number;
};

let gate: LoaderGate = { fonts: false, hero: false, dom: false };
let loaderComplete = false;
let loaderActive = false;
let phase: LoaderPhase = "idle";
let startedAt = 0;
let debugEnabled = false;

const completeListeners = new Set<() => void>();
const debugListeners = new Set<(snapshot: LoaderGateSnapshot) => void>();

function syncDebug(): void {
  const snapshot = getLoaderSnapshot();
  debugListeners.forEach((listener) => listener(snapshot));
}

export function setLoaderDebugEnabled(enabled: boolean): void {
  debugEnabled = enabled;
}

export function onLoaderDebug(listener: (snapshot: LoaderGateSnapshot) => void): () => void {
  debugListeners.add(listener);
  listener(getLoaderSnapshot());
  return () => debugListeners.delete(listener);
}

export function loaderLog(message: string): void {
  if (debugEnabled || process.env.NODE_ENV === "development") {
    console.info(`[Loader] ${message}`);
  }
  syncDebug();
}

export function getLoaderSessionKey(): string {
  return LOADER_SESSION_KEY;
}

export function shouldRunLoader(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(LOADER_SESSION_KEY) !== "1";
  } catch {
    return true;
  }
}

export function setLoaderPhase(next: LoaderPhase): void {
  phase = next;
  if (next === "running" && startedAt === 0) {
    startedAt = performance.now();
  }
  loaderActive = next === "running" || next === "exiting";
  syncDebug();
}

export function getLoaderPhase(): LoaderPhase {
  return phase;
}

export function getLoaderSnapshot(): LoaderGateSnapshot {
  const elapsedMs = startedAt > 0 ? performance.now() - startedAt : 0;
  return {
    phase,
    dom: gate.dom,
    fonts: gate.fonts,
    hero: gate.hero,
    criticalReady: isLoaderCriticalReady(),
    progress: getLoaderProgress(),
    elapsedMs,
  };
}

export function clearLoaderPending(): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove(LOADER_PENDING_CLASS);
  document.documentElement.classList.add(LOADER_DONE_CLASS);
  document.documentElement.style.overflow = "";
  document.documentElement.style.backgroundColor = "";
  document.documentElement.style.touchAction = "";
  document.body.classList.remove(LOADER_ACTIVE_CLASS);
  document.body.style.position = "";
  document.body.style.inset = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.touchAction = "";
  const app = document.getElementById("site-app");
  if (app) {
    app.style.visibility = "";
    app.style.opacity = "";
    app.style.pointerEvents = "";
    app.style.position = "";
    app.style.overflow = "";
  }
}

/** Idempotent — safe to call after loader or on pages that skip it */
export function ensureAppInteractive(): void {
  if (typeof document === "undefined") return;
  if (
    document.documentElement.classList.contains(LOADER_PENDING_CLASS) ||
    document.body.classList.contains(LOADER_ACTIVE_CLASS)
  ) {
    return;
  }
  unlockPageScroll();
  document.documentElement.classList.add(LOADER_DONE_CLASS);
  clearLoaderPending();
}

export function lockPageScroll(): void {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const scrollY = window.scrollY;
  document.body.dataset.loaderScrollY = String(scrollY);
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
}

export function unlockPageScroll(): void {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const scrollY = Number(document.body.dataset.loaderScrollY ?? "0");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  delete document.body.dataset.loaderScrollY;
  window.scrollTo(0, scrollY);
}

export function setLoaderActive(active: boolean): void {
  loaderActive = active;
}

export function isLoaderActive(): boolean {
  return loaderActive;
}

export function markLoaderDomReady(): void {
  if (gate.dom) return;
  gate.dom = true;
  syncDebug();
}

export function markLoaderFontsReady(): void {
  if (gate.fonts) return;
  gate.fonts = true;
  syncDebug();
}

export function markLoaderHeroReady(): void {
  if (gate.hero) return;
  gate.hero = true;
  syncDebug();
}

export function isLoaderCriticalReady(): boolean {
  if (!gate.dom) return false;

  if (typeof window !== "undefined" && shouldUseLightMotion()) {
    return gate.fonts || gate.hero;
  }

  return gate.fonts && gate.hero && gate.dom;
}

export function getLoaderProgress(): number {
  let progress = 0;
  if (gate.dom) progress += 0.22;
  if (gate.fonts) progress += 0.28;
  if (gate.hero) progress += 0.5;
  return Math.min(progress, 1);
}

export function isLoaderComplete(): boolean {
  return loaderComplete;
}

export function onLoaderComplete(listener: () => void): () => void {
  if (loaderComplete) {
    listener();
    return () => {};
  }
  completeListeners.add(listener);
  return () => completeListeners.delete(listener);
}

export function beginLoaderExit(): void {
  if (phase === "complete") return;
  setLoaderPhase("exiting");
}

export function completeLoader(): void {
  if (loaderComplete) return;
  loaderComplete = true;
  loaderActive = false;
  setLoaderPhase("complete");
  clearLoaderPending();
  unlockPageScroll();
  completeListeners.forEach((listener) => listener());
  completeListeners.clear();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("loopcodez:loader-complete"));
  }
}

export function notifyLoaderComplete(): void {
  completeLoader();
}

export function markLoaderSeen(): void {
  try {
    sessionStorage.setItem(LOADER_SESSION_KEY, "1");
  } catch {
    /* private browsing */
  }
}

export function resetLoaderGateForTests(): void {
  gate = { fonts: false, hero: false, dom: false };
  loaderComplete = false;
  loaderActive = false;
  phase = "idle";
  startedAt = 0;
  completeListeners.clear();
  debugListeners.clear();
}

