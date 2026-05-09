"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { isNextAuthConfiguredOnClient } from "@/lib/auth-client";

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  if (!isNextAuthConfiguredOnClient()) {
    return <>{children}</>;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
