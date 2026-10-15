import { notFound } from "next/navigation";

import { isSettingsSection } from "@/lib/settings-sections";

/** The settings layout renders the editor; this route only validates the section. */
export default async function SettingsSectionPage({ params }: { params: Promise<{ section: string }> }) {
  if (!isSettingsSection((await params).section)) notFound();
  return null;
}
