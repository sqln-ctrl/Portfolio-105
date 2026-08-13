export const LOADER_PENDING_CLASS = "site-loader-pending";

export const LOADER_BLOCK_SCRIPT = `(function(){try{if(sessionStorage.getItem("studio105-loader-seen")!=="1"){document.documentElement.classList.add("site-loader-pending");document.documentElement.style.overflow="hidden";document.documentElement.style.backgroundColor="#050505"}}catch(e){document.documentElement.classList.add("site-loader-pending");document.documentElement.style.overflow="hidden";document.documentElement.style.backgroundColor="#050505"}})();`;

const LOADER_SESSION_KEY = "studio105-loader-seen";

export const LOADER_MIN_MS = 800;
export const LOADER_MAX_MS = 4500;

type LoaderGate = {
  fonts: boolean;
  hero: boolean;
  dom: boolean;
};

let gate: LoaderGate = { fonts: false, hero: false, dom: false };
let loaderComplete = false;
let loaderActive = false;

const completeListeners = new Set<() => void>();

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

export function clearLoaderPending(): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove(LOADER_PENDING_CLASS);
  document.documentElement.style.overflow = "";
  document.documentElement.style.backgroundColor = "";
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
}

export function markLoaderFontsReady(): void {
  if (gate.fonts) return;
  gate.fonts = true;
}

export function markLoaderHeroReady(): void {
  if (gate.hero) return;
  gate.hero = true;
}

export function isLoaderCriticalReady(): boolean {
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

export function notifyLoaderComplete(): void {
  if (loaderComplete) return;
  loaderComplete = true;
  loaderActive = false;
  completeListeners.forEach((listener) => listener());
  completeListeners.clear();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("studio105:loader-complete"));
  }
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
  completeListeners.clear();
}
