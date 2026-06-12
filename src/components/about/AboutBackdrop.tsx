import type { CSSProperties, Ref } from "react";

/**
 * HUD instrument backdrop for the About section — slowly counter-rotating
 * tick-ring dials, drifting glyphs, and hairline streaks in the hero
 * palette (cyan / lavender / pink on the dark stage).
 *
 * Pure SVG + CSS animations: no canvas, no JS per frame, every animation
 * is `motion-safe:` gated so reduced-motion users get a static etching.
 * `pathLength` on each circle makes the dash math exact, so tick rings
 * never show a seam where the dash pattern wraps.
 */

type GlyphKind = "diamond" | "diamond-solid" | "plus" | "triangle" | "dot";

type Glyph = {
  kind: GlyphKind;
  className: string; // position + color
  delay: string;
  duration: string;
};

/* Scattered instrument glyphs — positions hand-placed to frame the
   content columns rather than sit under body text. */
const GLYPHS: Glyph[] = [
  { kind: "diamond",       className: "left-[8%] top-[6%] text-cyan",        delay: "0s",    duration: "7s"  },
  { kind: "plus",          className: "left-[30%] top-[3%] text-lavender",   delay: "-2.5s", duration: "9s"  },
  { kind: "triangle",      className: "right-[12%] top-[9%] text-cyan",      delay: "-5s",   duration: "8s"  },
  { kind: "dot",           className: "right-[28%] top-[20%] text-pink",     delay: "-1s",   duration: "6s"  },
  { kind: "diamond-solid", className: "left-[5%] top-[38%] text-lavender",   delay: "-4s",   duration: "10s" },
  { kind: "plus",          className: "right-[6%] top-[44%] text-cyan",      delay: "-7s",   duration: "8s"  },
  { kind: "diamond",       className: "left-[14%] top-[62%] text-pink",      delay: "-3s",   duration: "9s"  },
  { kind: "triangle",      className: "right-[18%] top-[68%] text-lavender", delay: "-6s",   duration: "7s"  },
  { kind: "dot",           className: "left-[40%] top-[80%] text-cyan",      delay: "-2s",   duration: "8s"  },
  { kind: "diamond-solid", className: "right-[9%] top-[88%] text-cyan",      delay: "-8s",   duration: "11s" },
  { kind: "plus",          className: "left-[22%] top-[94%] text-pink",      delay: "-4.5s", duration: "9s"  },
];

function GlyphMark({ kind }: { kind: GlyphKind }) {
  switch (kind) {
    case "diamond":
      return <span className="block size-2 rotate-45 border border-current" />;
    case "diamond-solid":
      return <span className="block size-1.5 rotate-45 bg-current" />;
    case "dot":
      return <span className="block size-1.5 rounded-full bg-current" />;
    case "plus":
      return (
        <svg viewBox="0 0 10 10" className="size-2.5 stroke-current" strokeWidth="1">
          <path d="M5 0v10M0 5h10" />
        </svg>
      );
    case "triangle":
      return (
        <svg viewBox="0 0 10 10" className="size-2 fill-current">
          <path d="M5 0l5 10H0z" />
        </svg>
      );
  }
}

type AboutDialProps = {
  /** GSAP scroll-drift wrapper for the dial (parallax plane). */
  dialRef?: Ref<HTMLDivElement>;
};

/**
 * Primary dial — mounted INSIDE the pinned stage (not the section
 * backdrop) so it rides the pin with the portrait/bio instead of
 * scrolling away while the reader is held in the paragraph sequence.
 */
export function AboutDial({ dialRef }: AboutDialProps) {
  return (
    <div
      aria-hidden
      ref={dialRef}
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-144 -translate-x-1/2 -translate-y-1/2 md:size-208 lg:left-[55%]"
    >
        {/* fine tick ring (160 ticks) */}
        <div className="absolute inset-0 motion-safe:animate-[spin_150s_linear_infinite]">
          <svg viewBox="0 0 600 600" className="size-full">
            <circle
              cx="300" cy="300" r="276" pathLength={640}
              fill="none" strokeDasharray="1 3" strokeWidth="9"
              className="stroke-cyan opacity-[0.14]"
            />
            <circle
              cx="300" cy="300" r="252"
              fill="none" strokeWidth="1"
              className="stroke-cyan opacity-[0.08]"
            />
          </svg>
        </div>
        {/* major ticks + lavender arc, counter-rotating */}
        <div className="absolute inset-0 motion-safe:animate-[spin_100s_linear_infinite_reverse]">
          <svg viewBox="0 0 600 600" className="size-full">
            <circle
              cx="300" cy="300" r="276" pathLength={48}
              fill="none" strokeDasharray="0.18 3.82" strokeWidth="20"
              className="stroke-cyan opacity-[0.16]"
            />
            <circle
              cx="300" cy="300" r="228" pathLength={100}
              fill="none" strokeDasharray="26 24 8 42" strokeWidth="1.5"
              className="stroke-lavender opacity-[0.28]"
            />
            {/* pink waypoint riding the arc radius */}
            <circle
              cx="300" cy="300" r="228" pathLength={100}
              fill="none" strokeDasharray="0.7 99.3" strokeLinecap="round" strokeWidth="5"
              className="stroke-pink opacity-[0.45]"
            />
          </svg>
        </div>
        {/* slow inner arc band */}
        <div className="absolute inset-0 motion-safe:animate-[spin_70s_linear_infinite]">
          <svg viewBox="0 0 600 600" className="size-full">
            <circle
              cx="300" cy="300" r="196" pathLength={100}
              fill="none" strokeDasharray="14 10 30 46" strokeWidth="1"
              className="stroke-cyan opacity-[0.18]"
            />
          </svg>
        </div>
        {/* static reticle center, like the reference's bullseye */}
        <svg viewBox="0 0 600 600" className="absolute inset-0 size-full">
          <circle cx="300" cy="300" r="30" fill="none" strokeWidth="1" className="stroke-cyan opacity-[0.2]" />
          <circle cx="300" cy="300" r="20" fill="none" strokeWidth="1" className="stroke-cyan opacity-[0.12]" />
        </svg>
    </div>
  );
}

/**
 * Section-level backdrop layer: secondary dial, hairline streaks, and
 * twinkling glyphs spread across the full section height.
 */
export function AboutBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* ── Secondary dial — clipped at the lower-left, near credentials ── */}
      <div className="absolute -left-36 bottom-[2%] size-104 md:size-120">
        <div className="absolute inset-0 motion-safe:animate-[spin_120s_linear_infinite_reverse]">
          <svg viewBox="0 0 400 400" className="size-full">
            <circle
              cx="200" cy="200" r="180" pathLength={320}
              fill="none" strokeDasharray="1 3" strokeWidth="7"
              className="stroke-lavender opacity-[0.14]"
            />
            <circle
              cx="200" cy="200" r="156" pathLength={100}
              fill="none" strokeDasharray="22 30 12 36" strokeWidth="1"
              className="stroke-cyan opacity-[0.16]"
            />
          </svg>
        </div>
      </div>

      {/* ── Hairline streaks (static, like the reference's diagonals) ── */}
      <span className="absolute right-[4%] top-[14%] h-px w-44 rotate-45 bg-linear-to-r from-transparent via-cyan/25 to-transparent" />
      <span className="absolute left-[10%] top-[26%] h-px w-32 -rotate-45 bg-linear-to-r from-transparent via-lavender/25 to-transparent" />
      <span className="absolute right-[14%] bottom-[10%] h-px w-40 rotate-45 bg-linear-to-r from-transparent via-cyan/20 to-transparent" />

      {/* ── Twinkling instrument glyphs ── */}
      {GLYPHS.map((glyph, i) => (
        <span
          key={i}
          className={`absolute opacity-25 motion-safe:animate-[hud-twinkle_var(--hud-dur)_ease-in-out_infinite] ${glyph.className}`}
          style={
            {
              "--hud-dur": glyph.duration,
              animationDelay: glyph.delay,
            } as CSSProperties
          }
        >
          <GlyphMark kind={glyph.kind} />
        </span>
      ))}
    </div>
  );
}
