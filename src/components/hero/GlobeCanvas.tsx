"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { GlobeScene } from "./GlobeScene";

/**
 * Client-only WebGL canvas for the hero globe. Imported by Hero via
 * `dynamic(..., { ssr: false })`, so none of this runs on the server or ships in
 * the initial bundle. `frameloop` flips to "demand" when the hero scrolls out of
 * view, so the GPU goes idle instead of rendering an off-screen globe.
 */
export default function GlobeCanvas({ onSettled }: { onSettled?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.04 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "demand"}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 3.2], fov: 36 }}
      >
        <Suspense fallback={null}>
          <GlobeScene onSettled={onSettled} />
        </Suspense>
      </Canvas>
    </div>
  );
}
