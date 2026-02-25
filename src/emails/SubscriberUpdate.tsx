import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface SubscriberUpdateProps {
  subscriberName: string;
  updateType: "resume" | "project";
  updateTitle: string;
  updateDescription: string;
  unsubscribeUrl: string;
}

export function SubscriberUpdate({
  subscriberName,
  updateType,
  updateTitle,
  updateDescription,
  unsubscribeUrl,
}: SubscriberUpdateProps) {
  const firstName = subscriberName.split(" ")[0];
  const typeLabel = updateType === "resume" ? "Resume Update" : "New Project";

  return (
    <Html>
      <Head />
      <Preview>
        {typeLabel}: {updateTitle} — Sauel Almonte Portfolio
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerLabel}>SA · Portfolio Update</Text>
            <Heading style={headerTitle}>{typeLabel}</Heading>
            <Text style={headerSub}>Something new just dropped on my portfolio.</Text>
          </Section>

          {/* Body */}
          <Section style={bodySection}>
            <Text style={greeting}>Hey {firstName},</Text>
            <Text style={paragraph}>
              I just published an update to my portfolio that I thought you&apos;d want to
              know about:
            </Text>

            {/* Update card */}
            <Section style={updateCard}>
              <Text style={updateType === "resume" ? updateBadgeResume : updateBadgeProject}>
                {typeLabel}
              </Text>
              <Text style={updateTitle_}>{updateTitle}</Text>
              <Text style={updateDesc}>{updateDescription}</Text>
            </Section>

            <Text style={paragraph}>
              Head over to my portfolio to check it out — I&apos;m always building and
              improving!
            </Text>

            <Link href="https://s-almonte.vercel.app" style={ctaLink}>
              Visit Portfolio →
            </Link>
          </Section>

          <Hr style={divider} />

          <Section style={footerSection}>
            <Text style={footer}>
              You&apos;re receiving this because you subscribed when you contacted me via
              my portfolio.{" "}
              <Link href={unsubscribeUrl} style={unsubLink}>
                Unsubscribe
              </Link>
            </Text>
            <Text style={footerName}>
              Sauel Almonte · Full-Stack Engineer & AI Builder · Boston, MA
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  maxWidth: "560px",
  margin: "0 auto",
  overflow: "hidden",
  border: "1px solid #e4e4e7",
};

const header = {
  background: "linear-gradient(135deg, #A8DADC 0%, #B39CD0 100%)",
  padding: "36px 40px 28px",
};

const headerLabel = {
  color: "rgba(44,44,44,0.65)",
  fontSize: "11px",
  fontWeight: "700" as const,
  letterSpacing: "3px",
  textTransform: "uppercase" as const,
  margin: "0 0 8px",
};

const headerTitle = {
  color: "#2C2C2C",
  fontSize: "26px",
  fontWeight: "800" as const,
  margin: "0 0 6px",
};

const headerSub = {
  color: "rgba(44,44,44,0.7)",
  fontSize: "14px",
  margin: "0",
};

const bodySection = { padding: "32px 40px 24px" };

const greeting = {
  color: "#18181b",
  fontSize: "16px",
  fontWeight: "600" as const,
  margin: "0 0 14px",
};

const paragraph = {
  color: "#3f3f46",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 14px",
};

const updateCard = {
  background: "#f9fafb",
  border: "1px solid #e4e4e7",
  borderRadius: "12px",
  padding: "20px 24px",
  margin: "20px 0",
};

const updateBadgeResume = {
  display: "inline-block",
  background: "#A8DADC22",
  color: "#3e9ea0",
  fontSize: "11px",
  fontWeight: "700" as const,
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  padding: "3px 10px",
  borderRadius: "999px",
  margin: "0 0 10px",
};

const updateBadgeProject = {
  ...updateBadgeResume,
  background: "#B39CD022",
  color: "#7b56a8",
};

const updateTitle_ = {
  color: "#18181b",
  fontSize: "17px",
  fontWeight: "700" as const,
  margin: "0 0 6px",
};

const updateDesc = {
  color: "#71717a",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
};

const ctaLink = {
  display: "inline-block",
  background: "#A8DADC",
  color: "#2C2C2C",
  fontWeight: "700" as const,
  fontSize: "14px",
  padding: "12px 28px",
  borderRadius: "999px",
  textDecoration: "none",
  margin: "8px 0 0",
};

const divider = { borderColor: "#f4f4f5", margin: "0 40px" };

const footerSection = { padding: "20px 40px 28px" };

const footer = {
  color: "#a1a1aa",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "0 0 6px",
};

const unsubLink = { color: "#A8DADC", textDecoration: "underline" };

const footerName = {
  color: "#d4d4d8",
  fontSize: "11px",
  margin: "0",
};
