import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  label,
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-3",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary">
        <span className="w-6 h-px bg-primary" />
        {label}
        <span className="w-6 h-px bg-primary" />
      </p>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
