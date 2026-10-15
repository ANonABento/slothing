import type { ReactNode } from "react";

import { SettingsEditor } from "@/components/settings-editor";
import { getSettings } from "@/lib/db";
import { providerStatus } from "@/lib/llm";

export const dynamic = "force-dynamic";

// The editor lives in the layout so unsaved edits survive moving between settings pages.
export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SettingsEditor initial={getSettings()} providers={providerStatus()} />
      {children}
    </>
  );
}
