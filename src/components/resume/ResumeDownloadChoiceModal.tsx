"use client";

import type { ReactElement } from "react";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LANDING_RESUME_CHOICES, type LandingResumePdfChoice } from "@/config/experience";

function publicResumeAnchorProps(href: string, download: string) {
  return {
    href,
    download,
    ...(href.startsWith("http")
      ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
      : {}),
  };
}

type ResumeDownloadChoiceModalProps = {
  children: ReactElement;
  /** Overrides default public PDF paths (e.g. from CMS). */
  choices?: LandingResumePdfChoice[];
};

export function ResumeDownloadChoiceModal({
  children,
  choices,
}: ResumeDownloadChoiceModalProps) {
  const resolvedChoices: LandingResumePdfChoice[] =
    choices ??
    LANDING_RESUME_CHOICES.map((c) => ({
      id: c.id,
      label: c.label,
      description: c.description,
      href: c.href,
      download: c.download,
    }));

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gap-fl-dialog rounded-2xl sm:max-w-md">
        <DialogHeader className="gap-2 text-left">
          <DialogTitle className="text-lg font-semibold leading-snug sm:text-xl">
            Choose a resume
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            Select the PDF that best fits the role. You can download either version.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-fl-stack">
          {resolvedChoices.map((choice) => {
            const softwareHover =
              "hover:border-cyan hover:bg-cyan hover:text-slate dark:hover:border-cyan dark:hover:bg-cyan dark:hover:text-slate";
            const itHover =
              "hover:border-lavender hover:bg-lavender hover:text-slate dark:hover:border-lavender dark:hover:bg-lavender dark:hover:text-slate";

            return (
              <DialogClose key={choice.id} asChild>
                <Button
                  asChild
                  variant="outline"
                  className={cn(
                    "group h-auto min-h-fl-row-min w-full cursor-pointer justify-start rounded-xl border-border bg-background px-fl-cta-x py-fl-cta-y text-left shadow-xs motion-safe:transition-colors motion-safe:duration-200",
                    "hover:bg-transparent dark:border-input dark:bg-input/30",
                    choice.id === "software" ? softwareHover : itHover
                  )}
                >
                  <a
                    {...publicResumeAnchorProps(choice.href, choice.download)}
                    aria-label={`Download ${choice.label} PDF`}
                    className="flex w-full items-start gap-fl-icon-gap"
                  >
                    <Download
                      className="mt-0.5 size-fl-icon shrink-0 text-muted-foreground motion-safe:transition-colors motion-safe:duration-200 group-hover:text-slate"
                      aria-hidden
                    />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                      <span className="text-base font-semibold leading-snug text-foreground motion-safe:transition-colors motion-safe:duration-200 group-hover:text-slate">
                        {choice.label}
                      </span>
                      <span className="text-sm font-normal leading-snug text-muted-foreground motion-safe:transition-colors motion-safe:duration-200 group-hover:text-slate/90">
                        {choice.description}
                      </span>
                    </span>
                  </a>
                </Button>
              </DialogClose>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
