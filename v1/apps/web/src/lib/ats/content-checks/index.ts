// Barrel for content-quality checks layered on top of the existing
// five-axis scoring. Keep each detector pure so it can be unit tested in
// isolation and combined into the contentQuality / keywordMatch axes.

export {
  analyzeWeakLanguage,
  type WeakLanguageReport,
  type WeakLanguageBullet,
} from "./weak-language";

export {
  analyzeBuzzwords,
  type BuzzwordReport,
  type BuzzwordSegment,
} from "./buzzwords";

export {
  analyzeAcronymPairs,
  ACRONYM_PAIRS,
  type AcronymPairReport,
  type AcronymGap,
  type AcronymPair,
} from "./acronym-pairs";

export {
  analyzeActionVerbStrength,
  classifyVerb,
  STRONG_VERBS,
  WEAK_VERBS,
  STANDARD_VERBS,
  type ActionVerbStrengthReport,
  type VerbBucket,
  type VerbTier,
  type VerbAnalysisBullet,
} from "./action-verb-strength";

export {
  analyzeFirstPerson,
  type FirstPersonReport,
  type FirstPersonBullet,
} from "./first-person";

export {
  analyzeDateFormatConsistency,
  classifyDateString,
  type DateFormatReport,
  type DateFormatKind,
  type DateInput,
} from "./date-format-consistency";

export {
  detectHiddenText,
  type HiddenTextReport,
  type HiddenTextHit,
  type HiddenTextHtmlFragment,
} from "./hidden-text";
