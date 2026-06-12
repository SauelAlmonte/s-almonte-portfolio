"use client";

import { useState } from "react";
import Image from "next/image";
import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { Languages, MapPin } from "lucide-react";

/** Cinematic ease shared with the rest of the About reveals. */
const EASE = [0.16, 1, 0.3, 1] as const;

type PortraitCardProps = {
  reduceMotion: boolean;
};

/**
 * Pointer-reactive 3D portrait. Motion owns everything here (entrance +
 * tilt are component-state, not scroll-driven); the GSAP scroll parallax
 * lives on a wrapper div in About so the two libraries never share an
 * element. Depth comes from a real CSS perspective: the card rotates in
 * 3D and the badges sit at +z, so they parallax against the photo as it
 * tilts.
 */
export function PortraitCard({ reduceMotion }: PortraitCardProps) {
  /* (pointer: fine) never changes mid-session; lazy init avoids a
     set-state-in-effect. Server renders `false`, but the markup is
     identical either way — only the no-op handlers differ. */
  const [finePointer] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches,
  );
  const tiltEnabled = finePointer && !reduceMotion;

  /* Normalized cursor position (-0.5..0.5) → sprung 3D rotation. */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 160, damping: 20 });
  const sy = useSpring(my, { stiffness: 160, damping: 20 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-11, 11]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    mx.set(0);
    my.set(0);
  };

  const entrance: Variants = {
    hidden: { opacity: 0, y: 64, scale: 0.82, rotateX: 28 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { duration: reduceMotion ? 0 : 1.15, ease: EASE },
    },
  };

  const badge = (delay: number): Variants => ({
    hidden: { opacity: 0, scale: 0.4, y: 12 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: reduceMotion
        ? { duration: 0 }
        : { delay, type: "spring", stiffness: 320, damping: 18 },
    },
  });

  return (
    <div className="perspective-distant">
      {/* Entrance layer — rises out of the page in 3D, fires once. */}
      <m.div
        variants={entrance}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="transform-3d"
      >
        {/* Tilt layer — follows the cursor on fine pointers only. */}
        <m.div
          style={{ rotateX, rotateY }}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
          className="relative transform-3d"
        >
          {/* Accent halo + orbital rings */}
          <div
            aria-hidden
            className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_70%)]"
          />
          <div className="absolute -inset-4 rounded-full border border-primary/25 motion-safe:animate-pulse" />
          <div className="absolute -inset-8 rounded-full border border-cat-backend/15" />

          {/* Headshot */}
          <div className="relative h-64 w-64 overflow-hidden rounded-full bg-linear-to-br from-cat-fullstack/30 via-cat-backend/20 to-cat-cloud/30 shadow-2xl ring-4 ring-primary/25 sm:h-72 sm:w-72">
            <Image
              src="/images/sauel-headshot.jpg"
              alt="Sauel Almonte"
              fill
              sizes="(min-width: 640px) 18rem, 16rem"
              className="object-cover"
            />
            {/* Inner rim light so the photo sits in the dark stage */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/15"
            />
          </div>

          {/* Floating badges — static +z offset lives on the wrapper;
              Motion animates the inner element, so the two transforms
              never fight over one node. */}
          <div className="absolute -right-4 -bottom-4 transform-3d translate-z-12">
            <m.div
              variants={badge(0.85)}
              className="flex items-center gap-2 rounded-full border border-primary/25 bg-stage/70 px-4 py-2 shadow-lg backdrop-blur-md"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink">
                Boston, MA
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
            </m.div>
          </div>

          <div className="absolute -top-4 -left-4 transform-3d translate-z-12">
            <m.div
              variants={badge(1)}
              className="flex items-center gap-2 rounded-full border border-primary/25 bg-stage/70 px-4 py-2 shadow-lg backdrop-blur-md"
            >
              <Languages className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink">
                EN / ES
              </span>
            </m.div>
          </div>
        </m.div>
      </m.div>
    </div>
  );
}
