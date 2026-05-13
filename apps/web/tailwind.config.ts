import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: [
          "var(--font-heading)",
          "var(--font-sans)",
          "system-ui",
          "sans-serif",
        ],
        display: ["var(--display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // Editorial tokens (Kev handoff) — direct passthrough, not HSL-wrapped
        page: "var(--bg)",
        "page-2": "var(--bg-2)",
        paper: {
          DEFAULT: "var(--paper)",
          foreground: "var(--ink)",
          border: "var(--rule)",
          // Legacy aliases — keep until callsites migrate
          surface: "hsl(var(--surface-paper))",
          "surface-foreground": "hsl(var(--paper-foreground))",
          "surface-border": "hsl(var(--surface-paper-border))",
        },
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
        },
        rule: {
          DEFAULT: "var(--rule)",
          strong: "var(--rule-strong)",
          "strong-bg": "var(--rule-strong-bg)",
        },
        brand: {
          DEFAULT: "var(--brand)",
          dark: "var(--brand-dark)",
          soft: "var(--brand-soft)",
        },
        inverse: {
          DEFAULT: "var(--inverse-bg)",
          ink: "var(--inverse-ink)",
        },
        // shadcn tokens (HSL-wrapped) — preset system drives these
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        scrim: "hsl(var(--surface-scrim))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "hero-h1": [
          "clamp(54px, 7vw, 96px)",
          {
            lineHeight: "0.96",
            letterSpacing: "var(--display-letter)",
            fontWeight: "700",
          },
        ],
        "section-h2": [
          "clamp(40px, 5vw, 64px)",
          {
            lineHeight: "1.0",
            letterSpacing: "var(--display-letter)",
            fontWeight: "700",
          },
        ],
        "closer-h2": [
          "clamp(36px, 4.5vw, 56px)",
          {
            lineHeight: "1.02",
            letterSpacing: "var(--display-letter)",
            fontWeight: "700",
          },
        ],
        preview: [
          "32px",
          {
            lineHeight: "1.1",
            letterSpacing: "var(--display-letter)",
            fontWeight: "700",
          },
        ],
        "hero-sub": ["17.5px", { lineHeight: "1.55" }],
        lede: ["17px", { lineHeight: "1.6" }],
        "mono-cap": ["11px", { lineHeight: "1.5", letterSpacing: "0.14em" }],
      },
      maxWidth: {
        wrap: "1240px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
        button: "var(--shadow-button)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        glow: "0 0 20px var(--glow-color)",
        // Editorial paper shadows
        "paper-card":
          "0 18px 40px var(--paper-shadow), 0 1px 0 rgba(255,255,255,0.7) inset",
        "paper-elevated": "0 30px 80px var(--paper-shadow)",
        panel: "0 20px 50px var(--paper-shadow-strong)",
      },
      borderWidth: {
        DEFAULT: "var(--border-width)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out-right": {
          from: { transform: "translateX(0)", opacity: "1" },
          to: { transform: "translateX(100%)", opacity: "0" },
        },
        "kb-drop": {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "caret-blink": {
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "kb-drop": "kb-drop 600ms ease backwards",
        "caret-blink": "caret-blink 1s steps(2) infinite",
        "spin-slow": "spin 0.9s linear infinite",
      },
      spacing: {
        "0": "var(--spacing-0)",
        "1": "var(--spacing-1)",
        "2": "var(--spacing-2)",
        "3": "var(--spacing-3)",
        "4": "var(--spacing-4)",
        "5": "var(--spacing-5)",
        "6": "var(--spacing-6)",
        "8": "var(--spacing-8)",
        "10": "var(--spacing-10)",
        "12": "var(--spacing-12)",
        "16": "var(--spacing-16)",
        "18": "var(--spacing-18)",
        "24": "var(--spacing-24)",
        "88": "var(--spacing-88)",
      },
      letterSpacing: {
        theme: "var(--letter-spacing)",
        display: "var(--display-letter)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
