import type { Config } from "tailwindcss";

// Editorial tokens carried over from v1 (cream paper / Midnight Indigo / rust).
// Values live as CSS variables in globals.css; this file only names them.
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    // Replaces Tailwind's radius scale outright, so only these shapes exist (no stray rounded-xl).
    borderRadius: {
      none: "0",
      chip: "var(--radius-chip)",
      control: "var(--radius-control)",
      card: "var(--radius-card)",
      full: "9999px",
    },
    extend: {
      colors: {
        page: { DEFAULT: "var(--page)", 2: "var(--page-2)" },
        header: "var(--header)",
        paper: "var(--paper)",
        ink: { DEFAULT: "var(--ink)", 2: "var(--ink-2)", 3: "var(--ink-3)" },
        rule: { DEFAULT: "var(--rule)", strong: "var(--rule-strong)", bg: "var(--rule-strong-bg)" },
        brand: { DEFAULT: "var(--brand)", dark: "var(--brand-dark)", soft: "var(--brand-soft)" },
        warn: { DEFAULT: "var(--warn)", soft: "var(--warn-soft)" },
        ok: { DEFAULT: "var(--ok)", soft: "var(--ok-soft)" },
        scrim: "var(--scrim)",
        veil: "var(--veil)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        eyebrow: ["11px", { lineHeight: "1rem", letterSpacing: "0.16em" }],
        nav: ["13.5px", { lineHeight: "1.25rem" }],
      },
      spacing: {
        bar: "var(--bar-h)",
      },
      boxShadow: {
        paper: "0 1px 0 var(--rule), 0 8px 24px -12px var(--paper-shadow)",
        "paper-elevated": "0 1px 2px var(--paper-shadow), 0 12px 32px -12px var(--paper-shadow-strong)",
        panel: "0 20px 50px var(--paper-shadow-strong)",
      },
    },
  },
  plugins: [],
} satisfies Config;
