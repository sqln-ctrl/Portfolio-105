import * as THREE from "three";
import type { Hero105State } from "@/lib/webgl/hero-state";
import { lerpState } from "@/lib/webgl/hero-state";

const AMBER = 0xff5c1a;
const COPPER = 0xc4784a;
const IVORY = 0xe8dcc8;
const DARK = 0x0a0a0a;

type FragmentTier = "large" | "medium" | "tiny";

type DigitSlot = {
  group: THREE.Group;
  base: THREE.Vector3;
  explode: THREE.Vector3;
  dissolveDir: THREE.Vector3;
  char: string;
  index: number;
};

type ShardSlot = {
  mesh: THREE.Mesh;
  base: THREE.Vector3;
  velocity: THREE.Vector3;
  tier: FragmentTier;
  parallax: number;
  driftPhase: number;
};

export type Hero105Object = {
  root: THREE.Group;
  shards: THREE.Mesh[];
  particles: THREE.Points;
  update: (state: Hero105State, delta: number, camera: THREE.Camera) => void;
  dispose: () => void;
};

/** Keep fragments in the right/center field — away from left typography */
function biasX(x: number): number {
  if (x < -0.2) return 0.6 + Math.random() * 2.2;
  return x + 0.35;
}

function createDigitTexture(char: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 384;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 256, 384);
  ctx.font = "400 260px Instrument Serif, Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f5ebe3";
  ctx.fillText(char, 128, 192);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createDigitGroup(char: string, index: number): THREE.Group {
  const group = new THREE.Group();

  const depth = new THREE.Mesh(
    new THREE.BoxGeometry(0.88, 1.28, 0.14),
    new THREE.MeshStandardMaterial({
      color: 0x1a1410,
      metalness: 0.55,
      roughness: 0.42,
      emissive: new THREE.Color(COPPER),
      emissiveIntensity: 0.08,
      transparent: true,
      opacity: 0.92,
    }),
  );
  depth.position.z = -0.07;
  group.add(depth);

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.85, 1.25),
    new THREE.MeshStandardMaterial({
      map: createDigitTexture(char),
      transparent: true,
      alphaTest: 0.05,
      emissive: new THREE.Color(IVORY),
      emissiveIntensity: 0.18,
      metalness: 0.35,
      roughness: 0.48,
      side: THREE.DoubleSide,
    }),
  );
  group.add(plane);

  const frame = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.95, 1.35, 0.16)),
    new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0.32 }),
  );
  group.add(frame);

  const innerGrid = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.PlaneGeometry(0.7, 1.05, 3, 5)),
    new THREE.LineBasicMaterial({ color: COPPER, transparent: true, opacity: 0.12 }),
  );
  innerGrid.position.z = 0.02;
  group.add(innerGrid);

  group.userData.digitIndex = index;
  return group;
}

function createShard(
  x: number,
  y: number,
  z: number,
  scale: number,
  tier: FragmentTier,
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(0.15 * scale, 0.4 * scale, 0.08 * scale);
  const opacity = tier === "large" ? 0.28 : tier === "medium" ? 0.42 : 0.35;
  const mat = new THREE.MeshStandardMaterial({
    color: DARK,
    metalness: 0.65,
    roughness: 0.32,
    emissive: new THREE.Color(tier === "large" ? COPPER : AMBER),
    emissiveIntensity: tier === "large" ? 0.06 : 0.12,
    transparent: true,
    opacity,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(biasX(x), y, z);
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  return mesh;
}

function createParticleField(count: number, spread: number, color: number, size: number): {
  points: THREE.Points;
  velocities: Float32Array;
  origins: Float32Array;
} {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const origins = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = biasX((Math.random() - 0.5) * spread);
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.65;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.5;

    origins[i * 3] = positions[i * 3];
    origins[i * 3 + 1] = positions[i * 3 + 1];
    origins[i * 3 + 2] = positions[i * 3 + 2];

    const angle = Math.random() * Math.PI * 2;
    const speed = 0.25 + Math.random() * 0.8;
    velocities[i * 3] = Math.cos(angle) * speed;
    velocities[i * 3 + 1] = (Math.random() - 0.3) * speed;
    velocities[i * 3 + 2] = Math.sin(angle) * speed * 0.5;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  return { points: new THREE.Points(geo, mat), velocities, origins };
}

export type Hero105Quality = "full" | "mobile";

export function createHero105Object(quality: Hero105Quality = "full"): Hero105Object {
  const isMobile = quality === "mobile";
  const largeCount = isMobile ? 1 : 3;
  const mediumCount = isMobile ? 6 : 16;
  const atmosphereCount = isMobile ? 48 : 140;
  const dustCount = isMobile ? 20 : 60;
  const root = new THREE.Group();
  const digits: DigitSlot[] = [];
  const shardSlots: ShardSlot[] = [];

  const digitConfigs = [
    { char: "1", x: -1.35, explode: new THREE.Vector3(-0.55, 0.15, -0.35) },
    { char: "0", x: 0, explode: new THREE.Vector3(0, -0.12, 0.35) },
    { char: "5", x: 1.35, explode: new THREE.Vector3(0.55, 0.12, -0.3) },
  ];

  digitConfigs.forEach(({ char, x, explode }, index) => {
    const group = createDigitGroup(char, index);
    group.position.set(x, 0, 0);
    root.add(group);

    digits.push({
      group,
      base: new THREE.Vector3(x, 0, 0),
      explode,
      dissolveDir: new THREE.Vector3(
        (Math.random() - 0.5) * 1.2,
        Math.random() * 0.5 + 0.1,
        (Math.random() - 0.5) * 0.8,
      ).normalize(),
      char,
      index,
    });
  });

  for (let i = 0; i < largeCount; i++) {
    const pos = new THREE.Vector3(
      0.8 + Math.random() * 2.5,
      (Math.random() - 0.5) * 2.2,
      -1.8 - Math.random() * 0.8,
    );
    const shard = createShard(pos.x, pos.y, pos.z, 1.1 + Math.random() * 0.4, "large");
    root.add(shard);
    shardSlots.push({
      mesh: shard,
      base: shard.position.clone(),
      velocity: new THREE.Vector3(0, 0, 0),
      tier: "large",
      parallax: 0.15,
      driftPhase: Math.random() * Math.PI * 2,
    });
  }

  for (let i = 0; i < mediumCount; i++) {
    const pos = new THREE.Vector3(
      (Math.random() - 0.2) * 3.8,
      (Math.random() - 0.5) * 2.8,
      (Math.random() - 0.5) * 1.8,
    );
    const shard = createShard(pos.x, pos.y, pos.z, 0.55 + Math.random() * 0.7, "medium");
    root.add(shard);
    shardSlots.push({
      mesh: shard,
      base: shard.position.clone(),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.8,
        Math.random() * 0.6,
        (Math.random() - 0.5) * 0.8,
      ),
      tier: "medium",
      parallax: 0.35 + Math.random() * 0.25,
      driftPhase: Math.random() * Math.PI * 2,
    });
  }

  const atmosphereField = createParticleField(atmosphereCount, isMobile ? 3.6 : 4.5, COPPER, isMobile ? 0.012 : 0.014);
  const dustField = createParticleField(dustCount, isMobile ? 2.6 : 3.2, IVORY, 0.01);
  root.add(atmosphereField.points);
  root.add(dustField.points);

  const orbitRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.013, 8, 72),
    new THREE.MeshStandardMaterial({
      color: DARK,
      metalness: 0.75,
      roughness: 0.35,
      emissive: new THREE.Color(COPPER),
      emissiveIntensity: 0.14,
      transparent: true,
      opacity: 0.42,
    }),
  );
  orbitRing.rotation.x = Math.PI / 2.25;
  root.add(orbitRing);

  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.55, 0.009, 8, 48),
    new THREE.MeshStandardMaterial({
      color: DARK,
      metalness: 0.8,
      roughness: 0.3,
      emissive: new THREE.Color(AMBER),
      emissiveIntensity: 0.1,
      transparent: true,
      opacity: 0.3,
    }),
  );
  innerRing.rotation.y = Math.PI / 3.5;
  root.add(innerRing);

  let idle = 0;

  const update = (state: Hero105State, delta: number, camera: THREE.Camera) => {
    if (!state.isActive && state.dissolveAmount > 0.98) return;
    idle += delta;

    const explodeTarget = state.isPointerDown ? 1 : 0;
    state.explodeAmount = lerpState(state.explodeAmount, explodeTarget, 0.1);

    const assembly = state.assemblyAmount;
    const explode = state.explodeAmount;
    const dissolve = state.dissolveAmount;

    root.position.y = Math.sin(idle * 0.5) * 0.05 * assembly * (1 - dissolve);
    root.rotation.x = state.pointerY * 0.065 * (1 - dissolve * 0.7) + Math.sin(idle * 0.35) * 0.025;
    root.rotation.y = state.pointerX * 0.08 * (1 - dissolve * 0.7) + Math.sin(idle * 0.3) * 0.03;
    root.scale.setScalar((0.86 + assembly * 0.14) * (1 - dissolve * 0.12));

    orbitRing.rotation.z += delta * 0.08 * (1 - dissolve * 0.5);
    innerRing.rotation.x += delta * 0.06;
    orbitRing.material.opacity = 0.42 * (1 - dissolve * 0.85);
    (innerRing.material as THREE.MeshStandardMaterial).opacity = 0.3 * (1 - dissolve * 0.85);

    const activeDigit =
      state.pointerX < -0.35 ? 0 : state.pointerX > 0.35 ? 2 : 1;

    digits.forEach(({ group, base, explode: exp, dissolveDir, index }, i) => {
      const digitDissolve = Math.max(0, dissolve - i * 0.08);
      const blast = explode * 1.2;
      group.position.x = base.x + exp.x * blast + dissolveDir.x * digitDissolve * 1.8;
      group.position.y =
        base.y + exp.y * blast + (1 - assembly) * (i - 1) * 0.28 + dissolveDir.y * digitDissolve * 1.5;
      group.position.z = base.z + exp.z * blast + (1 - assembly) * 0.3 + dissolveDir.z * digitDissolve * 1.4;

      group.scale.setScalar(Math.max(0.001, 1 - digitDissolve * 0.92));
      group.lookAt(camera.position);

      const hoverBoost = index === activeDigit && !state.isPointerDown ? 0.15 : 0;

      group.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.emissiveIntensity =
            (0.12 + explode * 0.35 + assembly * 0.15 + hoverBoost) * (1 - digitDissolve);
        }
        if (child instanceof THREE.LineSegments) {
          (child.material as THREE.LineBasicMaterial).opacity =
            0.28 * (1 - digitDissolve) + hoverBoost * 0.2;
        }
      });
    });

    shardSlots.forEach(({ mesh, base, velocity, tier, parallax, driftPhase }, i) => {
      const speedMul = tier === "large" ? 0.04 : tier === "medium" ? 0.1 : 0.14;
      mesh.rotation.x += delta * speedMul;
      mesh.rotation.y += delta * speedMul * 0.75;

      const drift = Math.sin(idle * 0.3 + driftPhase) * 0.035 * (1 - dissolve);
      const px = state.pointerX * parallax * 0.15;
      const py = state.pointerY * parallax * 0.1;

      mesh.position.x = base.x + px + (explode > 0.01 ? base.x * explode * 0.2 : 0);
      mesh.position.y = base.y + drift + py + (explode > 0.01 ? velocity.y * explode * delta : 0);
      mesh.position.z = base.z + (explode > 0.01 ? base.z * explode * 0.15 : 0);

      if (dissolve > 0.01) {
        mesh.position.x += velocity.x * dissolve * delta * 2;
        mesh.position.y += velocity.y * dissolve * delta * 2;
        mesh.position.z += velocity.z * dissolve * delta * 2;
        (mesh.material as THREE.MeshStandardMaterial).opacity *= 1 - dissolve * 0.85;
      }
    });

    const updateField = (
      field: THREE.Points,
      velocities: Float32Array,
      origins: Float32Array,
      spreadMul: number,
    ) => {
      const pos = field.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const ox = origins[i * 3]!;
        const oy = origins[i * 3 + 1]!;
        const oz = origins[i * 3 + 2]!;
        const vx = velocities[i * 3]!;
        const vy = velocities[i * 3 + 1]!;
        const vz = velocities[i * 3 + 2]!;
        const spread = dissolve + explode * 0.4;
        pos.array[i * 3] = ox + vx * spread * spreadMul + Math.sin(idle + i) * 0.015;
        pos.array[i * 3 + 1] = oy + vy * spread * spreadMul + Math.cos(idle * 0.6 + i) * 0.01;
        pos.array[i * 3 + 2] = oz + vz * spread * spreadMul;
      }
      pos.needsUpdate = true;
    };

    updateField(atmosphereField.points, atmosphereField.velocities, atmosphereField.origins, 2.4);
    updateField(dustField.points, dustField.velocities, dustField.origins, 1.8);
    atmosphereField.points.rotation.y = idle * 0.04;
  };

  const dispose = () => {
    root.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
        child.geometry.dispose();
        const mat = child.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial && child.material.map) {
          child.material.map.dispose();
        }
      }
      if (child instanceof THREE.Points) {
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
    });
  };

  return {
    root,
    shards: shardSlots.map((s) => s.mesh),
    particles: atmosphereField.points,
    update,
    dispose,
  };
}
