import type { Metadata } from "next";
import { isEmailMagicLinkConfigured, isNextAuthConfigured } from "@/auth";
import { AuthDisabledCard, SignInCard } from "./sign-in-card";

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
  const callbackUrl =
    searchParams?.callbackUrl ?? `/${params.locale}/dashboard`;
  const enableEmailMagicLink = isEmailMagicLinkConfigured();
  const isAuthConfigured = isNextAuthConfigured();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted px-4 py-10">
      <h1 className="sr-only">Sign in to Slothing</h1>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-1/3 -top-1/3 h-2/3 w-2/3 rounded-full bg-gradient-to-bl from-primary/8 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-1/3 -left-1/3 h-2/3 w-2/3 rounded-full bg-gradient-to-tr from-accent/6 via-transparent to-transparent blur-3xl" />
      </div>
      {isAuthConfigured ? (
        <SignInCard
          callbackUrl={callbackUrl}
          enableEmailMagicLink={enableEmailMagicLink}
        />
      ) : (
        <AuthDisabledCard
          locale={params.locale}
          showDevDashboardLink={process.env.NODE_ENV !== "production"}
        />
      )}
    </div>
  );
}
