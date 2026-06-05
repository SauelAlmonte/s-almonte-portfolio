import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

// Route segment + image metadata (read by Next's file-based metadata system)
export const alt = `${siteConfig.person.name} — ${siteConfig.person.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamically generated 1200×630 social preview.
 * Replaces the previously-referenced (and missing) /og-image.png and stays
 * in sync with siteConfig automatically — no design asset to maintain.
 */
export default function OpengraphImage() {
  // Derive the credential line from real config data instead of hardcoding it.
  const awsCertified = siteConfig.person.certifications.some((c) => /aws/i.test(c));
  const credentialLine = awsCertified
    ? `${siteConfig.person.location} · AWS Certified`
    : siteConfig.person.location;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0b1120 0%, #111827 55%, #1f2937 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        {/* Accent row mirrors the site's three category colors */}
        <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
          <div style={{ width: 64, height: 8, borderRadius: 9999, background: "#A8DADC" }} />
          <div style={{ width: 64, height: 8, borderRadius: 9999, background: "#B39CD0" }} />
          <div style={{ width: 64, height: 8, borderRadius: 9999, background: "#FFC1CC" }} />
        </div>

        <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
          {siteConfig.person.name}
        </div>

        <div style={{ fontSize: 40, fontWeight: 600, color: "#A8DADC", marginTop: 12 }}>
          {siteConfig.person.jobTitle}
        </div>

        <div style={{ fontSize: 28, color: "#94a3b8", marginTop: 28, maxWidth: 900 }}>
          {siteConfig.tagline}
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#cbd5e1", marginTop: "auto", fontWeight: 500 }}>
          {credentialLine}
        </div>
      </div>
    ),
    { ...size }
  );
}
