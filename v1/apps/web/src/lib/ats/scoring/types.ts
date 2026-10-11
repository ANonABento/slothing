import type {
  ATSAnalysisResult,
  ATSIssue,
  KeywordAnalysis,
  KeywordEvidenceSummary,
  LetterGrade,
} from "@/lib/ats/analyzer";
import type {
  AcronymPairReport,
  ActionVerbStrengthReport,
  BuzzwordReport,
  DateFormatReport,
  FirstPersonReport,
  HiddenTextReport,
  WeakLanguageReport,
} from "@/lib/ats/content-checks";
import type { PdfLayoutReport } from "@/lib/ats/pdf-layout";

export type AxisKey =
  | "parseability"
  | "sectionCompleteness"
  | "keywordMatch"
  | "datesAndTenure"
  | "contentQuality";

export interface ContentChecks {
  weakLanguage: WeakLanguageReport;
  buzzwords: BuzzwordReport;
  acronymPairs: AcronymPairReport;
  actionVerbStrength: ActionVerbStrengthReport;
  firstPerson: FirstPersonReport;
  dateFormat: DateFormatReport;
  hiddenText: HiddenTextReport;
  pdfLayout?: PdfLayoutReport;
}

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
  keywordEvidence?: KeywordEvidenceSummary;
  contentChecks?: ContentChecks;
  summary: string;
  recommendations: string[];
  scannedAt: string;
  legacy: ATSAnalysisResult;
}
