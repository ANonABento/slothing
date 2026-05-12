import { cn } from "@/lib/utils";

interface SlothMascotProps {
  className?: string;
  ariaLabel?: string;
}

export function SlothMascot({ className, ariaLabel }: SlothMascotProps) {
  const decorative = !ariaLabel;

  return (
    <svg
      viewBox="0 0 240 280"
      xmlns="http://www.w3.org/2000/svg"
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={ariaLabel}
      className={cn("h-full w-full text-foreground", className)}
    >
      {/* Soft halo */}
      <g className="text-primary">
        <circle cx="120" cy="150" r="108" fill="currentColor" opacity="0.08" />
        <circle cx="120" cy="150" r="78" fill="currentColor" opacity="0.06" />
      </g>

      {/* Tree branch */}
      <g className="text-foreground">
        <rect
          x="6"
          y="42"
          width="228"
          height="16"
          rx="8"
          fill="currentColor"
          opacity="0.22"
        />
        <rect
          x="6"
          y="42"
          width="228"
          height="6"
          rx="3"
          fill="currentColor"
          opacity="0.14"
        />
        <circle cx="32" cy="50" r="3" fill="currentColor" opacity="0.3" />
        <circle cx="198" cy="50" r="2.5" fill="currentColor" opacity="0.3" />
      </g>

      {/* Tiny leaves */}
      <g className="text-primary">
        <path
          d="M58 42 Q 64 28, 80 32 Q 72 44, 58 42 Z"
          fill="currentColor"
          opacity="0.55"
        />
        <path
          d="M170 42 Q 176 28, 192 32 Q 184 44, 170 42 Z"
          fill="currentColor"
          opacity="0.45"
        />
        <path
          d="M62 36 L 70 26"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.6"
          fill="none"
        />
        <path
          d="M178 36 L 186 26"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.6"
          fill="none"
        />
      </g>

      {/* Left arm wrapping the branch */}
      <g className="text-card">
        <path
          d="M86 70 C 60 40, 24 56, 48 92 C 64 116, 84 110, 96 96 Z"
          fill="currentColor"
        />
      </g>
      <g className="text-foreground">
        <path
          d="M86 70 C 60 40, 24 56, 48 92 C 64 116, 84 110, 96 96"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* Claws */}
        <path
          d="M40 60 L 30 50 M 46 56 L 38 44 M 52 54 L 46 42"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.85"
          fill="none"
        />
      </g>

      {/* Right arm wrapping the branch */}
      <g className="text-card">
        <path
          d="M154 70 C 180 40, 216 56, 192 92 C 176 116, 156 110, 144 96 Z"
          fill="currentColor"
        />
      </g>
      <g className="text-foreground">
        <path
          d="M154 70 C 180 40, 216 56, 192 92 C 176 116, 156 110, 144 96"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* Claws */}
        <path
          d="M200 60 L 210 50 M 194 56 L 202 44 M 188 54 L 194 42"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.85"
          fill="none"
        />
      </g>

      {/* Body */}
      <g className="text-card">
        <ellipse cx="120" cy="170" rx="62" ry="74" fill="currentColor" />
      </g>
      <g className="text-foreground">
        <ellipse
          cx="120"
          cy="170"
          rx="62"
          ry="74"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.85"
        />
        {/* Belly shading */}
        <ellipse
          cx="120"
          cy="186"
          rx="38"
          ry="44"
          fill="currentColor"
          opacity="0.06"
        />
      </g>

      {/* Face mask */}
      <g className="text-primary">
        <ellipse
          cx="120"
          cy="118"
          rx="46"
          ry="38"
          fill="currentColor"
          opacity="0.18"
        />
        <ellipse
          cx="120"
          cy="124"
          rx="38"
          ry="28"
          fill="currentColor"
          opacity="0.22"
        />
      </g>

      {/* Sleepy eyes */}
      <g className="text-foreground">
        <path
          d="M96 122 Q 104 130, 114 122"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M126 122 Q 134 130, 144 122"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Nose */}
        <ellipse
          cx="120"
          cy="136"
          rx="3.5"
          ry="2.6"
          fill="currentColor"
          opacity="0.85"
        />
        {/* Soft smile */}
        <path
          d="M112 146 Q 120 152, 128 146"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
      </g>

      {/* Blush */}
      <g className="text-primary">
        <circle cx="92" cy="140" r="6" fill="currentColor" opacity="0.35" />
        <circle cx="148" cy="140" r="6" fill="currentColor" opacity="0.35" />
      </g>

      {/* Resume held in the belly */}
      <g className="text-card">
        <rect
          x="92"
          y="176"
          width="56"
          height="68"
          rx="6"
          fill="currentColor"
        />
      </g>
      <g className="text-foreground">
        <rect
          x="92"
          y="176"
          width="56"
          height="68"
          rx="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          opacity="0.85"
        />
        {/* Document lines */}
        <line
          x1="102"
          y1="192"
          x2="138"
          y2="192"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.4"
        />
        <line
          x1="102"
          y1="202"
          x2="134"
          y2="202"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.4"
        />
        <line
          x1="102"
          y1="212"
          x2="138"
          y2="212"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.4"
        />
        <line
          x1="102"
          y1="222"
          x2="128"
          y2="222"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.4"
        />
      </g>
      {/* Highlighted resume row in brand color */}
      <g className="text-primary">
        <rect
          x="100"
          y="184"
          width="22"
          height="4"
          rx="2"
          fill="currentColor"
        />
        <rect
          x="100"
          y="232"
          width="18"
          height="4"
          rx="2"
          fill="currentColor"
          opacity="0.6"
        />
      </g>

      {/* Tiny sparkle */}
      <g className="text-primary">
        <path
          d="M186 132 l 4 -10 l 4 10 l 10 4 l -10 4 l -4 10 l -4 -10 l -10 -4 z"
          fill="currentColor"
          opacity="0.55"
        />
      </g>
    </svg>
  );
}
