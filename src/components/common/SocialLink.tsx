"use client";

import { m, useReducedMotion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A tactile, 3D social icon used in both the Hero (dark island) and the Contact
 * section (theme surface). The chip is a beveled disc that lifts on hover with a
 * brand-accent glow and presses in on tap. Monochrome at rest so a row reads
 * clean; the accent only appears on interaction.
 *
 * `tone="dark"` forces the dark treatment regardless of theme — the Hero is a
 * dark island inside a light-themed document, so `dark:` variants can't reach
 * it. `tone="surface"` follows the theme (light now, dark: ready).
 */

export interface SocialLinkItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Vivid brand hex revealed on hover (dark tone only). */
  accent: string;
  /** Opens in a new tab; internal anchors (e.g. "#contact") set this false. */
  external?: boolean;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
const rgba = (hex: string, a: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const SPRING = { stiffness: 280, damping: 18, mass: 0.6 };

export function SocialLink({
  item,
  tone = "dark",
  size = 44,
}: {
  item: SocialLinkItem;
  tone?: "dark" | "surface";
  size?: number;
}) {
  const { label, href, icon: Icon, external = true } = item;
  const reduce = useReducedMotion();

  // On the light surface, the pale brand cyan has too little contrast, so the
  // accent that touches text/ring is the deeper brand teal; the vivid hex still
  // drives the dark-tone hover.
  const accent = tone === "dark" ? item.accent : "#2b7a78";
  const isDark = tone === "dark";

  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={
        {
          width: size,
          height: size,
          // CSS var so the icon/ring can pick up the accent on hover.
          "--acc": accent,
        } as React.CSSProperties
      }
      className={cn(
        "group relative inline-grid cursor-pointer place-items-center rounded-full",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:[--tw-ring-color:var(--acc)]",
        isDark
          ? "focus-visible:ring-offset-[#080711]"
          : "focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b14]",
      )}
    >
      {/* Accent glow, revealed on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-1.5 rounded-full opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${rgba(accent, 0.55)}, transparent 70%)` }}
      />

      {/* The beveled chip. */}
      <m.div
        whileHover={reduce ? undefined : { y: -3, scale: 1.07 }}
        whileTap={reduce ? undefined : { y: 0, scale: 0.94 }}
        transition={SPRING}
        className={cn(
          "relative grid h-full w-full place-items-center rounded-full",
          "transition-[border-color,box-shadow] duration-300",
          isDark
            ? "border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.11),rgba(255,255,255,0.03)_52%,rgba(0,0,0,0.22))] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.22),inset_0_-1.5px_2px_rgba(0,0,0,0.5),0_6px_16px_-6px_rgba(0,0,0,0.85)] group-hover:border-[color:var(--acc)]/45"
            : "border border-slate-900/10 bg-[linear-gradient(160deg,#ffffff,#eef1f5_58%,#e1e6ee)] shadow-[inset_0_1px_0_#ffffff,inset_0_-2px_3px_rgba(15,23,42,0.06),0_6px_14px_-6px_rgba(15,23,42,0.2)] group-hover:border-[color:var(--acc)]/50 dark:border-white/10 dark:bg-[linear-gradient(160deg,rgba(255,255,255,0.11),rgba(255,255,255,0.03)_52%,rgba(0,0,0,0.22))] dark:shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.22),0_6px_16px_-6px_rgba(0,0,0,0.8)]",
        )}
      >
        <span
          className={cn(
            "transition-colors duration-300 group-hover:[color:var(--acc)]",
            isDark ? "text-[#C4C4D0]" : "text-slate-500 dark:text-[#C4C4D0]",
          )}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} aria-hidden />
        </span>
      </m.div>
    </a>
  );
}
