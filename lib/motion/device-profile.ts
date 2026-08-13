export type DeviceProfile = {
  coarsePointer: boolean;
  mobileViewport: boolean;
  lightMotion: boolean;
  heroQuality: "full" | "mobile";
};

const MOBILE_MAX_WIDTH = 767;

export function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;
}

/** Lighter effects for touch phones and narrow viewports */
export function shouldUseLightMotion(): boolean {
  if (typeof window === "undefined") return false;
  return isCoarsePointer() || isMobileViewport();
}

export function getDeviceProfile(): DeviceProfile {
  const coarsePointer = isCoarsePointer();
  const mobileViewport = isMobileViewport();
  const lightMotion = coarsePointer || mobileViewport;

  return {
    coarsePointer,
    mobileViewport,
    lightMotion,
    heroQuality: lightMotion ? "mobile" : "full",
  };
}

export function getHeroPixelRatio(quality: "full" | "mobile"): number {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  if (quality === "mobile") return Math.min(dpr, 1.35);
  return Math.min(dpr, 2);
}
