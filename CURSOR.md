# CURSOR.md

Purpose: quick orientation for [Cursor](https://cursor.com) when editing this repo. Longer parallel notes for Claude Code live in [`CLAUDE.md`](CLAUDE.md).

**Persistent AI guidance:** Project-specific rules belong in [`.cursor/rules/`](.cursor/rules/) (`*.mdc`). This file does not replace those rules—use `@CURSOR.md` or open it when you want stack and workflow context.

---

## Commands

```bash
npm run dev    # Next.js dev server (default http://localhost:3000)
npm run build  # production build
npm run lint   # ESLint
```

No automated test runner is wired up yet; verify behaviour in the browser after UI or auth changes.

---

## Stack

| Area | Choice |
|------|--------|
| Framework | Next.js 16 (App Router), TypeScript |
| UI | Tailwind CSS v4, Shadcn UI (`src/components/ui/`) |
| Motion | GSAP + ScrollTrigger in sections |
| Data | MongoDB + Mongoose (`src/lib/db/mongoose.ts`, `src/lib/models/*`) |
| Auth | Auth.js / NextAuth v5, Google OAuth (`src/auth.ts`) |
| Email | Resend + React Email (`src/emails/`, `/api/contact`) |

---

## Key paths

| Path | Role |
|------|------|
| `src/app/(main)/` | Public home (Hero, About, Experience, Skills, Contact) |
| `src/app/skills/[category]/` | Projects by category (`fullstack`, `backend`, `cloud`); reads Mongo when seeded, else fallback from `src/config/projects.ts` |
| `src/app/admin/*` | Admin shell + CRUD (`layout.tsx`, `login`, dashboard, projects, skills, resume, subscribers) |
| `src/app/api/` | Route handlers (contact, admin CRUD, NextAuth `[...nextauth]`) |
| `src/auth.ts` | NextAuth factory; imports dev auth-url normaliser before init |
| `src/lib/auth/normalize-dev-auth-urls.ts` | In dev, rewrites prod-style `AUTH_URL` so OAuth stays on localhost |
| `src/config/site.ts` | Site SEO, URLs, persona |
| `src/config/projects.ts` | Static project seeds + category metadata; used for fallback and **`POST /api/admin/projects/seed`** |
| `src/proxy.ts` | Guards `/admin/*` (Next.js 16 `proxy` replaces `middleware`); login exempt |

---

## Environment

Copy [.env.example](.env.example) to `.env.local` and fill values.

Important for Google admin login locally:

- `AUTH_URL` / `NEXTAUTH_URL` must not point at production when you expect localhost (or rely on dev normaliser + `.env.example` docs).
- Google OAuth client needs redirect URI `http://localhost:<port>/api/auth/callback/google` (and prod URL where deployed).

Secrets must not ship in `NEXT_PUBLIC_*`.

---

## Conventions agents should respect

1. Prefer **semantic HTML**, keyboard access, and **WCAG-aligned** patterns for public-facing UI (see `.cursor/rules/`).
2. **Server Components** default; **`"use client"`** only for interactivity.
3. **`next/link`** / **`next/image`** where appropriate; keep admin API calls authenticated (`credentials: "include"` for cookie sessions).
4. After substantive TS/React edits, **`npm run build`** or dev compile should stay clean—fix introduced lint/type errors in touched files.

---

## Related docs

- [`README.md`](README.md) — public repo overview  
- [`CLAUDE.md`](CLAUDE.md) — architecture and env cheat sheet  
- [`.env.example`](.env.example) — env template with auth/dev notes  
