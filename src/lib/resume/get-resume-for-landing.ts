import { connectToDatabase } from "@/lib/db/mongoose";
import { ResumeData } from "@/lib/models/ResumeData";
import {
  DEFAULT_LANDING_EXPERIENCES,
  DEFAULT_RESUME_DOWNLOAD,
  LANDING_RESUME_CHOICES,
  mapResumeExperiencesToLandingCards,
  type LandingExperienceCard,
  type LandingResumePdfChoice,
} from "@/config/experience";
import {
  getDefaultLandingCredentialCards,
  type LandingCredentialCard,
} from "@/config/resume";

type LeanEdu = {
  school?: string;
  degree?: string;
  year?: string;
  credentialUrl?: string;
};

type LeanCert = {
  name?: string;
  issuer?: string;
  year?: string;
  description?: string;
  credentialUrl?: string;
};

function normalizeDownloadUrl(raw: string | undefined | null): { href: string; download?: string } {
  const t = typeof raw === "string" ? raw.trim() : "";
  if (!t) return { ...DEFAULT_RESUME_DOWNLOAD };
  if (t.startsWith("http://") || t.startsWith("https://")) {
    return { href: t };
  }
  if (t.startsWith("/")) {
    const file = t.split("/").filter(Boolean).pop() ?? "";
    return {
      href: t,
      download: file.endsWith(".pdf") ? file : undefined,
    };
  }
  return { href: `/${t.replace(/^\//, "")}` };
}

function buildLandingPdfChoices(
  softwareRaw: string | undefined | null,
  itRaw: string | undefined | null
): LandingResumePdfChoice[] {
  const base: LandingResumePdfChoice[] = LANDING_RESUME_CHOICES.map((c) => ({
    id: c.id,
    label: c.label,
    description: c.description,
    href: c.href,
    download: c.download,
  }));
  if (typeof softwareRaw === "string" && softwareRaw.trim()) {
    const n = normalizeDownloadUrl(softwareRaw);
    base[0] = {
      ...base[0],
      href: n.href,
      download: n.download ?? base[0].download,
    };
  }
  if (typeof itRaw === "string" && itRaw.trim()) {
    const n = normalizeDownloadUrl(itRaw);
    base[1] = {
      ...base[1],
      href: n.href,
      download: n.download ?? base[1].download,
    };
  }
  return base;
}

function mongoCredentialsToLanding(
  education: LeanEdu[],
  certifications: LeanCert[]
): LandingCredentialCard[] {
  const ed: LandingCredentialCard[] = education.map((e) => ({
    institution: typeof e.school === "string" ? e.school : "",
    degree: typeof e.degree === "string" ? e.degree : "",
    period: typeof e.year === "string" ? e.year : "",
    credentialUrl:
      typeof e.credentialUrl === "string" && e.credentialUrl.trim()
        ? e.credentialUrl.trim()
        : null,
  }));
  const ce: LandingCredentialCard[] = certifications.map((c) => ({
    institution: typeof c.issuer === "string" ? c.issuer : "",
    degree: typeof c.name === "string" ? c.name : "",
    period: typeof c.year === "string" ? c.year : "",
    credentialUrl:
      typeof c.credentialUrl === "string" && c.credentialUrl.trim()
        ? c.credentialUrl.trim()
        : null,
    description:
      typeof c.description === "string" && c.description.trim()
        ? c.description.trim()
        : null,
  }));
  return [...ed, ...ce];
}

export type LandingResumePayload = {
  experienceCards: LandingExperienceCard[];
  professionalSummary: string;
  credentialCards: LandingCredentialCard[];
  pdfChoices: LandingResumePdfChoice[];
};

/**
 * Public landing resume: experience cards, summary, education/certs, PDF choices.
 * Uses config defaults when DB is empty or on connection error.
 */
export async function getResumeForLanding(): Promise<LandingResumePayload> {
  try {
    await connectToDatabase();
    const doc = await ResumeData.findOne().lean();
    if (!doc) {
      return {
        experienceCards: DEFAULT_LANDING_EXPERIENCES,
        professionalSummary: "",
        credentialCards: getDefaultLandingCredentialCards(),
        pdfChoices: buildLandingPdfChoices(undefined, undefined),
      };
    }

    const ex = Array.isArray(doc.experience) ? doc.experience : [];
    const experienceCards =
      ex.length > 0
        ? mapResumeExperiencesToLandingCards(ex as Parameters<typeof mapResumeExperiencesToLandingCards>[0])
        : DEFAULT_LANDING_EXPERIENCES;

    const education = Array.isArray(doc.education) ? doc.education : [];
    const certifications = Array.isArray(doc.certifications) ? doc.certifications : [];
    const credentialCards =
      education.length + certifications.length > 0
        ? mongoCredentialsToLanding(
            education as LeanEdu[],
            certifications as LeanCert[]
          )
        : getDefaultLandingCredentialCards();

    const pdfChoices = buildLandingPdfChoices(
      doc.resumeFileUrl as string | undefined,
      (doc as { resumeItFileUrl?: string }).resumeItFileUrl
    );

    return {
      experienceCards,
      professionalSummary: typeof doc.summary === "string" ? doc.summary : "",
      credentialCards,
      pdfChoices,
    };
  } catch {
    return {
      experienceCards: DEFAULT_LANDING_EXPERIENCES,
      professionalSummary: "",
      credentialCards: getDefaultLandingCredentialCards(),
      pdfChoices: buildLandingPdfChoices(undefined, undefined),
    };
  }
}
