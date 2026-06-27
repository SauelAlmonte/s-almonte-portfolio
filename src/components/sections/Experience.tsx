"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "@/lib/scroll/gsap";
import { MapPin, Calendar, Download, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";
import type { LandingExperienceCard, LandingResumePdfChoice } from "@/config/experience";
import { ResumeDownloadChoiceModal } from "@/components/resume/ResumeDownloadChoiceModal";

export type ExperienceSectionProps = {
  experiences: LandingExperienceCard[];
  pdfChoices: LandingResumePdfChoice[];
};

export function Experience({ experiences, pdfChoices }: ExperienceSectionProps) {
  const experienceList = useMemo(() => experiences, [experiences]);

  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const headingEl = () =>
    sectionRef.current?.querySelector("[data-heading]") as HTMLElement | null;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const h = headingEl();
      if (h) {
        if (reduceMotion) {
          gsap.set(h, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            h,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: h,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      cardRefs.current.forEach((card) => {
        if (!card) return;
        if (reduceMotion) {
          gsap.set(card, { opacity: 1, y: 0 });
        } else {
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
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [experienceList]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-label="Experience"
      className="relative py-fl-section px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto space-y-fl-y-tight">
        <div data-heading className="text-center lg:text-left">
          <SectionHeading
            label="Experience"
            title="Where I've Worked"
            subtitle="A track record built across startups, enterprise, and community organizations."
          />
        </div>

        {/*
          Timeline: shared rail (--exp-rail) + main spine for all breakpoints.
          Left column (lg): dots align to main spine via --dot-pull.
          Right column (lg): gutter spine centered in --grid-gap + dot (scales with any row count).
        */}
        <div
          className={cn(
            "flex gap-3 sm:gap-4",
            "[--exp-rail:2.75rem] [--dot-pull:calc(var(--exp-rail)/2+0.75rem)] sm:[--dot-pull:calc(var(--exp-rail)/2+1rem)]",
            "[--grid-gap:1.5rem] lg:[--grid-gap:2rem]"
          )}
        >
          <div
            aria-hidden="true"
            className="relative shrink-0 self-stretch"
            style={{ width: "var(--exp-rail)" }}
          >
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-cat-fullstack via-cat-backend to-cat-cloud opacity-30" />
          </div>

          <div className="grid min-w-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {experienceList.map((exp, i) => {
              const isRightColDesktop = i % 2 === 1;
              return (
                <div
                  key={`${exp.id}-${exp.role}-${i}`}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={cn(
                    "relative rounded-2xl border bg-card p-6 transition-shadow duration-300 lg:p-8",
                    exp.borderClass
                  )}
                >
                  {isRightColDesktop ? (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-[calc(-0.5*var(--grid-gap))] top-8 bottom-8 hidden w-px -translate-x-1/2 opacity-90 lg:block"
                      style={{
                        background: `linear-gradient(to bottom, color-mix(in srgb, ${exp.accent} 70%, transparent), color-mix(in srgb, ${exp.accent} 40%, transparent), transparent)`,
                      }}
                    />
                  ) : null}

                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute top-6 z-[1] h-3 w-3 rounded-full ring-4 ring-background",
                      "left-[calc(-1*var(--dot-pull))]",
                      isRightColDesktop &&
                        "lg:left-[calc(-0.5*var(--grid-gap))] lg:-translate-x-1/2",
                      exp.dotClass
                    )}
                  />

                  <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-3 text-lg font-extrabold leading-tight text-foreground lg:text-xl">
                        {exp.role}
                      </h3>
                      <div className="space-y-1">
                        <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                          <Briefcase className="h-3.5 w-3.5 shrink-0" />
                          {exp.company}
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            {exp.period}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {exp.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className="text-3xl font-black leading-none tabular-nums opacity-50"
                      style={{ color: exp.accent }}
                    >
                      {exp.id}
                    </span>
                  </div>

                  <ul className="space-y-2.5 mb-4">
                    {exp.achievements.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
                      >
                        <span
                          className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", exp.dotClass)}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((tag) => (
                      <span
                        key={tag}
                        className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", exp.tagClass)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            <div
              ref={(el) => {
                cardRefs.current[experienceList.length] = el;
              }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-8 text-center gap-4 lg:col-span-2 lg:p-10 lg:gap-5"
            >
              <div className="space-y-2 max-w-md">
                <p className="text-xl font-bold text-foreground">Want to see more?</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Download my full resume for a complete picture of my experience.
                </p>
              </div>
              <ResumeDownloadChoiceModal choices={pdfChoices}>
                <Button
                  size="lg"
                  type="button"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 shadow-lg shadow-primary/25 hover:scale-105 transition-all duration-200 group cursor-pointer"
                >
                  <Download className="mr-2 h-4 w-4 motion-safe:group-hover:animate-bounce" />
                  Download Resume
                </Button>
              </ResumeDownloadChoiceModal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
