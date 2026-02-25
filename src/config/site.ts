export const siteConfig = {
  name: "My Portfolio",
  description: "Full-stack developer portfolio showcasing projects, skills, and experience.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  nav: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills & Projects", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],
  social: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL ?? "",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "",
  },
} as const;
