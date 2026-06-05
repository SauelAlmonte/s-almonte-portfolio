import { siteConfig } from "@/config/site";
import { serializeJsonLd } from "@/lib/seo/json-ld";

export function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.person.name,
    url: siteConfig.url,
    jobTitle: siteConfig.person.jobTitle,
    description: siteConfig.description,
    email: `mailto:${siteConfig.person.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Boston",
      addressRegion: "MA",
      addressCountry: "US",
    },
    knowsLanguage: siteConfig.person.languages,
    knowsAbout: siteConfig.person.skills,
    hasCredential: siteConfig.person.certifications.map((cert) => ({
      "@type": "EducationalOccupationalCredential",
      name: cert,
    })),
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.youtube,
    ].filter(Boolean),
    image: `${siteConfig.url}/opengraph-image`,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: { "@type": "Person", name: siteConfig.person.name },
    inLanguage: "en-US",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(website) }}
      />
    </>
  );
}
