/** If `raw` is `YYYY-MM-DD`, format for display; otherwise return trimmed text (e.g. "Certified"). */
export function formatCredentialPeriod(raw: string | undefined | null): string {
  const t = typeof raw === "string" ? raw.trim() : "";
  if (!t) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    const d = new Date(`${t}T12:00:00`);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }
  return t;
}

/** Abbreviated months for credential cards ("Sept" style — short months stay whole). */
const CREDENTIAL_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "June",
  "July", "Aug", "Sept", "Oct", "Nov", "Dec",
] as const;

/** Public credential cards: `YYYY-MM-DD` → "Date Issued: June 06, 2025"; other text (e.g. "Expected June 2027") passes through unlabeled. */
export function formatCredentialDateLine(raw: string | undefined | null): string {
  const t = typeof raw === "string" ? raw.trim() : "";
  if (!t) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (m) {
    const month = CREDENTIAL_MONTHS[Number(m[2]) - 1];
    if (month) return `Date Issued: ${month} ${m[3]}, ${m[1]}`;
  }
  return t;
}

/** Value for `<input type="date" />` when `year` stores an ISO date; otherwise empty (legacy text kept in `formData.year`). */
export function isoDateForPicker(year: string | undefined | null): string {
  const t = typeof year === "string" ? year.trim() : "";
  return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : "";
}
