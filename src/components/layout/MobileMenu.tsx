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
  { label: "GitHub", href: "https://github.com/SauelAlmonte", icon: Github, accent: "#A8DADC" },
  { label: "LinkedIn", href: "https://linkedin.com/in/sauel-almonte", icon: Linkedin, accent: "#B39CD0" },
  { label: "YouTube", href: "https://youtube.com/@yourchannel", icon: Youtube, accent: "#FFC1CC" },
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

  const go = (href: string) => {
    setOpen(false);
    const el = document.getElementById(href.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open navigation menu"
          className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#ECECF2] transition-colors duration-200 hover:border-[#A8DADC]/40 hover:text-[#A8DADC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8DADC]/60 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </SheetTrigger>

      {/* Glass panel: translucent + heavy blur so the hero reads through it. */}
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-[86vw] max-w-[21rem] flex-col gap-0 overflow-hidden border-l border-white/10 bg-[#080711]/45 p-0 text-[#ECECF2] shadow-[-24px_0_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:max-w-[21rem]"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        {/* top sheen + faint corner accent (the only glow, kept restrained) */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(168,218,220,0.10), transparent 70%)" }}
        />

        {/* Minimal header — just a close affordance, like the reference's clean top. */}
        <m.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-center justify-between px-6 pt-6"
        >
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#7e7e8c]">Menu</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#C4C4D0] transition-colors duration-200 hover:border-[#A8DADC]/40 hover:text-[#A8DADC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8DADC]/60"
          >
            <X className="h-[18px] w-[18px]" />
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
                  "group flex w-full items-center gap-4 border-b border-white/[0.07] py-[18px] text-left transition-colors duration-200 last:border-b-0",
                  isActive ? "text-[#A8DADC]" : "text-[#E6E6EE]",
                )}
              >
                <Icon
                  className={cn(
                    "h-[26px] w-[26px] shrink-0 transition-colors duration-200",
                    isActive ? "text-[#A8DADC]" : "text-[#9ea0ad] group-hover:text-[#ECECF2]",
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
                      ? "translate-x-0 text-[#A8DADC] opacity-100"
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
          <p className="text-xs font-medium tracking-wide text-[#7e7e8c]">Connect</p>
          <div className="mt-3 flex items-center gap-2.5">
            {SOCIALS.map((item) => (
              <SocialLink key={item.label} item={item} tone="dark" size={40} />
            ))}
          </div>
          <button
            onClick={() => go("#contact")}
            className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center rounded-full border border-[#8fcfd1]/60 bg-[linear-gradient(180deg,#c7ecee,#A8DADC_46%,#8ccfd1)] text-sm font-semibold text-[#06232b] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_6px_16px_-8px_rgba(168,218,220,0.25)] transition-shadow duration-300 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_10px_24px_-10px_rgba(168,218,220,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8DADC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080711]"
          >
            Get in touch
          </button>
        </m.div>
      </SheetContent>
    </Sheet>
  );
}
