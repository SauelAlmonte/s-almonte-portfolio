import { Hero, About, Experience, Skills, Contact } from "@/components/sections";
import { getSkillsForLandingSection } from "@/lib/skills/get-skills-for-section";
import { getResumeForLanding } from "@/lib/resume/get-resume-for-landing";

export const dynamic = "force-dynamic";

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
