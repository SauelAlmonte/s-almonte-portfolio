import { Navbar, Footer } from "@/components/layout";
import { JsonLd } from "@/components/common/JsonLd";
import { MotionProvider } from "@/components/common/MotionProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <JsonLd />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </MotionProvider>
  );
}
