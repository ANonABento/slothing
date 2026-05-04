import type { Metadata } from "next";
import { LegalPage } from "../legal-page";

const title = "Terms of Service";
const description = "Terms governing use of the Taida application.";
const effectiveDate = "March 25, 2026";
const sections = [
  {
    title: "Use of the service",
    body: "Taida is provided to help you organize and improve your job search. You are responsible for the accuracy of the information you upload and for how you use any generated content in applications or interviews.",
  },
  {
    title: "Accounts and access",
    body: "Access is tied to your authenticated account. You are responsible for keeping your credentials secure and for reviewing integrations you authorize, including Google services and external AI providers.",
  },
  {
    title: "Generated content",
    body: "AI-generated resumes, interview feedback, and outreach drafts are assistive outputs. You should review them before relying on them in a professional context.",
  },
  {
    title: "Availability",
    body: "The service may change over time, including integrations, file support, and export features. We may suspend access to protect the platform or comply with legal and security requirements.",
  },
  {
    title: "Limitation of liability",
    body: "The product is offered on an as-is basis. It is intended to support your workflow, not to guarantee hiring outcomes, interview performance, or offer decisions.",
  },
] as const;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/terms",
  },
  twitter: {
    title,
    description,
  },
};

export default function TermsPage() {
  return (
    <LegalPage title={title} effectiveDate={effectiveDate} sections={sections} />
  );
}
