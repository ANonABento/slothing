import type { BankEntry } from "@/types";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "checkbox" | "list" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface ChunkCardProps {
  entry: BankEntry;
  onUpdate: (id: string, content: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  onCreateChild?: (parent: BankEntry, description: string) => void;
  onReorderChild?: (
    parent: BankEntry,
    childId: string,
    direction: "up" | "down",
  ) => void;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  highlighted?: boolean;
  anySelected?: boolean;
  childEntries?: BankEntry[];
  forceExpanded?: boolean;
  /**
   * When provided, replaces the card's inline expand-toggle behavior with a
   * "select" callback. Grid view passes this so clicks anywhere on the card
   * surface open the side drawer instead of expanding the card inline (which
   * does not work well at narrow grid column widths).
   */
  onSelect?: () => void;
  /**
   * Map of `sourceDocumentId → filename` used to render the source label as a
   * human-readable filename instead of a raw UUID. Pass `null` for entries
   * that were created manually.
   */
  sourceFilenames?: Map<string, string>;
  /**
   * AI bank authoring (spec §4). When provided, a verified entry shows a "Strengthen with
   * AI" action that drafts a grounded rewrite; an AI-drafted entry (status draft/suggested)
   * shows a "Confirm" action. Optional so non-AI surfaces can omit them.
   */
  onStrengthen?: (id: string) => void;
  onConfirm?: (id: string) => void;
  /** Ids with an AI request in flight (disables the button + shows a spinner). */
  aiBusyIds?: Set<string>;
}

export interface FieldEditorProps {
  field: FieldDef;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
  hideLabel?: boolean;
}
