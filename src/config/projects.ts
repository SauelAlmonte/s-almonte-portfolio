export type ProjectCategory = "fullstack" | "backend" | "cloud";

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageGradient: string;
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
  }
> = {
  fullstack: {
    label: "Full-Stack Web Dev",
    title: "Full-Stack Projects",
    description:
      "Web applications built end-to-end — from pixel-perfect frontends to robust backends.",
    accent: "#A8DADC",
    accentClass: "from-[#A8DADC]/30 to-[#A8DADC]/5",
    borderClass: "border-[#A8DADC]/40 hover:border-[#A8DADC]",
    tagClass: "bg-[#A8DADC]/15 text-[#3e9ea0] dark:text-[#A8DADC]",
    dotClass: "bg-[#A8DADC]",
  },
  backend: {
    label: "Backend & AI Engineering",
    title: "Backend & AI Projects",
    description:
      "Scalable APIs, machine learning pipelines, and AI-powered automation tools.",
    accent: "#B39CD0",
    accentClass: "from-[#B39CD0]/30 to-[#B39CD0]/5",
    borderClass: "border-[#B39CD0]/40 hover:border-[#B39CD0]",
    tagClass: "bg-[#B39CD0]/15 text-[#7b56a8] dark:text-[#B39CD0]",
    dotClass: "bg-[#B39CD0]",
  },
  cloud: {
    label: "Cloud & DevOps",
    title: "Cloud & DevOps Projects",
    description:
      "Infrastructure, containerization, and deployment pipelines built for scale.",
    accent: "#FFC1CC",
    accentClass: "from-[#FFC1CC]/30 to-[#FFC1CC]/5",
    borderClass: "border-[#FFC1CC]/40 hover:border-[#FFC1CC]",
    tagClass: "bg-[#FFC1CC]/15 text-[#c0536a] dark:text-[#FFC1CC]",
    dotClass: "bg-[#FFC1CC]",
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
    imageGradient: "from-[#A8DADC]/40 via-[#B39CD0]/20 to-[#A8DADC]/10",
    featured: true,
    category: "fullstack",
  },
  {
    id: "fullstack-2",
    title: "More Coming Soon",
    description:
      "New full-stack projects are in progress. Check back soon!",
    techStack: ["React", "Next.js", "TypeScript"],
    imageGradient: "from-[#A8DADC]/20 to-transparent",
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
    imageGradient: "from-[#B39CD0]/40 via-[#A8DADC]/20 to-[#B39CD0]/10",
    featured: true,
    category: "backend",
  },
  {
    id: "ai-transcription",
    title: "AI Audio Transcription Tool",
    description:
      "Automated audio transcription and document summarization using GPT-4 and Whisper, reducing workflow bottlenecks by 32% at North Light AI.",
    techStack: ["Python", "GPT-4", "Whisper", "Docker"],
    imageGradient: "from-[#B39CD0]/30 to-[#B39CD0]/10",
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
    imageGradient: "from-[#FFC1CC]/40 via-[#B39CD0]/20 to-[#FFC1CC]/10",
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
    imageGradient: "from-[#FFC1CC]/30 to-[#FFC1CC]/10",
    featured: false,
    comingSoon: true,
    category: "cloud",
  },
];
