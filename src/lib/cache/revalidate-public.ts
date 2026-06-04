import { revalidatePath } from "next/cache";

/**
 * On-demand ISR invalidation for the public, statically-generated pages.
 *
 * The public site is rendered with `export const revalidate = 3600` (see
 * `src/app/(main)/page.tsx` and `src/app/skills/[category]/page.tsx`). Calling
 * these helpers from the admin write handlers makes edits appear immediately
 * instead of waiting for the hourly window — without giving up static caching.
 *
 * Keep the route → content mapping here so it lives in one place.
 */

/** Projects are listed on the `/skills/[category]` pages. The `"page"` type
 * invalidates every category instance at once (covers cross-category moves). */
export function revalidatePublicProjects(): void {
  revalidatePath("/skills/[category]", "page");
}

/** Skills and résumé data render in the homepage sections (`/`). */
export function revalidatePublicHome(): void {
  revalidatePath("/");
}
