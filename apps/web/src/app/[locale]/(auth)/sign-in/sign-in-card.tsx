"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AlertTriangle, ArrowLeft, Loader2, Mail, Rocket } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/google/GoogleIcon";

interface SignInCardProps {
  callbackUrl: string;
  enableEmailMagicLink: boolean;
}

interface AuthDisabledCardProps {
  locale: string;
  showDevDashboardLink: boolean;
}

function AuthBrandLink() {
  return (
    <Link
      href="/"
      className="flex min-h-11 items-center gap-3 rounded-[var(--radius)] px-2"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-button)]">
        <Rocket className="h-5 w-5" />
      </span>
      <span className="text-xl font-bold leading-tight gradient-text">
        Slothing
      </span>
    </Link>
  );
}

export function AuthDisabledCard({
  locale,
  showDevDashboardLink,
}: AuthDisabledCardProps) {
  return (
    <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-5">
      <AuthBrandLink />

      <Card className="w-full shadow-[var(--shadow-elevated)]">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[var(--radius)] bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <CardTitle>Sign-in is disabled in this environment</CardTitle>
          <CardDescription>
            This Slothing instance is running without Google OAuth credentials.
            Missing: <code>GOOGLE_CLIENT_ID</code>,{" "}
            <code>GOOGLE_CLIENT_SECRET</code>, <code>NEXTAUTH_SECRET</code>. See{" "}
            <code>.env.example</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {showDevDashboardLink ? (
            <Button asChild className="w-full">
              <Link href={`/${locale}/dashboard`}>
                Continue to dashboard (dev mode)
              </Link>
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Contact your administrator.
            </p>
          )}
        </CardContent>
      </Card>

      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
    </div>
  );
}

export function SignInCard({
  callbackUrl,
  enableEmailMagicLink,
}: SignInCardProps) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [magicLinkSentTo, setMagicLinkSentTo] = useState<string | null>(null);
  const [magicLinkError, setMagicLinkError] = useState<string | null>(null);

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    void signIn("google", { callbackUrl }).catch(() => {
      setGoogleLoading(false);
    });
  };

  const handleMagicLinkSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setMagicLinkLoading(true);
    setMagicLinkError(null);

    try {
      const result = await signIn("resend", {
        email: trimmedEmail,
        callbackUrl,
        redirect: false,
      });

      if (result?.ok) {
        setMagicLinkSentTo(trimmedEmail);
        return;
      }

      setMagicLinkError("Could not send link. Try again.");
    } catch {
      setMagicLinkError("Could not send link. Try again.");
    } finally {
      setMagicLinkLoading(false);
    }
  };

  const resetMagicLinkForm = () => {
    setEmail("");
    setMagicLinkError(null);
    setMagicLinkSentTo(null);
  };

  return (
    <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-5">
      <AuthBrandLink />

      <Card className="w-full shadow-[var(--shadow-elevated)]">
        <CardHeader className="space-y-2 text-center">
          <CardTitle>Sign in to Slothing</CardTitle>
          <CardDescription>
            {enableEmailMagicLink
              ? "Continue with Google or get a magic link by email."
              : "Continue with Google to keep going."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            disabled={googleLoading || magicLinkLoading}
            onClick={handleGoogleSignIn}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="h-4 w-4" />
            )}
            {googleLoading ? "Signing in..." : "Sign in with Google"}
          </Button>

          {enableEmailMagicLink ? (
            <>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                <span>or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              {magicLinkSentTo ? (
                <div
                  role="status"
                  className="rounded-[var(--radius)] border-[length:var(--border-width)] border-border bg-muted/40 p-4 text-center"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-background text-primary shadow-[var(--shadow-button)]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <p className="font-medium text-foreground">
                    Check your inbox
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We sent a sign-in link to{" "}
                    <strong className="font-medium text-foreground">
                      {magicLinkSentTo}
                    </strong>
                    .
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    className="mt-2 h-auto p-0"
                    onClick={resetMagicLinkForm}
                  >
                    Use a different email
                  </Button>
                </div>
              ) : (
                <form className="space-y-3" onSubmit={handleMagicLinkSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      disabled={magicLinkLoading || googleLoading}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setMagicLinkError(null);
                      }}
                    />
                  </div>
                  {magicLinkError ? (
                    <p role="alert" className="text-sm text-destructive">
                      {magicLinkError}
                    </p>
                  ) : null}
                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={magicLinkLoading || googleLoading}
                  >
                    {magicLinkLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    {magicLinkLoading ? "Sending link..." : "Send magic link"}
                  </Button>
                </form>
              )}
            </>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-3 text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="font-medium text-primary underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-primary underline">
            Privacy Policy
          </Link>
          .
        </p>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
