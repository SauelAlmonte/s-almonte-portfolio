"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What projects has Sauel built?",
  "What's his tech stack?",
  "Tell me about his experience",
  "Is he AWS certified?",
] as const;

/** Pull display text out of a UIMessage's parts (v5/v6 messages are part-based). */
function messageText(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((p) => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text)
    .join("");
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });

  // The visible counter = messages YOU'VE sent this conversation, capped at the
  // limit. It increments per send and can't be reset by a button, by asking the
  // bot, or by prompt injection (it's derived from the real message list, not
  // model output). The server still enforces its own 12/min cap as the true
  // abuse guard — this number is the friendly UX mirror of it.
  const MESSAGE_LIMIT = 12;
  const usedCount = Math.min(messages.filter((m) => m.role === "user").length, MESSAGE_LIMIT);
  const atLimit = usedCount >= MESSAGE_LIMIT;

  const isBusy = status === "submitted" || status === "streaming";
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the latest message in view as tokens stream in.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Focus the input when the panel opens; close on Escape.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isBusy || atLimit) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  return (
    <>
      {/* ── Panel ── */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Sauel's portfolio assistant"
          className={cn(
            // Mobile: near-full-width sheet anchored to the bottom (thumb-reach).
            // Desktop: fixed-width card anchored to the right edge, vertically
            // centered to line up with the edge-pill launcher.
            "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl",
            // Mobile: fixed height (the length you liked) anchored with a tall
            // bottom gap, so the WHOLE window lifts up and the composer/Send
            // clears the bottom-right corner where floating browser extensions
            // (e.g. Acrobat) park. Same length — just shifted up.
            "inset-x-3 bottom-20 h-[min(72vh,560px)]",
            "sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:right-4 sm:h-[min(72vh,560px)] sm:w-[clamp(20rem,26vw,24rem)] sm:-translate-y-1/2",
            "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-2",
          )}
        >
          {/* Header */}
          <header className="flex items-center gap-3 border-b border-border bg-secondary/40 px-4 py-3">
            <span className="grid size-9 place-items-center rounded-full bg-primary/15 text-primary">
              <Sparkles className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">Ask about Sauel</p>
              <p className="truncate text-xs text-muted-foreground">
                Projects · skills · experience
              </p>
            </div>
            <span
              title="Messages you've sent in this chat (max 12)."
              aria-label={`${usedCount} of ${MESSAGE_LIMIT} messages used`}
              className={cn(
                "shrink-0 rounded-full border px-2 py-0.5 text-[0.7rem] font-medium tabular-nums",
                atLimit
                  ? "border-destructive/40 text-destructive"
                  : "border-border bg-secondary/50 text-muted-foreground",
              )}
            >
              {usedCount}/{MESSAGE_LIMIT}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
            </button>
          </header>

          {/* Messages */}
          <div
            ref={scrollRef}
            aria-live="polite"
            data-lenis-prevent
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
          >
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Hi! I can answer questions about Sauel&apos;s work, projects, and skills — or take
                  your details if you&apos;d like him to reach out. Try one of these:
                </p>
                <p className="text-xs text-muted-foreground/80">
                  Up to {MESSAGE_LIMIT} messages per chat · counter shown top-right.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:border-primary/50 hover:bg-secondary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2 text-[clamp(0.8125rem,0.78rem+0.2vw,0.9rem)] leading-relaxed",
                      m.role === "user"
                        ? "whitespace-pre-wrap rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-secondary text-secondary-foreground",
                    )}
                  >
                    {m.role === "user" ? (
                      messageText(m.parts)
                    ) : (
                      <ReactMarkdown
                        // Single newlines → <br>, so the model can put a project's
                        // links on their OWN line within the same bullet without a
                        // blank-line paragraph break (which would split the list item).
                        remarkPlugins={[remarkBreaks]}
                        components={{
                          p: ({ children }) => <p className="not-first:mt-2">{children}</p>,
                          ul: ({ children }) => (
                            <ul className="my-1 list-disc space-y-2 pl-4 marker:text-muted-foreground">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="my-1 list-decimal space-y-2 pl-4 marker:text-muted-foreground">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => <li className="leading-snug">{children}</li>,
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium break-words text-primary underline underline-offset-2 transition-opacity hover:opacity-80"
                            >
                              {children}
                            </a>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-foreground">{children}</strong>
                          ),
                        }}
                      >
                        {messageText(m.parts)}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))
            )}

            {status === "submitted" && (
              <div className="flex justify-start" aria-label="Assistant is typing">
                <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-secondary px-3.5 py-3">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-destructive">
                Something went wrong. Please try again in a moment.
              </p>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="border-t border-border bg-card px-3 py-3"
          >
            {atLimit && (
              <p className="mb-2 text-center text-xs text-muted-foreground">
                You&apos;ve reached the {MESSAGE_LIMIT}-message limit for this chat.
              </p>
            )}
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={1000}
                disabled={atLimit}
                placeholder={atLimit ? "Message limit reached" : "Ask a question…"}
                aria-label="Type your question"
                className="min-w-0 flex-1 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || isBusy || atLimit}
                aria-label="Send message"
                className="cta-dome grid size-9 shrink-0 place-items-center rounded-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="size-4" aria-hidden />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Launcher: vertical edge pill, centered on the right edge ──
          Hidden while the panel is open (the panel has its own close button).
          Sizing scales down on phones, up from `sm`. */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label="Open AI chat assistant"
          className={cn(
            "cta-dome fixed right-0 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center rounded-l-xl rounded-r-none shadow-lg",
            // Thin on phones + tablets; roomier only on desktop (lg+).
            "gap-1.5 py-3 pl-1.5 pr-1 lg:gap-2 lg:rounded-l-2xl lg:py-4 lg:pl-2.5 lg:pr-2",
            "transition-[padding,transform] hover:pr-1.5 active:scale-95 lg:hover:pr-3",
            "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-2",
          )}
        >
          <MessageCircle className="size-4 lg:size-5" aria-hidden />
          <span className="text-[0.5625rem] font-semibold uppercase tracking-wider [writing-mode:vertical-rl] lg:text-[0.7rem]">
            AI Chat
          </span>
        </button>
      )}
    </>
  );
}
