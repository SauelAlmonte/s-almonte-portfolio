import { Hero, About, Experience, Skills, Contact } from "@/components/sections";
import { getSkillsForLandingSection } from "@/lib/skills/get-skills-for-section";
import { getResumeForLanding } from "@/lib/resume/get-resume-for-landing";

// Rendered per request: the nonce-based CSP (src/proxy.ts) rules out cached
// HTML. Admin edits are visible immediately as a side effect.

export default async function Home() {
  const [skillsByCategory, resumeLanding] = await Promise.all([
    getSkillsForLandingSection(),
    getResumeForLanding(),
  ]);

  return (
    <>
      <Hero />
      <About
        professionalSummary={resumeLanding.professionalSummary}
        credentialCards={resumeLanding.credentialCards}
        pdfChoices={resumeLanding.pdfChoices}
      />
      <Experience experiences={resumeLanding.experienceCards} pdfChoices={resumeLanding.pdfChoices} />
      <Skills skillsByCategory={skillsByCategory} />
      <Contact />
    </>
  );
}
