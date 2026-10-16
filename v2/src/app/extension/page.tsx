import { existsSync, readFileSync } from "fs";
import { join } from "path";

import { ExtensionSetup } from "@/components/extension-setup";
import { extensionKey, extensionSeen } from "@/lib/extension";

export const dynamic = "force-dynamic";

export default function ExtensionPage() {
  const dist = join(process.cwd(), "extension", "dist");
  let built: string | null = null;
  try {
    built = existsSync(join(dist, "manifest.json")) ? String(JSON.parse(readFileSync(join(dist, "manifest.json"), "utf8")).version) : null;
  } catch {}
  return <ExtensionSetup connectionKey={extensionKey()} seen={extensionSeen()} dist={dist} built={built} />;
}
