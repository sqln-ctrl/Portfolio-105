import { shouldUseLightMotion } from "@/lib/motion/device-profile";
import { prefersReducedMotion } from "@/lib/motion/reduced-motion";
import {
  beginLoaderExit,
  completeLoader,
  getLoaderSnapshot,
  isLoaderCriticalReady,
  loaderLog,
  LOADER_ACTIVE_CLASS,
  LOADER_MAX_MS,
  LOADER_MIN_MS,
  lockPageScroll,
  markLoaderDomReady,
  markLoaderFontsReady,
  markLoaderHeroReady,
  markLoaderSeen,
  setLoaderPhase,
  shouldRunLoader,
  unlockPageScroll,
} from "@/lib/loader/loader-gate";

export type LoaderRuntimeCallbacks = {
  onProgress: (progress: number) => void;
  onExitStart: () => void;
  onComplete: () => void;
};

type RuntimeHandle = {
  dispose: () => void;
};

let generation = 0;
let activeGeneration = 0;

export function startLoaderRuntime(callbacks: LoaderRuntimeCallbacks): RuntimeHandle {
  const gen = ++generation;
  activeGeneration = gen;

  let disposed = false;
  let exitStarted = false;
  let finishCalled = false;
  let pollId = 0;
  let minTimerId = 0;
  let forceExitId = 0;
  let exitFinishId = 0;
  let fontsTimerId = 0;

  const isActive = () => !disposed && gen === activeGeneration;

  const finish = () => {
    if (!isActive() || finishCalled) return;
    finishCalled = true;
    window.clearInterval(pollId);
    window.clearTimeout(minTimerId);
    window.clearTimeout(forceExitId);
    window.clearTimeout(exitFinishId);
    window.clearTimeout(fontsTimerId);
    loaderLog("COMPLETE");
    completeLoader();
    unlockPageScroll();
    markLoaderSeen();
    callbacks.onComplete();
  };

  const exit = () => {
    if (!isActive() || exitStarted) return;
    exitStarted = true;
    window.clearInterval(pollId);
    window.clearTimeout(minTimerId);
    window.clearTimeout(forceExitId);
    beginLoaderExit();
    callbacks.onProgress(1);
    callbacks.onExitStart();
    loaderLog("EXIT");
    exitFinishId = window.setTimeout(finish, shouldUseLightMotion() ? 450 : 1400);
  };

  const skipLoader = () => {
    if (!isActive()) return;
    loaderLog("SKIP");
    completeLoader();
    unlockPageScroll();
    callbacks.onComplete();
  };

  loaderLog("mounted");

  if (prefersReducedMotion()) {
    skipLoader();
    return { dispose: () => { disposed = true; } };
  }

  if (!shouldRunLoader()) {
    skipLoader();
    return { dispose: () => { disposed = true; } };
  }

  setLoaderPhase("running");
  document.body.classList.add(LOADER_ACTIVE_CLASS);
  lockPageScroll();

  markLoaderDomReady();
  loaderLog("dom ready");

  markLoaderHeroReady();
  loaderLog("hero shell ready (optimistic)");

  markLoaderFontsReady();
  loaderLog("fonts ready (immediate)");

  if (typeof document !== "undefined" && "fonts" in document) {
    fontsTimerId = window.setTimeout(() => {
      markLoaderFontsReady();
      loaderLog("fonts ready (timeout fallback)");
    }, 700);
    document.fonts.ready
      .then(() => {
        window.clearTimeout(fontsTimerId);
        markLoaderFontsReady();
        loaderLog("fonts ready (document.fonts)");
      })
      .catch(() => {
        window.clearTimeout(fontsTimerId);
        markLoaderFontsReady();
        loaderLog("fonts ready (document.fonts error)");
      });
  }

  const start = performance.now();

  const tick = () => {
    if (!isActive() || exitStarted) return;

    const elapsed = performance.now() - start;
    const gateProgress = getLoaderSnapshot().progress;
    const timeProgress = Math.min(elapsed / LOADER_MIN_MS, 1);
    callbacks.onProgress(Math.max(gateProgress, timeProgress * 0.85));

    if (elapsed >= LOADER_MAX_MS) {
      loaderLog(`max time reached (${Math.round(elapsed)}ms)`);
      exit();
      return;
    }

    if (elapsed >= LOADER_MIN_MS && isLoaderCriticalReady()) {
      loaderLog(`critical ready at ${Math.round(elapsed)}ms`);
      exit();
    }
  };

  callbacks.onProgress(0.06);
  pollId = window.setInterval(tick, 50);
  tick();

  forceExitId = window.setTimeout(() => {
    if (!isActive() || exitStarted) return;
    loaderLog("force exit safety net");
    exit();
  }, LOADER_MAX_MS + 250);

  const onFallback = () => {
    if (!isActive() || exitStarted) return;
    loaderLog("inline fallback event");
    exit();
  };

  window.addEventListener("studio105:loader-force-exit", onFallback);

  return {
    dispose: () => {
      if (gen === activeGeneration) activeGeneration = 0;
      disposed = true;
      window.clearInterval(pollId);
      window.clearTimeout(minTimerId);
      window.clearTimeout(forceExitId);
      window.clearTimeout(exitFinishId);
      window.clearTimeout(fontsTimerId);
      window.removeEventListener("studio105:loader-force-exit", onFallback);
    },
  };
}
