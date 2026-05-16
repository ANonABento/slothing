"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_TAILOR_SETTINGS,
  loadTailorSettings,
  normalizeTailorSettings,
  saveTailorSettings,
  type AtsStrictness,
  type TailorSettings,
} from "@/lib/tailor/settings";

interface TailorSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Fires after Save with the normalized settings the dialog wrote to
   * localStorage. Lets a parent refresh derived state without re-reading.
   */
  onSaved?: (settings: TailorSettings) => void;
}

function parseIntOrZero(value: string): number {
  if (value === "" || value === "-") return 0;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function TailorSettingsDialog({
  open,
  onOpenChange,
  onSaved,
}: TailorSettingsDialogProps) {
  // Working copy lives in state so unsaved edits can be discarded on cancel.
  const [draft, setDraft] = React.useState<TailorSettings>(
    () => DEFAULT_TAILOR_SETTINGS,
  );

  // Re-load from storage every time the dialog opens — settings might have
  // been changed elsewhere (eg another tab) between opens.
  React.useEffect(() => {
    if (open) {
      setDraft(loadTailorSettings());
    }
  }, [open]);

  const handleSave = React.useCallback(() => {
    const normalized = saveTailorSettings(draft);
    onSaved?.(normalized);
    onOpenChange(false);
  }, [draft, onOpenChange, onSaved]);

  const handleReset = React.useCallback(() => {
    setDraft({ ...DEFAULT_TAILOR_SETTINGS });
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Studio · Tailor
          </p>
          <DialogTitle className="font-display tracking-tight">
            Tailor settings
          </DialogTitle>
          <DialogDescription>
            Tune bullet density, role limits, and ATS strictness for the AI
            tailor flow. Saved per browser.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          {/* Bullets per role */}
          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium text-foreground">
              Bullets per role
            </legend>
            <p className="text-xs text-muted-foreground">
              Soft floor and ceiling for highlights under each work experience.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="tailor-bullets-role-min">Min</Label>
                <Input
                  id="tailor-bullets-role-min"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={12}
                  aria-label="Minimum bullets per role"
                  value={draft.bulletsPerRole.min}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      bulletsPerRole: {
                        ...prev.bulletsPerRole,
                        min: parseIntOrZero(event.target.value),
                      },
                    }))
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="tailor-bullets-role-max">Max</Label>
                <Input
                  id="tailor-bullets-role-max"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={12}
                  aria-label="Maximum bullets per role"
                  value={draft.bulletsPerRole.max}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      bulletsPerRole: {
                        ...prev.bulletsPerRole,
                        max: parseIntOrZero(event.target.value),
                      },
                    }))
                  }
                />
              </div>
            </div>
          </fieldset>

          {/* Bullets per project */}
          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium text-foreground">
              Bullets per project
            </legend>
            <p className="text-xs text-muted-foreground">
              Range for highlights under each side project or portfolio item.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="tailor-bullets-project-min">Min</Label>
                <Input
                  id="tailor-bullets-project-min"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={12}
                  aria-label="Minimum bullets per project"
                  value={draft.bulletsPerProject.min}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      bulletsPerProject: {
                        ...prev.bulletsPerProject,
                        min: parseIntOrZero(event.target.value),
                      },
                    }))
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="tailor-bullets-project-max">Max</Label>
                <Input
                  id="tailor-bullets-project-max"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={12}
                  aria-label="Maximum bullets per project"
                  value={draft.bulletsPerProject.max}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      bulletsPerProject: {
                        ...prev.bulletsPerProject,
                        max: parseIntOrZero(event.target.value),
                      },
                    }))
                  }
                />
              </div>
            </div>
          </fieldset>

          {/* Counts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="tailor-max-roles">Max roles</Label>
              <Input
                id="tailor-max-roles"
                type="number"
                inputMode="numeric"
                min={0}
                max={20}
                aria-label="Maximum number of roles"
                value={draft.maxRoles}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    maxRoles: parseIntOrZero(event.target.value),
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="tailor-max-projects">Max projects</Label>
              <Input
                id="tailor-max-projects"
                type="number"
                inputMode="numeric"
                min={0}
                max={20}
                aria-label="Maximum number of projects"
                value={draft.maxProjects}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    maxProjects: parseIntOrZero(event.target.value),
                  }))
                }
              />
            </div>
          </div>

          {/* ATS strictness */}
          <div className="grid gap-1.5">
            <Label htmlFor="tailor-ats-strictness">ATS rules</Label>
            <Select
              value={draft.atsStrictness}
              onValueChange={(value) =>
                setDraft((prev) => ({
                  ...prev,
                  atsStrictness: value as AtsStrictness,
                }))
              }
            >
              <SelectTrigger
                id="tailor-ats-strictness"
                aria-label="ATS strictness"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loose">
                  Loose — keep stylistic flourishes
                </SelectItem>
                <SelectItem value="balanced">
                  Balanced — recommended default
                </SelectItem>
                <SelectItem value="strict">
                  Strict — plain text, keyword-first
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Controls how aggressively unsupported claims and decorative
              formatting are stripped before export.
            </p>
          </div>

          {/* Drop short bullets */}
          <div className="grid gap-1.5">
            <Label htmlFor="tailor-drop-short-bullets">
              Drop bullets shorter than (characters)
            </Label>
            <Input
              id="tailor-drop-short-bullets"
              type="number"
              inputMode="numeric"
              min={0}
              max={500}
              aria-label="Drop bullets shorter than (characters)"
              value={draft.dropBulletsShorterThan}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  dropBulletsShorterThan: parseIntOrZero(event.target.value),
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Stub bullets like &ldquo;Did stuff&rdquo; get filtered before they
              reach the resume.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            aria-label="Reset tailor settings to defaults"
          >
            Reset to defaults
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            aria-label="Cancel tailor settings"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            aria-label="Save tailor settings"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Convenience hook that owns the open/closed state + renders the dialog.
 * Wire `dialog` into your tree and call `open()` from the menu item that
 * used to show the "Coming soon" toast.
 */
export function useTailorSettingsDialog(options?: {
  onSaved?: (settings: TailorSettings) => void;
}): {
  open: () => void;
  close: () => void;
  dialog: React.ReactNode;
} {
  const [isOpen, setIsOpen] = React.useState(false);
  const onSaved = options?.onSaved;

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);

  const dialog = (
    <TailorSettingsDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      onSaved={onSaved}
    />
  );

  return { open, close, dialog };
}

// Re-export the normalizer so consumers that integrate this hook against
// other surfaces (eg generator wiring) get a single import surface.
export { normalizeTailorSettings };
