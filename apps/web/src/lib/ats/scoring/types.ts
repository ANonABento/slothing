import type {
  ATSAnalysisResult,
  ATSIssue,
  KeywordAnalysis,
  LetterGrade,
} from "@/lib/ats/analyzer";

export type AxisKey =
  | "parseability"
  | "sectionCompleteness"
  | "keywordMatch"
  | "datesAndTenure"
  | "contentQuality";

export interface AxisScore {
  key: AxisKey;
  label: string;
  score: number;
  weight: number;
  notes: string[];
  evidence: string[];
}

export interface FileMeta {
  mimeType: "application/pdf" | "text/plain";
  sizeBytes: number;
  sectionsDetected: string[];
  parseConfidence: number;
  warnings: string[];
}

export interface ATSScanResult {
  overall: number;
  letterGrade: LetterGrade;
  axes: Record<AxisKey, AxisScore>;
  issues: ATSIssue[];
  keywords: KeywordAnalysis[];
  summary: string;
  recommendations: string[];
  scannedAt: string;
  legacy: ATSAnalysisResult;
}
