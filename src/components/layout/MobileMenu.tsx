"use client";

import { useState } from "react";
import { Menu, X, ChevronRight, Github, Linkedin, Youtube } from "lucide-react";
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

const SOCIALS: SocialLinkItem[] = [
  { label: "GitHub", href: "https://github.com/SauelAlmonte", icon: Github, accent: "#A8DADC" },
  { label: "LinkedIn", href: "https://linkedin.com/in/sauel-almonte", icon: Linkedin, accent: "#B39CD0" },
  { label: "YouTube", href: "https://youtube.com/@yourchannel", icon: Youtube, accent: "#FFC1CC" },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.16 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
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

      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-[88vw] max-w-[22rem] flex-col gap-0 overflow-hidden border-l border-white/10 bg-[#080711]/95 p-0 text-[#ECECF2] backdrop-blur-xl sm:max-w-[22rem]"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        {/* faint top-corner accent (restrained, no heavy glow) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(168,218,220,0.10), transparent 70%)" }}
        />

        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-center justify-between px-5 pt-5"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-[linear-gradient(160deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02)_55%,rgba(0,0,0,0.25))] text-sm font-bold tracking-tight shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.22),0_4px_12px_-4px_rgba(0,0,0,0.7)]">
            <span className="text-[#A8DADC]">S</span>
            <span className="text-[#ECECF2]">A</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#C4C4D0] transition-colors duration-200 hover:border-[#A8DADC]/40 hover:text-[#A8DADC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8DADC]/60"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </m.div>

        {/* Nav links — large, techy, staggered */}
        <m.nav
          variants={listVariants}
          initial="hidden"
          animate="show"
          aria-label="Mobile navigation"
          className="mt-10 flex flex-1 flex-col gap-1.5 px-4"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <m.button
                key={item.href}
                variants={itemVariants}
                onClick={() => go(item.href)}
                whileTap={{ scale: 0.98 }}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left text-[clamp(1rem,3.8vw,1.15rem)] font-medium tracking-tight transition-colors duration-200",
                  isActive
                    ? "border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_55%,rgba(0,0,0,0.2))] text-[#A8DADC] shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.14)]"
                    : "border-transparent text-[#b6b6c2] hover:bg-white/[0.04] hover:text-[#ECECF2]",
                )}
              >
                {item.label}
                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0 transition-all duration-200",
                    isActive
                      ? "translate-x-0 text-[#A8DADC] opacity-100"
                      : "-translate-x-1.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-60",
                  )}
                  aria-hidden
                />
              </m.button>
            );
          })}
        </m.nav>

        {/* Footer: socials + CTA */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
          className="mt-auto border-t border-white/10 px-5 pb-7 pt-5"
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
