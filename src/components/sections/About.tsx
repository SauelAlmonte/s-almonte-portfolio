"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Download, MapPin, Languages, GraduationCap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 4, suffix: "+", label: "Years Experience" },
  { value: 50, suffix: "+", label: "Engineers Mentored" },
  { value: 3, suffix: "", label: "Companies" },
  { value: 2, suffix: "", label: "Languages" },
];

const EDUCATION = [
  {
    institution: "Bunker Hill Community College",
    degree: "A.S. Computer Science · A.A. Mathematics",
    period: "Expected June 2027",
    icon: GraduationCap,
    credentialUrl: null,
  },
  {
    institution: "Meta · Coursera",
    degree: "Front-End Developer Professional Certificate",
    period: "Completed Jan 2025",
    icon: GraduationCap,
    credentialUrl: "https://www.credly.com/badges/66608cd0-d62f-4d81-8b27-36664aec10bb/public_url",
  },
  {
    institution: "Amazon Web Services",
    degree: "AWS Certified Cloud Practitioner",
    period: "Certified",
    icon: GraduationCap,
    credentialUrl: "https://www.credly.com/badges/2c79f693-01e6-422c-b5a4-c3adcd374cdf/public_url",
  },
  {
    institution: "CISCO Network Academy",
    degree: "C++ Essentials 1",
    period: "Completed",
    icon: GraduationCap,
    credentialUrl: "https://www.credly.com/badges/d5da802a-e6a3-448d-bcca-122cb94be261/public_url",
  },
  {
    institution: "CISCO Network Academy",
    degree: "C++ Essentials 2",
    period: "Completed",
    icon: GraduationCap,
    credentialUrl: "https://www.credly.com/badges/db901e18-76ea-4ac7-ab69-112155b906db/public_url",
  },
];

export function About() {
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

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ─── DESKTOP + REDUCED MOTION: show content immediately, no animations ─── */
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: reduce)", () => {
      gsap.set(headingRef.current, { clipPath: "inset(0% 0 0 0)", opacity: 1, y: 0 });
      gsap.set(photoCardRef.current, { opacity: 1, scale: 1, rotation: 0, y: 0 });
      gsap.set([badge1Ref.current, badge2Ref.current], { opacity: 1, scale: 1, y: 0 });
      /* Bio + download: always visible, no GSAP */
      gsap.utils.toArray<HTMLElement>("[data-stat-card]").forEach((c) => {
        gsap.set(c, { opacity: 1, scale: 1, rotation: 0, y: 0 });
      });
      gsap.utils.toArray<HTMLElement>("[data-edu-card]").forEach((c) => {
        gsap.set(c, { opacity: 1, x: 0, scale: 1 });
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
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {

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

      /* --- Bio paragraphs + Download button: always visible (no GSAP) — content must be readable without scroll/animation --- */

      /* --- Stats: scale + rotation entrance + counter --- */
      const statCards = gsap.utils.toArray<HTMLElement>("[data-stat-card]");
      statCards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.7, rotation: i % 2 === 0 ? -8 : 8, y: 30 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            y: 0,
            duration: 0.7,
            ease: "back.out(1.5)",
            delay: i * 0.12,
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
            gsap.fromTo(
              { val: 0 },
              { val: stat.value },
              {
                duration: 1.8,
                ease: "power2.out",
                delay: i * 0.12,
                onUpdate: function () {
                  el.textContent = Math.round(this.targets()[0].val).toString();
                },
              }
            );
          });
        },
      });

      /* --- Education cards: alternating L/R slide with stagger --- */
      const eduCards = gsap.utils.toArray<HTMLElement>("[data-edu-card]");
      eduCards.forEach((card, i) => {
        const fromX = i % 2 === 0 ? -70 : 70;
        gsap.fromTo(
          card,
          { opacity: 0, x: fromX, scale: 0.92 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.75,
            ease: "power3.out",
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
    mm.add("(max-width: 1023px)", () => {
      const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        /* Show all content immediately, no animations */
        gsap.set(headingRef.current, { clearProps: "clipPath,opacity,y" });
        gsap.set(photoCardRef.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set([badge1Ref.current, badge2Ref.current], { opacity: 1, scale: 1 });
        /* Bio + download: always visible, no GSAP */
        gsap.utils.toArray<HTMLElement>("[data-stat-card]").forEach((c) => {
          gsap.set(c, { opacity: 1, y: 0 });
        });
        gsap.utils.toArray<HTMLElement>("[data-edu-card]").forEach((c) => {
          gsap.set(c, { opacity: 1, y: 0 });
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

        /* Bio + download: always visible (no GSAP) */

        /* Stats */
        const statCards = gsap.utils.toArray<HTMLElement>("[data-stat-card]");
        statCards.forEach((card, i) => {
          gsap.fromTo(card, { opacity: 0, y: 30 }, {
            opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: i * 0.1,
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
              gsap.fromTo({ val: 0 }, { val: stat.value }, {
                duration: 1.8, ease: "power2.out", delay: i * 0.1,
                onUpdate: function () {
                  el.textContent = Math.round(this.targets()[0].val).toString();
                },
              });
            });
          },
        });

        /* Education */
        const eduCards = gsap.utils.toArray<HTMLElement>("[data-edu-card]");
        eduCards.forEach((card, i) => {
          gsap.fromTo(card, { opacity: 0, y: 40 }, {
            opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: i * 0.1,
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
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
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

      <div className="max-w-6xl mx-auto space-y-24 min-w-0 overflow-x-hidden">

        {/* Heading */}
        <div ref={headingRef} className="about-animate-initial">
          <SectionHeading
            label="About Me"
            title="Who I Am"
            subtitle="A passionate engineer who loves solving real problems through clean code, thoughtful design, and continuous learning."
          />
        </div>

        {/* Photo + Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Photo — sticky on desktop */}
          <div ref={photoColRef} className="flex justify-center lg:justify-end lg:sticky lg:top-[15vh]">
            <div ref={photoCardRef} className="relative opacity-0">
              {/* Decorative rings */}
              <div className="absolute -inset-4 rounded-full border border-primary/20 motion-safe:animate-pulse" />
              <div className="absolute -inset-8 rounded-full border border-accent/10" />

              {/* Avatar */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-linear-to-br from-primary/30 via-accent/20 to-secondary/30 flex items-center justify-center shadow-2xl ring-4 ring-primary/20">
                <span className="text-6xl font-extrabold text-primary tracking-tight select-none">
                  SA
                </span>
              </div>

              {/* Floating badge — location */}
              <div
                ref={badge1Ref}
                className="absolute -bottom-4 -right-4 bg-background border border-border rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2"
                style={{ opacity: 0, scale: 0 }}
              >
                <MapPin className="h-4 w-4 text-primary" />
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
            className="space-y-6 lg:pt-4"
            style={{ opacity: 1, visibility: "visible" }}
          >
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p
                data-bio-para
                className="text-base sm:text-lg"
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
                className="text-base sm:text-lg"
              >
                Beyond coding, I&apos;m deeply committed to community. I&apos;ve{" "}
                <span className="text-foreground font-semibold">mentored 50+ early-career engineers</span>{" "}
                through the Urban League of Eastern Massachusetts, leading bootcamps and mock
                interviews that helped technologists break into the industry.
              </p>
              <p
                data-bio-para
                className="text-base sm:text-lg"
              >
                I&apos;m currently pursuing my{" "}
                <span className="text-foreground font-medium">A.S. in Computer Science</span> at
                Bunker Hill Community College while continuing to build and ship real-world
                projects.
              </p>
            </div>

            <div data-download-btn>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all duration-200 hover:scale-105 group"
                asChild
              >
                <a href="/resume.pdf" download="sauel_almonte_resume.pdf" aria-label="Download resume PDF">
                  <Download className="mr-2 h-4 w-4 motion-safe:group-hover:animate-bounce" />
                  Download Resume
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 min-w-0">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              data-stat-card
              className="relative group flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 min-w-0"
              style={{ opacity: 0 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="text-3xl sm:text-4xl font-extrabold text-primary">
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
            {EDUCATION.map((edu) => {
              const inner = (
                <>
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <edu.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-semibold text-foreground text-sm leading-snug">{edu.institution}</p>
                      {edu.credentialUrl && (
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{edu.degree}</p>
                    <p className="text-xs text-primary font-medium">{edu.period}</p>
                  </div>
                </>
              );

              return edu.credentialUrl ? (
                <a
                  key={edu.degree}
                  href={edu.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-edu-card
                  className="group flex gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 min-w-0"
                  style={{ opacity: 0 }}
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={edu.degree}
                  data-edu-card
                  className="group flex gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 min-w-0"
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
