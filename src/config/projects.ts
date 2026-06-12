import { BRAND } from "@/config/tokens";

export type ProjectCategory = "fullstack" | "backend" | "cloud";

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  /** Discovery / SEO-oriented labels shown on skill category cards when present */
  tags?: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageGradient: string;
  /** When set (e.g. admin upload), renders over the gradient area instead of initials only */
  imageBase64?: string;
  featured: boolean;
  comingSoon?: boolean;
  category: ProjectCategory;
}

export const CATEGORY_META: Record<
  ProjectCategory,
  {
    label: string;
    title: string;
    description: string;
    accent: string;
    accentClass: string;
    borderClass: string;
    tagClass: string;
    dotClass: string;
    /** Proficiency % / accent text — matches homepage Skills cards and admin lists */
    skillAccentClass: string;
    /** Admin “Add to …” row hover tint */
    skillSubtleHoverClass: string;
    /** Slider thumb ring color (admin skill dialog) */
    skillSliderThumbClass: string;
  }
> = {
  fullstack: {
    label: "Full-Stack Web Dev",
    title: "Full-Stack Projects",
    description:
      "Web applications built end-to-end — from pixel-perfect frontends to robust backends.",
    accent: BRAND.fullstack,
    accentClass: "from-cat-fullstack/30 to-cat-fullstack/5",
    borderClass: "border-cat-fullstack/40 hover:border-cat-fullstack",
    tagClass: "bg-cat-fullstack/15 text-cat-fullstack-deep dark:text-cat-fullstack",
    dotClass: "bg-cat-fullstack",
    skillAccentClass: "text-cat-fullstack-deep dark:text-cat-fullstack",
    skillSubtleHoverClass: "hover:text-cat-fullstack hover:bg-cat-fullstack/10",
    skillSliderThumbClass: "border-cat-fullstack",
  },
  backend: {
    label: "Backend & AI Engineering",
    title: "Backend & AI Projects",
    description:
      "Scalable APIs, machine learning pipelines, and AI-powered automation tools.",
    accent: BRAND.backend,
    accentClass: "from-cat-backend/30 to-cat-backend/5",
    borderClass: "border-cat-backend/40 hover:border-cat-backend",
    tagClass: "bg-cat-backend/15 text-cat-backend-deep dark:text-cat-backend",
    dotClass: "bg-cat-backend",
    skillAccentClass: "text-cat-backend-deep dark:text-cat-backend",
    skillSubtleHoverClass: "hover:text-cat-backend hover:bg-cat-backend/10",
    skillSliderThumbClass: "border-cat-backend",
  },
  cloud: {
    label: "Cloud & DevOps",
    title: "Cloud & DevOps Projects",
    description:
      "Infrastructure, containerization, and deployment pipelines built for scale.",
    accent: BRAND.cloud,
    accentClass: "from-cat-cloud/30 to-cat-cloud/5",
    borderClass: "border-cat-cloud/40 hover:border-cat-cloud",
    tagClass: "bg-cat-cloud/15 text-cat-cloud-deep dark:text-cat-cloud",
    dotClass: "bg-cat-cloud",
    skillAccentClass: "text-cat-cloud-deep dark:text-cat-cloud",
    skillSubtleHoverClass: "hover:text-cat-cloud hover:bg-cat-cloud/10",
    skillSliderThumbClass: "border-cat-cloud",
  },
};

export const PROJECTS: ProjectData[] = [
  /* ── Full-Stack ── */
  {
    id: "portfolio",
    title: "Developer Portfolio",
    description:
      "This portfolio — a modern, animated full-stack web app built with Next.js, TypeScript, TailwindCSS, GSAP, and MongoDB for a dynamic admin CMS.",
    techStack: ["Next.js", "TypeScript", "TailwindCSS", "GSAP", "MongoDB"],
    liveUrl: "https://s-almonte.vercel.app",
    repoUrl: "https://github.com/SauelAlmonte",
    imageGradient: "from-cat-fullstack/40 via-cat-backend/20 to-cat-fullstack/10",
    featured: true,
    category: "fullstack",
  },
  {
    id: "fullstack-2",
    title: "More Coming Soon",
    description:
      "New full-stack projects are in progress. Check back soon!",
    techStack: ["React", "Next.js", "TypeScript"],
    imageGradient: "from-cat-fullstack/20 to-transparent",
    featured: false,
    comingSoon: true,
    category: "fullstack",
  },

  /* ── Backend & AI ── */
  {
    id: "book-recommender",
    title: "Book Recommendation System",
    description:
      "Intelligent book recommender using semantic search, sentiment analysis, and zero-shot classification with LLMs. Powered by LangChain, ChromaDB, and Gradio.",
    techStack: ["Python", "OpenAI API", "LangChain", "Gradio", "ChromaDB"],
    repoUrl: "https://github.com/SauelAlmonte",
    imageGradient: "from-cat-backend/40 via-cat-fullstack/20 to-cat-backend/10",
    featured: true,
    category: "backend",
  },
  {
    id: "ai-transcription",
    title: "AI Audio Transcription Tool",
    description:
      "Automated audio transcription and document summarization using GPT-4 and Whisper, reducing workflow bottlenecks by 32% at North Light AI.",
    techStack: ["Python", "GPT-4", "Whisper", "Docker"],
    imageGradient: "from-cat-backend/30 to-cat-backend/10",
    featured: true,
    comingSoon: true,
    category: "backend",
  },

  /* ── Cloud & DevOps ── */
  {
    id: "ml-pipeline",
    title: "ML Pipeline Infrastructure",
    description:
      "Containerized machine learning pipelines from data ingestion through model evaluation, with validation, logging, and retry controls built for reliability.",
    techStack: ["Docker", "Python", "CI/CD", "AWS"],
    imageGradient: "from-cat-cloud/40 via-cat-backend/20 to-cat-cloud/10",
    featured: true,
    comingSoon: true,
    category: "cloud",
  },
  {
    id: "kafka-pipeline",
    title: "Real-Time Kafka Data Pipeline",
    description:
      "Real-time data pipelines built at Wayfair using Apache Kafka for high-volume event stream ingestion and processing across microservices.",
    techStack: ["Kafka", "Python", "Docker", "Microservices"],
    imageGradient: "from-cat-cloud/30 to-cat-cloud/10",
    featured: false,
    comingSoon: true,
    category: "cloud",
  },
];
