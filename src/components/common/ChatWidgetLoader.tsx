"use client";

import dynamic from "next/dynamic";

/**
 * Defers the chat widget (and its AI SDK / zod dependencies) out of the initial
 * page bundle. The launcher is non-critical UI, so we load it client-side after
 * hydration instead of blocking first render — keeps the AI SDK chunk off the
 * critical path for visitors who never open the chat.
 */
const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

export default function ChatWidgetLoader() {
  return <ChatWidget />;
}
