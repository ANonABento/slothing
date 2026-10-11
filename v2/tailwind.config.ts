import type { Config } from "tailwindcss";

// Editorial tokens carried over from v1 (cream paper / Midnight Indigo / rust).
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "var(--page)",
        paper: "var(--paper)",
        ink: { DEFAULT: "var(--ink)", 2: "var(--ink-2)", 3: "var(--ink-3)" },
        rule: { DEFAULT: "var(--rule)", strong: "var(--rule-strong)" },
        brand: { DEFAULT: "var(--brand)", dark: "var(--brand-dark)", soft: "var(--brand-soft)" },
        warn: { DEFAULT: "var(--warn)", soft: "var(--warn-soft)" },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        paper: "0 1px 0 var(--rule), 0 8px 24px -12px var(--paper-shadow)",
      },
    },
  },
  plugins: [],
} satisfies Config;
