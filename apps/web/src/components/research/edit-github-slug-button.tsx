"use client";

import { useState } from "react";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditGithubSlugButtonProps {
  jobId: string;
  currentSlug?: string | null;
  onSlugSaved: () => void;
}

export function EditGithubSlugButton({
  jobId,
  currentSlug,
  onSlugSaved,
}: EditGithubSlugButtonProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentSlug ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/companies/${jobId}/enrich/slugs`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ githubSlug: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save GitHub org");
      }
      setValue(data.githubSlug ?? "");
      setEditing(false);
      onSlugSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save GitHub org",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        title="Edit GitHub org"
        onClick={() => setEditing(true)}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
    );
  }

  return (
    <div className="flex max-w-full flex-wrap items-center justify-end gap-1">
      <Input
        aria-label="GitHub org"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-7 w-28 text-xs"
        placeholder="org"
        disabled={saving}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={save}
        disabled={saving}
        title="Save GitHub org"
      >
        {saving ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Check className="h-3.5 w-3.5" />
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => {
          setValue(currentSlug ?? "");
          setEditing(false);
          setError(null);
        }}
        disabled={saving}
        title="Cancel"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
      {error && <p className="basis-full text-xs text-destructive">{error}</p>}
    </div>
  );
}
