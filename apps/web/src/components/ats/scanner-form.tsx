"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  AlertCircle,
  CheckCircle2,
  FileSearch,
  FileText,
  Link as LinkIcon,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatFileSize } from "@/lib/utils";
import {
  scanResume,
  type ATSAnalysisResult,
  type ATSScanResult,
  type FileMeta,
} from "@/lib/ats/analyzer";
import { pluralize } from "@/lib/text/pluralize";
import { textToProfile, textToJob } from "@/lib/ats/text-to-profile";
import { computeJdMatch, type JdMatchResult } from "@/lib/ats/match-score";
import { nowIso } from "@/lib/format/time";
import type { JobDescription, Profile } from "@/types";
import { ScoreDisplay } from "./score-display";
import { FixSuggestionsList } from "./fix-suggestions";
import { JdMatchCard } from "./jd-match-card";
import { ResultQualityCard } from "@/components/result-quality/result-quality-card";
import {
  evaluateResultQuality,
  type ResultQualityRubric,
} from "@/lib/result-quality/rubric";

const MIN_RESUME_LENGTH = 50;
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

interface ParseResponse {
  profile: Partial<Profile>;
  sectionsDetected: string[];
  confidence: number;
  warnings: string[];
}

interface ScrapedOpportunity {
  title: string;
  company: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  keywords?: string[];
  url?: string;
}

interface ScannerFormProps {
  locale?: string;
}

function completeProfile(profile: Partial<Profile>, rawText?: string): Profile {
  const now = nowIso();
  return {
    id: profile.id || "scanner-anonymous",
    contact: profile.contact || { name: "" },
    summary: profile.summary,
    experiences: profile.experiences || [],
    education: profile.education || [],
    skills: profile.skills || [],
    projects: profile.projects || [],
    certifications: profile.certifications || [],
    rawText: rawText || profile.rawText,
    createdAt: profile.createdAt || now,
    updatedAt: profile.updatedAt || now,
  };
}

function opportunityToJob(opportunity: ScrapedOpportunity): JobDescription {
  return {
    id: "scanner-imported-job",
    title: opportunity.title,
    company: opportunity.company,
    description: opportunity.description,
    requirements: opportunity.requirements || [],
    responsibilities: opportunity.responsibilities || [],
    keywords: opportunity.keywords || [],
    url: opportunity.url,
    createdAt: nowIso(),
  };
}

function opportunityToText(opportunity: ScrapedOpportunity) {
  return [
    `${opportunity.title} at ${opportunity.company}`,
    opportunity.description,
    ...(opportunity.requirements?.length
      ? ["Requirements", ...opportunity.requirements.map((item) => `- ${item}`)]
      : []),
    ...(opportunity.responsibilities?.length
      ? [
          "Responsibilities",
          ...opportunity.responsibilities.map((item) => `- ${item}`),
        ]
      : []),
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildCurrentJobForScan(
  currentJobText: string,
  importedJob: JobDescription | null,
  importedJobText: string,
) {
  const text = currentJobText.trim();
  if (text.length <= 20) return undefined;

  const parsed = textToJob(text);
  if (importedJob && text === importedJobText.trim()) {
    return {
      ...parsed,
      id: importedJob.id,
      title: importedJob.title,
      company: importedJob.company,
      url: importedJob.url,
      description: text,
      createdAt: importedJob.createdAt,
    };
  }

  return parsed;
}

function profileToMatchText(profile: Profile, fallbackText: string) {
  const parts = [
    fallbackText,
    profile.rawText,
    profile.contact?.name,
    profile.summary,
    ...profile.experiences.flatMap((experience) => [
      experience.title,
      experience.company,
      experience.description,
      ...experience.highlights,
      ...experience.skills,
    ]),
    ...profile.education.flatMap((education) => [
      education.institution,
      education.degree,
      education.field,
      ...education.highlights,
    ]),
    ...profile.skills.map((skill) => skill.name),
    ...profile.projects.flatMap((project) => [
      project.name,
      project.description,
      ...project.technologies,
      ...project.highlights,
    ]),
    ...profile.certifications.flatMap((certification) => [
      certification.name,
      certification.issuer,
    ]),
  ];

  return parts.filter(Boolean).join(" ");
}

export function ScannerForm({ locale = "en" }: ScannerFormProps = {}) {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [parsedProfile, setParsedProfile] = useState<Profile | null>(null);
  const [fileMeta, setFileMeta] = useState<FileMeta | undefined>();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parseMessage, setParseMessage] = useState("");
  const [parseError, setParseError] = useState("");
  const [showPasteResume, setShowPasteResume] = useState(false);
  const [scrapedJob, setScrapedJob] = useState<JobDescription | null>(null);
  const [scrapedJobText, setScrapedJobText] = useState("");
  const [scrapeStatus, setScrapeStatus] = useState("");
  const [scrapeError, setScrapeError] = useState("");
  const [parsing, setParsing] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [result, setResult] = useState<ATSScanResult | null>(null);
  const [jdMatch, setJdMatch] = useState<JdMatchResult | null>(null);
  const [resultQuality, setResultQuality] =
    useState<ResultQualityRubric | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const scrapingRef = useRef(false);
  const jobTextareaRef = useRef<HTMLTextAreaElement>(null);

  const parseFile = useCallback(async (file: File) => {
    setParseError("");
    setParseMessage("");
    setParsing(true);
    setUploadedFile(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/scanner/parse-resume", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json().catch(() => null)) as
        | (ParseResponse & { error?: string })
        | null;

      if (!response.ok || !data) {
        throw new Error(data?.error || "Could not parse that resume.");
      }

      const rawText =
        file.type === "text/plain" ? await file.text() : undefined;
      const profile = completeProfile(data.profile, rawText);
      setParsedProfile(profile);
      if (rawText) setResumeText(rawText);
      setFileMeta({
        mimeType: file.type === "text/plain" ? "text/plain" : "application/pdf",
        sizeBytes: file.size,
        sectionsDetected: data.sectionsDetected,
        parseConfidence: data.confidence,
        warnings: data.warnings,
      });
      setParseMessage(
        `Parsed ${pluralize(data.sectionsDetected.length, "section")}, confidence ${Math.round(data.confidence * 100)}%`,
      );
    } catch (error) {
      setParsedProfile(null);
      setFileMeta(undefined);
      setParseError(
        error instanceof Error ? error.message : "Could not parse that resume.",
      );
      setShowPasteResume(true);
    } finally {
      setParsing(false);
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const [file] = acceptedFiles;
      if (file) void parseFile(file);
    },
    [parseFile],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "text/plain": [".txt"],
      },
      maxFiles: 1,
      maxSize: MAX_UPLOAD_SIZE,
    });

  async function handleScrapeJob() {
    const url = jobUrl.trim();
    if (!url || scrapingRef.current) return;

    scrapingRef.current = true;
    setScrapeError("");
    setScrapeStatus("");
    setScraping(true);

    try {
      const response = await fetch("/api/scanner/scrape-job", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await response.json().catch(() => null)) as {
        opportunity?: ScrapedOpportunity;
        error?: string;
      } | null;
      if (!response.ok || !data?.opportunity) {
        throw new Error(data?.error || "Could not import that job posting.");
      }

      const job = opportunityToJob(data.opportunity);
      const importedText = opportunityToText(data.opportunity);
      setScrapedJob(job);
      setScrapedJobText(importedText);
      setJobText(importedText);
      setScrapeStatus(`Imported from ${new URL(url).hostname}`);
    } catch (error) {
      setScrapedJob(null);
      setScrapedJobText("");
      setScrapeError(
        `${error instanceof Error ? error.message : "Could not import that job posting."} Paste manually instead.`,
      );
    } finally {
      scrapingRef.current = false;
      setScraping(false);
    }
  }

  function focusManualJobPaste() {
    jobTextareaRef.current?.focus();
  }

  function handleAnalyze() {
    const profile =
      parsedProfile ||
      (resumeText.trim().length >= MIN_RESUME_LENGTH
        ? textToProfile(resumeText)
        : null);
    if (!profile) return;

    setAnalyzing(true);

    requestAnimationFrame(() => {
      const jdText = jobText.trim();
      const job = buildCurrentJobForScan(jobText, scrapedJob, scrapedJobText);
      const analysis = scanResume(profile, resumeText, job, fileMeta);
      const jdMatchResult = jdText
        ? computeJdMatch(profileToMatchText(profile, resumeText), jdText, {
            missingLimit: 10,
          })
        : null;
      setResult(analysis);
      setJdMatch(jdMatchResult);
      setResultQuality(
        evaluateResultQuality({
          jdMatchScore: jdMatchResult?.score,
          missingKeywords: jdMatchResult?.missingKeywords,
          atsAxes: analysis.axes,
          atsIssues: analysis.issues,
          keywords: analysis.keywords,
          profile,
          hasJobDescription: Boolean(jdText),
        }),
      );
      setAnalyzing(false);
    });
  }

  function handleReset() {
    setResult(null);
    setJdMatch(null);
    setResultQuality(null);
    setResumeText("");
    setJobText("");
    setJobUrl("");
    setParsedProfile(null);
    setFileMeta(undefined);
    setUploadedFile(null);
    setParseMessage("");
    setParseError("");
    setScrapedJob(null);
    setScrapedJobText("");
    setScrapeStatus("");
    setScrapeError("");
    setShowPasteResume(false);
  }

  const canAnalyze =
    Boolean(parsedProfile || resumeText.trim().length >= MIN_RESUME_LENGTH) &&
    !analyzing &&
    !parsing;
  const callbackUrl = `/${locale}/dashboard`;

  if (result) {
    const legacyResult: ATSAnalysisResult = result.legacy;
    return (
      <div className="space-y-8">
        <ScoreDisplay result={legacyResult} />

        {resultQuality ? <ResultQualityCard rubric={resultQuality} /> : null}

        {jdMatch ? <JdMatchCard match={jdMatch} /> : null}

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold">Scoring axes</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.values(result.axes).map((axis) => (
              <div
                key={axis.key}
                className="rounded-md border border-border bg-muted/30 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{axis.label}</span>
                  <span className="text-sm font-semibold">{axis.score}%</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Weight {Math.round(axis.weight * 100)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        <FixSuggestionsList issues={legacyResult.issues} />

        <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-8 text-center">
          <h3 className="mb-2 text-xl font-bold">
            Want AI-powered resume tailoring?
          </h3>
          <p className="mb-4 text-muted-foreground">
            Get personalized rewrites, keyword optimization, and cover letters
            generated for each job.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="gradient" size="pill" asChild>
              <Link href={{ pathname: "/sign-in", query: { callbackUrl } }}>
                Sign up free &rarr;
              </Link>
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Scan another resume
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium">
            Upload your resume <span className="text-destructive">*</span>
          </label>
          <button
            type="button"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            onClick={() => setShowPasteResume((current) => !current)}
          >
            Paste text instead
          </button>
        </div>

        <div
          {...getRootProps()}
          className={cn(
            "cursor-pointer rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center transition-colors",
            isDragActive && "border-primary bg-primary/5",
            isDragReject && "border-destructive bg-destructive/5",
          )}
        >
          <input
            {...getInputProps()}
            aria-label="Upload resume PDF or text file"
          />
          {parsing ? (
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
          ) : uploadedFile ? (
            <FileText className="mx-auto mb-3 h-8 w-8 text-primary" />
          ) : (
            <UploadCloud className="mx-auto mb-3 h-8 w-8 text-primary" />
          )}
          <p className="text-sm font-medium">
            {uploadedFile
              ? uploadedFile.name
              : "Drop a PDF here or click to browse"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF preferred, TXT fallback, up to {formatFileSize(MAX_UPLOAD_SIZE)}
          </p>
        </div>

        {parseMessage ? (
          <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>{parseMessage}</span>
            <button
              type="button"
              className="ml-auto text-xs font-medium text-primary underline-offset-4 hover:underline"
              onClick={() => setUploadedFile(null)}
            >
              Replace file
            </button>
          </div>
        ) : null}

        {parseError ? (
          <div className="mt-3 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{parseError}</span>
          </div>
        ) : null}

        {showPasteResume ? (
          <div className="mt-4">
            <label
              htmlFor="resume-text"
              className="mb-2 block text-sm font-medium"
            >
              Paste your resume text <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="resume-text"
              placeholder="Paste your full resume text here..."
              className="min-h-[200px] font-mono text-sm"
              value={resumeText}
              onChange={(event) => {
                setResumeText(event.target.value);
                setParsedProfile(null);
                setFileMeta(undefined);
              }}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {resumeText.trim().length < MIN_RESUME_LENGTH
                ? `At least ${MIN_RESUME_LENGTH} characters required`
                : pluralize(resumeText.trim().split(/\s+/).length, "word")}
            </p>
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
        <label htmlFor="job-url" className="mb-2 block text-sm font-medium">
          Import job from URL{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="job-url"
              type="url"
              className="h-10 w-full rounded-md border border-input bg-background px-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="https://www.linkedin.com/jobs/..."
              value={jobUrl}
              onChange={(event) => setJobUrl(event.target.value)}
              onBlur={handleScrapeJob}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleScrapeJob();
                }
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleScrapeJob}
            disabled={!jobUrl.trim() || scraping}
          >
            {scraping ? <Loader2 className="h-4 w-4 animate-spin" /> : "Import"}
          </Button>
        </div>
        {scrapeStatus ? (
          <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 text-success" />
            {scrapeStatus}
          </p>
        ) : null}
        {scrapeError ? (
          <button
            type="button"
            className="mt-2 flex items-center gap-1 text-left text-xs text-destructive underline-offset-4 hover:underline"
            onClick={focusManualJobPaste}
          >
            <AlertCircle className="h-3 w-3" />
            {scrapeError}
          </button>
        ) : null}

        <label htmlFor="job-text" className="mt-4 block text-sm font-medium">
          Paste job description{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="job-text"
          ref={jobTextareaRef}
          placeholder="Optional: paste the job description to check keyword matching..."
          className="mt-2 min-h-[96px] border-border bg-background/70 font-mono text-sm placeholder:italic focus:min-h-[140px]"
          value={jobText}
          onChange={(event) => {
            setJobText(event.target.value);
            if (event.target.value.trim() !== scrapedJobText.trim()) {
              setScrapedJob(null);
              setScrapedJobText("");
            }
          }}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Adding a job description enables keyword match analysis
        </p>
      </div>

      <Button
        onClick={handleAnalyze}
        disabled={!canAnalyze}
        variant="gradient"
        size="lg"
        className="w-full"
      >
        {analyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <FileSearch className="mr-2 h-4 w-4" />
            Scan Resume
          </>
        )}
      </Button>
    </div>
  );
}
