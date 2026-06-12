"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { GlobeScene } from "./GlobeScene";
import { HeroPoster } from "./HeroPoster";

/**
 * Client-only WebGL canvas for the hero globe. Imported by Hero via
 * `dynamic(..., { ssr: false })`, so none of this runs on the server or ships
 * in the initial bundle.
 *
 * Render-loop budget:
 * - `frameloop` drops to "demand" when the hero scrolls out of view
 *   (IntersectionObserver) or the tab is hidden (`visibilitychange`), so the
 *   GPU idles instead of drawing an invisible globe.
 * - Pixel ratio is capped at 1.5 on small screens and 2 on desktop, and
 *   `PerformanceMonitor` steps it down further if the frame rate sags.
 *
 * Fallbacks: the static `HeroPoster` renders under the canvas and crossfades
 * out once WebGL has produced a context. It stays permanently when WebGL is
 * unavailable or the visitor prefers reduced motion (spec: reduced motion
 * gets a still poster, not a paused 3D scene) — in both cases `onSettled`
 * fires immediately so the copy cascade and navbar never wait on a globe
 * that isn't coming.
 */

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

export default function GlobeCanvas({ onSettled }: { onSettled?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [tabHidden, setTabHidden] = useState(false);
  const [ready, setReady] = useState(false);

  // This component is client-only (`ssr: false`), so `window` is safe in lazy
  // initializers — decide once at first render: real scene, or poster forever.
  const [mode] = useState<"webgl" | "poster">(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return !reduce && supportsWebGL() ? "webgl" : "poster";
  });
  const [maxDpr, setMaxDpr] = useState(() =>
    window.innerWidth < 768 ? 1.5 : 2,
  );

  // Keep the latest callback without retriggering the mount-only effects
  // (Hero passes an inline arrow, so its identity changes every render).
  const settledRef = useRef(onSettled);
  useEffect(() => {
    settledRef.current = onSettled;
  }, [onSettled]);

  // Poster mode is instantly "settled" — the copy cascade and navbar must
  // never wait on a globe that isn't coming.
  useEffect(() => {
    if (mode === "poster") settledRef.current?.();
  }, [mode]);

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

  return (
    <div ref={wrap} className="absolute inset-0">
      <HeroPoster
        className={`transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {/*
        Dev console shows "THREE.Clock: deprecated, use THREE.Timer" on mount.
        It's upstream: R3F constructs one internal THREE.Clock per <Canvas> for
        its render loop, and three r183 deprecated Clock. Our code never builds a
        Clock (we only read state.clock in useFrame). Benign, no runtime impact;
        resolves when R3F migrates to Timer. Nothing to fix here — don't suppress
        or downgrade three over it.
      */}
      {mode === "webgl" && (
        <Canvas
          frameloop={inView && !tabHidden ? "always" : "demand"}
          dpr={[1, maxDpr]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 3.2], fov: 36 }}
          onCreated={() => setReady(true)}
        >
          <PerformanceMonitor
            onDecline={() => setMaxDpr((d) => Math.max(1, d - 0.5))}
          />
          <Suspense fallback={null}>
            <GlobeScene onSettled={onSettled} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
