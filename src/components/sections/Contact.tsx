"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gsap } from "@/lib/scroll/gsap";
import {
  MapPin,
  Github,
  Linkedin,
  Youtube,
  Send,
  CheckCircle2,
  Loader2,
  Bell,
  BellOff,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SocialLink, type SocialLinkItem } from "@/components/common/SocialLink";
import { YOUTUBE_CHANNEL_URL } from "@/config/site";
import { cn } from "@/lib/utils";

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[\+]?[\d\s\-\(\)]{7,20}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof ContactSchema>;

const SOCIALS: SocialLinkItem[] = [
  { label: "GitHub",   href: "https://github.com/SauelAlmonte",       icon: Github,   accent: "#A8DADC" },
  { label: "LinkedIn", href: "https://linkedin.com/in/sauel-almonte", icon: Linkedin, accent: "#B39CD0" },
  { label: "YouTube",  href: YOUTUBE_CHANNEL_URL,                     icon: Youtube,  accent: "#FFC1CC" },
];

type ModalState = "idle" | "consent" | "success";

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [modalState, setModalState] = useState<ModalState>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingData, setPendingData] = useState<ContactFormData | null>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  /* GSAP scroll animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      /* Reduced motion: reveal both columns immediately, no slide-in. */
      if (reduceMotion) {
        gsap.set([leftRef.current, rightRef.current], { opacity: 1, x: 0 });
        return;
      }

      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 60 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Step 1: validate form, show consent modal */
  const onSubmit = async (data: ContactFormData) => {
    setPendingData(data);
    setModalState("consent");
  };

  /* Step 2: user made their subscription choice */
  const handleConsentChoice = async (subscribe: boolean) => {
    if (!pendingData) return;
    setIsSubmitting(true);
    setModalState("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pendingData, subscribe }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Something went wrong.");
      }

      form.reset();
      setPendingData(null);
      setModalState("success");
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "Failed to send. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="contact"
        aria-label="Contact"
        className="relative py-fl-section px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Background blobs */}
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#A8DADC]/10 blur-[100px]" />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#B39CD0]/10 blur-[80px]" />
        </div>

        <div className="max-w-6xl mx-auto space-y-fl-y-lg">
          <SectionHeading
            label="Contact"
            title="Let's Work Together"
            subtitle="Have a project in mind, a question, or just want to say hello? I'd love to hear from you."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-fl-gap-cols items-start">

            {/* ── Left ── */}
            <div ref={leftRef} className="opacity-0 space-y-10">
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Whether you&apos;re looking for a{" "}
                  <span className="text-foreground font-medium">full-stack engineer</span>,
                  want to collaborate on something meaningful, or just want to connect —
                  my inbox is always open.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  I typically respond within{" "}
                  <span className="text-foreground font-medium">1–2 business days</span>.
                </p>
              </div>

              {/* Identity card */}
              <div className="flex items-start gap-5 p-6 rounded-2xl border border-border bg-card shadow-sm shadow-foreground/10">
                <div className="w-14 h-14 rounded-full bg-linear-to-br from-primary/30 via-accent/20 to-secondary/30 flex items-center justify-center shrink-0 ring-2 ring-primary/20 shadow-sm shadow-foreground/10">
                  <span className="text-lg font-extrabold text-[#2b7a78] dark:text-primary">SA</span>
                </div>
                <div className="space-y-1.5">
                  <p className="font-extrabold text-foreground text-lg leading-tight">Sauel Almonte</p>
                  <p className="text-sm text-muted-foreground">Full-Stack Engineer & AI Builder</p>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-[#2b7a78] dark:text-primary shrink-0" />
                    <span>Boston, MA</span>
                  </div>
                </div>
              </div>

              {/* Social icons */}
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                  Connect with me
                </p>
                <div className="flex items-center gap-3">
                  {SOCIALS.map((item) => (
                    <SocialLink key={item.label} item={item} tone="surface" size={44} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: form ── */}
            <div ref={rightRef} className="opacity-0">
              <div className="p-7 sm:p-8 rounded-3xl border border-border bg-card shadow-xl shadow-black/5">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">
                              Full Name <span className="text-[#2b7a78] dark:text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" {...field} className="rounded-xl border-border focus-visible:ring-primary bg-background" />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">
                              Email Address <span className="text-[#2b7a78] dark:text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jane@example.com" {...field} className="rounded-xl border-border focus-visible:ring-primary bg-background" />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Phone + Subject */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">
                              Phone{" "}
                              <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+1 (617) 000-0000" {...field} className="rounded-xl border-border focus-visible:ring-primary bg-background" />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">
                              Subject <span className="text-[#2b7a78] dark:text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="What's this about?" {...field} className="rounded-xl border-border focus-visible:ring-primary bg-background" />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Message */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">
                            Message <span className="text-[#2b7a78] dark:text-primary">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell me about your project, idea, or just say hi..."
                              rows={5}
                              {...field}
                              className="rounded-xl border-border focus-visible:ring-primary bg-background resize-none"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {form.formState.errors.root && (
                      <p className="text-sm text-destructive bg-destructive/10 px-4 py-2.5 rounded-xl">
                        {form.formState.errors.root.message}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className={cn(
                        "w-full rounded-xl font-semibold",
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                        "shadow-lg shadow-primary/25 hover:shadow-primary/40",
                        "transition-all duration-200 hover:scale-[1.02]"
                      )}
                    >
                      {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
                      ) : (
                        <><Send className="mr-2 h-4 w-4" />Send Message</>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      A confirmation email will be sent to you automatically.
                    </p>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Consent Modal ── */}
      <Dialog open={modalState === "consent"} onOpenChange={(open) => { if (!open) setModalState("idle"); }}>
        <DialogContent className="sm:max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl">
          <DialogTitle className="sr-only">Subscription consent</DialogTitle>
          <DialogDescription className="sr-only">
            Choose whether to subscribe to portfolio updates when sending a message through this form.
          </DialogDescription>

          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
              <Bell className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="text-center space-y-3 mb-7">
            <h2 className="text-xl font-extrabold text-foreground">Stay in the Loop</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By contacting via this form you&apos;ll be automatically subscribed to receive
              updates whenever I add new projects or update my resume.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You can opt out at any time — no spam, ever.
            </p>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-6" />

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => handleConsentChoice(true)}
              disabled={isSubmitting}
              size="lg"
              className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
              ) : (
                <><Bell className="mr-2 h-4 w-4" />Send &amp; Subscribe to Updates</>
              )}
            </Button>

            <Button
              onClick={() => handleConsentChoice(false)}
              disabled={isSubmitting}
              variant="outline"
              size="lg"
              className="w-full rounded-xl border-border hover:border-muted-foreground font-semibold text-muted-foreground"
            >
              <BellOff className="mr-2 h-4 w-4" />
              Send without subscribing
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Success Modal ── */}
      <Dialog open={modalState === "success"} onOpenChange={(open) => { if (!open) setModalState("idle"); }}>
        <DialogContent className="sm:max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-2xl">
          <DialogTitle className="sr-only">Message sent successfully</DialogTitle>
          <DialogDescription className="sr-only">
            Your contact message was submitted successfully.
          </DialogDescription>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <h2 className="text-2xl font-extrabold text-foreground">Message sent</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Your message has been successfully submitted. I&apos;ll review it and get back to
              you as soon as possible.
            </p>
            <p className="text-muted-foreground text-sm">
              Thank you for reaching out and visiting my online portfolio — it truly means a lot!
            </p>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-6" />

          <Button
            onClick={() => setModalState("idle")}
            className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            size="lg"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
