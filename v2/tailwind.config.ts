import type { Config } from "tailwindcss";

// Editorial tokens carried over from v1 (cream paper / Midnight Indigo / rust).
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
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
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
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
