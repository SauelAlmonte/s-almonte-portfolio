"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import { Github, Linkedin, Mail, Youtube, ArrowDown } from "lucide-react";
import { SocialLink, type SocialLinkItem } from "@/components/common/SocialLink";

// 3D globe is heavy + browser-only: lazy, client-only, out of the initial bundle.
const GlobeCanvas = dynamic(() => import("@/components/hero/GlobeCanvas"), {
  ssr: false,
});

const ROLES = [
  "Full-Stack Engineer",
  "AI Engineer",
  "Cloud Developer",
  "Mentor & Advocate",
];

const SOCIAL_LINKS: SocialLinkItem[] = [
  { label: "GitHub", href: "https://github.com/SauelAlmonte", icon: Github, accent: "#A8DADC", external: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/sauel-almonte", icon: Linkedin, accent: "#B39CD0", external: true },
  { label: "YouTube", href: "https://youtube.com/@yourchannel", icon: Youtube, accent: "#FFC1CC", external: true },
  { label: "Contact", href: "#contact", icon: Mail, accent: "#A8DADC", external: false },
];

/* Entrance choreography. The copy column is one variant parent; each line is a
   child carrying its index as `custom`. When the parent flips to "show" (once
   the globe settles), each line computes its own delay — front-loaded so the
   greeting lands first, then a beat, then the name and the rest cascade. */
const LEAD = 0.4; // beat after the first line draws the eye before the cascade
const STAGGER = 0.22; // gap between the remaining lines — spaced out, deliberate
// Soft spring: lower stiffness = each line takes longer to settle, so the
// cascade reads as graceful rather than snapping into place.
const SPRING = { type: "spring", stiffness: 150, damping: 22, mass: 0.9 } as const;

// Parent only conducts: it flips the label; children own their timing.
const copyVariants = { hidden: {}, show: {} };

/* Transform + opacity only — compositor-cheap, no layout or paint thrash.
   Spring easing so each line settles naturally instead of on a fixed clock. */
const lineVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...SPRING, delay: i === 0 ? 0 : LEAD + (i - 1) * STAGGER },
  }),
};

/* Reduced-motion alternative: a gentle crossfade, no transform. */
const reducedLineVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [globeSettled, setGlobeSettled] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = useReducedMotion();

  /* Reveal the copy once the globe has settled into place, so the lines
     cascade in after the dots land — not while they're still travelling.
     The fallback timeout guarantees the hero never ships blank if WebGL is
     unavailable and `onSettled` never fires; reduced motion shows it at once. */
  useEffect(() => {
    if (reduceMotion || globeSettled) {
      setRevealed(true);
      return;
    }
    const fallback = setTimeout(() => setRevealed(true), 2800);
    return () => clearTimeout(fallback);
  }, [globeSettled, reduceMotion]);

  /* Cycle the role label. Motion handles the crossfade (respects reduced motion). */
  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2600);
    return () => clearInterval(id);
  }, []);

  const lines = reduceMotion ? reducedLineVariants : lineVariants;

  return (
    <section
      id="home"
      aria-label="Hero"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#080711] text-[#ECECF2]"
    >
      {/* Brand glow behind the globe. It fades in only once the globe has
          settled into place, so it never lights the landing zone ahead of the
          travelling dots. Reduced motion shows it instantly. */}
      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(69% 63% at 72% 42%, rgba(179,156,208,0.12), transparent 70%)," +
            "radial-gradient(52% 52% at 78% 60%, rgba(168,218,220,0.08), transparent 72%)," +
            "radial-gradient(46% 46% at 60% 30%, rgba(255,193,204,0.05), transparent 70%)",
        }}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: reduceMotion || globeSettled ? 1 : 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* The dotted earth. */}
      <GlobeCanvas onSettled={() => setGlobeSettled(true)} />

      {/* Legibility scrim: darken the left/bottom where the copy sits. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080711] via-[#080711]/82 to-transparent lg:via-[#080711]/55"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080711] to-transparent"
      />

      {/* Content. */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 py-24 sm:px-8">
        <m.div
          className="max-w-2xl"
          variants={copyVariants}
          initial="hidden"
          animate={revealed ? "show" : "hidden"}
        >
          <m.p
            custom={0}
            variants={lines}
            className="mb-3 text-[clamp(0.95rem,1.2vw,1.125rem)] font-medium tracking-tight text-[#A8DADC]"
          >
            Hi, I&apos;m Sauel <span className="text-[#8A8A98]">(Sol)</span>
          </m.p>

          <m.h1
            custom={1}
            variants={lines}
            className="text-[clamp(2.6rem,7vw,5.75rem)] font-bold leading-[1.0] tracking-[-0.035em] text-balance text-[#F4F4F8] [text-shadow:0_2px_40px_rgba(0,0,0,0.5)]"
          >
            Sauel Almonte
          </m.h1>

          {/* Cycling role */}
          <m.div
            custom={2}
            variants={lines}
            className="mt-2 flex min-h-[2.75rem] items-center text-[clamp(1.5rem,2.8vw,2.2rem)] font-semibold tracking-tight"
            aria-live="polite"
          >
            <AnimatePresence mode="wait">
              <m.span
                key={roleIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-[#A8DADC] [text-shadow:0_0_28px_rgba(168,218,220,0.35)]"
              >
                {ROLES[roleIndex]}
              </m.span>
            </AnimatePresence>
          </m.div>

          <m.p
            custom={3}
            variants={lines}
            className="mt-4 max-w-[34rem] text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.5] text-[#C8C8D4] text-pretty"
          >
            I build full-stack web applications and AI-powered tools. AWS
            certified, bilingual (EN/ES), based in Boston, and mentoring the next
            wave of engineers.
          </m.p>

          {/* CTAs — 3D pills matching the social chips: domed surface, bevel,
              spring lift on hover, press-in on tap. */}
          <m.div
            custom={4}
            variants={lines}
            className="mt-6 flex max-w-md items-center gap-2.5 sm:gap-3"
          >
            {/* Primary: domed cyan. */}
            <m.a
              href="#experience"
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { y: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 280, damping: 18, mass: 0.6 }}
              className="group flex h-[clamp(2.5rem,8.5vw,3rem)] flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#8fcfd1]/60 bg-[linear-gradient(180deg,#c7ecee,#A8DADC_46%,#8ccfd1)] px-[clamp(0.875rem,3vw,1.5rem)] text-[clamp(0.8125rem,2.3vw,1rem)] font-semibold text-[#06232b] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-2px_3px_rgba(0,40,45,0.18),0_6px_16px_-8px_rgba(168,218,220,0.22)] transition-shadow duration-300 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.78),inset_0_-2px_3px_rgba(0,40,45,0.2),0_12px_26px_-10px_rgba(168,218,220,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8DADC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080711]"
            >
              View my work
              <ArrowDown
                className="hidden h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5 min-[360px]:block"
                aria-hidden
              />
            </m.a>

            {/* Secondary: dark glass, lights cyan on hover. */}
            <m.a
              href="#contact"
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { y: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 280, damping: 18, mass: 0.6 }}
              className="group flex h-[clamp(2.5rem,8.5vw,3rem)] flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-white/12 bg-[linear-gradient(160deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03)_52%,rgba(0,0,0,0.22))] px-[clamp(0.875rem,3vw,1.5rem)] text-[clamp(0.8125rem,2.3vw,1rem)] font-medium text-[#ECECF2] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.22),inset_0_-1.5px_2px_rgba(0,0,0,0.5),0_6px_16px_-6px_rgba(0,0,0,0.85)] transition-[box-shadow,border-color,color] duration-300 hover:border-[#A8DADC]/45 hover:text-white hover:shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.26),0_8px_20px_-10px_rgba(168,218,220,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8DADC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080711]"
            >
              Get in touch
            </m.a>
          </m.div>

          {/* Socials */}
          <m.div custom={5} variants={lines} className="mt-8 flex items-center gap-3">
            {SOCIAL_LINKS.map((item) => (
              <SocialLink key={item.label} item={item} tone="dark" />
            ))}
          </m.div>
        </m.div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute inset-x-0 bottom-6 z-10 mx-auto flex w-fit flex-col items-center gap-1 text-[#8A8A98] transition-colors hover:text-[#A8DADC]"
      >
        <span className="text-xs tracking-wide">Scroll</span>
        <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
