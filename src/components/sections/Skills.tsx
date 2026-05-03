"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Code2, BrainCircuit, Cloud } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";
import { CATEGORY_META, type ProjectCategory } from "@/config/projects";
import { SKILL_SECTION_SUBTITLE } from "@/config/skills";

gsap.registerPlugin(ScrollTrigger);

export type SkillsSectionProps = {
  skillsByCategory: Record<
    ProjectCategory,
    Array<{ name: string; proficiency: number }>
  >;
};

interface Skill {
  name: string;
  proficiency: number;
}

interface SkillCard {
  category: ProjectCategory;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  accent: string;
  accentLight: string;
  accentClass: string;
  borderClass: string;
  barClass: string;
  glowClass: string;
  skills: Skill[];
}

/** Presentation only (icons + accents); skill rows come from CMS or defaults. */
const SKILL_CARD_SHELL: Omit<SkillCard, "skills" | "title" | "subtitle">[] = (
  [
    {
      category: "fullstack",
      icon: Code2,
      accentLight: "#2b7a78",
      borderClass:
        "border-[#A8DADC]/30 hover:border-[#A8DADC]/80 hover:shadow-[#A8DADC]/10",
      glowClass: "group-hover:shadow-[0_8px_40px_rgba(168,218,220,0.2)]",
    },
    {
      category: "backend",
      icon: BrainCircuit,
      accentLight: "#5a4a7a",
      borderClass:
        "border-[#B39CD0]/30 hover:border-[#B39CD0]/80 hover:shadow-[#B39CD0]/10",
      glowClass: "group-hover:shadow-[0_8px_40px_rgba(179,156,208,0.2)]",
    },
    {
      category: "cloud",
      icon: Cloud,
      accentLight: "#b84a5f",
      borderClass:
        "border-[#FFC1CC]/30 hover:border-[#FFC1CC]/80 hover:shadow-[#FFC1CC]/10",
      glowClass: "group-hover:shadow-[0_8px_40px_rgba(255,193,204,0.2)]",
    },
  ] as const
).map(({ category, icon, accentLight, borderClass, glowClass }) => ({
  category,
  icon,
  accent: CATEGORY_META[category].accent,
  accentLight,
  accentClass: CATEGORY_META[category].skillAccentClass,
  borderClass,
  barClass: CATEGORY_META[category].dotClass,
  glowClass,
}));

function buildSkillCards(
  skillsByCategory: SkillsSectionProps["skillsByCategory"]
): SkillCard[] {
  return SKILL_CARD_SHELL.map((shell) => ({
    ...shell,
    title: CATEGORY_META[shell.category].label,
    subtitle: SKILL_SECTION_SUBTITLE[shell.category],
    skills: skillsByCategory[shell.category] ?? [],
  }));
}

export function Skills({ skillsByCategory }: SkillsSectionProps) {
  const cards = useMemo(() => buildSkillCards(skillsByCategory), [skillsByCategory]);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLDivElement | null)[][]>([[], [], []]);
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 70, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: cardRefs.current[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      cardRefs.current.forEach((card, cardIdx) => {
        if (!card) return;
        const bars = barRefs.current[cardIdx];
        const cardSkills = cards[cardIdx]?.skills ?? [];
        bars.forEach((bar, barIdx) => {
          if (!bar) return;
          const target = cardSkills[barIdx]?.proficiency ?? 0;
          gsap.fromTo(
            bar,
            { width: "0%" },
            {
              width: `${target}%`,
              duration: 1.2,
              ease: "power2.out",
              delay: barIdx * 0.1,
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [cards]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-label="Skills and Projects"
      className="relative py-fl-section px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-[#B39CD0]/10 blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full bg-[#FFC1CC]/10 blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-fl-y-lg">
        <div ref={headingRef} className="opacity-0">
          <SectionHeading
            label="Skills & Projects"
            title="What I Build"
            subtitle="Click any card to explore projects in that stack."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-6 xl:gap-8">
          {cards.map((card, cardIdx) => (
            <div
              key={card.category}
              ref={(el) => { cardRefs.current[cardIdx] = el; }}
              role="button"
              tabIndex={0}
              aria-label={`Explore ${card.title} projects`}
              onClick={() => router.push(`/skills/${card.category}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/skills/${card.category}`);
                }
              }}
              className={cn(
                "group relative flex cursor-pointer flex-col gap-5 rounded-3xl border bg-card p-5 sm:gap-6 sm:p-6 xl:p-7",
                "transition-all duration-300 shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                card.borderClass,
                card.glowClass
              )}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div
                    className="absolute inset-0 rounded-2xl dark:hidden"
                    style={{
                      background: `color-mix(in srgb, ${card.accentLight} 18%, transparent)`,
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-2xl hidden dark:block"
                    style={{
                      background: `color-mix(in srgb, ${card.accent} 20%, transparent)`,
                    }}
                  />
                  <card.icon
                    className={cn("h-6 w-6 relative z-10", card.accentClass)}
                  />
                </div>
                <ArrowUpRight
                  className={cn(
                    "h-5 w-5 transition-all duration-300 opacity-40",
                    "group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                    card.accentClass
                  )}
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold leading-tight text-foreground">
                  {card.title}
                </h3>
                <p className="text-sm leading-snug text-muted-foreground">{card.subtitle}</p>
              </div>

              <div className="flex-1 space-y-4">
                {card.skills.map((skill, barIdx) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex min-w-0 items-baseline justify-between gap-2 sm:gap-3">
                      <span className="min-w-0 flex-1 break-words text-xs font-semibold text-foreground/80">
                        {skill.name}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 text-xs font-bold tabular-nums",
                          card.accentClass
                        )}
                      >
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                      <div
                        ref={(el) => { barRefs.current[cardIdx][barIdx] = el; }}
                        className={cn("h-full rounded-full", card.barClass)}
                        style={{ width: "0%" }}
                        role="progressbar"
                        aria-valuenow={skill.proficiency}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${skill.name} proficiency`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className={cn(
                  "flex items-center gap-2 text-sm font-semibold pt-2 border-t border-border/50 transition-colors duration-200",
                  card.accentClass
                )}
              >
                <span>Explore Projects</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at top left, ${card.accent}0D, transparent 70%)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
