"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useScrolled } from "@/hooks/useScrolled";
import { useActiveSection } from "@/hooks/useActiveSection";
import { onHeroSettled } from "@/lib/heroSettle";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

// Run the entrance setup before paint so the header never flashes in before
// the globe-gated reveal; falls back to useEffect during SSR (no window).
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SECTION_IDS = siteConfig.nav.map((item) => item.href.replace("#", ""));

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const scrolled = useScrolled();
  const activeSection = useActiveSection(SECTION_IDS);

  /* Entrance. On the home hero at tablet+, the header holds until the globe
     settles, then glides down as one unit on a smooth ease. Mobile, or any page
     without the globe, reveals it right away; reduced motion shows it instantly.
     The hidden state is set in a layout effect so it never flashes in during
     the wait. */
  useIsoLayoutEffect(() => {
    const node = navRef.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(node, { yPercent: 0, opacity: 1 });
      return;
    }

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const isHome = window.location.pathname === "/";

    gsap.set(node, { yPercent: -100, opacity: 0 });

    let played = false;
    const reveal = () => {
      if (played) return;
      played = true;
      gsap.to(node, {
        yPercent: 0,
        opacity: 1,
        duration: 0.85,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    };

    if (isHome && isDesktop) {
      const off = onHeroSettled(reveal); // fires immediately if already settled
      const fallback = window.setTimeout(reveal, 3200); // safety if settle never fires
      return () => {
        off();
        clearTimeout(fallback);
        gsap.killTweensOf(node);
      };
    }

    reveal();
    return () => gsap.killTweensOf(node);
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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#A8DADC] focus:px-4 focus:py-2 focus:font-medium focus:text-[#06232b]"
      >
        Skip to content
      </a>

      <header
        ref={navRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
          scrolled
            ? "border-white/10 bg-[#080711]/80 shadow-[0_10px_30px_-16px_rgba(0,0,0,0.85)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          {/* Logo: 3D monogram chip */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavClick("#home")}
              aria-label="Go to top"
              className="group/logo flex cursor-pointer items-center gap-2.5 focus:outline-none"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-[linear-gradient(160deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02)_55%,rgba(0,0,0,0.25))] text-sm font-bold tracking-tight shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.22),0_4px_12px_-4px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover/logo:-translate-y-0.5">
                <span className="text-[#A8DADC]">S</span>
                <span className="text-[#ECECF2]">A</span>
              </span>
            </button>

            {/* Secret admin entry — only visible on hover/focus */}
            <button
              onClick={() => router.push("/admin/login")}
              aria-label="Admin login"
              title="Admin"
              className="cursor-pointer rounded-md p-1 text-[#6f6f80] opacity-0 transition-opacity duration-200 hover:bg-white/5 hover:text-[#A8DADC] hover:opacity-100 focus:opacity-100"
            >
              <Lock className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-0.5 md:flex" role="list">
            {siteConfig.nav.map((item) => {
              const id = item.href.replace("#", "");
              const isActive = activeSection === id;

              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavClick(item.href)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group/nav relative cursor-pointer rounded-full px-3.5 py-2 text-sm font-medium tracking-tight transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8DADC]/60",
                      isActive ? "text-[#A8DADC]" : "text-[#9b9baa] hover:text-[#ECECF2]",
                    )}
                  >
                    {item.label}
                    {/* animated underline: grows from centre on hover, full when active */}
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute inset-x-3.5 bottom-1 h-px origin-center rounded-full transition-transform duration-300 ease-out",
                        isActive
                          ? "scale-x-100 bg-[#A8DADC]"
                          : "scale-x-0 bg-[#ECECF2]/40 group-hover/nav:scale-x-100",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right side: theme toggle + mobile menu */}
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <MobileMenu navItems={siteConfig.nav} activeSection={activeSection} />
          </div>
        </nav>
      </header>
    </>
  );
}
