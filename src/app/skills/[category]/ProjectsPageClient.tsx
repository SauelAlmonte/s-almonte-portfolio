"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, Code2, BrainCircuit, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/common/ProjectCard";
import { cn } from "@/lib/utils";
import { CATEGORY_META, type ProjectCategory, type ProjectData } from "@/config/projects";

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_ICONS: Record<ProjectCategory, React.ElementType> = {
  fullstack: Code2,
  backend: BrainCircuit,
  cloud: Cloud,
};

interface ProjectsPageClientProps {
  category: ProjectCategory;
  projects: ProjectData[];
  meta: (typeof CATEGORY_META)[ProjectCategory];
}

export function ProjectsPageClient({ category, projects, meta }: ProjectsPageClientProps) {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const Icon = CATEGORY_ICONS[category];

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Header entrance */
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );

      /* Cards stagger */
      if (gridRef.current?.children) {
        gsap.fromTo(
          Array.from(gridRef.current.children),
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.12,
            delay: 0.3,
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      {/* Header */}
      <div
        ref={headerRef}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `${meta.accent}25` }}
            >
              <Icon className="h-4 w-4" style={{ color: meta.accent }} />
            </div>
            <span className="text-sm font-semibold text-foreground">{meta.label}</span>
          </div>
        </div>
      </div>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Hero heading */}
        <div className="space-y-4">
          <p
            className="text-xs font-bold tracking-widest uppercase flex items-center gap-2"
            style={{ color: meta.accent }}
          >
            <span className="w-6 h-px inline-block" style={{ background: meta.accent }} />
            {meta.label}
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {meta.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {meta.description}
          </p>

          {/* Accent divider */}
          <div
            className="h-1 w-20 rounded-full"
            style={{
              background: `linear-gradient(to right, ${meta.accent}, transparent)`,
            }}
          />
        </div>

        {/* Projects grid */}
        {projects.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-4 py-24 rounded-3xl border border-dashed",
              meta.borderClass
            )}
          >
            <span className="text-5xl">🚧</span>
            <p className="text-lg font-bold text-foreground">No projects yet</p>
            <p className="text-sm text-muted-foreground">Check back soon!</p>
          </div>
        )}

        {/* More coming soon note */}
        {projects.some((p) => p.comingSoon) && (
          <div
            className="flex items-center gap-3 p-4 rounded-2xl border"
            style={{ borderColor: `${meta.accent}40`, background: `${meta.accent}08` }}
          >
            <span className="text-xl">✨</span>
            <p className="text-sm text-muted-foreground">
              More projects are actively being built and will appear here soon.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
