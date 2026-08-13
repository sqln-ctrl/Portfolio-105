export type HeroBridgeSnapshot = {
  dissolveAmount: number;
  explodeAmount: number;
  assemblyAmount: number;
  pointerX: number;
  pointerY: number;
  isPointerDown: boolean;
  /** Normalized viewport position of hero visual center */
  visualCenterX: number;
  visualCenterY: number;
};

const defaultSnapshot: HeroBridgeSnapshot = {
  dissolveAmount: 0,
  explodeAmount: 0,
  assemblyAmount: 0,
  pointerX: 0,
  pointerY: 0,
  isPointerDown: false,
  visualCenterX: 0.72,
  visualCenterY: 0.45,
};

let snapshot: HeroBridgeSnapshot = { ...defaultSnapshot };
const listeners = new Set<(s: HeroBridgeSnapshot) => void>();

export function getHeroBridgeSnapshot(): HeroBridgeSnapshot {
  return snapshot;
}

export function updateHeroBridge(partial: Partial<HeroBridgeSnapshot>): void {
  snapshot = { ...snapshot, ...partial };
  listeners.forEach((fn) => fn(snapshot));
}

export function subscribeHeroBridge(
  fn: (s: HeroBridgeSnapshot) => void,
): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function resetHeroBridge(): void {
  snapshot = { ...defaultSnapshot };
}
