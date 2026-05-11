import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  isDevAuthBypassAllowed,
  isEmailMagicLinkConfigured,
  isNextAuthConfigured,
} from "@/auth";
import { SignInCard } from "./sign-in-card";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to Slothing - continue with Google or get a magic link by email.",
};

interface SignInPageProps {
  params: { locale: string };
  searchParams?: { callbackUrl?: string };
}

export default function SignInPage({ params, searchParams }: SignInPageProps) {
  if (!isNextAuthConfigured()) {
    if (isDevAuthBypassAllowed()) {
      redirect(`/${params.locale}/dashboard`);
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
        <main className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-normal">
            Sign-in unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Authentication is not configured for this deployment. Set
            GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and NEXTAUTH_SECRET, then
            restart the app.
          </p>
        </main>
      </div>
    );
  }

  const callbackUrl =
    searchParams?.callbackUrl ?? `/${params.locale}/dashboard`;
  const enableEmailMagicLink = isEmailMagicLinkConfigured();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted px-4 py-10">
      <h1 className="sr-only">Sign in to Slothing</h1>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-1/3 -top-1/3 h-2/3 w-2/3 rounded-full bg-gradient-to-bl from-primary/8 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-1/3 -left-1/3 h-2/3 w-2/3 rounded-full bg-gradient-to-tr from-accent/6 via-transparent to-transparent blur-3xl" />
      </div>
      <SignInCard
        callbackUrl={callbackUrl}
        enableEmailMagicLink={enableEmailMagicLink}
      />
    </div>
  );
}
