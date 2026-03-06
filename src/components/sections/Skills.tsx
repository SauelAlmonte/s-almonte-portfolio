"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Code2, BrainCircuit, Cloud } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";
import { type ProjectCategory } from "@/config/projects";

gsap.registerPlugin(ScrollTrigger);

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

const SKILL_CARDS: SkillCard[] = [
  {
    category: "fullstack",
    icon: Code2,
    title: "Full-Stack Web Dev",
    subtitle: "Building end-to-end web experiences",
    accent: "#A8DADC",
    accentLight: "#2b7a78",
    accentClass: "text-[#2b7a78] dark:text-[#A8DADC]",
    borderClass:
      "border-[#A8DADC]/30 hover:border-[#A8DADC]/80 hover:shadow-[#A8DADC]/10",
    barClass: "bg-[#A8DADC]",
    glowClass: "group-hover:shadow-[0_8px_40px_rgba(168,218,220,0.2)]",
    skills: [
      { name: "Next.js / React", proficiency: 90 },
      { name: "JavaScript / TypeScript", proficiency: 88 },
      { name: "CSS / Tailwind CSS", proficiency: 85 },
      { name: "HTML / Accessibility", proficiency: 82 },
    ],
  },
  {
    category: "backend",
    icon: BrainCircuit,
    title: "Backend & AI Engineering",
    subtitle: "APIs, ML pipelines & AI automation",
    accent: "#B39CD0",
    accentLight: "#5a4a7a",
    accentClass: "text-[#5a4a7a] dark:text-[#B39CD0]",
    borderClass:
      "border-[#B39CD0]/30 hover:border-[#B39CD0]/80 hover:shadow-[#B39CD0]/10",
    barClass: "bg-[#B39CD0]",
    glowClass: "group-hover:shadow-[0_8px_40px_rgba(179,156,208,0.2)]",
    skills: [
      { name: "Python", proficiency: 82 },
      { name: "Node.js / Express", proficiency: 78 },
      { name: "GPT-4 / LangChain", proficiency: 75 },
      { name: "Java / C++", proficiency: 65 },
    ],
  },
  {
    category: "cloud",
    icon: Cloud,
    title: "Cloud & DevOps",
    subtitle: "Infrastructure built for scale",
    accent: "#FFC1CC",
    accentLight: "#b84a5f",
    accentClass: "text-[#b84a5f] dark:text-[#FFC1CC]",
    borderClass:
      "border-[#FFC1CC]/30 hover:border-[#FFC1CC]/80 hover:shadow-[#FFC1CC]/10",
    barClass: "bg-[#FFC1CC]",
    glowClass: "group-hover:shadow-[0_8px_40px_rgba(255,193,204,0.2)]",
    skills: [
      { name: "Docker / Containers", proficiency: 78 },
      { name: "AWS", proficiency: 72 },
      { name: "CI/CD Pipelines", proficiency: 70 },
      { name: "PostgreSQL / MongoDB", proficiency: 80 },
    ],
  },
];

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLDivElement | null)[][]>([[], [], []]);
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Heading */
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

      /* Cards stagger in */
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

      /* Skill bars animate width on scroll */
      cardRefs.current.forEach((card, cardIdx) => {
        if (!card) return;
        const bars = barRefs.current[cardIdx];
        bars.forEach((bar, barIdx) => {
          if (!bar) return;
          const target = SKILL_CARDS[cardIdx].skills[barIdx].proficiency;
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
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-label="Skills and Projects"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background accents */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-[#B39CD0]/10 blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full bg-[#FFC1CC]/10 blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Heading */}
        <div ref={headingRef} className="opacity-0">
          <SectionHeading
            label="Skills & Projects"
            title="What I Build"
            subtitle="Click any card to explore projects in that stack."
          />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SKILL_CARDS.map((card, cardIdx) => (
            <div
              key={card.category}
              ref={(el) => { cardRefs.current[cardIdx] = el; }}
              role="button"
              tabIndex={0}
              aria-label={`Explore ${card.title} projects`}
              onClick={() => router.push(`/skills/${card.category}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  router.push(`/skills/${card.category}`);
              }}
              className={cn(
                "group relative flex flex-col gap-6 p-7 rounded-3xl border bg-card",
                "transition-all duration-300 shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                card.borderClass,
                card.glowClass
              )}
            >
              {/* Top: icon + arrow */}
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

              {/* Title + subtitle */}
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-foreground leading-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground">{card.subtitle}</p>
              </div>

              {/* Skill bars */}
              <div className="space-y-4 flex-1">
                {card.skills.map((skill, barIdx) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground/80">
                        {skill.name}
                      </span>
                      <span className={cn("text-xs font-bold", card.accentClass)}>
                        {skill.proficiency}%
                      </span>
                    </div>
                    {/* Track */}
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

              {/* Footer CTA */}
              <div
                className={cn(
                  "flex items-center gap-2 text-sm font-semibold pt-2 border-t border-border/50 transition-colors duration-200",
                  card.accentClass
                )}
              >
                <span>Explore Projects</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              {/* Hover gradient overlay */}
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
