import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** v1's editorial page header band: icon tile, display title, description, actions on the right. */
export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  actions,
}: {
  icon: LucideIcon;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="border-b border-rule bg-header">
      <div className="flex flex-col gap-4 px-4 py-6 sm:px-8 lg:min-h-[120px] xl:flex-row xl:items-end xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-rule bg-page-2 text-ink">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1.5">
            {eyebrow && <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">{eyebrow}</div>}
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            {description && <div className="max-w-prose text-sm leading-6 text-ink-2">{description}</div>}
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function PageBody({ children }: { children: ReactNode }) {
  return <div className="px-4 py-6 sm:px-8">{children}</div>;
}
