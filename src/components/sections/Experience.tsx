"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Calendar, Download, ArrowRight, Briefcase, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCES = [
  {
    id: "01",
    role: "Full-Stack Developer & Mentor",
    company: "Urban League of Eastern Massachusetts",
    location: "Boston, MA",
    period: "May 2021 – Feb 2025",
    duration: "~4 years",
    accent: "#A8DADC",
    accentClass: "from-[#A8DADC]/20 to-[#A8DADC]/5",
    borderClass: "border-[#A8DADC]/30 hover:border-[#A8DADC]/70",
    tagClass: "bg-[#A8DADC]/15 text-[#5aacae] dark:text-[#A8DADC]",
    dotClass: "bg-[#A8DADC]",
    achievements: [
      "Developed web apps with React & Tailwind, improving page load times by 40%",
      "Mentored 50+ early-career technologists through workshops and mock interviews",
      "Facilitated weekly dev bootcamps for fluency in modern frontend development",
    ],
    tech: ["React", "TypeScript", "Tailwind CSS", "JavaScript"],
  },
  {
    id: "02",
    role: "AI Engineer Intern",
    company: "North Light AI",
    location: "Remote",
    period: "Sep 2024 – Jan 2025",
    duration: "5 months",
    accent: "#B39CD0",
    accentClass: "from-[#B39CD0]/20 to-[#B39CD0]/5",
    borderClass: "border-[#B39CD0]/30 hover:border-[#B39CD0]/70",
    tagClass: "bg-[#B39CD0]/15 text-[#7b56a8] dark:text-[#B39CD0]",
    dotClass: "bg-[#B39CD0]",
    achievements: [
      "Deployed AI tools using GPT-4 & Whisper, reducing workflow bottlenecks by 32%",
      "Built containerized ML pipelines from data ingestion through model evaluation",
      "Coordinated a remote Agile team of 5 through sprint planning and task tracking",
    ],
    tech: ["Python", "GPT-4", "Whisper", "Docker", "LangChain"],
  },
  {
    id: "03",
    role: "Software Engineer Intern",
    company: "Wayfair",
    location: "Boston, MA",
    period: "May 2023 – Aug 2023",
    duration: "4 months",
    accent: "#FFC1CC",
    accentClass: "from-[#FFC1CC]/20 to-[#FFC1CC]/5",
    borderClass: "border-[#FFC1CC]/30 hover:border-[#FFC1CC]/70",
    tagClass: "bg-[#FFC1CC]/15 text-[#c0536a] dark:text-[#FFC1CC]",
    dotClass: "bg-[#FFC1CC]",
    achievements: [
      "Refactored legacy services into Python microservices, reducing technical debt",
      "Built real-time data pipelines using Kafka for high-volume event stream processing",
      "Containerized tools with Docker & CI/CD, shortening deployment cycles by 30%",
    ],
    tech: ["Python", "Kafka", "Docker", "CI/CD", "Microservices"],
  },
];

function UnderConstructionOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md rounded-inherit" />
      <div
        className={cn(
          "relative z-10",
          "flex flex-col items-center gap-5 text-center",
          "px-10 py-10 rounded-3xl",
          "bg-background/50 backdrop-blur-xl",
          "border border-white/20 dark:border-white/10",
          "shadow-2xl shadow-black/20",
          "max-w-sm w-[90%]"
        )}
      >
        <div className="flex items-center gap-3">
          <HardHat className="h-6 w-6 text-primary" />
          <span className="text-xs font-bold tracking-widest uppercase text-primary">
            Under Construction
          </span>
          <HardHat className="h-6 w-6 text-primary" />
        </div>

        <p className="text-5xl select-none">😔</p>

        <div className="space-y-1.5">
          <p className="text-lg font-extrabold text-foreground">
            This section is being built
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sorry for the inconvenience — this section is getting a fresh coat of paint.
            Check back soon!
          </p>
        </div>

        <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary via-accent to-secondary animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ─────────────── DESKTOP: horizontal scroll-jack ─────────────── */
      mm.add("(min-width: 1024px)", () => {
        const section = sectionRef.current;
        const track = trackRef.current;
        const sticky = stickyRef.current;
        if (!section || !track || !sticky) return;

        /* Amount to travel = total track width minus one viewport width */
        const getDistance = () => track.scrollWidth - window.innerWidth;

        /* Main scroll-jacking timeline */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance() + 200}`,
            scrub: 1.2,
            pin: sticky,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              /* Progress bar */
              if (progressBarRef.current) {
                gsap.set(progressBarRef.current, {
                  scaleX: self.progress,
                  transformOrigin: "left center",
                });
              }
              /* Counter */
              if (counterRef.current) {
                const idx = Math.min(
                  Math.floor(self.progress * EXPERIENCES.length) + 1,
                  EXPERIENCES.length
                );
                counterRef.current.textContent = String(idx).padStart(2, "0");
              }
            },
          },
        });

        /* Slide the track */
        tl.to(track, {
          x: () => -getDistance(),
          ease: "none",
        });

        /* Clip-path reveal on each card as it enters view */
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          gsap.fromTo(
            card,
            { clipPath: "inset(0 100% 0 0 round 1.5rem)", opacity: 0 },
            {
              clipPath: "inset(0 0% 0 0 round 1.5rem)",
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: () => `top+=${i * (getDistance() / EXPERIENCES.length)} top`,
                end: () =>
                  `top+=${(i + 0.8) * (getDistance() / EXPERIENCES.length)} top`,
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        /* Parallax: role title drifts slightly slower than card */
        titleRefs.current.forEach((title) => {
          if (!title) return;
          gsap.fromTo(
            title,
            { y: 20 },
            {
              y: -20,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${getDistance()}`,
                scrub: 2,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        ScrollTrigger.refresh();
      });

      /* ─────────────── MOBILE: vertical stagger reveal ─────────────── */
      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          headingEl(),
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingEl(),
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        cardRefs.current.forEach((card) => {
          if (!card) return;
          gsap.fromTo(
            card,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headingEl = () =>
    sectionRef.current?.querySelector("[data-heading]") as HTMLElement;

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-label="Experience"
      className="relative"
    >
      {/* ───── DESKTOP: pinned sticky viewport ───── */}
      <div
        ref={stickyRef}
        className="hidden lg:flex flex-col w-full h-screen overflow-hidden relative"
      >
        {/* Top progress bar */}
        <div className="relative h-0.5 w-full bg-border overflow-hidden shrink-0">
          <div
            ref={progressBarRef}
            className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary origin-left scale-x-0"
          />
        </div>

        {/* Top info bar */}
        <div className="flex items-center justify-between px-12 pt-10 pb-4 shrink-0">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary flex items-center gap-2">
              <span className="w-6 h-px bg-primary" />
              Experience
            </p>
            <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-foreground mt-1">
              Where I&apos;ve{" "}
              <span className="text-primary">Worked</span>
            </h2>
          </div>

          <div className="flex items-center gap-8">
            {/* Counter */}
            <div className="text-right">
              <p className="text-5xl font-extrabold text-primary tabular-nums leading-none">
                <span ref={counterRef}>01</span>
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                / {String(EXPERIENCES.length).padStart(2, "0")}
              </p>
            </div>

            {/* Download Resume */}
            <Button
              variant="outline"
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all duration-200 hover:scale-105 group"
              asChild
            >
              <a href="/resume.pdf" download="sauel_almonte_resume.pdf">
                <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Resume
              </a>
            </Button>
          </div>
        </div>

        {/* Horizontal scrolling track */}
        <div className="flex-1 flex items-center overflow-hidden px-12 pb-8">
          <div
            ref={trackRef}
            className="flex gap-8 items-stretch will-change-transform"
            style={{ width: "max-content" }}
          >
            {EXPERIENCES.map((exp, i) => (
              <div
                key={exp.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                className={cn(
                  "relative flex flex-col justify-between",
                  "w-[min(680px,75vw)] h-full min-h-[420px]",
                  "rounded-3xl border bg-card p-10",
                  "transition-shadow duration-300 hover:shadow-2xl",
                  exp.borderClass
                )}
                style={{
                  background: `linear-gradient(135deg, var(--card) 60%, ${exp.accent}12)`,
                }}
              >
                {/* Top: ID + period */}
                <div className="flex items-start justify-between mb-6">
                  <span className="text-7xl font-black text-border/50 leading-none select-none">
                    {exp.id}
                  </span>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-1.5 justify-end text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {exp.period}
                    </div>
                    <div className="flex items-center gap-1.5 justify-end text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {exp.location}
                    </div>
                  </div>
                </div>

                {/* Role + Company */}
                <div className="space-y-1 mb-6">
                  <h3
                    ref={(el) => { titleRefs.current[i] = el; }}
                    className="text-2xl xl:text-3xl font-extrabold text-foreground leading-tight"
                  >
                    {exp.role}
                  </h3>
                  <p className="text-base font-semibold text-muted-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4 shrink-0" />
                    {exp.company}
                  </p>
                </div>

                {/* Achievements */}
                <ul className="space-y-3 flex-1 mb-6">
                  {exp.achievements.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                      <span
                        className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", exp.dotClass)}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        exp.tagClass
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Decorative corner accent */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-br-3xl rounded-tl-none rounded-3xl opacity-10 pointer-events-none"
                  style={{ background: `radial-gradient(circle at top right, ${exp.accent}, transparent 70%)` }}
                />
              </div>
            ))}

            {/* Final CTA card */}
            <div className="flex flex-col items-center justify-center w-[min(400px,60vw)] h-full min-h-[420px] rounded-3xl border border-dashed border-primary/40 bg-primary/5 p-10 gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowRight className="h-7 w-7 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-bold text-foreground">Want to see more?</p>
                <p className="text-sm text-muted-foreground">
                  Download my full resume for a complete picture of my experience.
                </p>
              </div>
              <Button
                size="lg"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 shadow-lg shadow-primary/25 hover:scale-105 transition-all duration-200 group"
                asChild
              >
                <a href="/resume.pdf" download="sauel_almonte_resume.pdf">
                  <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                  Download Resume
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop under construction overlay */}
        <UnderConstructionOverlay />
      </div>

      {/* ───── MOBILE: vertical timeline ───── */}
      <div className="lg:hidden py-24 px-4 sm:px-6 space-y-16 relative">
        {/* Heading */}
        <div data-heading className="text-center space-y-3">
          <SectionHeading
            label="Experience"
            title="Where I've Worked"
            subtitle="A track record built across startups, enterprise, and community organizations."
          />
          <div className="pt-4 flex justify-center">
            <Button
              variant="outline"
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all duration-200 hover:scale-105 group"
              asChild
            >
              <a href="/resume.pdf" download="sauel_almonte_resume.pdf">
                <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Download Resume
              </a>
            </Button>
          </div>
        </div>

        {/* Cards */}
        <div className="relative space-y-6">
          {/* Vertical timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-secondary opacity-30" />

          {EXPERIENCES.map((exp, i) => (
            <div
              key={exp.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={cn(
                "relative ml-12 rounded-2xl border bg-card p-6 transition-shadow duration-300",
                exp.borderClass
              )}
            >
              {/* Timeline dot */}
              <div
                className={cn(
                  "absolute -left-[2.85rem] top-6 w-3 h-3 rounded-full ring-4 ring-background",
                  exp.dotClass
                )}
              />

              <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-foreground leading-tight">
                    {exp.role}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="h-3.5 w-3.5 shrink-0" />
                    {exp.company}
                  </p>
                </div>
                <span className="text-3xl font-black text-border/40 leading-none">
                  {exp.id}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />{exp.period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />{exp.location}
                </span>
              </div>

              <ul className="space-y-2.5 mb-4">
                {exp.achievements.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                    <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", exp.dotClass)} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {exp.tech.map((tag) => (
                  <span key={tag} className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", exp.tagClass)}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile under construction overlay */}
        <UnderConstructionOverlay />
      </div>

    </section>
  );
}
