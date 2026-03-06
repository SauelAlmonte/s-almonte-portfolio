"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useScrolled } from "@/hooks/useScrolled";
import { useActiveSection } from "@/hooks/useActiveSection";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

const SECTION_IDS = siteConfig.nav.map((item) => item.href.replace("#", ""));

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const scrolled = useScrolled();
  const activeSection = useActiveSection(SECTION_IDS);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  const handleNavClick = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-medium"
      >
        Skip to content
      </a>

      <header
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-transparent"
        )}
      >
        <nav
          aria-label="Main navigation"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        >
          {/* Logo */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleNavClick("#home")}
              aria-label="Go to top"
              className="group/logo flex items-center gap-2 focus:outline-none"
            >
              <span className="text-xl font-bold tracking-tight">
                <span className="text-primary">S</span>
                <span className="text-foreground">A</span>
              </span>
              <span className="hidden sm:block text-sm font-medium text-muted-foreground group-hover/logo:text-foreground transition-colors">
                Sauel Almonte
              </span>
            </button>

            {/* Secret admin entry — only visible when hovering the lock itself */}
            <button
              onClick={() => router.push("/admin/login")}
              aria-label="Admin login"
              title="Admin"
              className="opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity duration-200 p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Lock className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {siteConfig.nav.map((item) => {
              const id = item.href.replace("#", "");
              const isActive = activeSection === id;

              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                      "hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right side: theme toggle + mobile menu */}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <MobileMenu navItems={siteConfig.nav} activeSection={activeSection} />
          </div>
        </nav>
      </header>
    </>
  );
}
