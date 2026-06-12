# Design Tokens — Hero-Derived Palette

The hero (dotted globe on a violet-black stage) is the **source of truth** for
the site's color system. Every value below was extracted from the shipped hero
or derived from it to pass WCAG AA. Defined in `src/app/globals.css`
(`:root` + `.dark`); mirrored for WebGL/JS in `src/config/tokens.ts`
(**change both together**). No component may hardcode a palette hex.

The **public landing is dark-only**: `src/app/(main)/layout.tsx` wraps
everything in `.dark`, so hero → sections never changes worlds. Admin and the
`/skills/[category]` sub-pages keep the light/dark toggle.

## Palette

| Token | Utility | Value | Role |
|---|---|---|---|
| `--stage` | `bg-stage` | `#080711` | The hero stage; landing background |
| `--surface` | `bg-surface`, `bg-card` | `#12101D` | Cards, popovers, panels |
| `--surface-raised` | `bg-surface-raised`, `bg-secondary` | `#1A1828` | Raised structural layer |
| `--ink-bright` | `text-ink-bright` | `#F4F4F8` | Display headings (h1) |
| `--ink` | `text-ink`, `text-foreground` | `#ECECF2` | Body text |
| `--ink-secondary` | `text-ink-secondary` | `#C6C7D2` | Supporting copy, inactive nav |
| `--ink-muted` | `text-ink-muted`, `text-muted-foreground` | `#9A9AA7` | Muted text, labels |
| `--ink-faint` | `text-ink-faint` | `#757584` | Faint UI affordances only (3:1) — never body text |
| **accent** | `text-primary`, `bg-primary`, `ring-primary` | `#A8DADC` | THE accent — the hero glow |
| `--accent-soft` / `--accent-strong` | `accent-soft` / `accent-strong` | `#C7ECEE` / `#8CCFD1` | CTA gradient steps (see `.cta-dome`) |
| `--accent-ink` | `text-accent-ink` | `#06232B` | Text on accent fills |
| `--cat-fullstack/-backend/-cloud` | `*-cat-fullstack` … | `#A8DADC` / `#B39CD0` / `#FFC1CC` | Category identity + scene atmosphere |
| `--cat-*-deep` | `*-cat-fullstack-deep` … | `#226562` / `#5A4A7A` / `#A23D51` | AA-darkened category steps for light surfaces |
| functional | `text-destructive/success/warning/info` | dark: `#E0697C` / `#7FD9B9` / `#E5C687` / `#B39CD0` | Harmonized with the hero family (rose, not stock red) |

Naming note: the brand accent is exposed as shadcn **`primary`** (it already
carried that role); shadcn's own `accent` variable remains the *component
hover-surface* (`#16202C` cyan-tinted dark) — never use `text-accent` to mean
the glow. Legacy `cyan`/`lavender`/`pink`/`slate`/`light` utilities are
deprecated aliases kept for the resume modal.

## 60 / 30 / 10 — where each tier is allowed

- **60% — `stage` + `surface`:** page background, section backgrounds, cards,
  glass panels' base. Large fills are always this tier.
- **30% — structure & ink:** `surface-raised`, borders/hairlines, `ink-*` text
  scale, glass bevels (pure white/black alpha), the category washes at ≤10%
  alpha (scene atmosphere only).
- **10% — accent (`primary` + steps):** CTAs (`.cta-dome`), active nav state +
  gliding indicator, focus rings, key numerics/stats, small glows. **Never
  body text, never large fills.** If the accent is everywhere it stops being
  the accent.
- **Category tier (`cat-*`):** category identity (skills/projects cards, tags,
  social-chip hovers) and low-alpha atmosphere (aurora, blobs). Never as an
  interactive accent; on light surfaces use the `-deep` step for text.

## Material-effect exception

Pure white/black alpha values (`rgba(255,255,255,…)` bevels, `rgba(0,0,0,…)`
shadows, `border-white/10` hairlines) are *material effects*, not palette —
they remain inline. The light-surface chip gradient in `SocialLink`
(`#ffffff/#eef1f5/#e1e6ee`) is the one documented hex exception.

## Contrast audit (WCAG AA) — computed, dark landing world

Text pairs (need ≥ 4.5:1; large text ≥ 3:1):

| Pair | Ratio | Verdict |
|---|---|---|
| ink-bright `#F4F4F8` / stage | 18.25 | PASS |
| ink `#ECECF2` / stage | 17.02 | PASS |
| ink `#ECECF2` / surface | 15.97 | PASS |
| ink-secondary `#C6C7D2` / surface-raised | 10.37 | PASS |
| ink-secondary / glass pill (composited `#0E0C18`) | 11.53 | PASS |
| ink-muted `#9A9AA7` / stage · surface · muted | 7.20 · 6.76 · 6.60 | PASS |
| ink-muted / glass pill (composited) | 6.97 | PASS |
| accent `#A8DADC` / stage · surface | 13.09 · 12.28 | PASS |
| accent-ink `#06232B` / accent · soft · strong | 10.70 · 12.99 · 9.32 | PASS |
| destructive `#E0697C` / stage | 6.18 | PASS |
| success `#7FD9B9` / stage | 11.95 | PASS |
| warning `#E5C687` / stage | 12.17 | PASS |
| info `#B39CD0` / stage | 8.18 | PASS |

UI components & states (need ≥ 3:1 against adjacent colors):

| Pair | Ratio | Verdict |
|---|---|---|
| ink-faint `#757584` / stage (hidden-til-hover admin lock) | 4.42 | PASS |
| focus ring `#A8DADC` / stage · surface | 13.09 · 12.28 | PASS |
| gliding nav indicator `#A8DADC` / pill composite | 12.4 | PASS |
| form input boundary `white/38` / card | 3.57 | PASS (raised from white/15 ≈ 1.5) |
| decorative hairlines `white/10` | ~1.5 | exempt — non-essential separators; components carry other cues |

Light world (admin + skills sub-pages — light `:root` values unchanged, plus
the new deep steps): `cat-fullstack-deep` 5.52, `cat-backend-deep` 6.36,
`cat-cloud-deep` 5.16 on the light background — all PASS. The previous
hand-picked light variants (`#2b7a78` 4.12, `#b84a5f` 4.10, `#3e9ea0` 2.60)
failed and were replaced by these derived steps.

## Beyond color

- Focus: every interactive element keeps a visible 2px `ring-primary` (≥3:1)
  with ring-offset — never color-only.
- Meaning is never color-only: active nav has `aria-current` + the indicator
  shape; form errors render text via `FormMessage`; category cards carry
  icons + labels.
- Touch targets: nav/menu controls are ≥36px visual with ≥44px effective rows
  (mobile menu rows are 60px+).
- Reduced motion: static states ship in the same tokens (poster, instant
  reveals) — see the Phase 1 scroll architecture.
