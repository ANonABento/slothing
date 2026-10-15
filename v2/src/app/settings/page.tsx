import { SettingsEditor } from "@/components/settings-editor";
import { getSettings } from "@/lib/db";
import { providerStatus } from "@/lib/llm";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return <SettingsEditor initial={getSettings()} providers={providerStatus()} />;
}
