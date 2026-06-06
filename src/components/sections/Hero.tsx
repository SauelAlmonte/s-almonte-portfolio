"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import { Github, Linkedin, Mail, Youtube, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/SauelAlmonte", icon: Github, external: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/sauel-almonte", icon: Linkedin, external: true },
  { label: "YouTube", href: "https://youtube.com/@yourchannel", icon: Youtube, external: true },
  { label: "Contact", href: "#contact", icon: Mail, external: false },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [globeSettled, setGlobeSettled] = useState(false);
  const reduceMotion = useReducedMotion();

  /* Entrance — enhances already-visible content; reduced motion shows it instantly. */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const items = gsap.utils.toArray<HTMLElement>("[data-hero-stagger]");
      if (reduce) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }
      gsap.from(items, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.15,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Cycle the role label. Motion handles the crossfade (respects reduced motion). */
  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
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
        <div className="max-w-xl">
          <p data-hero-stagger className="mb-4 text-sm font-medium text-[#A8DADC]">
            Hi, I&apos;m Sauel <span className="text-[#8A8A98]">(Sol)</span>
          </p>

          <h1
            data-hero-stagger
            className="text-5xl font-semibold leading-[1.04] tracking-tight text-balance sm:text-6xl"
          >
            Sauel Almonte
          </h1>

          {/* Cycling role */}
          <div
            data-hero-stagger
            className="mt-4 flex h-9 items-center text-xl font-medium sm:text-2xl"
            aria-live="polite"
          >
            <AnimatePresence mode="wait">
              <m.span
                key={roleIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-[#A8DADC]"
              >
                {ROLES[roleIndex]}
              </m.span>
            </AnimatePresence>
          </div>

          <p
            data-hero-stagger
            className="mt-6 max-w-md text-base leading-relaxed text-[#C4C4D0] text-pretty"
          >
            I build full-stack web applications and AI-powered tools. AWS
            certified, bilingual (EN/ES), based in Boston, and mentoring the next
            wave of engineers.
          </p>

          {/* CTAs */}
          <div data-hero-stagger className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#A8DADC] px-7 text-[#0b0b14] shadow-lg shadow-[#A8DADC]/20 transition-transform hover:bg-[#bce6e8] hover:scale-[1.03]"
            >
              <a href="#experience">
                View my work
                <ArrowDown className="ml-1 h-4 w-4" aria-hidden />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-white/5 px-7 text-[#ECECF2] transition-colors hover:bg-white/10 hover:text-white"
            >
              <a href="#contact">Get in touch</a>
            </Button>
          </div>

          {/* Socials */}
          <div data-hero-stagger className="mt-8 flex items-center gap-2">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon, external }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#C4C4D0] transition-colors hover:border-[#A8DADC]/50 hover:text-[#A8DADC]"
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden />
              </a>
            ))}
          </div>
        </div>
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
