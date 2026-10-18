import Link from "next/link";
import type { ReactNode } from "react";

import { cx, segmentGroup, segmentItem, type Size } from "./ui";

/** Segmented, with links (URL state) instead of buttons. Apart from ui.tsx so that stays free of Next. */
export function SegmentedLinks({ options, value, size = "md", className }: { options: { value: string; label: ReactNode; href: string }[]; value: string; size?: Size; className?: string }) {
  return (
    <nav className={cx(segmentGroup, className)}>
      {options.map((o) => (
        <Link key={o.value} href={o.href} aria-current={value === o.value ? "page" : undefined} className={segmentItem(value === o.value, size)}>
          {o.label}
        </Link>
      ))}
    </nav>
  );
}
