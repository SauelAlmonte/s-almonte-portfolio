"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { m } from "motion/react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/scroll/gsap";
import { siteConfig } from "@/config/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { onHeroSettled } from "@/lib/heroSettle";
import { useScrollTo } from "@/components/common/ScrollProvider";
import { MobileMenu } from "./MobileMenu";

const SECTION_IDS = siteConfig.nav.map((item) => item.href.replace("#", ""));
// Desktop links drop "Contact" — the "Get in touch" CTA is the single path there.
const NAV_LINKS = siteConfig.nav.filter((item) => item.href !== "#contact");

// Run entrance setup before paint so the header never flashes in before the
// globe-gated reveal; falls back to useEffect during SSR (no window).
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Width of the gliding active-link indicator (px). Constant width so it can
// move on `x` alone — pure transform, no width/scale artifacts on its glow.
const INDICATOR_W = 20;

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const activeSection = useActiveSection(SECTION_IDS);
  const scrollTo = useScrollTo();

  /* Gliding scroll-spy indicator: a small glow bar that slides to sit under
     the active link (Motion spring on `x` only). Hidden when the section in
     view has no desktop link (e.g. #contact, which lives in the CTA). */
  const linkRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ x: 0, visible: false });
  useEffect(() => {
    const measure = () => {
      const btn = linkRefs.current[activeSection];
      if (!btn) {
        setIndicator((cur) => ({ ...cur, visible: false }));
        return;
      }
      // offsetLeft is relative to the positioned <ul>, where the bar lives.
      setIndicator({
        x: btn.offsetLeft + btn.offsetWidth / 2 - INDICATOR_W / 2,
        visible: true,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeSection]);

  /* Entrance. On the home hero (every size) the header holds until the globe
     settles, then glides down as one unit on a smooth ease — landing right after
     the dots and just before the copy cascades. Other pages (no globe) reveal it
     right away; reduced motion shows it instantly. The hidden state is set in a
     layout effect so it never flashes in during the wait. */
  useIsoLayoutEffect(() => {
    const node = navRef.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(node, { yPercent: 0, opacity: 1 });
      return;
    }

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

    if (isHome) {
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

  // In-page navigation rides the shared Lenis instance (native scrollIntoView
  // would fight its smoothing); falls back gracefully when Lenis is absent.
  const handleNavClick = (href: string) => scrollTo(href);

  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-medium focus:text-accent-ink"
      >
        Skip to content
      </a>

      <header ref={navRef} className="fixed inset-x-0 top-3 z-50 px-4 sm:top-4">
        <nav
          aria-label="Main navigation"
          className="nav-pill relative isolate mx-auto flex w-full items-center justify-between gap-2 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015)),color-mix(in_srgb,var(--surface)_55%,transparent)] px-3 py-2.5 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.14),inset_0_-1px_1px_rgba(0,0,0,0.5),0_20px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl md:w-fit"
        >
          {/* grain texture on the glass */}
          <span aria-hidden className="nav-grain" />

          {/* Brand: real 3D monogram chip + hover-revealed admin lock */}
          <div className="group/brand relative z-10 flex items-center gap-1">
            <button
              onClick={() => handleNavClick("#home")}
              aria-label="Go to top"
              className="group/logo flex cursor-pointer items-center focus:outline-none"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-[linear-gradient(160deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))] text-sm font-bold text-primary shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.22),0_4px_12px_-4px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover/logo:-translate-y-0.5">
                {/* ink-centered SA (caps sit high in the line box) */}
                <span className="block leading-none [text-indent:0.5px] [transform:translateY(-0.01em)]">SA</span>
              </span>
            </button>

            {/* Secret admin entry — reveals on brand hover/focus, action unchanged */}
            <button
              onClick={() => router.push("/admin/login")}
              aria-label="Admin login"
              title="Admin"
              className="cursor-pointer rounded-md p-1 text-ink-faint opacity-0 transition-all duration-200 hover:bg-white/5 hover:text-primary focus:opacity-100 group-hover/brand:opacity-100"
            >
              <Lock className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Desktop links — flip vertically on hover, no pills */}
          <ul className="relative z-10 hidden items-center gap-0.5 md:flex" role="list">
            {/* Gliding active indicator — moves on transform only. */}
            <li role="presentation" aria-hidden className="pointer-events-none">
              <m.span
                initial={false}
                animate={{ x: indicator.x, opacity: indicator.visible ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                style={{ width: INDICATOR_W }}
                className="absolute bottom-[3px] left-0 h-[2px] rounded-full bg-primary shadow-[0_0_10px_color-mix(in_srgb,var(--primary)_85%,transparent)]"
              />
            </li>
            {NAV_LINKS.map((item) => {
              const id = item.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <li key={item.href}>
                  <button
                    ref={(el) => {
                      linkRefs.current[id] = el;
                    }}
                    onClick={() => handleNavClick(item.href)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group/flip cursor-pointer rounded-full py-2 pl-[0.35rem] pr-3 text-sm font-medium tracking-tight transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                      isActive ? "text-ink" : "text-ink-secondary hover:text-ink",
                    )}
                  >
                    <span className="block h-[1.3em] overflow-hidden">
                      <span className="block transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/flip:-translate-y-1/2">
                        <span className="block h-[1.3em] leading-[1.3em]">{item.label}</span>
                        <span className="block h-[1.3em] leading-[1.3em] text-primary">{item.label}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right: Get in touch CTA (desktop), mobile menu. The landing is
              dark-only, so the theme toggle now lives only in /admin. */}
          <div className="relative z-10 flex items-center gap-1.5">
            <button
              onClick={() => handleNavClick("#contact")}
              className="cta-dome hidden h-9 cursor-pointer items-center rounded-full px-4 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-stage md:inline-flex"
            >
              Get in touch
            </button>
            <MobileMenu navItems={NAV_LINKS} activeSection={activeSection} />
          </div>
        </nav>
      </header>
    </>
  );
}
