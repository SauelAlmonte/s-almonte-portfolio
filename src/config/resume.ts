import { DEFAULT_LANDING_EXPERIENCES } from "@/config/experience";

/** Shape matching `ExperienceSchema` (no `_id`). */
export type ResumeSeedExperience = {
  company: string;
  role: string;
  period: string;
  location?: string;
  description?: string;
  bullets: string[];
  tech: string[];
  order: number;
};

/** Shape matching `EducationSchema` (optional `credentialUrl` for verified programs). */
export type ResumeSeedEducation = {
  school: string;
  degree: string;
  field?: string;
  year?: string;
  description?: string;
  credentialUrl?: string;
};

/** Shape matching `CertificationSchema`. */
export type ResumeSeedCertification = {
  name: string;
  issuer: string;
  year?: string;
  description?: string;
  credentialUrl?: string;
};

/**
 * Default education rows — synced into Mongo from Admin “Sync from portfolio config”.
 * Keep in sync with the public About fallback in `getDefaultLandingCredentialCards`.
 */
export const RESUME_SEED_EDUCATION: ResumeSeedEducation[] = [
  {
    school: "Bunker Hill Community College",
    degree: "A.S. Computer Science · A.A. Mathematics",
    year: "Expected June 2027",
  },
  {
    school: "Meta · Coursera",
    degree: "Front-End Developer Professional Certificate",
    year: "2025-01-12",
    credentialUrl:
      "https://www.credly.com/badges/66608cd0-d62f-4d81-8b27-36664aec10bb/linked_in_profile",
  },
];

export const RESUME_SEED_CERTIFICATIONS: ResumeSeedCertification[] = [
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    year: "2025-06-06",
    credentialUrl:
      "https://www.credly.com/badges/2c79f693-01e6-422c-b5a4-c3adcd374cdf/public_url",
  },
  {
    name: "C++ Essentials 1",
    issuer: "CISCO Network Academy",
    year: "2025-07-20",
    credentialUrl:
      "https://www.credly.com/badges/d5da802a-e6a3-448d-bcca-122cb94be261/public_url",
  },
  {
    name: "C++ Essentials 2",
    issuer: "CISCO Network Academy",
    year: "2025-07-22",
    credentialUrl:
      "https://www.credly.com/badges/db901e18-76ea-4ac7-ab69-112155b906db/public_url",
  },
];

export function getResumeSeedExperiences(): ResumeSeedExperience[] {
  return DEFAULT_LANDING_EXPERIENCES.map((e, i) => ({
    company: e.company,
    role: e.role,
    period: e.period,
    location: e.location,
    description: "",
    bullets: [...e.achievements],
    tech: [...e.tech],
    order: i,
  }));
}

/** Public About section: credential cards when Mongo has no education/certs. */
export type LandingCredentialCard = {
  institution: string;
  degree: string;
  period: string;
  credentialUrl: string | null;
  /** Optional; primarily used for certifications. */
  description?: string | null;
};

export function getDefaultLandingCredentialCards(): LandingCredentialCard[] {
  const fromEdu: LandingCredentialCard[] = RESUME_SEED_EDUCATION.map((e) => ({
    institution: e.school,
    degree: e.degree,
    period: e.year ?? "",
    credentialUrl: e.credentialUrl?.trim() || null,
  }));
  const fromCert: LandingCredentialCard[] = RESUME_SEED_CERTIFICATIONS.map((c) => ({
    institution: c.issuer,
    degree: c.name,
    period: c.year ?? "",
    credentialUrl: c.credentialUrl?.trim() || null,
    description: c.description?.trim() || null,
  }));
  return [...fromEdu, ...fromCert];
}
