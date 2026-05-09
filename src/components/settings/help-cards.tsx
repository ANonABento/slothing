"use client";

import { Cpu, ExternalLink, Key } from "lucide-react";
import { PageIconTile, PagePanel } from "@/components/ui/page-layout";

export function HelpCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PagePanel className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <PageIconTile icon={Cpu} className="bg-success/10 text-success" />
          <h3 className="font-semibold">Using Ollama (Free)</h3>
        </div>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
          <li>
            Install from{" "}
            <a
              href="https://ollama.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 font-medium inline-flex items-center gap-1"
            >
              ollama.ai <ExternalLink className="h-3 w-3" />
            </a>
          </li>
          <li>
            Run{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              ollama pull llama3.2
            </code>
          </li>
          <li>Test the connection above</li>
        </ol>
      </PagePanel>

      <PagePanel className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <PageIconTile icon={Key} />
          <h3 className="font-semibold">Using API Keys</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Connect your own API keys from OpenAI, Anthropic, or OpenRouter for
          cloud-based processing. Your keys are stored locally and never leave
          your device.
        </p>
      </PagePanel>
    </div>
  );
}
