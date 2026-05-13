import { getTranslations } from "next-intl/server";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { ToastProvider } from "@/components/ui/toast";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // skipToMain lives in the `nav` namespace, not `a11y` — using the
  // a11yT translator here was the source of a type-check break on main.
  const navT = await getTranslations("nav");

  return (
    <ToastProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {navT("skipToMain")}
      </a>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
