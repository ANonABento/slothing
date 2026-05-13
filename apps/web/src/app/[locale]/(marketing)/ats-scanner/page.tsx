import { HonestyPanel } from "@/components/ats/honesty-panel";
import { ScannerForm } from "@/components/ats/scanner-form";
import { getLocalizedPageMetadata } from "@/lib/seo";
import { ShieldCheck, Zap, Eye, Sparkles } from "lucide-react";

export function generateMetadata({ params }: { params: { locale: string } }) {
  return getLocalizedPageMetadata("atsScanner", params.locale);
}

const BENEFITS = [
  {
    icon: Zap,
    title: "Instant Results",
    description: "Score in under a second, no signup required",
  },
  {
    icon: Eye,
    title: "Detailed Breakdown",
    description:
      "Five scoring axes plus JD keyword matching when you paste a job",
  },
  {
    icon: Sparkles,
    title: "Free and Private",
    description:
      "We parse resumes on our servers, do not save them to your account, and do not share them",
  },
];

interface ATSScannerPageProps {
  params: {
    locale: string;
  };
}

export default function ATSScannerPage({ params }: ATSScannerPageProps) {
  const locale = params.locale;

  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Free ATS Resume Scanner
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            88% of executives in Harvard&apos;s Hidden Workers study say their
            ATS configuration excludes viable candidates. We check the
            mechanical and content issues that actually trip parsers and
            recruiters.
          </p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            <a
              href="https://www.hbs.edu/managing-the-future-of-work/Documents/research/hiddenworkers09032021.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Source: Harvard Business School, Hidden Workers (2021)
            </a>
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center p-4">
              <Icon className="h-5 w-5 mx-auto mb-2 text-primary" />
              <div className="font-medium text-sm">{title}</div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </div>
          ))}
        </div>

        {/* Scanner Form */}
        <ScannerForm locale={locale} />

        {/* Honesty panel — explains what the score does and doesn't mean. */}
        <div className="mt-16">
          <HonestyPanel />
        </div>
      </div>
    </div>
  );
}
