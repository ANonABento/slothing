import { ArrowLeft, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { IconTile } from "./ui";

/**
 * The page header band. Always one compact row at --bar-h (the sidebar brand row's height, so the
 * two bottom rules line up): icon or back link, title, one-line description, actions on the right.
 */
export function PageHeader({
  icon,
  back,
  title,
  description,
  actions,
}: {
  icon: LucideIcon;
  /** Detail pages: the icon tile becomes a link back to the parent list. */
  back?: { href: string; label: string };
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="border-b border-rule bg-header">
      <div className="flex min-h-bar flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-8 lg:h-bar lg:flex-nowrap lg:py-0">
        {back ? (
          <Link href={back.href} aria-label={`Back to ${back.label}`} title={`Back to ${back.label}`} className="group rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
            <IconTile icon={ArrowLeft} className="transition-colors group-hover:border-rule-strong group-hover:bg-paper" />
          </Link>
        ) : (
          <IconTile icon={icon} />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-2xl font-bold leading-tight tracking-tight">{title}</h1>
          {description && <div className="truncate text-sm text-ink-2">{description}</div>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function PageBody({ children }: { children: ReactNode }) {
  return <div className="px-4 py-6 sm:px-8">{children}</div>;
}
