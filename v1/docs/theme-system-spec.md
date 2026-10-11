# Theme System — Modular Design Tokens Architecture

## Overview

A centralized theme system where every visual property (colors, radius, shadows, typography, effects) comes from typed token objects. Components never hardcode styles — they read CSS variables. Adding a new theme = one file. Dark mode = built into every preset.

## Directory Structure

```
src/lib/theme/
├── tokens.ts                # ThemeTokens interface + CSS var names
├── presets/
│   ├── index.ts             # Re-export all presets
│   ├── default.ts           # Violet + Cream (current)
│   ├── bloxy.ts             # Chunky, pixel, offset shadows
│   ├── glass.ts             # Translucent, backdrop-blur, gradients
│   ├── minimal.ts           # Clean, whitespace, monochrome
│   ├── neon.ts              # Cyberpunk, cyan+magenta, glows
│   ├── earth.ts             # Terracotta, organic, warm
│   └── premium.ts           # Polished pro, tight typography
├── registry.ts              # ALL_THEMES array, getTheme(), getThemeIds()
├── provider.tsx              # ThemeProvider context, CSS var injector, SSR-safe
├── use-theme.ts              # useTheme() hook: get/set theme, toggle dark mode
├── apply.ts                  # applyThemeTokens() — writes CSS vars to :root
└── utils.ts                  # Helpers: resolveToken, mergeTokens, cloneTheme
```

## ThemeTokens Type

```typescript
interface ThemeTokens {
  // ─── Identity ───
  id: string;                    // "default", "bloxy", etc.
  name: string;                  // "Default", "Bloxy", etc.
  description: string;           // "Violet + Cream, rounded, subtle"
  
  // ─── Colors (HSL strings for Tailwind compatibility) ───
  background: string;            // "30 25% 99%"
  foreground: string;            
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  
  // ─── Shape ───
  radius: string;                // "0" | "0.25rem" | "0.5rem" | "0.75rem" | "1rem" | "1.25rem"
  
  // ─── Shadows ───
  shadowCard: string;            // CSS shadow value
  shadowElevated: string;        // Heavier shadow for modals/popovers
  shadowButton: string;          // Button shadow (offset for bloxy)
  
  // ─── Typography ───
  fontFamily: string;            // "'Inter', sans-serif" | "'Courier New', monospace"
  fontHeading?: string;          // Optional separate heading font
  letterSpacing: string;         // "-0.01em" | "0" | "0.05em" | "0.1em"
  textTransform: "none" | "uppercase";
  fontWeightNormal: string;      // "400"
  fontWeightMedium: string;      // "500"
  fontWeightBold: string;        // "700" | "800" | "900"
  
  // ─── Borders ───
  borderWidth: string;           // "1px" | "2px" | "3px" | "4px"
  
  // ─── Effects (optional, theme-specific) ───
  backdropBlur?: string;         // Glass: "blur(20px)"
  glowColor?: string;            // Electric: "rgba(0,212,255,0.3)"
  glowColorSecondary?: string;   // Electric: "rgba(255,0,102,0.15)"
  offsetShadowX?: string;        // Bloxy: "4px"
  offsetShadowY?: string;        // Bloxy: "4px"
  gradientBg?: string;           // Glass: "linear-gradient(135deg, ...)"
}

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  light: ThemeTokens;
  dark: ThemeTokens;
  preview: {
    primary: string;     // Hex for settings preview swatch
    background: string;  // Hex for settings preview swatch
    accent: string;      // Hex for settings preview swatch
  };
}
```

## How Tokens Map to CSS Variables

`applyThemeTokens(tokens: ThemeTokens)` writes to `:root`:

```css
:root {
  --background: 30 25% 99%;
  --foreground: 258 20% 13%;
  --primary: 258 65% 58%;
  /* ...all colors... */
  
  --radius: 0.75rem;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04);
  --shadow-elevated: 0 4px 16px rgba(0,0,0,0.1);
  --shadow-button: none;
  
  --font-family: 'Inter', sans-serif;
  --font-heading: 'Inter', sans-serif;
  --letter-spacing: -0.01em;
  --text-transform: none;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  
  --border-width: 1px;
  
  /* Optional effects */
  --backdrop-blur: none;
  --glow-color: transparent;
  --offset-shadow-x: 0;
  --offset-shadow-y: 0;
  --gradient-bg: none;
}
```

## Component Usage

Components NEVER reference theme-specific values. They use CSS vars:

```tsx
// Card component — works for ALL themes
<div className="rounded-[var(--radius)] border-[length:var(--border-width)] 
               shadow-[var(--shadow-card)] bg-card text-card-foreground
               [backdrop-filter:var(--backdrop-blur)]">
```

```tsx
// Button — offset shadow for bloxy, glow for neon, subtle for default
<button style={{ 
  boxShadow: `var(--shadow-button)`,
  textTransform: `var(--text-transform)`,
  letterSpacing: `var(--letter-spacing)`,
}}>
```

Tailwind config already reads `--primary`, `--background`, etc. for colors. We extend it to also read `--radius`, `--shadow-card`, etc.

## ThemeProvider

```tsx
// src/lib/theme/provider.tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState(() => 
    localStorage.getItem("taida-theme") ?? "default"
  );
  const [isDark, setIsDark] = useState(() => 
    localStorage.getItem("taida-dark") === "true"
  );
  
  useEffect(() => {
    const preset = getTheme(themeId);
    const tokens = isDark ? preset.dark : preset.light;
    applyThemeTokens(tokens);
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("taida-theme", themeId);
    localStorage.setItem("taida-dark", String(isDark));
  }, [themeId, isDark]);
  
  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, isDark, setIsDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## Theme Presets Summary

| ID | Name | Key Traits |
|----|------|-----------|
| default | Default | Violet+cream, rounded-lg, subtle shadows, Inter font |
| bloxy | Bloxy | Sharp corners, 3px borders, offset shadows, monospace, uppercase, yellow/red |
| glass | Glassmorphism | Extra-rounded, no borders, backdrop-blur, gradient bg, translucent cards |
| minimal | Minimal | Thin borders, barely-there shadows, lots of whitespace, monochrome |
| neon | Electric Cyberpunk | Rounded, glow shadows, cyan+magenta, border-left indicators |
| earth | Warm Earth | Extra-rounded, terracotta accent, warm shadows, organic feel |
| premium | Premium Software | Medium-rounded, layered shadows, blue accent, tight letter-spacing |

Each has light + dark variant = **14 total variants**.

## Migration Plan

### Phase 1: Token Infrastructure
1. Create `tokens.ts` type definitions
2. Create all 7 preset files (light + dark each)
3. Create `registry.ts`, `apply.ts`, `use-theme.ts`
4. Create `ThemeProvider` and wrap app

### Phase 2: Migrate globals.css
5. Replace hardcoded HSL values in globals.css `:root` with token application
6. Replace `.dark` block with token application
7. Add new CSS vars for radius, shadows, typography, effects

### Phase 3: Migrate Components
8. Audit all components for hardcoded colors/radius/shadows
9. Replace with CSS variable references
10. Test each theme across all pages

### Phase 4: Settings UI
11. Theme picker in Settings with live preview swatches
12. Dark mode toggle
13. Optional: custom color overrides (power user)

## Future Extensibility

- **Custom themes**: clone a preset → override values → save to localStorage as `custom-{id}`
- **Theme sharing**: export/import as JSON
- **Theme marketplace**: community-submitted ThemePreset objects
- **Per-page themes**: different theme for different sections (stretch)
- **Animated transitions**: CSS transition on `--background` etc. when switching
