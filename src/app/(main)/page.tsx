import { Hero, About, Experience, Skills, Contact } from "@/components/sections";
import { getSkillsForLandingSection } from "@/lib/skills/get-skills-for-section";
import { getResumeForLanding } from "@/lib/resume/get-resume-for-landing";

// ISR: serve static HTML to visitors/crawlers, refresh from Mongo hourly.
// Admin edits appear within the revalidate window (see revalidatePath note below).
export const revalidate = 3600;

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
