import { Navbar, Footer } from "@/components/layout";
import { JsonLd } from "@/components/common/JsonLd";
import { MotionProvider } from "@/components/common/MotionProvider";
import { ScrollProvider } from "@/components/common/ScrollProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      {/* One Lenis smooth-scroll instance for the whole public site — Navbar,
          MobileMenu, and every section's ScrollTriggers hang off it. */}
      <ScrollProvider>
        <JsonLd />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </ScrollProvider>
    </MotionProvider>
  );
}
