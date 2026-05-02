/**
 * Turns driver errors into short hints for admins (no secrets).
 * ENOTFOUND on querySrv = local/VPN/custom DNS failing SRV lookup for Atlas.
 */

export function mongoConnectionHint(error: unknown): string | undefined {
  if (!(error instanceof Error)) return undefined;
  const code = (error as NodeJS.ErrnoException).code;
  const message = error.message;

  if (code === "ENOTFOUND" && message.includes("querySrv")) {
    return (
      "Your Mac could not resolve the MongoDB Atlas address (DNS). Public DNS resolves it OK, so this is usually: " +
      "VPN/custom DNS blocker (Pi-hole, NextDNS, corporate VPN), flaky Wi‑Fi, or a stale macOS resolver. " +
      "Try turning VPN off briefly, switching DNS to 8.8.8.8, or flushing DNS (`sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`). " +
      "In Atlas, reconnect and paste a fresh `mongodb+srv://` string into `.env.local`."
    );
  }

  if (message.includes("bad auth") || message.includes("Authentication failed")) {
    return "Check database username/password in MONGODB_URI (URL‑encode special characters in the password).";
  }

  if (message.includes("SSL") || message.includes("certificate")) {
    return "TLS/cert issue — rare on Atlas; verify system time and proxy SSL inspection.";
  }

  return undefined;
}
