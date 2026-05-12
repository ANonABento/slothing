import { getA11yTranslations } from "@/lib/i18n/get-a11y-translations";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { ToastProvider } from "@/components/ui/toast";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const a11yT = await getA11yTranslations();

  return (
    <ToastProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {a11yT("skipToMain")}
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
