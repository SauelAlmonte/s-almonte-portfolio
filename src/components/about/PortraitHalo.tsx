"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "@/lib/three/suppress-clock-deprecation";
import { BRAND } from "@/config/tokens";

/*
 * Dotted WebGL halo behind the About portrait — same particle language as
 * the hero globe, scaled down to a flourish. Loaded with `ssr: false` and
 * mounted only on desktop + no-reduced-motion (gated in About), so it
 * costs nothing on phones. Renders null when WebGL is unavailable; the
 * CSS rings in PortraitCard remain as the fallback decoration.
 */

/* Mirror of GlobeCanvas's private check — kept local so the hero stays
   untouched by this section's work. */
function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

type RingProps = {
  radius: number;
  count: number;
  jitter: number;
  spread: number;
  palette: readonly string[];
  size: number;
  opacity: number;
  /** Radians/second around z; sign sets direction. */
  spin: number;
  tiltAmp: number;
  tiltSpeed: number;
};

function buildRing(
  count: number,
  radius: number,
  jitter: number,
  spread: number,
  palette: readonly string[],
) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.06;
    const r = radius + (Math.random() - 0.5) * jitter;
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = Math.sin(angle) * r;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
    color.set(palette[Math.floor(Math.random() * palette.length)]);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  return { positions, colors };
}

function DotRing({
  radius,
  count,
  jitter,
  spread,
  palette,
  size,
  opacity,
  spin,
  tiltAmp,
  tiltSpeed,
}: RingProps) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(
    () => buildRing(count, radius, jitter, spread, palette),
    [count, radius, jitter, spread, palette],
  );

  useFrame((state, delta) => {
    const points = ref.current;
    if (!points) return;
    // Clamp delta: resuming from frameloop="demand" spikes it, which would
    // jolt the spin (same gotcha as the hero globe's damp() divergence).
    const dt = Math.min(Math.max(delta, 0), 0.1);
    const t = state.clock.elapsedTime;
    points.rotation.z += dt * spin;
    points.rotation.x = Math.sin(t * tiltSpeed) * tiltAmp;
    points.rotation.y = Math.cos(t * tiltSpeed * 0.8) * tiltAmp * 0.6;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        sizeAttenuation
        vertexColors
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function PortraitHalo() {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  // Client-only component (`ssr: false`) — document/window are safe in lazy
  // initializers. Seeding from document.hidden keeps a background-tab mount
  // on "demand" instead of rendering until the first visibility event.
  const [tabHidden, setTabHidden] = useState(() => document.hidden);
  const [webgl] = useState(() => supportsWebGL());

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.04 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (!webgl) return null;

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop={inView && !tabHidden ? "always" : "demand"}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 4.8], fov: 45 }}
      >
        <DotRing
          radius={1.45}
          count={360}
          jitter={0.1}
          spread={0.26}
          palette={[BRAND.accent, BRAND.accent, BRAND.fullstack, BRAND.backend]}
          size={0.035}
          opacity={0.85}
          spin={0.16}
          tiltAmp={0.32}
          tiltSpeed={0.25}
        />
        <DotRing
          radius={1.82}
          count={220}
          jitter={0.18}
          spread={0.42}
          palette={[BRAND.backend, BRAND.cloud, BRAND.accent]}
          size={0.028}
          opacity={0.55}
          spin={-0.1}
          tiltAmp={0.22}
          tiltSpeed={0.18}
        />
      </Canvas>
    </div>
  );
}
