import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isNextAuthConfigured } from "@/auth";
import { SignInCard } from "./sign-in-card";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Slothing account.",
};

interface SignInPageProps {
  searchParams?: { callbackUrl?: string };
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  if (!isNextAuthConfigured()) {
    redirect("/dashboard");
  }

  const callbackUrl = searchParams?.callbackUrl ?? "/dashboard";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <SignInCard callbackUrl={callbackUrl} />
    </div>
  );
}
