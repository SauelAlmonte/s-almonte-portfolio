/** Default experience cards for the landing page when `ResumeData` has no experience entries. */
export type LandingExperienceCard = {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  duration: string;
  accent: string;
  accentClass: string;
  borderClass: string;
  tagClass: string;
  dotClass: string;
  achievements: string[];
  tech: string[];
};

export const DEFAULT_LANDING_EXPERIENCES: LandingExperienceCard[] = [
  {
    id: "01",
    role: "Full-Stack Developer & Mentor",
    company: "Urban League of Eastern Massachusetts",
    location: "Boston, MA",
    period: "May 2021 – Feb 2025",
    duration: "~4 years",
    accent: "#A8DADC",
    accentClass: "from-[#A8DADC]/20 to-[#A8DADC]/5",
    borderClass: "border-[#A8DADC]/30 hover:border-[#A8DADC]/70",
    tagClass: "bg-[#A8DADC]/15 text-[#5aacae] dark:text-[#A8DADC]",
    dotClass: "bg-[#A8DADC]",
    achievements: [
      "Developed web apps with React & Tailwind, improving page load times by 40%",
      "Mentored 50+ early-career technologists through workshops and mock interviews",
      "Facilitated weekly dev bootcamps for fluency in modern frontend development",
    ],
    tech: ["React", "TypeScript", "Tailwind CSS", "JavaScript"],
  },
  {
    id: "02",
    role: "AI Engineer Intern",
    company: "North Light AI",
    location: "Remote",
    period: "Sep 2024 – Jan 2025",
    duration: "5 months",
    accent: "#B39CD0",
    accentClass: "from-[#B39CD0]/20 to-[#B39CD0]/5",
    borderClass: "border-[#B39CD0]/30 hover:border-[#B39CD0]/70",
    tagClass: "bg-[#B39CD0]/15 text-[#7b56a8] dark:text-[#B39CD0]",
    dotClass: "bg-[#B39CD0]",
    achievements: [
      "Deployed AI tools using GPT-4 & Whisper, reducing workflow bottlenecks by 32%",
      "Built containerized ML pipelines from data ingestion through model evaluation",
      "Coordinated a remote Agile team of 5 through sprint planning and task tracking",
    ],
    tech: ["Python", "GPT-4", "Whisper", "Docker", "LangChain"],
  },
  {
    id: "03",
    role: "IT Support/Travel Expert",
    company: "Overseas Adventure Travel",
    location: "Boston, MA",
    period: "Oct 2021 – Sep 2024",
    duration: "~3 years",
    accent: "#FFC1CC",
    accentClass: "from-[#FFC1CC]/20 to-[#FFC1CC]/5",
    borderClass: "border-[#FFC1CC]/30 hover:border-[#FFC1CC]/70",
    tagClass: "bg-[#FFC1CC]/15 text-[#c0536a] dark:text-[#FFC1CC]",
    dotClass: "bg-[#FFC1CC]",
    achievements: [
      "Automated diagnostics with Bash and Azure CLI; improved monitoring reliability by 25%.",
      "Shipped GERT–CRM integrations with cross-functional teams, tightening day-to-day ops.",
      "Shared performance and user insights with engineering, cutting repeat support tickets.",
    ],
    tech: ["Bash", "Azure CLI", "CRM", "IT Support"],
  },
  {
    id: "04",
    role: "Software Engineer Intern",
    company: "Wayfair",
    location: "Boston, MA",
    period: "May 2023 – Aug 2023",
    duration: "4 months",
    accent: "#A8DADC",
    accentClass: "from-[#A8DADC]/20 to-[#A8DADC]/5",
    borderClass: "border-[#A8DADC]/30 hover:border-[#A8DADC]/70",
    tagClass: "bg-[#A8DADC]/15 text-[#5aacae] dark:text-[#A8DADC]",
    dotClass: "bg-[#A8DADC]",
    achievements: [
      "Refactored legacy services into Python microservices, reducing technical debt",
      "Built real-time data pipelines using Kafka for high-volume event stream processing",
      "Containerized tools with Docker & CI/CD, shortening deployment cycles by 30%",
    ],
    tech: ["Python", "Kafka", "Docker", "CI/CD", "Microservices"],
  },
];

const ACCENT_STYLES: Pick<
  LandingExperienceCard,
  "accent" | "accentClass" | "borderClass" | "tagClass" | "dotClass"
>[] = [
  {
    accent: "#A8DADC",
    accentClass: "from-[#A8DADC]/20 to-[#A8DADC]/5",
    borderClass: "border-[#A8DADC]/30 hover:border-[#A8DADC]/70",
    tagClass: "bg-[#A8DADC]/15 text-[#5aacae] dark:text-[#A8DADC]",
    dotClass: "bg-[#A8DADC]",
  },
  {
    accent: "#B39CD0",
    accentClass: "from-[#B39CD0]/20 to-[#B39CD0]/5",
    borderClass: "border-[#B39CD0]/30 hover:border-[#B39CD0]/70",
    tagClass: "bg-[#B39CD0]/15 text-[#7b56a8] dark:text-[#B39CD0]",
    dotClass: "bg-[#B39CD0]",
  },
  {
    accent: "#FFC1CC",
    accentClass: "from-[#FFC1CC]/20 to-[#FFC1CC]/5",
    borderClass: "border-[#FFC1CC]/30 hover:border-[#FFC1CC]/70",
    tagClass: "bg-[#FFC1CC]/15 text-[#c0536a] dark:text-[#FFC1CC]",
    dotClass: "bg-[#FFC1CC]",
  },
];

type LeanExp = {
  role?: string;
  company?: string;
  period?: string;
  location?: string;
  description?: string;
  bullets?: string[];
  tech?: string[];
};

export function mapResumeExperiencesToLandingCards(
  items: LeanExp[]
): LandingExperienceCard[] {
  return items.map((doc, index) => {
    const style = ACCENT_STYLES[index % ACCENT_STYLES.length]!;
    const bullets = Array.isArray(doc.bullets)
      ? doc.bullets.map((b) => String(b).trim()).filter(Boolean)
      : [];
    const desc = typeof doc.description === "string" ? doc.description.trim() : "";
    const achievements =
      bullets.length > 0 ? bullets : desc ? [desc] : ["Add bullet points in Admin Resume."];
    const tech = Array.isArray(doc.tech)
      ? doc.tech.map((t) => String(t).trim()).filter(Boolean)
      : [];

    return {
      id: String(index + 1).padStart(2, "0"),
      role: typeof doc.role === "string" ? doc.role : "Role",
      company: typeof doc.company === "string" ? doc.company : "Company",
      location: typeof doc.location === "string" ? doc.location : "",
      period: typeof doc.period === "string" ? doc.period : "",
      duration: "",
      ...style,
      achievements,
      tech,
    };
  });
}

export const DEFAULT_RESUME_DOWNLOAD = {
  href: "/sauel_almonte_resume_Software.pdf",
  download: "sauel_almonte_resume_Software.pdf",
} as const;

/** Landing-page resume picker: both PDFs in `public/`. */
export const LANDING_RESUME_CHOICES = [
  {
    id: "software",
    label: "Software resume",
    description: "Engineering, full-stack & product delivery",
    href: "/sauel_almonte_resume_Software.pdf",
    download: "sauel_almonte_resume_Software.pdf",
  },
  {
    id: "it",
    label: "IT resume",
    description: "IT support & technical operations",
    href: "/sauel_almonte_resume_IT.pdf",
    download: "sauel_almonte_resume_IT.pdf",
  },
] as const;

export type LandingResumePdfChoice = {
  id: string;
  label: string;
  description: string;
  href: string;
  download: string;
};
