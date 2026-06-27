"use client";

import { useState } from "react";
import {
  Menu,
  X,
  ChevronRight,
  Home,
  User,
  Briefcase,
  Layers,
  Mail,
  Github,
  Linkedin,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { m } from "motion/react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SocialLink, type SocialLinkItem } from "@/components/common/SocialLink";
import { useLenis, useScrollTo } from "@/components/common/ScrollProvider";
import { YOUTUBE_CHANNEL_URL } from "@/config/site";
import { BRAND } from "@/config/tokens";
import { NavItem } from "@/types";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  navItems: readonly NavItem[];
  activeSection: string;
}

// One line icon per section, keyed by anchor.
const NAV_ICONS: Record<string, LucideIcon> = {
  "#home": Home,
  "#about": User,
  "#experience": Briefcase,
  "#skills": Layers,
  "#contact": Mail,
};

const SOCIALS: SocialLinkItem[] = [
  { label: "GitHub", href: "https://github.com/SauelAlmonte", icon: Github, accent: BRAND.fullstack },
  { label: "LinkedIn", href: "https://linkedin.com/in/sauel-almonte", icon: Linkedin, accent: BRAND.backend },
  { label: "YouTube", href: YOUTUBE_CHANNEL_URL, icon: Youtube, accent: BRAND.cloud },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.14 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: 22 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

export function MobileMenu({ navItems, activeSection }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const scrollTo = useScrollTo();

  /* Radix locks body scroll while the sheet is open; Lenis must also stop so
     wheel/touch momentum doesn't keep gliding the page under the overlay.
     Routed through one handler so ESC / outside-click / link clicks all
     restart Lenis the same way. */
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) lenis?.stop();
    else lenis?.start();
  };

  const go = (href: string) => {
    handleOpenChange(false); // restart Lenis before asking it to scroll
    scrollTo(href);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button
          aria-label="Open navigation menu"
          className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/4 text-ink transition-colors duration-200 hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 md:hidden"
        >
          {/* Quarter-turn while the glyph swaps reads as a hamburger↔close morph. */}
          <m.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="grid place-items-center"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </m.span>
        </button>
      </SheetTrigger>

      {/* Glass panel: translucent + heavy blur so the hero reads through it. */}
      <SheetContent
        side="right"
        showCloseButton={false}
        aria-describedby={undefined} // nav links are self-describing; silences Radix's missing-Description warning
        className="flex w-[86vw] max-w-84 flex-col gap-0 overflow-hidden border-l border-white/10 bg-stage/45 p-0 text-ink shadow-[-24px_0_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:max-w-84"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        {/* faint instrument grid, masked toward the glowing corner */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[linear-gradient(color-mix(in_srgb,var(--primary)_70%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--primary)_70%,transparent)_1px,transparent_1px)] bg-size-[36px_36px] mask-[radial-gradient(120%_90%_at_100%_0%,black,transparent_75%)]"
        />

        {/* top sheen + faint corner accent (the only glow, kept restrained) */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_70%)]"
        />

        {/* Minimal header — just a close affordance, like the reference's clean top. */}
        <m.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-center justify-between px-6 pt-6"
        >
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-ink-muted">Menu</span>
          <button
            onClick={() => handleOpenChange(false)}
            aria-label="Close navigation menu"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/4 text-ink-secondary transition-colors duration-200 hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </m.div>

        {/* Nav list — icon + label rows, generous spacing, hairline dividers. */}
        <m.nav
          variants={listVariants}
          initial="hidden"
          animate="show"
          aria-label="Mobile navigation"
          className="mt-6 flex flex-1 flex-col px-6"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            const Icon = NAV_ICONS[item.href] ?? ChevronRight;
            return (
              <m.button
                key={item.href}
                variants={itemVariants}
                onClick={() => go(item.href)}
                whileTap={{ scale: 0.99 }}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex w-full cursor-pointer items-center gap-4 border-b border-white/[0.07] py-4.5 text-left transition-colors duration-200 last:border-b-0",
                  isActive ? "text-primary" : "text-ink",
                )}
              >
                <Icon
                  className={cn(
                    "h-6.5 w-6.5 shrink-0 transition-colors duration-200",
                    isActive ? "text-primary" : "text-ink-muted group-hover:text-ink",
                  )}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="text-[clamp(1.05rem,4.4vw,1.2rem)] font-medium tracking-tight">
                  {item.label}
                </span>
                <ChevronRight
                  className={cn(
                    "ml-auto h-4 w-4 shrink-0 transition-all duration-200",
                    isActive
                      ? "translate-x-0 text-primary opacity-100"
                      : "-translate-x-1.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-50",
                  )}
                  aria-hidden
                />
              </m.button>
            );
          })}
        </m.nav>

        {/* Footer: socials + CTA, sitting on the glass. */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
          className="mt-auto border-t border-white/10 px-6 pb-7 pt-5"
        >
          <p className="text-xs font-medium tracking-wide text-ink-muted">Connect</p>
          <div className="mt-3 flex items-center gap-2.5">
            {SOCIALS.map((item) => (
              <SocialLink key={item.label} item={item} tone="dark" size={40} />
            ))}
          </div>
          <button
            onClick={() => go("#contact")}
            className="cta-dome mt-5 flex h-12 w-full cursor-pointer items-center justify-center rounded-full text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-stage"
          >
            Get in touch
          </button>
        </m.div>
      </SheetContent>
    </Sheet>
  );
}
