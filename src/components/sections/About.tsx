"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger, SCROLL_MEDIA } from "@/lib/scroll/gsap";
import { Download, MapPin, Languages, GraduationCap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/SectionHeading";
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

type AboutProps = {
  professionalSummary: string;
  credentialCards: LandingCredentialCard[];
  pdfChoices: LandingResumePdfChoice[];
};

export function About({ professionalSummary, credentialCards, pdfChoices }: AboutProps) {
  const sectionRef    = useRef<HTMLElement>(null);
  const headingRef    = useRef<HTMLDivElement>(null);
  const photoColRef   = useRef<HTMLDivElement>(null);
  const photoCardRef  = useRef<HTMLDivElement>(null);
  const badge1Ref     = useRef<HTMLDivElement>(null);
  const badge2Ref     = useRef<HTMLDivElement>(null);
  const contentRef    = useRef<HTMLDivElement>(null);
  const statsRef      = useRef<HTMLDivElement>(null);
  const educationRef  = useRef<HTMLDivElement>(null);
  const blob1Ref      = useRef<HTMLDivElement>(null);
  const blob2Ref      = useRef<HTMLDivElement>(null);
  const statValueRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const cmsBioParagraphs = useMemo(() => {
    const t = professionalSummary.trim();
    if (!t) return null;
    const parts = t
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    return parts.length > 0 ? parts : null;
  }, [professionalSummary]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ─── DESKTOP + REDUCED MOTION: show content immediately, no animations ─── */
    mm.add(SCROLL_MEDIA.desktopReduced, () => {
      gsap.set(headingRef.current, { clipPath: "inset(0% 0 0 0)", opacity: 1, y: 0 });
      gsap.set(photoCardRef.current, { opacity: 1, scale: 1, rotation: 0, y: 0 });
      gsap.set([badge1Ref.current, badge2Ref.current], { opacity: 1, scale: 1, y: 0 });
      gsap.set(gsap.utils.toArray<HTMLElement>("[data-bio-para], [data-download-btn]"), { opacity: 1 });
      gsap.utils.toArray<HTMLElement>("[data-stat-card]").forEach((c) => {
        gsap.set(c, { opacity: 1 });
      });
      gsap.utils.toArray<HTMLElement>("[data-edu-card]").forEach((c) => {
        gsap.set(c, { opacity: 1 });
      });
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          STATS.forEach((stat, i) => {
            const el = statValueRefs.current[i];
            if (el) el.textContent = stat.value.toString();
          });
        },
      });
    });

    /* ─── DESKTOP (≥1024 px) + NO REDUCED MOTION ─── */
    mm.add(SCROLL_MEDIA.desktop, () => {

      /* --- Background parallax blobs --- */
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

      /* --- Heading clip-path wipe up --- */
      gsap.fromTo(
        headingRef.current,
        { clipPath: "inset(100% 0 0 0)", opacity: 0, y: 30 },
        {
          clipPath: "inset(0% 0 0 0)",
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      /* --- Photo card entrance (scale + slight rotate) --- */
      gsap.fromTo(
        photoCardRef.current,
        { opacity: 0, scale: 0.75, rotation: -6 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: photoColRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      /* --- Floating badges pop in with bounce --- */
      gsap.fromTo(
        [badge1Ref.current, badge2Ref.current],
        { opacity: 0, scale: 0, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(2)",
          stagger: 0.2,
          delay: 0.4,
          scrollTrigger: {
            trigger: photoCardRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      /* --- Photo subtle parallax while bio scrolls alongside --- */
      gsap.to(photoCardRef.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1.2,
        },
      });

      /* --- Bio paragraphs + Download button: Hero-style timeline (power3.out, y: 20, overlapping) --- */
      const bioParas = gsap.utils.toArray<HTMLElement>("[data-bio-para]");
      const downloadBtnEl = document.querySelector<HTMLElement>("[data-download-btn]");
      const bioTl = gsap.timeline({
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });
      bioParas.forEach((para, i) => {
        if (i === 0) {
          bioTl.fromTo(para, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
        } else {
          bioTl.fromTo(para, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
        }
      });
      if (downloadBtnEl) bioTl.fromTo(downloadBtnEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2");

      /* --- Stats: fade-in + counter --- */
      const statCards = gsap.utils.toArray<HTMLElement>("[data-stat-card]");
      statCards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      /* --- Stats counter (fires once on entry) --- */
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          STATS.forEach((stat, i) => {
            const el = statValueRefs.current[i];
            if (!el) return;
            // Tween a proxy object and write the rounded value into the DOM.
            // (The animated property must live in the to-vars — the old
            // fromTo call had it in the from slot, so nothing ever animated
            // and the stats sat at 0.)
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

      /* --- Education cards: fade-in --- */
      const eduCards = gsap.utils.toArray<HTMLElement>("[data-edu-card]");
      eduCards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: educationRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    /* ─── MOBILE / TABLET (< 1024 px) ─── */
    mm.add(SCROLL_MEDIA.mobile, () => {
      const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        /* Show all content immediately, no animations */
        gsap.set(headingRef.current, { clearProps: "clipPath,opacity,y" });
        gsap.set(photoCardRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set([badge1Ref.current, badge2Ref.current], { opacity: 1, scale: 1 });
        gsap.set(gsap.utils.toArray<HTMLElement>("[data-bio-para], [data-download-btn]"), { opacity: 1 });
        gsap.utils.toArray<HTMLElement>("[data-stat-card]").forEach((c) => {
          gsap.set(c, { opacity: 1 });
        });
        gsap.utils.toArray<HTMLElement>("[data-edu-card]").forEach((c) => {
          gsap.set(c, { opacity: 1 });
        });
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            STATS.forEach((stat, i) => {
              const el = statValueRefs.current[i];
              if (el) el.textContent = stat.value.toString();
            });
          },
        });
        return () => {};
      }

      /* Run animations */
      const ctx = gsap.context(() => {
        /* Blob parallax (subtle on mobile) */
        gsap.to(blob1Ref.current, {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });

        /* Heading — skip animation on mobile; .about-animate-initial keeps it visible */
        gsap.set(headingRef.current, { clearProps: "clipPath,opacity" });

        /* Photo */
        gsap.fromTo(photoCardRef.current, { opacity: 0, scale: 0.85, y: 30 }, {
          opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: photoCardRef.current, start: "top 82%" },
        });
        gsap.fromTo([badge1Ref.current, badge2Ref.current], { opacity: 0, scale: 0 }, {
          opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.15, delay: 0.3,
          scrollTrigger: { trigger: photoCardRef.current, start: "top 82%" },
        });

        /* Bio paragraphs + Download: Hero-style timeline */
        const bioParas = gsap.utils.toArray<HTMLElement>("[data-bio-para]");
        const downloadBtnEl = document.querySelector<HTMLElement>("[data-download-btn]");
        const bioTl = gsap.timeline({
          scrollTrigger: { trigger: contentRef.current, start: "top 85%" },
          defaults: { ease: "power3.out" },
        });
        bioParas.forEach((para, i) => {
          if (i === 0) {
            bioTl.fromTo(para, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
          } else {
            bioTl.fromTo(para, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
          }
        });
        if (downloadBtnEl) bioTl.fromTo(downloadBtnEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2");

        /* Stats */
        const statCards = gsap.utils.toArray<HTMLElement>("[data-stat-card]");
        statCards.forEach((card, i) => {
          gsap.fromTo(card, { opacity: 0 }, {
            opacity: 1, duration: 0.6, ease: "power2.out", delay: i * 0.1,
            scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
          });
        });
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            STATS.forEach((stat, i) => {
              const el = statValueRefs.current[i];
              if (!el) return;
              // Same proxy-object count-up as the desktop clause above.
              const counter = { val: 0 };
              gsap.to(counter, {
                val: stat.value, duration: 1.8, ease: "power2.out", delay: i * 0.1,
                onUpdate: () => {
                  el.textContent = Math.round(counter.val).toString();
                },
              });
            });
          },
        });

        /* Education */
        const eduCards = gsap.utils.toArray<HTMLElement>("[data-edu-card]");
        eduCards.forEach((card, i) => {
          gsap.fromTo(card, { opacity: 0 }, {
            opacity: 1, duration: 0.6, ease: "power2.out", delay: i * 0.1,
            scrollTrigger: { trigger: educationRef.current, start: "top 85%" },
          });
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About Me"
      className="relative py-fl-section px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Parallax background blobs */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div
          ref={blob1Ref}
          className="absolute -top-20 right-[-5%] w-[500px] h-[500px] rounded-full bg-[#A8DADC]/10 blur-[100px]"
        />
        <div
          ref={blob2Ref}
          className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#B39CD0]/8 blur-[90px]"
        />
      </div>

      <div className="max-w-6xl mx-auto space-y-fl-y-xl">

        {/* Heading */}
        <div ref={headingRef} className="about-animate-initial">
          <SectionHeading
            label="About Me"
            title="Who I Am"
            subtitle="A passionate engineer who loves solving real problems through clean code, thoughtful design, and continuous learning."
          />
        </div>

        {/* Photo + Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-fl-gap-cols items-start">

          {/* Photo — sticky on desktop */}
          <div ref={photoColRef} className="flex justify-center lg:justify-end lg:sticky lg:top-[15vh]">
            <div ref={photoCardRef} className="relative opacity-0">
              {/* Decorative rings */}
              <div className="absolute -inset-4 rounded-full border border-primary/20 motion-safe:animate-pulse" />
              <div className="absolute -inset-8 rounded-full border border-accent/10" />

              {/* Avatar */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-linear-to-br from-primary/30 via-accent/20 to-secondary/30 flex items-center justify-center shadow-2xl ring-4 ring-primary/20">
                <span className="text-6xl font-extrabold text-[#2b7a78] dark:text-primary tracking-tight select-none">
                  SA
                </span>
              </div>

              {/* Floating badge — location */}
              <div
                ref={badge1Ref}
                className="absolute -bottom-4 -right-4 bg-background border border-border rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2"
                style={{ opacity: 0, scale: 0 }}
              >
                <MapPin className="h-4 w-4 text-[#2b7a78] dark:text-primary" />
                <span className="text-sm font-medium text-foreground">Boston, MA</span>
              </div>

              {/* Floating badge — languages */}
              <div
                ref={badge2Ref}
                className="absolute -top-4 -left-4 bg-background border border-border rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2"
                style={{ opacity: 0, scale: 0 }}
              >
                <Languages className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-foreground">EN / ES</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div
            ref={contentRef}
            data-bio-block
            className="space-y-6"
          >
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              {cmsBioParagraphs ? (
                cmsBioParagraphs.map((text, i) => (
                  <p
                    key={i}
                    data-bio-para
                    className="text-lg opacity-0"
                  >
                    {text}
                  </p>
                ))
              ) : (
                <>
                  <p
                    data-bio-para
                    className="text-lg opacity-0"
                  >
                    I&apos;m a{" "}
                    <span className="text-foreground font-semibold">Full-Stack Software Engineer</span>{" "}
                    specializing in building scalable cloud applications and AI-powered workflow
                    automation. With hands-on experience at companies like{" "}
                    <span className="text-foreground font-medium">Wayfair</span> and{" "}
                    <span className="text-foreground font-medium">North Light AI</span>, I bring both
                    startup agility and enterprise-level engineering discipline to every project.
                  </p>
                  <p
                    data-bio-para
                    className="text-lg opacity-0"
                  >
                    Beyond coding, I&apos;m deeply committed to community. I&apos;ve{" "}
                    <span className="text-foreground font-semibold">mentored 50+ early-career engineers</span>{" "}
                    through the Urban League of Eastern Massachusetts, leading bootcamps and mock
                    interviews that helped technologists break into the industry.
                  </p>
                  <p
                    data-bio-para
                    className="text-lg opacity-0"
                  >
                    I&apos;m currently pursuing my{" "}
                    <span className="text-foreground font-medium">A.S. in Computer Science</span> at
                    Bunker Hill Community College while continuing to build and ship real-world
                    projects.
                  </p>
                </>
              )}
            </div>

            <div data-download-btn className="opacity-0">
              <ResumeDownloadChoiceModal choices={pdfChoices}>
                <Button
                  size="lg"
                  variant="outline"
                  type="button"
                  className="rounded-full px-8 border-[#2b7a78] dark:border-primary text-[#2b7a78] dark:text-primary hover:bg-[#2b7a78] dark:hover:bg-primary hover:text-primary-foreground font-semibold shadow-sm shadow-foreground/10 hover:shadow-md hover:shadow-foreground/15 transition-all duration-200 hover:scale-105 group cursor-pointer"
                >
                  <Download className="mr-2 h-4 w-4 motion-safe:group-hover:animate-bounce" />
                  Download Resume
                </Button>
              </ResumeDownloadChoiceModal>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 min-w-0">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              data-stat-card
              className="relative group flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border border-border bg-card shadow-sm shadow-foreground/10 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 min-w-0"
              style={{ opacity: 0 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="text-4xl font-extrabold text-[#2b7a78] dark:text-primary">
                <span ref={(el) => { statValueRefs.current[i] = el; }}>0</span>
                {stat.suffix}
              </p>
              <p className="mt-1 text-sm text-muted-foreground font-medium text-center">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Education & Certifications */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground">Education &amp; Certifications</h3>
          <div ref={educationRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
            {credentialCards.map((edu) => {
              const cardKey = `${edu.institution}-${edu.degree}`;
              const inner = (
                <>
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 shadow-sm shadow-foreground/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <GraduationCap className="h-5 w-5 text-[#2b7a78] dark:text-primary" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-semibold text-foreground text-sm leading-snug">{edu.institution}</p>
                      {edu.credentialUrl && (
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#2b7a78] dark:group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{edu.degree}</p>
                    <p className="text-xs text-[#2b7a78] dark:text-primary font-medium">
                      {formatCredentialPeriod(edu.period)}
                    </p>
                    {edu.description ? (
                      <p className="text-xs text-muted-foreground leading-snug line-clamp-3">{edu.description}</p>
                    ) : null}
                  </div>
                </>
              );

              return edu.credentialUrl ? (
                <a
                  key={cardKey}
                  href={edu.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-edu-card
                  className="group flex gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm shadow-foreground/10 hover:border-primary/40 hover:shadow-md transition-all duration-300 min-w-0"
                  style={{ opacity: 0 }}
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={cardKey}
                  data-edu-card
                  className="group flex gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm shadow-foreground/10 hover:border-primary/40 hover:shadow-md transition-all duration-300 min-w-0"
                  style={{ opacity: 0 }}
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
