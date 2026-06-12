/**
 * Static stand-in for the WebGL globe: a soft lavender/cyan glow sitting where
 * the globe rests, on the same near-black stage. Shown while the 3D chunk
 * loads (no layout shift, no blank flash), and permanently when WebGL is
 * unavailable or the visitor prefers reduced motion.
 *
 * Server-renderable on purpose — keep it free of hooks and browser APIs.
 */
export function HeroPoster({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 bg-[radial-gradient(42%_46%_at_50%_46%,rgba(179,156,208,0.16),transparent_70%),radial-gradient(30%_34%_at_56%_42%,rgba(168,218,220,0.10),transparent_70%)] lg:bg-[radial-gradient(34%_52%_at_72%_50%,rgba(179,156,208,0.16),transparent_70%),radial-gradient(24%_38%_at_76%_44%,rgba(168,218,220,0.10),transparent_70%)] ${className}`}
    />
  );
}
