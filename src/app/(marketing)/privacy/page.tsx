import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

const title = "Privacy Policy";
const description = "How Taida stores, uses, and protects your job search data.";
const effectiveDate = "March 25, 2026";
const sections = [
  {
    title: "What we collect",
    body: "Taida stores the profile, resume, job tracking, reminder, and interview preparation data you add to the product. If you connect Google services, the app also stores the minimum tokens and metadata needed to sync with those tools.",
  },
  {
    title: "How we use it",
    body: "Your data is used to power application tracking, document parsing, analytics, calendar exports, reminders, and AI-assisted features you explicitly trigger. We do not sell your personal job search data.",
  },
  {
    title: "Data sharing",
    body: "Third-party providers are only involved when you use integrations or AI features, such as Clerk for authentication, Google for connected workflows, or an LLM provider you configure in the app.",
  },
  {
    title: "Retention and deletion",
    body: "You control the content you add. Deleting jobs, reminders, documents, or generated resumes removes them from the app's active workspace. Backup exports are created only when you request them.",
  },
  {
    title: "Contact",
    body: "Questions about privacy or data handling can be directed through the support channel associated with your workspace.",
  },
] as const;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/privacy",
  },
  twitter: {
    title,
    description,
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage title={title} effectiveDate={effectiveDate} sections={sections} />
  );
}
