"use client";

import { useMemo, useRef } from "react";
import { m, useReducedMotion, type Variants } from "motion/react";
import { gsap, ScrollTrigger, SCROLL_MEDIA } from "@/lib/scroll/gsap";
import { useScrollSection } from "@/lib/scroll/useScrollSection";
import { Download, GraduationCap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PortraitCard } from "@/components/about/PortraitCard";
import { formatCredentialPeriod } from "@/lib/resume/format-credential-period";

import { ResumeDownloadChoiceModal } from "@/components/resume/ResumeDownloadChoiceModal";
import type { LandingCredentialCard } from "@/config/resume";
import type { LandingResumePdfChoice } from "@/config/experience";

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
  const portraitDriftRef = useRef<HTMLDivElement>(null);
  const bioColRef        = useRef<HTMLDivElement>(null);
  const statsRef         = useRef<HTMLDivElement>(null);
  const statValueRefs    = useRef<(HTMLSpanElement | null)[]>([]);

  /* `useReducedMotion()` is null until the media query resolves (SSR-safe);
     treat "unknown" as "animate" so the first paint matches the common case. */
  const reduceMotion = useReducedMotion() ?? false;

  const cmsBioParagraphs = useMemo(() => {
    const t = professionalSummary.trim();
    if (!t) return null;
    const parts = t
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    return parts.length > 0 ? parts : null;
  }, [professionalSummary]);

  /* ─── GSAP: scroll-driven work only (parallax depth + count-up) ─── */
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

    mm.add(SCROLL_MEDIA.desktop, () => {
      /* Layered depth — each layer scrubs at a different speed. */
      gsap.to(gridRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2.5,
        },
      });
      gsap.to(blob1Ref.current, {
        y: -180,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
      gsap.to(blob2Ref.current, {
        y: 120,
        x: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });
      /* Portrait drifts upward while the bio scrolls alongside. The drift
         wrapper is GSAP-owned; PortraitCard's Motion transforms live on
         separate nodes inside it. */
      gsap.to(portraitDriftRef.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: bioColRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1.2,
        },
      });

      startCounters();
    });

    mm.add(SCROLL_MEDIA.mobile, () => {
      // No parallax below the desktop breakpoint — reveals + count-up only.
      // Reduced-motion users are handled by the clause below.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
  const rise: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.9, ease: EASE },
    },
  };

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

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About Me"
      className="relative py-fl-section px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Layered parallax backdrop: instrument grid (slow) + glow blobs */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div
          ref={gridRef}
          className="absolute inset-x-0 -inset-y-24 opacity-[0.05] bg-[linear-gradient(color-mix(in_srgb,var(--primary)_70%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--primary)_70%,transparent)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(85%_70%_at_50%_30%,black,transparent_80%)]"
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

        {/* Heading */}
        <m.div
          variants={rise}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <SectionHeading
            label="About Me"
            title="Who I Am"
            subtitle="A passionate engineer who loves solving real problems through clean code, thoughtful design, and continuous learning."
          />
        </m.div>

        {/* Portrait + Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-fl-gap-cols items-start">

          {/* Portrait — sticky on desktop; outer div is the GSAP parallax layer */}
          <div className="flex justify-center lg:justify-end lg:sticky lg:top-[15vh]">
            <div ref={portraitDriftRef}>
              <PortraitCard reduceMotion={reduceMotion} />
            </div>
          </div>

          {/* Bio */}
          <m.div
            ref={bioColRef}
            variants={staggerGroup}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              {cmsBioParagraphs ? (
                cmsBioParagraphs.map((text, i) => (
                  <m.p key={i} variants={staggerItem} className="text-lg">
                    {text}
                  </m.p>
                ))
              ) : (
                <>
                  <m.p variants={staggerItem} className="text-lg">
                    I&apos;m a{" "}
                    <span className="text-foreground font-semibold">Full-Stack Software Engineer</span>{" "}
                    specializing in building scalable cloud applications and AI-powered workflow
                    automation. With hands-on experience at companies like{" "}
                    <span className="text-foreground font-medium">Wayfair</span> and{" "}
                    <span className="text-foreground font-medium">North Light AI</span>, I bring both
                    startup agility and enterprise-level engineering discipline to every project.
                  </m.p>
                  <m.p variants={staggerItem} className="text-lg">
                    Beyond coding, I&apos;m deeply committed to community. I&apos;ve{" "}
                    <span className="text-foreground font-semibold">mentored 50+ early-career engineers</span>{" "}
                    through the Urban League of Eastern Massachusetts, leading bootcamps and mock
                    interviews that helped technologists break into the industry.
                  </m.p>
                  <m.p variants={staggerItem} className="text-lg">
                    I&apos;m currently pursuing my{" "}
                    <span className="text-foreground font-medium">A.S. in Computer Science</span> at
                    Bunker Hill Community College while continuing to build and ship real-world
                    projects.
                  </m.p>
                </>
              )}
            </div>

            <m.div variants={staggerItem}>
              <ResumeDownloadChoiceModal choices={pdfChoices}>
                <Button
                  size="lg"
                  variant="outline"
                  type="button"
                  className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold shadow-sm shadow-foreground/10 hover:shadow-md hover:shadow-foreground/15 transition-all duration-200 hover:scale-105 group cursor-pointer"
                >
                  <Download className="mr-2 h-4 w-4 motion-safe:group-hover:animate-bounce" />
                  Download Resume
                </Button>
              </ResumeDownloadChoiceModal>
            </m.div>
          </m.div>
        </div>

        {/* Stats — instrument readout */}
        <m.div
          ref={statsRef}
          variants={cardGroup}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 min-w-0"
        >
          {STATS.map((stat, i) => (
            <m.div
              key={stat.label}
              variants={staggerItem}
              className="group relative flex min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-surface-raised/50 p-4 shadow-sm shadow-foreground/10 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 sm:p-6"
            >
              <span
                aria-hidden
                className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <p className="font-mono text-4xl font-bold tabular-nums text-primary">
                <span ref={(el) => { statValueRefs.current[i] = el; }}>0</span>
                {stat.suffix}
              </p>
              <p className="mt-1 text-sm text-muted-foreground font-medium text-center">{stat.label}</p>
            </m.div>
          ))}
        </m.div>

        {/* Education & Certifications */}
        <div className="space-y-6">
          <m.h3
            variants={rise}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="text-xl font-bold text-foreground"
          >
            Education &amp; Certifications
          </m.h3>
          <m.div
            variants={cardGroup}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0"
          >
            {credentialCards.map((edu) => {
              const cardKey = `${edu.institution}-${edu.degree}`;
              const cardClass =
                "group relative flex gap-4 min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-surface-raised/50 p-5 shadow-sm shadow-foreground/10 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40";
              const inner = (
                <>
                  <span
                    aria-hidden
                    className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="shrink-0 w-10 h-10 rounded-xl border border-primary/20 bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-semibold text-foreground text-sm leading-snug">{edu.institution}</p>
                      {edu.credentialUrl && (
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{edu.degree}</p>
                    <p className="font-mono text-[11px] tracking-wide text-primary">
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
                  key={cardKey}
                  href={edu.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={staggerItem}
                  whileHover={reduceMotion ? undefined : { y: -5 }}
                  className={`${cardClass} hover:shadow-lg hover:shadow-primary/10`}
                >
                  {inner}
                </m.a>
              ) : (
                <m.div key={cardKey} variants={staggerItem} className={cardClass}>
                  {inner}
                </m.div>
              );
            })}
          </m.div>
        </div>

      </div>
    </section>
  );
}
