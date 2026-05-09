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
}

export interface FieldEditorProps {
  field: FieldDef;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
}
