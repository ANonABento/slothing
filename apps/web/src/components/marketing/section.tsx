import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Shared primitives for marketing-page layout. The home, extension,
// ats-scanner, pricing, and vs/* routes each previously inlined the same
// `<section py-20 lg:py-32><div max-w-Nxl mx-auto px-6>` chrome around
// every region, plus the eyebrow + title + lead block above each. The
// repetition is what the audit means by "no shared marketing primitives".

type SectionWidth = "wide" | "narrow";
type SectionBackground = "default" | "muted";

interface MarketingSectionProps {
  id?: string;
  width?: SectionWidth;
  background?: SectionBackground;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}

const widthClass: Record<SectionWidth, string> = {
  wide: "max-w-6xl",
  narrow: "max-w-4xl",
};

export function MarketingSection({
  id,
  width = "wide",
  background = "default",
  className,
  innerClassName,
  children,
}: MarketingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 lg:py-32",
        background === "muted" && "bg-muted/30",
        className,
      )}
    >
      <div className={cn("mx-auto px-6", widthClass[width], innerClassName)}>
        {children}
      </div>
    </section>
  );
}

type HeaderAlign = "center" | "left";

interface MarketingSectionHeaderProps {
  // Optional eyebrow content. Each section styles its eyebrow differently
  // (Features uses a primary-tinted pill, How-It-Works a primary-bordered
  // pill, Testimonials a plain primary-tinted label), so the primitive
  // accepts whatever ReactNode the caller wants here instead of forcing
  // a single style.
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: HeaderAlign;
  className?: string;
}

export function MarketingSectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: MarketingSectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-16 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <div className="mb-4">{eyebrow}</div> : null}
      <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-lg leading-8 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
