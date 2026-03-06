import { ArrowUp } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          © {year}{" "}
          <span className="text-foreground font-medium">Sauel Almonte</span>
          . All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <p className="hidden sm:block text-xs text-muted-foreground">
            Built with{" "}
            <span className="text-primary font-medium">Next.js</span>
            {" & "}
            <span className="text-accent font-medium">passion</span>
          </p>

          <a
            href="#home"
            aria-label="Back to top"
            className="w-8 h-8 rounded-full border border-foreground/25 dark:border-border shadow-sm shadow-foreground/10 flex items-center justify-center text-[#2b7a78] dark:text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 hover:shadow-md hover:shadow-foreground/15 transition-all duration-200 hover:scale-110"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
