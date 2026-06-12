/* ── Pending content ──
   TODO(sauel): replace with the real channel URL when it exists. This is the
   single source for the YouTube social link shown in Hero, Contact, and the
   mobile menu. (JSON-LD intentionally keeps using `social.youtube`, which
   stays empty until NEXT_PUBLIC_YOUTUBE_URL is set — we never want the
   placeholder leaking into structured data.) */
export const YOUTUBE_CHANNEL_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "https://youtube.com/@yourchannel";

export const siteConfig = {
  /* ── Identity ── */
  name: "Sauel Almonte",
  title: "Sauel Almonte — Full-Stack & AI Engineer",
  description:
    "Full-Stack Software Engineer based in Boston, MA specializing in scalable cloud applications, AI-powered automation, and modern web experiences. AWS Certified. Mentor. Builder.",
  /** Short value-prop line — consumed by the OG image card. */
  tagline:
    "Scalable cloud applications · AI-powered automation · Modern web experiences",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /* ── Person metadata (used in JSON-LD & meta tags) ── */
  person: {
    name: "Sauel Almonte",
    jobTitle: "Full-Stack Software Engineer",
    location: "Boston, MA",
    nationality: "Dominican-American",
    languages: ["English", "Spanish"],
    email: "almontesauel@gmail.com",
    skills: [
      "Next.js", "React", "TypeScript", "Node.js", "Python",
      "AWS", "MongoDB", "PostgreSQL", "Docker", "AI Engineering",
      "TailwindCSS", "GraphQL", "REST APIs", "Cloud Architecture",
    ],
    companies: ["Wayfair", "North Light AI"],
    certifications: [
      "AWS Certified Cloud Practitioner",
      "Meta Front-End Developer Certificate",
      "C++ Essentials 1 & 2 — CISCO Network Academy",
    ],
  },

  /* ── Nav ── */
  nav: [
    { label: "Home",             href: "#home"       },
    { label: "About",            href: "#about"      },
    { label: "Experience",       href: "#experience" },
    { label: "Skills & Projects",href: "#skills"     },
    { label: "Contact",          href: "#contact"    },
  ],

  /* ── Social ── */
  social: {
    github:   process.env.NEXT_PUBLIC_GITHUB_URL   ?? "https://github.com/SauelAlmonte",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://linkedin.com/in/sauel-almonte",
    twitter:  process.env.NEXT_PUBLIC_TWITTER_URL  ?? "",
    youtube:  process.env.NEXT_PUBLIC_YOUTUBE_URL  ?? "",
  },

  /* ── Keywords ── */
  keywords: [
    "Sauel Almonte",
    "Full-Stack Engineer",
    "Software Engineer Boston",
    "AI Engineer",
    "Cloud Developer",
    "Next.js Developer",
    "React Developer",
    "AWS Certified",
    "Portfolio",
    "Web Developer Boston MA",
    "Dominican American Engineer",
  ],
} as const;
