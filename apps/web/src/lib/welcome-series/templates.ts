import { escapeHtml } from "@/lib/email/transactional";

export interface WelcomeEmail {
  subject: string;
  html: string;
  text: string;
}

interface BaseTemplateInput {
  firstName?: string | null;
  unsubscribeUrl: string;
}

interface ShellInput extends BaseTemplateInput {
  preheader: string;
  headline: string;
  bodyHtml: string;
  ctaHref: string;
  ctaLabel: string;
}

interface Day1Input extends BaseTemplateInput {
  profileUrl: string;
}

interface Day3Input extends BaseTemplateInput {
  opportunitiesUrl: string;
}

interface Day7Input extends BaseTemplateInput {
  interviewUrl: string;
}

interface Day14Input extends BaseTemplateInput {
  applicationCount: number;
  tailoredResumeCount: number;
  upgradeUrl: string;
}

export function welcomeDay1(input: Day1Input): WelcomeEmail {
  const subject = "Welcome — set up your profile in 5 min";
  const html = renderShell({
    ...input,
    preheader: "A complete profile helps tailor every application faster.",
    headline: greet(input.firstName, "Welcome to Slothing"),
    bodyHtml: `
      <p style="margin:0 0 16px;color:#273142;font-size:16px;line-height:24px;">Start with the basics: contact details, recent roles, projects, and the skills you want hiring teams to notice.</p>
      <p style="margin:0;color:#273142;font-size:16px;line-height:24px;">A focused profile takes about five minutes and becomes the source for tailored resumes, cover letters, and interview prep.</p>
    `,
    ctaHref: input.profileUrl,
    ctaLabel: "Set up profile",
  });

  return {
    subject,
    html,
    text: `${subject}\n\nSet up your profile in about five minutes: ${input.profileUrl}\n\nUnsubscribe: ${input.unsubscribeUrl}`,
  };
}

export function welcomeDay3(input: Day3Input): WelcomeEmail {
  const subject = "Apply to your first opportunity today";
  const html = renderShell({
    ...input,
    preheader: "Turn saved roles into momentum with your first application.",
    headline: greet(input.firstName, "Ready for your first application?"),
    bodyHtml: `
      <p style="margin:0 0 16px;color:#273142;font-size:16px;line-height:24px;">Pick one strong-fit opportunity and send a tailored application today. Small momentum beats a giant search board every time.</p>
      <p style="margin:0;color:#273142;font-size:16px;line-height:24px;">Use your profile to sharpen the resume, then track the application so follow-ups stay organized.</p>
    `,
    ctaHref: input.opportunitiesUrl,
    ctaLabel: "Find opportunities",
  });

  return {
    subject,
    html,
    text: `${subject}\n\nApply to a first opportunity: ${input.opportunitiesUrl}\n\nUnsubscribe: ${input.unsubscribeUrl}`,
  };
}

export function welcomeDay7(input: Day7Input): WelcomeEmail {
  const subject = "Practice for your first interview";
  const html = renderShell({
    ...input,
    preheader: "A little practice now makes the first screen feel calmer.",
    headline: greet(input.firstName, "Let’s get interview-ready"),
    bodyHtml: `
      <p style="margin:0 0 16px;color:#273142;font-size:16px;line-height:24px;">Use your target role and profile details to practice realistic questions before the first recruiter screen lands.</p>
      <p style="margin:0;color:#273142;font-size:16px;line-height:24px;">You will leave with sharper examples, cleaner stories, and a better sense of what to improve next.</p>
    `,
    ctaHref: input.interviewUrl,
    ctaLabel: "Practice interview",
  });

  return {
    subject,
    html,
    text: `${subject}\n\nPractice for interviews: ${input.interviewUrl}\n\nUnsubscribe: ${input.unsubscribeUrl}`,
  };
}

export function welcomeDay14(input: Day14Input): WelcomeEmail {
  const subject = "Unlock more tailored applications with Pro";
  const apps = pluralize(input.applicationCount, "opportunity", "opportunities");
  const resumes = pluralize(
    input.tailoredResumeCount,
    "resume",
    "resumes",
  );
  const html = renderShell({
    ...input,
    preheader: "Use your activity so far to decide whether Pro fits your search.",
    headline: greet(input.firstName, "Your search is taking shape"),
    bodyHtml: `
      <p style="margin:0 0 16px;color:#273142;font-size:16px;line-height:24px;">You've already applied to <strong>${input.applicationCount} ${apps}</strong> and tailored <strong>${input.tailoredResumeCount} ${resumes}</strong>.</p>
      <p style="margin:0 0 16px;color:#273142;font-size:16px;line-height:24px;">Pro unlocks unlimited tailoring, deeper ATS scans, and salary research so each next application can get more specific without slowing you down.</p>
      <p style="margin:0;color:#273142;font-size:16px;line-height:24px;">It is most useful when you are applying consistently and want every resume, cover letter, and prep session to reflect the role in front of you.</p>
    `,
    ctaHref: input.upgradeUrl,
    ctaLabel: "Explore Pro",
  });

  return {
    subject,
    html,
    text: `${subject}\n\nYou've already applied to ${input.applicationCount} ${apps} and tailored ${input.tailoredResumeCount} ${resumes}. Explore Pro: ${input.upgradeUrl}\n\nUnsubscribe: ${input.unsubscribeUrl}`,
  };
}

function renderShell({
  preheader,
  headline,
  bodyHtml,
  ctaHref,
  ctaLabel,
  unsubscribeUrl,
}: ShellInput): string {
  const safePreheader = escapeHtml(preheader);
  const safeHeadline = escapeHtml(headline);
  const safeCtaHref = escapeHtml(ctaHref);
  const safeCtaLabel = escapeHtml(ctaLabel);
  const safeUnsubscribeUrl = escapeHtml(unsubscribeUrl);

  return `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${safeHeadline}</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f2ea;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;color:#f6f2ea;">${safePreheader}</div>
    <main style="max-width:640px;margin:0 auto;padding:32px 20px;">
      <div style="background:#ffffff;border:1px solid #e7dfd1;padding:28px;">
        <p style="margin:0 0 12px;color:#6b5e4f;font-size:13px;line-height:18px;">Slothing</p>
        <h1 style="margin:0 0 18px;color:#17202a;font-size:28px;line-height:34px;font-weight:700;">${safeHeadline}</h1>
        ${bodyHtml}
        <p style="margin:26px 0 0;">
          <a href="${safeCtaHref}" style="background:#1f6f5b;color:#ffffff;display:inline-block;font-size:16px;font-weight:700;line-height:20px;padding:13px 18px;text-decoration:none;">${safeCtaLabel}</a>
        </p>
      </div>
      <p style="margin:18px 0 0;color:#6b5e4f;font-size:12px;line-height:18px;">You are receiving this onboarding email because you created a Slothing account. <a href="${safeUnsubscribeUrl}" style="color:#1f6f5b;text-decoration:underline;">Unsubscribe</a>.</p>
    </main>
  </body>
</html>`;
}

function greet(firstName: string | null | undefined, fallback: string): string {
  const cleanName = firstName?.trim();
  return cleanName ? `${fallback}, ${cleanName}` : fallback;
}

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}
