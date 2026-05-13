// ATS platform detection from job-posting URL.
//
// Different ATS platforms have wildly different parsing behavior, scoring
// philosophy, and recruiter UX. We detect the destination ATS from the URL
// pattern of the JD and surface platform-specific recommendations the
// candidate can act on.
//
// Source patterns are documented from public career-site infrastructure:
// - Workday        *.myworkdayjobs.com           ~50% Fortune 500
// - Greenhouse     boards.greenhouse.io,         tech / startups
//                  *.greenhouse.io
// - Lever          jobs.lever.co
// - Ashby          *.ashbyhq.com, jobs.ashbyhq.com
// - SmartRecruiters jobs.smartrecruiters.com
// - Workable       apply.workable.com
// - Taleo          *.taleo.net
// - iCIMS          *.icims.com, careers-*.icims.com
// - SuccessFactors *.successfactors.com, jobs.sap.com
// - Kenexa/BrassRing *.brassring.com, *.kenexa.com, infinitebrassring.com
// - JazzHR         *.applytojob.com
// - Recruitee      *.recruitee.com
// - JobVite        jobs.jobvite.com

export type AtsPlatform =
  | "workday"
  | "greenhouse"
  | "lever"
  | "ashby"
  | "smartrecruiters"
  | "workable"
  | "taleo"
  | "icims"
  | "successfactors"
  | "kenexa"
  | "jazzhr"
  | "recruitee"
  | "jobvite"
  | "unknown";

export interface PlatformInfo {
  platform: AtsPlatform;
  label: string;
  /** A short, citable one-liner shown in the UI. */
  brief: string;
  /** Platform-specific recommendations the candidate should know. */
  recommendations: string[];
}

const HOST_RULES: ReadonlyArray<{ test: RegExp; platform: AtsPlatform }> = [
  { test: /(^|\.)myworkdayjobs\.com$/i, platform: "workday" },
  { test: /(^|\.)workday\.com$/i, platform: "workday" },
  { test: /(^|\.)greenhouse\.io$/i, platform: "greenhouse" },
  { test: /(^|\.)grnh\.se$/i, platform: "greenhouse" },
  { test: /(^|\.)lever\.co$/i, platform: "lever" },
  { test: /(^|\.)ashbyhq\.com$/i, platform: "ashby" },
  { test: /(^|\.)smartrecruiters\.com$/i, platform: "smartrecruiters" },
  { test: /(^|\.)workable\.com$/i, platform: "workable" },
  { test: /(^|\.)taleo\.net$/i, platform: "taleo" },
  { test: /(^|\.)icims\.com$/i, platform: "icims" },
  { test: /(^|\.)successfactors\.(com|eu)$/i, platform: "successfactors" },
  { test: /jobs\.sap\.com$/i, platform: "successfactors" },
  { test: /(^|\.)brassring\.com$/i, platform: "kenexa" },
  { test: /(^|\.)kenexa\.com$/i, platform: "kenexa" },
  { test: /(^|\.)infinitebrassring\.com$/i, platform: "kenexa" },
  { test: /(^|\.)applytojob\.com$/i, platform: "jazzhr" },
  { test: /(^|\.)recruitee\.com$/i, platform: "recruitee" },
  { test: /jobs\.jobvite\.com$/i, platform: "jobvite" },
];

const PLATFORM_INFO: Record<Exclude<AtsPlatform, "unknown">, PlatformInfo> = {
  workday: {
    platform: "workday",
    label: "Workday Recruiting",
    brief:
      "~50% of the Fortune 500. Recruiter search runs on structured form fields, not the resume binary — if parsing misfires, manually correct the form.",
    recommendations: [
      "Use a single-column layout. Workday's parser flattens two-column resumes top-to-bottom and scrambles the order.",
      "Put your email and phone in the first lines of the document body, not in Word's header/footer (which the parser often strips).",
      "Answer every knockout question accurately — they auto-disqualify with no human review.",
      "Use plain text bullets (•, -). Avoid tables, text boxes, and graphics; Workday converts these to messy text runs.",
      "After uploading, scroll through the auto-filled application fields and fix any mis-parsed values manually.",
    ],
  },
  greenhouse: {
    platform: "greenhouse",
    label: "Greenhouse",
    brief:
      "Common at tech / startups. Greenhouse explicitly does not auto-rank or auto-reject — rejections are human via Scorecards.",
    recommendations: [
      "No automated keyword scoring. Focus on bullets a recruiter would actually read — concrete outcomes with metrics.",
      "Greenhouse parses cleanly but multi-column layouts still degrade. Stick to single-column.",
      "Tailor your bullets to the competency attributes in the JD — interviewers will score you against a scorecard, so make each attribute easy to spot.",
      "If you have a referral, ask them to enter it through the Greenhouse referral form rather than passing your resume separately — referrals route to a dedicated recruiter queue.",
    ],
  },
  lever: {
    platform: "lever",
    label: "Lever (LeverTRM)",
    brief:
      "Tech / startup market. Lever does re-rank candidates by AI similarity, but recruiters triage manually.",
    recommendations: [
      "Mirror the JD's language verbatim — Lever's matching is more semantic than Workday's but exact-phrase still ranks higher.",
      "Single-column resumes parse most reliably.",
      "Use a professional summary that names the target role; Lever's AI ranking gives summary text high weight.",
    ],
  },
  ashby: {
    platform: "ashby",
    label: "Ashby",
    brief:
      "Newer AI-native ATS used by OpenAI, Notion, Ramp, Linear. AI-assisted review with explicit criteria — no numeric ranking.",
    recommendations: [
      "Recruiters define explicit criteria (e.g., '5+ years Python', 'production ML'). Make each criterion easy to verify with a concrete bullet.",
      "Cite specific outcomes — Ashby's AI surfaces evidence citations linked back to your resume text.",
      "Single column, standard sections (Experience / Education / Skills) — Ashby's parser is modern but still benefits from clean structure.",
    ],
  },
  smartrecruiters: {
    platform: "smartrecruiters",
    label: "SmartRecruiters",
    brief:
      "Mid-market to enterprise. Winston AI surfaces numeric match scores to recruiters.",
    recommendations: [
      "Numeric match scores are visible to recruiters here. Tailor keywords to the JD aggressively.",
      "Single column, standard section names.",
      "Include both acronym and spelled-out forms on first use (Machine Learning (ML)).",
    ],
  },
  workable: {
    platform: "workable",
    label: "Workable",
    brief:
      "SMB-focused. Workable surfaces numerical match scores and requirement checklists.",
    recommendations: [
      "Numeric match score is visible. Cover the JD's required skills explicitly in your skills section AND in experience bullets.",
      "Workable is aggressive with knockout-style filters — answer application questions carefully.",
    ],
  },
  taleo: {
    platform: "taleo",
    label: "Oracle Taleo",
    brief:
      "Legacy enterprise giant. Pure literal keyword matching — no synonym expansion. 'JS' does not match 'JavaScript'.",
    recommendations: [
      "Mirror the JD's exact phrasing. If the JD says 'JavaScript', write 'JavaScript' — not 'JS'.",
      "Use literal section headers: 'Experience', 'Education', 'Skills'. Anything creative will mis-segment, and everything below it cascades wrong.",
      "Replace em-dashes (—) and en-dashes (–) with plain hyphens. Replace curly quotes with straight quotes.",
      "Submit a Word DOCX if accepted — Taleo parses DOCX more reliably than design-tool PDFs.",
      "Include the acronym and the spelled-out form (Machine Learning (ML)) — Taleo will not match them as synonyms.",
    ],
  },
  icims: {
    platform: "icims",
    label: "iCIMS",
    brief:
      "Used by Microsoft, IBM, UPS, Target. Reads left-to-right across the page width — two-column resumes scramble.",
    recommendations: [
      "Single column is essential. Two-column resumes drop from ~89% parse accuracy to ~67% on iCIMS.",
      "iCIMS Copilot computes a Role Fit score from the JD text — match the JD's exact phrasing.",
      "Avoid embedded images and graphics; iCIMS has a file size cap and design-heavy resumes can be rejected at upload.",
    ],
  },
  successfactors: {
    platform: "successfactors",
    label: "SAP SuccessFactors",
    brief:
      "Heavily used by European industrials (Siemens, Bosch, BMW, Unilever). Competency-based matching, not keyword frequency.",
    recommendations: [
      "Map your experience to the JD's named competencies, not just keywords.",
      "SuccessFactors silently misparses many resumes. After applying, log into your candidate profile and verify the populated fields match what you uploaded.",
      "Single column, standard sections.",
    ],
  },
  kenexa: {
    platform: "kenexa",
    label: "IBM Kenexa BrassRing (Infinite BrassRing)",
    brief:
      "Common in banking, healthcare, government. Older-generation parser; expect manual form re-entry after upload.",
    recommendations: [
      "Plan for manual form filling — the parser only partially pre-populates fields.",
      "Match the JD's literal phrasing; ranking here is Boolean-search-based, not semantic.",
      "Single column, plain text bullets.",
    ],
  },
  jazzhr: {
    platform: "jazzhr",
    label: "JazzHR",
    brief: "SMB ATS via applytojob.com.",
    recommendations: [
      "Simple parsing — single column DOCX or text PDF works well.",
      "Match JD phrasing where accurate; no synonym expansion on JazzHR's free tier.",
    ],
  },
  recruitee: {
    platform: "recruitee",
    label: "Recruitee",
    brief: "Mid-market ATS, often used by European SMBs.",
    recommendations: [
      "Single column resumes; Recruitee handles standard formatting well.",
      "Be explicit with the JD's required skills in your skills section.",
    ],
  },
  jobvite: {
    platform: "jobvite",
    label: "Jobvite",
    brief: "Mid-market ATS with strong referral / social-sourcing features.",
    recommendations: [
      "Jobvite has strong referral workflows — if you can get a referral, prioritize that over resume tweaks.",
      "Standard single-column resume parses cleanly.",
    ],
  },
};

function parseHost(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`,
    );
    return url.hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function detectAtsPlatform(jobUrl: string): AtsPlatform {
  const host = parseHost(jobUrl);
  if (!host) return "unknown";

  for (const rule of HOST_RULES) {
    if (rule.test.test(host)) return rule.platform;
  }
  return "unknown";
}

export function getPlatformInfo(platform: AtsPlatform): PlatformInfo | null {
  if (platform === "unknown") return null;
  return PLATFORM_INFO[platform];
}

export function detectAndDescribe(jobUrl: string): PlatformInfo | null {
  const platform = detectAtsPlatform(jobUrl);
  return getPlatformInfo(platform);
}
