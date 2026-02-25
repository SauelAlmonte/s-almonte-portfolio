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
  Row,
  Column,
} from "@react-email/components";

interface ContactNotificationProps {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  sentAt: string;
}

export function ContactNotification({
  senderName,
  senderEmail,
  subject,
  message,
  sentAt,
}: ContactNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New message from {senderName} via your portfolio</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerLabel}>SA · Portfolio</Text>
            <Heading style={headerTitle}>New Contact Message</Heading>
          </Section>

          {/* Sender details */}
          <Section style={detailsSection}>
            <Row>
              <Column style={detailLabel}>From</Column>
              <Column style={detailValue}>{senderName}</Column>
            </Row>
            <Row style={{ marginTop: "8px" }}>
              <Column style={detailLabel}>Email</Column>
              <Column style={detailValue}>{senderEmail}</Column>
            </Row>
            <Row style={{ marginTop: "8px" }}>
              <Column style={detailLabel}>Subject</Column>
              <Column style={detailValue}>{subject}</Column>
            </Row>
            <Row style={{ marginTop: "8px" }}>
              <Column style={detailLabel}>Sent</Column>
              <Column style={detailValue}>{sentAt}</Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Message */}
          <Section style={messageSection}>
            <Text style={messageLabel}>Message</Text>
            <Text style={messageBody}>{message}</Text>
          </Section>

          <Hr style={divider} />

          <Text style={footer}>
            This message was sent via your portfolio contact form at s-almonte.vercel.app
          </Text>
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
  background: "linear-gradient(135deg, #2C2C2C 0%, #3d3d3d 100%)",
  padding: "32px 40px",
};

const headerLabel = {
  color: "#A8DADC",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "3px",
  textTransform: "uppercase" as const,
  margin: "0 0 8px",
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "800",
  margin: "0",
};

const detailsSection = {
  padding: "28px 40px 16px",
};

const detailLabel = {
  color: "#71717a",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  width: "80px",
};

const detailValue = {
  color: "#18181b",
  fontSize: "14px",
  fontWeight: "500",
};

const divider = {
  borderColor: "#f4f4f5",
  margin: "0 40px",
};

const messageSection = {
  padding: "24px 40px",
};

const messageLabel = {
  color: "#71717a",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 12px",
};

const messageBody = {
  color: "#18181b",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const footer = {
  color: "#a1a1aa",
  fontSize: "12px",
  textAlign: "center" as const,
  padding: "16px 40px 28px",
  margin: "0",
};
