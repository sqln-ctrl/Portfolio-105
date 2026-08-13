export type Hero105State = {
  pointerX: number;
  pointerY: number;
  explodeAmount: number;
  assemblyAmount: number;
  scrollProgress: number;
  /** 0 assembled → 1 fully dissolved into particles (scroll-driven) */
  dissolveAmount: number;
  isActive: boolean;
  isPointerDown: boolean;
};

export function createHeroState(): Hero105State {
  return {
    pointerX: 0,
    pointerY: 0,
    explodeAmount: 0,
    assemblyAmount: 0,
    scrollProgress: 0,
    dissolveAmount: 0,
    isActive: true,
    isPointerDown: false,
  };
}

export function lerpState(
  current: number,
  target: number,
  alpha: number,
): number {
  return current + (target - current) * alpha;
}
