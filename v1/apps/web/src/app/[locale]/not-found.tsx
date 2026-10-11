import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-16">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("description")}</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">
            {t("action")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
