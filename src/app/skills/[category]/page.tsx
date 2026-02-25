import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROJECTS, CATEGORY_META, type ProjectCategory } from "@/config/projects";
import { ProjectsPageClient } from "./ProjectsPageClient";

interface PageProps {
  params: Promise<{ category: string }>;
}

const VALID_CATEGORIES: ProjectCategory[] = ["fullstack", "backend", "cloud"];

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category as ProjectCategory)) return {};
  const meta = CATEGORY_META[category as ProjectCategory];
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as ProjectCategory)) {
    notFound();
  }

  const cat = category as ProjectCategory;
  const projects = PROJECTS.filter((p) => p.category === cat);
  const meta = CATEGORY_META[cat];

  return <ProjectsPageClient category={cat} projects={projects} meta={meta} />;
}
