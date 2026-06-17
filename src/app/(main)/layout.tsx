import { Navbar, Footer } from "@/components/layout";
import ChatWidgetLoader from "@/components/common/ChatWidgetLoader";
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
        {/* The public landing is dark-only by design: the `dark` class pins
            every shadcn/token utility to the hero's #080711 world regardless
            of the visitor's theme, so hero → sections never changes worlds.
            Admin keeps its own light/dark toggle. */}
        <div className="dark bg-background text-foreground">
          <JsonLd />
          <Navbar />
          <main>{children}</main>
          <Footer />
          {/* Public-only AI assistant — lives inside `.dark` so it inherits the
              hero token world; never mounted on /admin. */}
          <ChatWidgetLoader />
        </div>
      </ScrollProvider>
    </MotionProvider>
  );
}
