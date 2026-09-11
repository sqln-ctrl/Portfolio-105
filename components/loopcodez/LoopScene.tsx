"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/** A continuous infinity curve split into independently transformable glass sections. */
class LoopArc extends THREE.Curve<THREE.Vector3> {
  constructor(private start: number, private end: number) { super(); }
  getPoint(t: number, target = new THREE.Vector3()) {
    const a = this.start + (this.end - this.start) * t;
    return target.set(2.6 * Math.cos(a), 1.18 * Math.sin(a * 2), 0.47 * Math.sin(a));
  }
}

export default function LoopScene({ paused }: { paused: boolean }) {
  const mount = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); }
    catch { return; }
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;
    let mobile = host.clientWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.3 : 1.7));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10120f);
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
    camera.position.set(0, 0, 13);
    const environment = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(renderer);
    const environmentMap = generator.fromScene(environment, 0.04);
    scene.environment = environmentMap.texture;
    environment.dispose();
    generator.dispose();

    const glass = new THREE.MeshPhysicalMaterial({ color: 0x8ba99a, metalness: 0, roughness: 0.055, transmission: 1, thickness: 1.2, ior: 1.5, clearcoat: 1, iridescence: 0.15, iridescenceIOR: 1.3, envMapIntensity: 1 });
    const crystalMaterial = new THREE.MeshPhysicalMaterial({ color: 0xadc9bb, metalness: 0, roughness: 0.035, transmission: 1, thickness: 1.9, ior: 1.45, clearcoat: 1, envMapIntensity: 0.8 });
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xd2e7d7, transparent: true, opacity: 0.18 });
    const key = new THREE.DirectionalLight(0xeeffdb, 2); key.position.set(-3, 5, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xa5ccff, 2); rim.position.set(4, -2, 3); scene.add(rim);
    const lime = new THREE.PointLight(0xd6fa71, 16, 15); lime.position.set(-1, -2, 3); scene.add(lime);
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    const logo = new THREE.Group(); scene.add(logo);
    const fragmentCount = mobile ? 40 : 64;
    const fragments: { mesh: THREE.Mesh; center: THREE.Vector3; direction: THREE.Vector3; spin: THREE.Vector3 }[] = [];
    const continuous = new THREE.TubeGeometry(new LoopArc(0, Math.PI * 2), fragmentCount * 6, 0.33, 12, true);
    const surface = continuous.toNonIndexed();
    continuous.dispose();
    const verticesPerFragment = 6 * 12 * 6;
    for (let i = 0; i < fragmentCount; i++) {
      const a = i / fragmentCount * Math.PI * 2;
      const arc = new LoopArc(a, a + Math.PI * 2 / fragmentCount * 0.996);
      const center = arc.getPoint(0.5);
      const geometry = new THREE.BufferGeometry();
      for (const name of ["position", "normal", "uv"]) {
        const attribute = surface.getAttribute(name);
        const start = i * verticesPerFragment * attribute.itemSize;
        geometry.setAttribute(name, new THREE.Float32BufferAttribute(attribute.array.slice(start, start + verticesPerFragment * attribute.itemSize), attribute.itemSize));
      }
      geometry.translate(-center.x, -center.y, -center.z);
      const mesh = new THREE.Mesh(geometry, glass); mesh.position.copy(center); logo.add(mesh);
      const direction = center.clone().normalize().multiplyScalar(2.1 + Math.sin(i * 17) * 0.8);
      direction.z += Math.sin(i * 7) * 2;
      fragments.push({ mesh, center, direction, spin: new THREE.Vector3(Math.sin(i * 3), Math.cos(i * 7), Math.sin(i * 13)) });
    }
    surface.dispose();

    const crystals: { mesh: THREE.Mesh; position: THREE.Vector3; phase: number }[] = [];
    const crystalGeometry = new THREE.OctahedronGeometry(1, 0);
    const crystalEdges = new THREE.EdgesGeometry(crystalGeometry);
    const positions = [[-4.1, 2.3, 0, 0.28], [4.3, 2.2, -1, 0.42], [4, -2.1, 0.5, 0.5], [-2.7, -2.5, -1, 0.23], [0.3, 2.9, -2, 0.16], [2.1, -2.8, -1, 0.17], [-4.8, -0.4, -1, 0.19], [5, 0.1, -2, 0.2]];
    positions.forEach(([x, y, z, scale], i) => {
      const mesh = new THREE.Mesh(crystalGeometry, crystalMaterial);
      mesh.scale.set(scale * 0.7, scale * 1.7, scale);
      mesh.position.set(x, y, z); mesh.rotation.set(i * 0.4, i, 0.5);
      mesh.add(new THREE.LineSegments(crystalEdges, edgeMaterial)); scene.add(mesh);
      crystals.push({ mesh, position: mesh.position.clone(), phase: i * 1.7 });
    });

    const particleCount = mobile ? 65 : 150;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = Math.sin(i * 127.1) * 7;
      particlePositions[i * 3 + 1] = Math.cos(i * 311.7) * 4;
      particlePositions[i * 3 + 2] = Math.sin(i * 74.7) * 4 - 3;
    }
    const particleGeometry = new THREE.BufferGeometry(); particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: 0xdce9c7, size: 0.017, transparent: true, opacity: 0.5, depthWrite: false });
    const particles = new THREE.Points(particleGeometry, particleMaterial); scene.add(particles);

    const pointer = new THREE.Vector2();
    let inView = true; let frame = 0; let elapsed = 0; let previous = 0; let progress = 0;
    const hero = host.closest(".loop-hero") as HTMLElement;
    const resize = () => {
      mobile = host.clientWidth < 768;
      renderer.setSize(host.clientWidth, host.clientHeight);
      camera.aspect = host.clientWidth / host.clientHeight; camera.updateProjectionMatrix();
      logo.scale.setScalar(mobile ? 0.71 : 1.03);
      logo.position.set(mobile ? 0.45 : 1.65, mobile ? -0.1 : 0.2, 0);
    };
    const move = (event: PointerEvent) => { pointer.set(event.clientX / window.innerWidth - 0.5, event.clientY / window.innerHeight - 0.5); };
    const draw = (now: number) => {
      const delta = Math.min((now - previous) / 1000 || 0, 0.05); previous = now;
      if (!pausedRef.current && !reduced) elapsed += delta;
      const target = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / (host.clientHeight * 0.35)));
      if (reduced || pausedRef.current) progress = 0;
      else progress += (target - progress) * Math.min(1, delta * 8);
      const explosion = progress * progress * (3 - 2 * progress);
      fragments.forEach(({ mesh, center, direction, spin }) => {
        mesh.position.copy(center).addScaledVector(direction, explosion * 1.7);
        mesh.rotation.set(spin.x * explosion * 3, spin.y * explosion * 3, spin.z * explosion * 3);
      });
      logo.rotation.set(reduced || pausedRef.current ? 0.05 : 0.08 + pointer.y * 0.1, reduced || pausedRef.current ? -0.2 : -0.2 + pointer.x * 0.18 + Math.sin(elapsed * 0.2) * 0.08, -0.24 + explosion * 0.24);
      crystals.forEach(({ mesh, position, phase }) => {
        mesh.position.y = position.y + Math.sin(elapsed * 0.42 + phase) * 0.16;
        mesh.rotation.y = phase + elapsed * 0.09;
        mesh.rotation.z = 0.4 + Math.sin(elapsed * 0.3 + phase) * 0.2;
      });
      particles.rotation.z = elapsed * 0.009;
      renderer.render(scene, camera);
      host.dataset.ready = "true";
      host.dataset.phase = progress > 0.65 ? "fragmented" : progress > 0.08 ? "separating" : "assembled";
      if (inView && !document.hidden && !reduced && !pausedRef.current) frame = requestAnimationFrame(draw);
      else frame = 0;
    };
    const wake = () => { if (!frame && inView && !document.hidden) { previous = performance.now(); frame = requestAnimationFrame(draw); } };
    const reducedChange = () => { reduced = motionQuery.matches; wake(); };
    const observer = new ResizeObserver(() => { resize(); wake(); }); observer.observe(host);
    const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; if (inView) wake(); else { cancelAnimationFrame(frame); frame = 0; } }); intersection.observe(host);
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else wake(); };
    const contextLost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(frame); frame = 0; host.dataset.ready = "false"; };
    const contextRestored = () => wake();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    motionQuery.addEventListener("change", reducedChange);
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    renderer.domElement.addEventListener("webglcontextrestored", contextRestored);
    // Prop changes also wake a paused scene without allocating a second renderer.
    const pauseObserver = new MutationObserver(wake); pauseObserver.observe(host, { attributes: true, attributeFilter: ["data-paused"] });
    resize(); wake();

    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); pauseObserver.disconnect();
      window.removeEventListener("pointermove", move); window.removeEventListener("scroll", wake);
      document.removeEventListener("visibilitychange", visibility); motionQuery.removeEventListener("change", reducedChange);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost); renderer.domElement.removeEventListener("webglcontextrestored", contextRestored);
      fragments.forEach(({ mesh }) => mesh.geometry.dispose());
      crystalGeometry.dispose(); crystalEdges.dispose(); particleGeometry.dispose();
      glass.dispose(); crystalMaterial.dispose(); edgeMaterial.dispose(); particleMaterial.dispose(); environmentMap.dispose();
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div className="loop-scene" ref={mount} data-paused={paused} aria-hidden="true" />;
}
