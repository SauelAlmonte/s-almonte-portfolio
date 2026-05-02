/**
 * Normalize "Discovery tags" from Mongo, admin forms, or imports.
 * Splits comma/semicolon lists and common dash characters (e.g. em dash in UI copy).
 */
export function normalizeDiscoveryTags(raw: unknown): string[] {
  if (raw == null) return [];

  const splitDelimiters = /[,;]|[\u2013\u2014]/g;

  const fromString = (s: string) =>
    s
      .split(splitDelimiters)
      .map((x) => x.trim())
      .filter(Boolean);

  if (Array.isArray(raw)) {
    const out: string[] = [];
    for (const item of raw) {
      if (typeof item !== "string") continue;
      const t = item.trim();
      if (!t) continue;
      const parts = t.split(splitDelimiters).map((x) => x.trim()).filter(Boolean);
      if (parts.length > 1) out.push(...parts);
      else out.push(t);
    }
    return dedupePreserveOrder(out);
  }

  if (typeof raw === "string") {
    return dedupePreserveOrder(fromString(raw));
  }

  return [];
}

function dedupePreserveOrder(vals: string[]): string[] {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const v of vals) {
    if (!seen.has(v)) {
      seen.add(v);
      next.push(v);
    }
  }
  return next;
}
