"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { CenteredPagePanel } from "@/components/ui/page-layout";
import { isNextAuthConfiguredOnClient } from "@/lib/auth-client";
import { CheckCircle, Loader2, Chrome, AlertCircle } from "lucide-react";

type ConnectStatus = "loading" | "connecting" | "success" | "error";

function useTokenGenerator() {
  const [status, setStatus] = useState<ConnectStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  async function generateToken() {
    setStatus("connecting");
    try {
      const response = await fetch("/api/extension/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceInfo: navigator.userAgent }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate token");
      }

      const { token, expiresAt } = await response.json();

      const params = new URLSearchParams(window.location.search);
      const extensionId = params.get("extensionId");

      // chrome.runtime is only injected on pages that match an extension's
      // externally_connectable manifest entry. Access through globalThis to
      // keep this file typecheckable without @types/chrome in the main app.
      const chromeGlobal = (
        globalThis as unknown as {
          chrome?: {
            runtime?: {
              sendMessage?: (
                extensionId: string,
                message: unknown,
                responseCallback: (response: unknown) => void,
              ) => void;
            };
          };
        }
      ).chrome;

      const fallbackToLocalStorage = () => {
        localStorage.setItem(
          "columbus_extension_token",
          JSON.stringify({ token, expiresAt }),
        );
        setStatus("success");
      };

      try {
        if (extensionId && chromeGlobal?.runtime?.sendMessage) {
          chromeGlobal.runtime.sendMessage(
            extensionId,
            { type: "AUTH_CALLBACK", token, expiresAt },
            (response: unknown) => {
              if (!response) {
                fallbackToLocalStorage();
              } else {
                setStatus("success");
              }
            },
          );
        } else {
          fallbackToLocalStorage();
        }
      } catch {
        fallbackToLocalStorage();
      }

      setTimeout(() => window.close(), 2000);
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  }

  return { status, error, generateToken };
}

function StatusCard({
  status,
  error,
  onRetry,
}: {
  status: ConnectStatus;
  error: string | null;
  onRetry: () => void;
}) {
  if (status === "loading") {
    return (
      <CenteredPagePanel>
        <div className="flex flex-col items-center py-8 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </CenteredPagePanel>
    );
  }

  return (
    <CenteredPagePanel>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
          <Chrome className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Connect Slothing Extension
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Link your browser extension to your Slothing account.
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center space-y-4">
        {status === "connecting" && (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Connecting your extension...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-12 w-12 text-success" />
            <p className="text-center font-medium text-success">
              Extension connected successfully.
            </p>
            <p className="text-center text-sm text-muted-foreground">
              You can now close this tab and use the extension.
            </p>
            <Button variant="outline" onClick={() => window.close()}>
              Close Tab
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-center font-medium text-destructive">
              Connection failed
            </p>
            <p className="text-center text-sm text-muted-foreground">
              {error || "An unexpected error occurred"}
            </p>
            <Button onClick={onRetry}>Try Again</Button>
          </>
        )}
      </div>
    </CenteredPagePanel>
  );
}

function ExtensionConnectPageWithAuth() {
  const { status: sessionStatus } = useSession();
  const isLoaded = sessionStatus !== "loading";
  const isSignedIn = sessionStatus === "authenticated";
  const { status, error, generateToken } = useTokenGenerator();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      window.location.href = `/sign-in?callbackUrl=${encodeURIComponent("/extension/connect")}`;
      return;
    }

    generateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return <StatusCard status="loading" error={null} onRetry={generateToken} />;
  }

  return <StatusCard status={status} error={error} onRetry={generateToken} />;
}

function ExtensionConnectPageLocalDev() {
  const { status, error, generateToken } = useTokenGenerator();

  useEffect(() => {
    generateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <StatusCard status={status} error={error} onRetry={generateToken} />;
}

export default function ExtensionConnectPage() {
  if (!isNextAuthConfiguredOnClient()) {
    return <ExtensionConnectPageLocalDev />;
  }
  return <ExtensionConnectPageWithAuth />;
}
