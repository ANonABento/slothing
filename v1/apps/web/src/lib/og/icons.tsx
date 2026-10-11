import type { SVGProps } from "react";

type OgIconProps = SVGProps<SVGSVGElement>;

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function RocketIcon(props: OgIconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6.05 11A22 22 0 0 1 12 15Z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

export function BriefcaseIcon(props: OgIconProps) {
  return (
    <svg {...iconProps} {...props}>
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function ChartIcon(props: OgIconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
      <path d="M19 9h-5" />
      <path d="M19 9v5" />
    </svg>
  );
}

export function CalendarIcon(props: OgIconProps) {
  return (
    <svg {...iconProps} {...props}>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </svg>
  );
}

export function DocumentStackIcon(props: OgIconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M16 3H6a2 2 0 0 0-2 2v12" />
      <path d="M8 7h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
      <path d="M10 12h6" />
      <path d="M10 16h6" />
    </svg>
  );
}

export function ScannerIcon(props: OgIconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M7 8h10" />
      <path d="M7 12h10" />
      <path d="M7 16h6" />
    </svg>
  );
}

export function LayoutIcon(props: OgIconProps) {
  return (
    <svg {...iconProps} {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

export function EditPenIcon(props: OgIconProps) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
