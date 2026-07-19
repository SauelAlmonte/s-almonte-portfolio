import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORY_META, type ProjectCategory } from "@/config/projects";
import { siteConfig } from "@/config/site";
import { loadPublishedProjectsByCategory } from "@/lib/projects/load-published-projects";
import { serializeJsonLd } from "@/lib/seo/json-ld";
import { ProjectsPageClient } from "./ProjectsPageClient";

// Rendered per request: the nonce-based CSP (src/proxy.ts) rules out cached
// HTML, so ISR/generateStaticParams were removed with it.

interface PageProps {
  params: Promise<{ category: string }>;
}

const VALID_CATEGORIES: ProjectCategory[] = ["fullstack", "backend", "cloud"];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category as ProjectCategory)) return {};
  const meta = CATEGORY_META[category as ProjectCategory];
  const canonical = `${siteConfig.url}/skills/${category}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as ProjectCategory)) {
    notFound();
  }

  const cat = category as ProjectCategory;
  const projects = await loadPublishedProjectsByCategory(cat);
  const meta = CATEGORY_META[cat];
  const pageUrl = `${siteConfig.url}/skills/${cat}`;

  // Breadcrumb (Home › Skills & Projects › <Category>) + a CollectionPage whose
  // ItemList enumerates the published projects. Gives search/AI engines a
  // machine-readable map of this page's substantive content.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Skills & Projects", item: `${siteConfig.url}/#skills` },
          { "@type": "ListItem", position: 3, name: meta.title, item: pageUrl },
        ],
      },
      {
        "@type": "CollectionPage",
        name: meta.title,
        description: meta.description,
        url: pageUrl,
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: projects.length,
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "SoftwareSourceCode",
              name: project.title,
              description: project.description,
              programmingLanguage: project.techStack,
              ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
              ...(project.liveUrl ? { url: project.liveUrl } : {}),
            },
          })),
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <ProjectsPageClient category={cat} projects={projects} meta={meta} />
    </>
  );
}
