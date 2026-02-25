import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactThankYouProps {
  senderName: string;
}

export function ContactThankYou({ senderName }: ContactThankYouProps) {
  const firstName = senderName.split(" ")[0];

  return (
    <Html>
      <Head />
      <Preview>Thanks for reaching out, {firstName}! I'll be in touch soon.</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerLabel}>Sauel Almonte · Portfolio</Text>
            <Heading style={headerTitle}>Message Received!</Heading>
            <Text style={headerSub}>
              Thank you for visiting my online portfolio.
            </Text>
          </Section>

          {/* Body */}
          <Section style={bodySection}>
            <Text style={greeting}>Hi {firstName},</Text>
            <Text style={paragraph}>
              Thank you for reaching out! I&apos;ve received your message and truly appreciate
              you taking the time to contact me.
            </Text>
            <Text style={paragraph}>
              I&apos;ll review your message and get back to you as soon as possible —
              typically within <strong>1–2 business days</strong>.
            </Text>
            <Text style={paragraph}>
              In the meantime, feel free to explore more of my work on my portfolio
              or connect with me on LinkedIn and GitHub.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Social links as text */}
          <Section style={socialSection}>
            <Text style={socialLabel}>Connect with me</Text>
            <Text style={socialLinks}>
              GitHub: github.com/SauelAlmonte{"   "}·{"   "}
              LinkedIn: linkedin.com/in/sauel-almonte
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={footerSection}>
            <Text style={signOff}>
              Warm regards,{"\n"}
              <strong>Sauel Almonte</strong>
            </Text>
            <Text style={footer}>
              Full-Stack Engineer & AI Builder · Boston, MA
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
  padding: "40px 40px 32px",
};

const headerLabel = {
  color: "rgba(44,44,44,0.7)",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "3px",
  textTransform: "uppercase" as const,
  margin: "0 0 10px",
};

const headerTitle = {
  color: "#2C2C2C",
  fontSize: "28px",
  fontWeight: "800",
  margin: "0 0 8px",
};

const headerSub = {
  color: "rgba(44,44,44,0.75)",
  fontSize: "15px",
  margin: "0",
};

const bodySection = {
  padding: "32px 40px 24px",
};

const greeting = {
  color: "#18181b",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const paragraph = {
  color: "#3f3f46",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 14px",
};

const divider = {
  borderColor: "#f4f4f5",
  margin: "0 40px",
};

const socialSection = {
  padding: "20px 40px",
};

const socialLabel = {
  color: "#71717a",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  margin: "0 0 8px",
};

const socialLinks = {
  color: "#A8DADC",
  fontSize: "13px",
  margin: "0",
};

const footerSection = {
  padding: "20px 40px 32px",
};

const signOff = {
  color: "#18181b",
  fontSize: "15px",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap" as const,
  margin: "0 0 6px",
};

const footer = {
  color: "#a1a1aa",
  fontSize: "12px",
  margin: "0",
};
