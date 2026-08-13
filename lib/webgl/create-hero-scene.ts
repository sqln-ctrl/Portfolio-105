import * as THREE from "three";
import {
  createHero105Object,
  type Hero105Object,
  type Hero105Quality,
} from "@/lib/webgl/create-hero-105-object";
import { getHeroPixelRatio } from "@/lib/motion/device-profile";
import type { Hero105State } from "@/lib/webgl/hero-state";

export type HeroSceneContext = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  object: Hero105Object;
  state: Hero105State;
  clock: THREE.Clock;
  resize: () => void;
  dispose: () => void;
};

type CreateHeroSceneOptions = {
  canvas: HTMLCanvasElement;
  state: Hero105State;
  quality?: Hero105Quality;
  dpr?: number;
};

export function createHeroScene({
  canvas,
  state,
  quality = "full",
  dpr = getHeroPixelRatio(quality),
}: CreateHeroSceneOptions): HeroSceneContext {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.08);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 4.8);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: quality === "full",
    powerPreference: quality === "mobile" ? "default" : "high-performance",
  });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const object = createHero105Object(quality);

  if (quality === "mobile") {
    camera.position.z = 5.4;
    object.root.scale.setScalar(0.88);
  }
  scene.add(object.root);

  scene.add(new THREE.AmbientLight(0xfff5ee, 0.18));

  const key = new THREE.DirectionalLight(0xfff0e8, 0.95);
  key.position.set(2, 3, 4);
  scene.add(key);

  const warm = new THREE.PointLight(0xff5c1a, 1.8, 12);
  warm.position.set(1.5, 0.5, 3);
  scene.add(warm);

  const rim = new THREE.PointLight(0xc4784a, 0.6, 10);
  rim.position.set(-1, 1, 2);
  scene.add(rim);

  const clock = new THREE.Clock();

  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const { width, height } = parent.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const dispose = () => {
    object.dispose();
    renderer.dispose();
  };

  resize();

  return { scene, camera, renderer, object, state, clock, resize, dispose };
}

export function renderHeroFrame(ctx: HeroSceneContext) {
  const delta = ctx.clock.getDelta();
  ctx.object.update(ctx.state, delta, ctx.camera);
  ctx.renderer.render(ctx.scene, ctx.camera);
}
