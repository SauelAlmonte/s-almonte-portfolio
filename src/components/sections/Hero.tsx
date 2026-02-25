"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Github, Linkedin, Mail, Youtube, ArrowDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const ROLES = [
  "Full-Stack Engineer",
  "AI Engineer",
  "Mentor & Builder",
  "Cloud Developer",
];

const SOCIAL_LINKS = [
  { label: "GitHub",   href: "https://github.com/SauelAlmonte",          icon: Github,   external: true  },
  { label: "LinkedIn", href: "https://linkedin.com/in/sauel-almonte",    icon: Linkedin, external: true  },
  { label: "YouTube",  href: "https://youtube.com/@yourchannel",         icon: Youtube,  external: true  },
  { label: "Contact",  href: "#contact",                                  icon: Mail,     external: false },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const greetingRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState(ROLES[0]);

  /* GSAP entrance animation */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(greetingRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(nameRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.3")
      .fromTo(roleRef.current?.parentElement ?? null, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
      .fromTo(descRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
      .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
      .fromTo(socialRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
      .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.1");
  }, []);

  /* Role cycling animation */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!roleRef.current) return;

      gsap.to(roleRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setRoleIndex((prev) => {
            const next = (prev + 1) % ROLES.length;
            setDisplayedRole(ROLES[next]);
            return next;
          });
          gsap.fromTo(
            roleRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
          );
        },
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const handleScrollDown = () => {
    const about = document.getElementById("about");
    if (about) about.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      {/* Background blobs */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#A8DADC]/20 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[450px] h-[450px] rounded-full bg-[#B39CD0]/20 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full bg-[#FFC1CC]/15 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl mx-auto text-center space-y-6">

        {/* Greeting */}
        <p
          ref={greetingRef}
          className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-muted-foreground opacity-0"
        >
          <span className="w-8 h-px bg-primary inline-block" />
          Hi, I&apos;m Sauel
          <span className="w-8 h-px bg-primary inline-block" />
        </p>

        {/* Name */}
        <h1
          ref={nameRef}
          className="opacity-0 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none"
        >
          <span className="text-foreground">Sauel </span>
          <span className="text-primary">Almonte</span>
        </h1>

        {/* Animated role */}
        <div className="opacity-0 h-10 flex items-center justify-center">
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-foreground/70">
            <span className="text-accent font-semibold">
              <span ref={roleRef}>{displayedRole}</span>
            </span>
            {" "}based in Boston, MA
          </p>
        </div>

        {/* Description */}
        <p
          ref={descRef}
          className="opacity-0 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          I build <span className="text-foreground font-medium">scalable web applications</span> and{" "}
          <span className="text-foreground font-medium">AI-powered solutions</span> — from polished
          frontends to cloud-deployed backends. Bilingual (EN/ES) and passionate about mentoring the
          next generation of engineers.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="opacity-0 flex flex-col sm:flex-row gap-4 items-center justify-center pt-2"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 rounded-full shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-primary/40 hover:scale-105"
            onClick={() => {
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View My Work
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-full px-8 border-border hover:border-primary hover:text-primary font-semibold transition-all duration-200 hover:scale-105"
            onClick={() => {
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Get In Touch
          </Button>
        </div>

        {/* Social Links */}
        <div
          ref={socialRef}
          className="opacity-0 flex items-center justify-center gap-4 pt-2"
        >
          {SOCIAL_LINKS.map(({ label, href, icon: Icon, external }) =>
            external ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2.5 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-all duration-200 hover:scale-110"
              >
                <Icon className="h-5 w-5" />
              </a>
            ) : (
              <button
                key={label}
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                aria-label={label}
                className="p-2.5 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-all duration-200 hover:scale-110"
              >
                <Icon className="h-5 w-5" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="opacity-0 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <button
          onClick={handleScrollDown}
          aria-label="Scroll to about section"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent group-hover:h-12 transition-all duration-300" />
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
