"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BRAND } from "@/config/tokens";
import { sampleLandPoints, buildArcs, buildGraticule } from "./globe-geometry";
import {
  POINT_VERT,
  POINT_FRAG,
  ATMO_VERT,
  ATMO_FRAG,
  ARC_VERT,
  ARC_FRAG,
} from "./shaders";

const RADIUS = 1;
const CANDIDATES = 30000; // ~8k survive the land mask
const ARC_COUNT = 14;
const PARTICLE_COUNT = 480;

// Brand palette (sRGB) from the token mirror — shaders can't read CSS vars.
const CYAN = new THREE.Color(BRAND.fullstack);
const LAVENDER = new THREE.Color(BRAND.backend);
const PINK = new THREE.Color(BRAND.cloud);

export function GlobeScene({ onSettled }: { onSettled?: () => void }) {
  const group = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const settled = useRef(false);
  const { gl, size } = useThree();
  const dpr = Math.min(gl.getPixelRatio(), 2);

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  /* Cursor-reactive parallax: normalized pointer position, consumed by a
     damped tilt in useFrame. Listening on `window` (not the canvas) because
     the hero copy sits above the canvas and would swallow pointer events.
     Mouse-only — touch dragging a tilt feels broken — and off under reduced
     motion. */
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  // Load the land mask and sample the dots + arcs once.
  const mask = useLoader(THREE.TextureLoader, "/textures/earth-mask.png");
  const { earthGeom, arcGeom, particleGeom, graticuleGeom } = useMemo(() => {
    const pts = sampleLandPoints(mask.image as HTMLImageElement, CANDIDATES, RADIUS);

    const earth = new THREE.BufferGeometry();
    earth.setAttribute("position", new THREE.BufferAttribute(pts.positions, 3));
    earth.setAttribute("aRandom", new THREE.BufferAttribute(pts.randoms, 1));
    earth.setAttribute("aWarm", new THREE.BufferAttribute(pts.warms, 1));

    const arcs = buildArcs(pts.land, ARC_COUNT, RADIUS);
    const arc = new THREE.BufferGeometry();
    arc.setAttribute("position", new THREE.BufferAttribute(arcs.positions, 3));
    arc.setAttribute("aProgress", new THREE.BufferAttribute(arcs.progress, 1));
    arc.setAttribute("aPhase", new THREE.BufferAttribute(arcs.phase, 1));

    // Bokeh shell around the globe.
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    const pRnd = new Float32Array(PARTICLE_COUNT);
    const pWarm = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = RADIUS * (1.5 + Math.random() * 1.6);
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pPos[i * 3 + 1] = r * Math.cos(p) * 0.6;
      pPos[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
      pRnd[i] = Math.random();
      pWarm[i] = Math.random() < 0.2 ? 1 : 0;
    }
    const particles = new THREE.BufferGeometry();
    particles.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    particles.setAttribute("aRandom", new THREE.BufferAttribute(pRnd, 1));
    particles.setAttribute("aWarm", new THREE.BufferAttribute(pWarm, 1));

    const grat = new THREE.BufferGeometry();
    grat.setAttribute("position", new THREE.BufferAttribute(buildGraticule(RADIUS), 3));

    return { earthGeom: earth, arcGeom: arc, particleGeom: particles, graticuleGeom: grat };
  }, [mask]);

  // Materials (memoized; uTime driven per-frame).
  const pointMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: POINT_VERT,
        fragmentShader: POINT_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 16 },
          uPixelRatio: { value: dpr },
          uOpacity: { value: 1 },
          uColorA: { value: CYAN },
          uColorB: { value: LAVENDER },
          uColorWarm: { value: PINK },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [dpr],
  );

  const particleMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: POINT_VERT,
        fragmentShader: POINT_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 13 },
          uPixelRatio: { value: dpr },
          uOpacity: { value: 0.5 },
          uColorA: { value: CYAN },
          uColorB: { value: LAVENDER },
          uColorWarm: { value: PINK },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [dpr],
  );

  const arcMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ARC_VERT,
        fragmentShader: ARC_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uSpeed: { value: 0.12 },
          uColor: { value: CYAN.clone().multiplyScalar(0.5) },
          uPulseColor: { value: PINK },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  const atmoMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        uniforms: {
          uColor: { value: LAVENDER },
          uPower: { value: 2.6 },
          uIntensity: { value: 1.4 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    [],
  );

  const graticuleMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: LAVENDER,
        transparent: true,
        opacity: 0.07,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  // Dispose GPU resources on unmount.
  useEffect(() => {
    return () => {
      [earthGeom, arcGeom, particleGeom, graticuleGeom].forEach((g) => g.dispose());
      [pointMat, particleMat, arcMat, atmoMat, graticuleMat].forEach((m) => m.dispose());
    };
  }, [earthGeom, arcGeom, particleGeom, graticuleGeom, pointMat, particleMat, arcMat, atmoMat, graticuleMat]);

  // Responsive scale + offset. Desktop: globe sits right-of-centre so the copy
  // column gets the left. Tablet AND mobile share the same centred placement so
  // the composition is consistent down to phones.
  const target = useMemo(() => {
    const w = size.width;
    if (w >= 1024) return { scale: 1.05, x: 0.95, y: 0 };
    if (w >= 768) return { scale: 0.92, x: 0, y: 0 };
    return { scale: 0.82, x: 0, y: 0 };
  }, [size.width]);

  // Entrance: start off-screen right (or snapped to target for reduced motion),
  // then the per-frame lerp eases it in from the right.
  useLayoutEffect(() => {
    const g = group.current;
    if (!g) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    g.scale.setScalar(target.scale);
    g.position.set(reduce ? target.x : target.x + 2.6, target.y, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    // Clamp the frame delta: when the hero scrolls back into view after a
    // frameloop="demand" pause, the first frames carry spiked/garbage deltas
    // that make the damp() easing below diverge — the globe visibly inflates
    // and re-enters from the right. 100ms cap = anything slower than 10fps
    // is treated as one 100ms step.
    const dt = Math.min(Math.max(delta, 0), 0.1);
    const t = state.clock.elapsedTime;
    pointMat.uniforms.uTime.value = t;
    particleMat.uniforms.uTime.value = t;
    if (!reduced) arcMat.uniforms.uTime.value = t;
    // PerformanceMonitor may step the canvas DPR down under load; keep the
    // point-size math in the shader in sync so dots don't change size.
    const liveDpr = Math.min(gl.getPixelRatio(), 2);
    pointMat.uniforms.uPixelRatio.value = liveDpr;
    particleMat.uniforms.uPixelRatio.value = liveDpr;

    const g = group.current;
    if (!g) return;
    if (!reduced) g.rotation.y += dt * 0.045;
    // frame-rate-independent exponential ease-out (smooth slide-in + resize follow)
    const dampF = THREE.MathUtils.damp;

    // Damped pointer parallax on the wrapper group, so it composes with (and
    // never fights) the globe's own rotation/position easing below.
    const tl = tilt.current;
    if (tl && !reduced) {
      tl.rotation.x = dampF(tl.rotation.x, pointer.current.y * 0.045, 2.5, dt);
      tl.rotation.y = dampF(tl.rotation.y, pointer.current.x * 0.08, 2.5, dt);
    }
    g.scale.setScalar(dampF(g.scale.x, target.scale, 3, dt));
    g.position.x = dampF(g.position.x, target.x, 2.4, dt);
    g.position.y = dampF(g.position.y, target.y, 3, dt);

    // Once the globe has converged on its resting spot, tell Hero so the brand
    // glow can fade in behind it. Gating on "settled" (not "started") keeps the
    // glow from ever appearing at the landing zone ahead of the travelling dots.
    if (!settled.current && Math.abs(g.position.x - target.x) < 0.03) {
      settled.current = true;
      onSettled?.();
    }
  });

  return (
    <group ref={tilt}>
      <group ref={group} position={[3.6, 0, 0]} rotation={[0.35, 0, 0.12]}>
        <points geometry={earthGeom} material={pointMat} />
        <lineSegments geometry={arcGeom} material={arcMat} />
        <points geometry={particleGeom} material={particleMat} />
        <lineSegments geometry={graticuleGeom} material={graticuleMat} />
        <mesh material={atmoMat}>
          <sphereGeometry args={[RADIUS * 1.16, 48, 48]} />
        </mesh>
      </group>
    </group>
  );
}
