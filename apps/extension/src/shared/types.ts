// Shared types for Columbus extension
export type {
  Certification,
  ContactInfo,
  Education,
  Experience,
  Profile,
  Project,
  Skill,
} from "@slothing/shared/types";

import type { Profile } from "@slothing/shared/types";

// Extension-specific types
export interface ExtensionProfile extends Profile {
  computed: ComputedProfileFields;
}

export interface ComputedProfileFields {
  firstName?: string;
  lastName?: string;
  currentCompany?: string;
  currentTitle?: string;
  mostRecentSchool?: string;
  mostRecentDegree?: string;
  mostRecentField?: string;
  graduationYear?: string;
  yearsExperience?: number;
  skillsList?: string;
}

// Field detection types
export type FieldType =
  | "firstName"
  | "lastName"
  | "fullName"
  | "email"
  | "phone"
  | "address"
  | "city"
  | "state"
  | "zipCode"
  | "country"
  | "linkedin"
  | "github"
  | "website"
  | "portfolio"
  | "currentCompany"
  | "currentTitle"
  | "education"
  | "degree"
  | "school"
  | "graduationYear"
  | "gpa"
  | "fieldOfStudy"
  | "experience"
  | "yearsExperience"
  | "resume"
  | "coverLetter"
  | "salary"
  | "salaryExpectation"
  | "startDate"
  | "availability"
  | "workAuthorization"
  | "sponsorship"
  | "veteranStatus"
  | "disability"
  | "gender"
  | "ethnicity"
  | "skills"
  | "summary"
  | "customQuestion"
  | "unknown";

export interface DetectedField {
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  fieldType: FieldType;
  confidence: number;
  suggestedValue?: string;
  label?: string;
  placeholder?: string;
}

export interface FieldSignals {
  name: string;
  id: string;
  type: string;
  placeholder: string;
  autocomplete: string;
  label: string;
  ariaLabel: string;
  nearbyText: string;
  parentClasses: string[];
}

// Scraper types
export interface ScrapedJob {
  title: string;
  company: string;
  location?: string;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  salary?: string;
  type?: "full-time" | "part-time" | "contract" | "internship";
  remote?: boolean;
  url: string;
  source: string;
  sourceJobId?: string;
  deadline?: string;
  postedAt?: string;
  keywords?: string[];
}

export interface PageSnapshot {
  url: string;
  host: string;
  title: string;
  headline?: string;
  submittedAt: string;
  thumbnailDataUrl?: string;
}

export interface TrackedApplicationPayload extends PageSnapshot {
  scrapedJob?: ScrapedJob | null;
}

// Learning types
export interface LearnedAnswer {
  id: string;
  question: string;
  questionNormalized: string;
  answer: string;
  source: "extension" | "curated" | "manual";
  sourceUrl?: string;
  sourceCompany?: string;
  timesUsed: number;
  createdAt: string;
}

export interface SimilarAnswer {
  id: string;
  question: string;
  answer: string;
  similarity: number;
  timesUsed: number;
}

// Message types for background/content communication
export type MessageType =
  | "GET_PROFILE"
  | "FILL_FORM"
  | "SCRAPE_JOB"
  | "SCRAPE_JOB_LIST"
  | "IMPORT_JOB"
  | "IMPORT_JOBS_BATCH"
  | "TRACK_APPLIED"
  | "OPEN_DASHBOARD"
  | "CAPTURE_VISIBLE_TAB"
  | "GET_SETTINGS"
  | "TAILOR_FROM_PAGE"
  | "GENERATE_COVER_LETTER_FROM_PAGE"
  | "SAVE_ANSWER"
  | "SEARCH_ANSWERS"
  | "GET_LEARNED_ANSWERS"
  | "DELETE_ANSWER"
  | "GET_AUTH_STATUS"
  | "OPEN_AUTH"
  | "LOGOUT"
  | "JOB_DETECTED"
  | "WW_GET_PAGE_STATE"
  | "WW_SCRAPE_ALL_VISIBLE"
  | "WW_SCRAPE_ALL_PAGINATED"
  | "WW_BULK_PROGRESS"
  | "AUTH_CALLBACK";

export interface ExtensionMessage<T = unknown> {
  type: MessageType;
  payload?: T;
}

export interface ExtensionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Storage types
export interface ExtensionStorage {
  authToken?: string;
  tokenExpiry?: string;
  apiBaseUrl: string;
  cachedProfile?: ExtensionProfile;
  profileCachedAt?: string;
  settings: ExtensionSettings;
}

export interface ExtensionSettings {
  autoFillEnabled: boolean;
  showConfidenceIndicators: boolean;
  minimumConfidence: number;
  learnFromAnswers: boolean;
  notifyOnJobDetected: boolean;
  autoTrackApplicationsEnabled: boolean;
  captureScreenshotEnabled: boolean;
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
  autoFillEnabled: true,
  showConfidenceIndicators: true,
  minimumConfidence: 0.5,
  learnFromAnswers: true,
  notifyOnJobDetected: true,
  autoTrackApplicationsEnabled: true,
  captureScreenshotEnabled: false,
};

export const DEFAULT_API_BASE_URL = "http://localhost:3000";
