# Sauel Almonte — Portfolio

### Thank you for visiting my portfolio repository! 🙏

*A modern, animated full-stack portfolio built to showcase my skills, experience, and projects.*

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://greensock.com/gsap)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-s--almonte.vercel.app-A8DADC?style=for-the-badge&logo=vercel&logoColor=black)](https://s-almonte.vercel.app)
[![License: All%20Rights%20Reserved-B39CD0?style=for-the-badge)](LICENSE)

---

## ✨ Features

- **Animated UI** — GSAP ScrollTrigger reveals, parallax, and staggered animations, with full `prefers-reduced-motion` support
- **Light & Dark Mode** — System-aware theme switching via `next-themes`
- **Admin CMS** — Google-OAuth-protected dashboard to manage projects, skills, resume, and subscribers — no code changes needed
- **Contact Form** — Powered by Resend with dual email notifications and subscriber opt-in
- **MongoDB Backend** — Dynamic content + subscriber management via Mongoose, with ISR and on-demand revalidation
- **Skills & Projects** — Categorized skill cards with animated progress bars linking to project pages
- **SEO & AEO** — Per-route metadata, JSON-LD structured data, dynamic OG images, sitemap/robots, and an `llms.txt` for AI answer engines
- **Fully Responsive** — Optimized for all screen sizes from mobile to widescreen

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS v4 + ShadCN UI |
| **Animation** | GSAP + ScrollTrigger · Motion (LazyMotion) · Three.js / React Three Fiber + drei |
| **Auth** | Auth.js (NextAuth v5) + Google OAuth |
| **Database** | MongoDB Atlas via Mongoose |
| **Email** | Resend + React Email |
| **Forms** | React Hook Form + Zod |
| **Testing / CI** | Playwright (E2E) · Lighthouse CI · CodeQL |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (main)/             # Public single-page site
│   ├── admin/              # Protected CMS (projects, skills, resume, subscribers)
│   ├── api/                # Route handlers: admin, auth, contact
│   ├── skills/[category]/  # Dynamic project category pages
│   ├── opengraph-image.tsx # Dynamically generated social card
│   ├── sitemap.ts          # + robots.ts
│   └── layout.tsx
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── sections/           # Hero, About, Experience, Skills, Contact
│   ├── common/             # Shared (JsonLd, MotionProvider, …)
│   ├── resume/             # Resume download UI
│   └── ui/                 # ShadCN components
├── config/                 # Site config & static data
├── emails/                 # React Email templates
├── hooks/                  # Custom React hooks (GSAP, scroll)
├── lib/
│   ├── auth/ · cache/ · db/ · models/
│   ├── projects/ · resume/ · skills/ · validations/
│   └── seo/                # JSON-LD serialization
├── auth.ts                 # Auth.js (NextAuth) config
├── proxy.ts                # /admin route protection
└── types/                  # TypeScript types

e2e/                        # Playwright E2E tests
.github/workflows/          # CodeQL · Lighthouse CI · E2E
```

---

## 🧪 Automated Testing & CI

Every pull request to `main` runs three automated gates via GitHub Actions:

| Gate | What it checks |
|---|---|
| **Playwright (E2E)** | Browser tests against a production build (`next build && next start`) covering the public surfaces — homepage, skills navigation, and category pages |
| **Lighthouse CI** | Performance, Accessibility, Best-Practices, and SEO of the production build, with assertion budgets (a11y & SEO are hard-gated) |
| **CodeQL** | Static security analysis (JavaScript/TypeScript) on every push and PR |

Run the E2E suite locally:

```bash
npm run test:e2e        # Playwright — auto-starts the dev server
```

> All three run their tooling inside the ephemeral CI runner, so they add **zero runtime dependencies** and the project stays at **0 audit findings**.

---

## 🎨 Color Palette

| Name | Hex | Usage |
|---|---|---|
| Slate Gray | `#2C2C2C` | Dark background / text |
| Light Gray | `#E4E4E4` | Light background |
| Light Cyan | `#A8DADC` | Primary accent |
| Soft Pink | `#FFC1CC` | Secondary accent |
| Lavender | `#B39CD0` | Tertiary accent |

---

## 📬 Contact

**Sauel Almonte** — Full-Stack Engineer & AI Builder — Boston, MA

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/sauel-almonte)
[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/SauelAlmonte)

---

## 📄 License

Copyright © 2025 Sauel Almonte. **All rights reserved.**

This portfolio, including its source code, design, content, biography, experience, and project materials, is the intellectual property of Sauel Almonte. No permission is granted to copy, modify, distribute, publish, sublicense, or use this work without prior written permission. See the [LICENSE](LICENSE) file for details.

---

Made with ❤️ in Boston, MA
