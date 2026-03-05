"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ConnectionStatus {
  connected: boolean;
  email?: string;
  name?: string;
  picture?: string;
}

interface GoogleConnectButtonProps {
  onConnectionChange?: (connected: boolean) => void;
  showStatus?: boolean;
}

export function GoogleConnectButton({
  onConnectionChange,
  showStatus = true,
}: GoogleConnectButtonProps) {
  const { openUserProfile } = useClerk();
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/google/auth");
      if (!res.ok) {
        throw new Error("Failed to check connection");
      }
      const data: ConnectionStatus = await res.json();
      setStatus(data);
      onConnectionChange?.(data.connected);
    } catch (err) {
      console.error("Failed to check Google connection:", err);
      setError("Failed to check connection");
      setStatus({ connected: false });
    } finally {
      setLoading(false);
    }
  }, [onConnectionChange]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Re-check connection when user returns from Clerk profile
  useEffect(() => {
    function handleFocus() {
      checkConnection();
    }
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [checkConnection]);

  function handleConnect() {
    // Opens Clerk's user profile where they can connect/manage Google
    openUserProfile();
  }

  if (loading) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking...
      </Button>
    );
  }

  if (error) {
    return (
      <Button variant="outline" onClick={checkConnection}>
        <AlertCircle className="mr-2 h-4 w-4 text-destructive" />
        Retry
      </Button>
    );
  }

  if (status?.connected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {status.picture && (
            <Image
              src={status.picture}
              alt="Google profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <div className="flex flex-col">
            <span className="flex items-center text-sm font-medium text-green-600">
              <CheckCircle className="mr-1.5 h-4 w-4" />
              Google Connected
            </span>
            {showStatus && status.email && (
              <span className="text-xs text-muted-foreground">
                {status.email}
              </span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleConnect}>
          Manage
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} className="gap-2">
      <GoogleIcon className="h-4 w-4" />
      Connect Google Account
    </Button>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
