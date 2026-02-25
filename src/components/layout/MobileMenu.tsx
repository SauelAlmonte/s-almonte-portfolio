"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavItem } from "@/types";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  navItems: readonly NavItem[];
  activeSection: string;
}

export function MobileMenu({ navItems, activeSection }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
          className="rounded-full text-foreground hover:bg-primary/20 hover:text-primary md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-72 bg-background/95 backdrop-blur-md border-l border-border"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-2 mt-12 px-2"
        >
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = activeSection === id;

            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                  "hover:bg-primary/10 hover:text-primary",
                  isActive
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-foreground/70"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
