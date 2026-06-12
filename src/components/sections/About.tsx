"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { gsap, ScrollTrigger, SCROLL_MEDIA } from "@/lib/scroll/gsap";
import { useScrollSection } from "@/lib/scroll/useScrollSection";
import { Download, GraduationCap, ExternalLink } from "lucide-react";
import { PortraitCard } from "@/components/about/PortraitCard";
import { formatCredentialPeriod } from "@/lib/resume/format-credential-period";

import { ResumeDownloadChoiceModal } from "@/components/resume/ResumeDownloadChoiceModal";
import type { LandingCredentialCard } from "@/config/resume";
import type { LandingResumePdfChoice } from "@/config/experience";

const PortraitHalo = dynamic(
  () => import("@/components/about/PortraitHalo"),
  { ssr: false },
);

const STATS = [
  { value: 4, suffix: "+", label: "Years Experience" },
  { value: 50, suffix: "+", label: "Engineers Mentored" },
  { value: 3, suffix: "", label: "Companies" },
  { value: 2, suffix: "", label: "Languages" },
];

/** Cinematic ease for every Motion reveal in this section. */
const EASE = [0.16, 1, 0.3, 1] as const;

type AboutProps = {
  professionalSummary: string;
  credentialCards: LandingCredentialCard[];
  pdfChoices: LandingResumePdfChoice[];
};

export function About({ professionalSummary, credentialCards, pdfChoices }: AboutProps) {
  const sectionRef       = useRef<HTMLElement>(null);
  const gridRef          = useRef<HTMLDivElement>(null);
  const blob1Ref         = useRef<HTMLDivElement>(null);
  const blob2Ref         = useRef<HTMLDivElement>(null);
  const headerDriftRef   = useRef<HTMLDivElement>(null);
  const stageRef         = useRef<HTMLDivElement>(null);
  const stackRef         = useRef<HTMLDivElement>(null);
  const portraitDriftRef = useRef<HTMLDivElement>(null);
  const statsDriftRef    = useRef<HTMLDivElement>(null);
  const statsRef         = useRef<HTMLDivElement>(null);
  const eduDriftRef      = useRef<HTMLDivElement>(null);
  const statValueRefs    = useRef<(HTMLSpanElement | null)[]>([]);

  /* `useReducedMotion()` is null until the media query resolves (SSR-safe).
     For animations, treat "unknown" as "animate" so the first paint matches
     the common case; the WebGL halo gates on the resolved tri-state instead,
     so reduced-motion users never even fetch the chunk during the null
     window. */
  const reduceMotionPref = useReducedMotion();
  const reduceMotion = reduceMotionPref ?? false;

  const cmsBioParagraphs = useMemo(() => {
    const t = professionalSummary.trim();
    if (!t) return null;
    const parts = t
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    return parts.length > 0 ? parts : null;
  }, [professionalSummary]);

  /* ─── GSAP: scroll-driven work only (pin sequence, parallax, count-up) ─── */
  useScrollSection(sectionRef, (mm) => {
    const startCounters = () => {
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          STATS.forEach((stat, i) => {
            const el = statValueRefs.current[i];
            if (!el) return;
            // Tween a proxy object and write the rounded value into the
            // DOM — the animated property must live in the to-vars.
            const counter = { val: 0 };
            gsap.to(counter, {
              val: stat.value,
              duration: 1.8,
              ease: "power2.out",
              delay: i * 0.12,
              onUpdate: () => {
                el.textContent = Math.round(counter.val).toString();
              },
            });
          });
        },
      });
    };

    const gridDrift = (travel: number) => {
      gsap.to(gridRef.current, {
        y: travel,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    };

    const headerDrift = (travel: number) => {
      gsap.fromTo(
        headerDriftRef.current,
        { y: -travel },
        {
          y: travel,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    };

    /* All parallax planes, scaled by `k` so smaller screens get the same
       depth at gentler offsets. */
    const buildPlanes = (k: number) => {
      const section = sectionRef.current;

      /* Background plane (slowest): the instrument grid drifts visibly. */
      gridDrift(-120 * k);

      /* Ambient color — not a depth plane, just alive. */
      gsap.to(blob1Ref.current, {
        y: -180 * k,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
      gsap.to(blob2Ref.current, {
        y: 120 * k,
        x: -40 * k,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });

      /* Midground plane: the display header lags the page. */
      headerDrift(16 * k);

      /* Stats band gets extra travel as it passes center (ends near 0 so
         the resting layout keeps its designed spacing). */
      gsap.fromTo(
        statsDriftRef.current,
        { y: 48 * k },
        {
          y: -12 * k,
          ease: "none",
          scrollTrigger: {
            trigger: statsDriftRef.current,
            start: "top bottom",
            end: "top 30%",
            scrub: 1,
          },
        },
      );

      /* Credentials ride a slightly faster plane than the stats above
         them, so the two blocks visibly converge as they enter. */
      gsap.fromTo(
        eduDriftRef.current,
        { y: 72 * k },
        {
          y: -16 * k,
          ease: "none",
          scrollTrigger: {
            trigger: eduDriftRef.current,
            start: "top bottom",
            end: "top 25%",
            scrub: 1,
          },
        },
      );
    };

    /* Pinned stage: the bio paragraphs play as a scrubbed sequence while
       the portrait drifts against them — GSAP owns the [data-bio-stage]/
       [data-cta-stage] WRAPPERS; Motion only ever touches the inner
       elements, so no node is shared. The overlap stacking (display:grid +
       grid-area 1/1) is applied HERE rather than via classes, so
       reduced-motion and no-pin states keep the natural stacked flow. */
    const buildStage = (portraitTravel: number) => {
      const section = sectionRef.current;
      if (!section) return;
      const stages = Array.from(
        section.querySelectorAll<HTMLElement>("[data-bio-stage]"),
      );
      const cta = section.querySelector<HTMLElement>("[data-cta-stage]");
      if (stages.length <= 1) return;

      gsap.set(stackRef.current, { display: "grid", alignItems: "center" });
      gsap.set(stages, { gridArea: "1 / 1", marginBottom: 0 });
      gsap.set(stages.slice(1), { autoAlpha: 0, y: 48 });
      if (cta) gsap.set(cta, { autoAlpha: 0, y: 24 });

      const seq = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "center center",
          end: `+=${stages.length * 55}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
        defaults: { ease: "none" },
      });

      stages.forEach((stage, i) => {
        if (i === 0) return;
        seq
          .to(stages[i - 1], { autoAlpha: 0, y: -48, duration: 1 })
          .fromTo(
            stage,
            { autoAlpha: 0, y: 48 },
            { autoAlpha: 1, y: 0, duration: 1 },
            "<35%",
          );
      });
      if (cta) seq.to(cta, { autoAlpha: 1, y: 0, duration: 0.7 }, ">-0.25");
      seq.to({}, { duration: 0.5 }); // hold the last beat before release

      /* Portrait slow counter-drift across the whole pin — the visible
         rate differential while the text swaps. Disabled (0) in the
         1-column tiers: there the portrait sits directly above the text,
         and the +y start would shove it into the paragraphs. */
      if (portraitTravel > 0) {
        seq.fromTo(
          portraitDriftRef.current,
          { y: portraitTravel },
          { y: -portraitTravel, duration: seq.duration() },
          0,
        );
      }
    };

    /* Same experience on every tier — only the plane offsets scale down. */
    mm.add(SCROLL_MEDIA.desktop, () => {
      buildPlanes(1);
      buildStage(56);
      startCounters();
    });

    mm.add(SCROLL_MEDIA.tablet, () => {
      buildPlanes(0.7);
      buildStage(0);
      startCounters();
    });

    mm.add(SCROLL_MEDIA.phone, () => {
      buildPlanes(0.45);
      buildStage(0);
      startCounters();
    });

    mm.add(SCROLL_MEDIA.reduced, () => {
      STATS.forEach((stat, i) => {
        const el = statValueRefs.current[i];
        if (el) el.textContent = stat.value.toString();
      });
    });
  });

  /* ─── Motion variants (component-state reveals) ─── */
  const staggerGroup: Variants = {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? { staggerChildren: 0 }
        : { staggerChildren: 0.16, delayChildren: 0.1 },
    },
  };

  const staggerItem: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.7, ease: EASE },
    },
  };

  const cardGroup: Variants = {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? { staggerChildren: 0 }
        : { staggerChildren: 0.09 },
    },
  };

  const bioParagraphs = cmsBioParagraphs ?? [
    <>
      I&apos;m a{" "}
      <span className="text-foreground font-semibold">Full-Stack Software Engineer</span>{" "}
      specializing in building scalable cloud applications and AI-powered workflow
      automation. With hands-on experience at companies like{" "}
      <span className="text-foreground font-medium">Wayfair</span> and{" "}
      <span className="text-foreground font-medium">North Light AI</span>, I bring both
      startup agility and enterprise-level engineering discipline to every project.
    </>,
    <>
      Beyond coding, I&apos;m deeply committed to community. I&apos;ve{" "}
      <span className="text-foreground font-semibold">mentored 50+ early-career engineers</span>{" "}
      through the Urban League of Eastern Massachusetts, leading bootcamps and mock
      interviews that helped technologists break into the industry.
    </>,
    <>
      I&apos;m currently pursuing my{" "}
      <span className="text-foreground font-medium">A.S. in Computer Science</span> at
      Bunker Hill Community College while continuing to build and ship real-world
      projects.
    </>,
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About Me"
      className="relative py-fl-section px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Layered parallax backdrop: instrument grid (slow plane) + glow blobs */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div
          ref={gridRef}
          className="absolute inset-x-0 -inset-y-32 opacity-[0.08] bg-[linear-gradient(color-mix(in_srgb,var(--primary)_70%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--primary)_70%,transparent)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(85%_70%_at_50%_30%,black,transparent_80%)]"
        />
        <div
          ref={blob1Ref}
          className="absolute -top-20 right-[-5%] w-125 h-125 rounded-full bg-cat-fullstack/10 blur-[100px]"
        />
        <div
          ref={blob2Ref}
          className="absolute bottom-[-10%] left-[-5%] w-100 h-100 rounded-full bg-cat-backend/8 blur-[90px]"
        />
      </div>

      <div className="max-w-6xl mx-auto space-y-fl-y-xl">

        {/* Editorial header — midground parallax plane */}
        <div ref={headerDriftRef}>
          <m.div
            variants={staggerGroup}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <m.div variants={staggerItem} className="flex items-center gap-4">
              <span aria-hidden className="h-px w-12 bg-primary/60" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                About Me
              </span>
            </m.div>
            <m.h2
              variants={staggerItem}
              className="mt-5 text-[clamp(2.75rem,7.5vw,6.25rem)] font-bold leading-[0.95] tracking-[-0.03em] text-ink-bright"
            >
              Who I Am<span className="text-primary">.</span>
            </m.h2>
            <m.p
              variants={staggerItem}
              className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground lg:ml-auto lg:text-right"
            >
              A passionate engineer who loves solving real problems through clean
              code, thoughtful design, and continuous learning.
            </m.p>
          </m.div>
        </div>

        {/* Pinned stage: asymmetric portrait + sequenced bio. Negative top
            margin tucks it under the header (space-y sets margin-bottom on
            the header, so this composes instead of conflicting). */}
        <div
          ref={stageRef}
          className="relative grid grid-cols-1 gap-12 lg:-mt-16 lg:grid-cols-12 lg:items-center lg:gap-8"
        >
          {/* Portrait — pulled up into the header's space on desktop;
              centered in its column so the gutter stays balanced at 1024.
              Bottom padding below lg clears the Boston badge + halo ring
              from the stacked bio text. */}
          <div className="flex justify-center pb-6 lg:col-span-5 lg:-mt-20 lg:pb-0">
            <div ref={portraitDriftRef} className="relative">
              {reduceMotionPref === false && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-24 -z-10"
                >
                  <PortraitHalo />
                </div>
              )}
              <PortraitCard reduceMotion={reduceMotion} />
            </div>
          </div>

          {/* Bio — narrow measure; wrappers are GSAP's, inner elements Motion's */}
          <m.div
            variants={staggerGroup}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7"
          >
            {/* Natural stacked flow by default; the pin clauses switch this
                to an overlap grid via GSAP so paragraphs can sequence. */}
            <div ref={stackRef} className="space-y-5 text-muted-foreground leading-relaxed">
              {bioParagraphs.map((content, i) => (
                <div key={i} data-bio-stage>
                  <m.p variants={staggerItem} className="max-w-prose text-lg">
                    {content}
                  </m.p>
                </div>
              ))}
            </div>

            <div data-cta-stage className="mt-8">
              <m.div variants={staggerItem}>
                <ResumeDownloadChoiceModal choices={pdfChoices}>
                  <button
                    type="button"
                    className="cta-dome group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-stage"
                  >
                    <Download className="h-4 w-4 motion-safe:group-hover:animate-bounce" />
                    Download Resume
                  </button>
                </ResumeDownloadChoiceModal>
              </m.div>
            </div>
          </m.div>
        </div>

        {/* Stats — HUD readout band, no boxes */}
        <div ref={statsDriftRef}>
          <m.div
            ref={statsRef}
            variants={cardGroup}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 gap-y-10 border-y border-white/10 py-10 md:grid-cols-4 md:gap-y-0 md:divide-x md:divide-white/10"
          >
            {STATS.map((stat, i) => (
              <m.div
                key={stat.label}
                variants={staggerItem}
                className="flex min-w-0 flex-col items-center justify-center px-2"
              >
                <p className="font-mono text-5xl font-bold tabular-nums text-primary sm:text-6xl lg:text-7xl">
                  <span ref={(el) => { statValueRefs.current[i] = el; }}>0</span>
                  <span className="text-primary/60">{stat.suffix}</span>
                </p>
                <p className="mt-3 text-center font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted">
                  {stat.label}
                </p>
              </m.div>
            ))}
          </m.div>
        </div>

        {/* Education & Certifications — editorial/HUD language, its own
            parallax plane, tucked closer to the stats band on desktop */}
        <div ref={eduDriftRef} className="space-y-8 lg:-mt-12">
          <m.div
            variants={staggerGroup}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            <m.div variants={staggerItem} className="flex items-center gap-4">
              <span aria-hidden className="h-px w-12 bg-primary/60" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                Credentials
              </span>
            </m.div>
            <m.h3
              variants={staggerItem}
              className="mt-4 text-2xl font-bold tracking-tight text-ink-bright sm:text-3xl"
            >
              Education &amp; Certifications
            </m.h3>
          </m.div>
          <m.div
            variants={cardGroup}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0"
          >
            {credentialCards.map((edu, index) => (
              <div
                key={`${edu.institution}-${edu.degree}`}
                className="perspective-midrange min-w-0"
              >
                <CredentialCard
                  edu={edu}
                  index={index}
                  reduceMotion={reduceMotion}
                  variants={staggerItem}
                />
              </div>
            ))}
          </m.div>
        </div>

      </div>
    </section>
  );
}

type CredentialCardProps = {
  edu: LandingCredentialCard;
  index: number;
  reduceMotion: boolean;
  variants: Variants;
};

/**
 * Credential card with a real 3D pointer tilt — same engine as the
 * portrait (sprung motion values → rotateX/rotateY inside a per-card
 * perspective wrapper). Motion owns every transform on the card node
 * (tilt + hover lift + reveal); the icon chip sits at +z via a static
 * class, so it floats above the surface as the card tilts.
 */
function CredentialCard({ edu, index, reduceMotion, variants }: CredentialCardProps) {
  /* (pointer: fine) never changes mid-session; server renders `false`
     but markup is identical either way — only the no-op handlers differ. */
  const [finePointer] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches,
  );
  const tiltEnabled = finePointer && !reduceMotion;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 18 });
  const sy = useSpring(my, { stiffness: 220, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!tiltEnabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    mx.set(0);
    my.set(0);
  };

  const cardClass =
    "group relative flex h-full gap-4 min-w-0 rounded-2xl border border-white/10 bg-surface-raised/50 p-5 shadow-lg shadow-black/40 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 transform-3d";

  const inner = (
    <>
      {/* top light — gives the surface a beveled, lit-from-above read */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-b from-white/5 to-transparent"
      />
      {/* persistent hairline, brightens on hover */}
      <span
        aria-hidden
        className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent transition-opacity duration-300 group-hover:via-primary/70"
      />
      {/* HUD corner brackets, revealed on hover */}
      <span
        aria-hidden
        className="absolute left-2 top-2 h-2.5 w-2.5 border-l border-t border-primary/0 transition-colors duration-300 group-hover:border-primary/60"
      />
      <span
        aria-hidden
        className="absolute bottom-2 right-2 h-2.5 w-2.5 border-b border-r border-primary/0 transition-colors duration-300 group-hover:border-primary/60"
      />
      <div className="shrink-0 w-10 h-10 translate-z-6 rounded-xl border border-primary/20 bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_18px_-4px_var(--primary)]">
        <GraduationCap className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="font-semibold text-foreground text-sm leading-snug flex-1 min-w-0">{edu.institution}</p>
          {edu.credentialUrl && (
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-all duration-300 shrink-0 mt-0.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          )}
          {/* mono index, instrument-style */}
          <span
            aria-hidden
            className="shrink-0 font-mono text-[11px] leading-snug tracking-[0.2em] text-ink-faint transition-colors duration-300 group-hover:text-primary/70"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-snug">{edu.degree}</p>
        <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
          <span
            aria-hidden
            className="h-1 w-1 rounded-full bg-primary motion-safe:group-hover:animate-pulse"
          />
          {formatCredentialPeriod(edu.period)}
        </p>
        {edu.description ? (
          <p className="text-xs text-muted-foreground leading-snug line-clamp-3">{edu.description}</p>
        ) : null}
      </div>
    </>
  );

  return edu.credentialUrl ? (
    <m.a
      href={edu.credentialUrl}
      target="_blank"
      rel="noopener noreferrer"
      variants={variants}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      style={{ rotateX, rotateY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      className={`${cardClass} hover:shadow-primary/10`}
    >
      {inner}
    </m.a>
  ) : (
    <m.div
      variants={variants}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      style={{ rotateX, rotateY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      className={`${cardClass} hover:shadow-primary/10`}
    >
      {inner}
    </m.div>
  );
}
