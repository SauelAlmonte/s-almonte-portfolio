import { ExternalLink, Github, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ProjectData, CATEGORY_META } from "@/config/projects";

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const meta = CATEGORY_META[project.category];

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-card overflow-hidden",
        "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        meta.borderClass,
        project.comingSoon && "opacity-70"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image / gradient area */}
      <div
        className={cn(
          "relative h-44 bg-linear-to-br flex items-center justify-center overflow-hidden",
          project.imageGradient
        )}
      >
        {project.comingSoon && (
          <div className="absolute inset-0 bg-background/40 backdrop-blur-sm flex items-center justify-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground tracking-wide">
              Coming Soon
            </span>
          </div>
        )}

        {project.featured && !project.comingSoon && (
          <span
            className={cn(
              "absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold",
              meta.tagClass
            )}
          >
            Featured
          </span>
        )}

        {/* Decorative initials */}
        <span className="text-5xl font-black text-white/10 select-none tracking-tighter">
          {project.title
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="space-y-1.5 flex-1">
          <h3 className="font-bold text-foreground text-lg leading-snug group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tag) => (
            <span
              key={tag}
              className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold", meta.tagClass)}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        {!project.comingSoon && (
          <div className="flex gap-2 pt-1">
            {project.liveUrl && (
              <Button
                size="sm"
                className={cn(
                  "flex-1 rounded-full text-xs font-semibold",
                  "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                asChild
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.repoUrl && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 rounded-full text-xs font-semibold border-border hover:border-primary hover:text-primary"
                asChild
              >
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-1.5 h-3.5 w-3.5" />
                  Code
                </a>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Accent bottom bar */}
      <div
        className="h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
        style={{ background: meta.accent }}
      />
    </div>
  );
}
