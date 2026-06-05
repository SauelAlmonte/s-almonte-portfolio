/**
 * Serialize a JSON-LD object for safe embedding in an inline `<script>`.
 *
 * `JSON.stringify` alone does not neutralize a `</script>` sequence (or the
 * U+2028 / U+2029 line separators) that could appear in CMS-authored content,
 * which would let it break out of the script context. Escaping `<`, `>`, `&`
 * and the two line separators to their `\uXXXX` form keeps the payload inert
 * while remaining valid JSON-LD for crawlers.
 *
 * The pattern is built with `new RegExp` from an ASCII string so the raw
 * U+2028/U+2029 line terminators never appear in this source file (they would
 * otherwise break a regex literal across lines).
 */
const UNSAFE_SCRIPT_CHARS = new RegExp("[<>&\\u2028\\u2029]", "g");

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(
    UNSAFE_SCRIPT_CHARS,
    (ch) => "\\u" + ch.charCodeAt(0).toString(16).padStart(4, "0"),
  );
}
