# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start local dev server (http://localhost:3000)
npm run build    # production build
npm run lint     # ESLint check
```

No test suite is configured. Verify UI changes by running `dev` and testing in-browser.

## Shipping / Git workflow

Before pushing commits (`git push`), run `npm run build` from the repository root and fix any failures. Do not push while the production build is broken.

## Architecture Overview

Single-page portfolio with a hidden admin CMS, backed by MongoDB Atlas.

### Page Structure

- **Public site** (`src/app/(main)/`) — single scrolling page with section-based anchor navigation (`#home`, `#about`, `#experience`, `#skills`, `#contact`). Animations are GSAP ScrollTrigger-driven, with hooks in `src/hooks/`.
- **Skills sub-pages** (`src/app/skills/[category]/`) — dynamic routes for `fullstack`, `backend`, `cloud`; category metadata (colors, labels) lives in `src/config/projects.ts`.
- **Admin CMS** (`src/app/admin/`) — protected CRUD for Projects, Skills, Resume, and Subscribers.

### Auth & Route Protection

`src/auth.ts` configures NextAuth v5 with Google OAuth. Only the email matching `ADMIN_EMAIL` env var is permitted — the `signIn` callback rejects all others. `src/proxy.ts` applies the auth guard (Next.js 16 `proxy` naming) to every `/admin/*` route, redirecting unauthenticated requests to `/admin/login`.

### API Routes

All under `src/app/api/`:

| Route | Auth | Purpose |
|---|---|---|
| `POST /api/contact` | Public | Sends emails via Resend + saves subscriber to MongoDB |
| `GET/POST /api/admin/projects` | Session | Project CRUD |
| `GET/POST /api/admin/skills` | Session | Skill CRUD |
| `GET/POST/PUT/DELETE /api/admin/resume` | Session | Resume data |
| `GET /api/admin/subscribers` | Session | Subscriber list |
| `GET /api/admin/stats` | Session | Dashboard counts |

Every admin route calls `auth()` from `@/auth` and returns `401` if no session exists.

### Database

MongoDB Atlas via Mongoose. Connection is in `src/lib/db/mongoose.ts` using a `global.mongoose` cache to survive Next.js hot reloads. Always call `await connectToDatabase()` before any model operation.

Models in `src/lib/models/`: `Project`, `Skill`, `Resume`, `ResumeData`, `Subscriber`.

### Static Config vs. Dynamic Data

- `src/config/site.ts` — site identity, SEO metadata, nav links, social URLs (consumed by `layout.tsx` for `<Metadata>` and JSON-LD).
- `src/config/projects.ts` — project category definitions with their accent colors and Tailwind class strings.
- Dynamic content (projects, skills, resume) is fetched from MongoDB via the admin API.

### Styling

TailwindCSS v4 + ShadCN UI. The three accent colors map to content categories:
- `#A8DADC` — Full-Stack (cyan)
- `#B39CD0` — Backend & AI (lavender)
- `#FFC1CC` — Cloud (pink)

Use `cn()` from `src/lib/utils.ts` (re-exports `clsx` + `tailwind-merge`) for conditional class composition.

**Interactive cursor:** Anything that behaves as clickable (links, CTAs, buttons, checkboxes, radios, selects, disclosure controls, tabs, labeled inputs, custom `div`/`span` handlers) must show a **pointer** cursor on hover: use Tailwind `cursor-pointer` where needed and keep `src/app/globals.css` `@layer base` selectors aligned; avoid `cursor-default` on clickable elements (disabled controls may use `cursor-not-allowed` or rely on opacity/pointer-events). See `.cursor/rules/interactive-pointer.mdc`.

## Required Environment Variables

Set these in `.env.local` (gitignored — never commit real secrets):

```
MONGODB_URI
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
ADMIN_EMAIL           # sole email allowed into the admin panel
RESEND_API_KEY
CONTACT_EMAIL         # destination for contact form notifications
AUTH_URL              # local: http://localhost:3000 — if set to Vercel URL, login redirects away from localhost
AUTH_SECRET           # NextAuth / Auth.js secret (openssl rand -base64 32)
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_GITHUB_URL
NEXT_PUBLIC_LINKEDIN_URL
```

**Local Google login ends on Vercel:** In development, [`src/lib/auth/normalize-dev-auth-urls.ts`](src/lib/auth/normalize-dev-auth-urls.ts) rewires production-style `AUTH_URL` / `NEXTAUTH_URL` to `http://localhost:<PORT>` (override with `AUTH_FORCE_PRODUCTION_ORIGIN_DEV=1` for tunnels). Still add Google redirect URI `http://localhost:3000/api/auth/callback/google` (and your actual port). Set `AUTH_URL=http://localhost:PORT` explicitly if you dev on a non-default port (`4000`, etc.).

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
