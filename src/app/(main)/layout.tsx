import { Navbar, Footer } from "@/components/layout";
import { JsonLd } from "@/components/common/JsonLd";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
