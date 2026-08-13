export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
  spring: "elastic.out(1, 0.45)",
} as const;

export const DURATION = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
  hero: 1.2,
} as const;
