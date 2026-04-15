// Shared resume template type definitions
// Extracted to avoid circular imports between templates.ts and template-analyzer.ts

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview?: string;
  styles: TemplateStyles;
}

export interface TemplateStyles {
  fontFamily: string;
  fontSize: string;
  headerSize: string;
  sectionHeaderSize: string;
  lineHeight: string;
  accentColor: string;
  layout: "single-column" | "two-column";
  headerStyle: "centered" | "left" | "minimal";
  bulletStyle: "disc" | "dash" | "arrow" | "none";
  sectionDivider: "line" | "space" | "none";
}
