"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FieldDef } from "./chunk-card.types";

interface ChunkExpandedContentProps {
  fields: FieldDef[];
  content: Record<string, unknown>;
  onEdit: () => void;
  onDeleteClick: () => void;
}

export function ChunkExpandedContent({
  fields,
  content,
  onEdit,
  onDeleteClick,
}: ChunkExpandedContentProps) {
  return (
    <>
      <div className="space-y-2 text-sm">
        {fields.map((field) => {
          const val = content[field.key];
          if (val === undefined || val === null || val === "") return null;
          if (field.type === "checkbox") {
            if (!val) return null;
            return (
              <div key={field.key} className="flex items-center gap-2">
                <Check className="h-3 w-3 text-success" />
                <span className="text-muted-foreground">{field.label}</span>
              </div>
            );
          }
          if (field.type === "list" && Array.isArray(val)) {
            if (val.length === 0) return null;
            return (
              <div key={field.key}>
                <span className="text-xs text-muted-foreground font-medium">{field.label}</span>
                <ul className="mt-1 list-disc list-inside text-sm">
                  {val.map((item, i) => (
                    <li key={i}>{String(item)}</li>
                  ))}
                </ul>
              </div>
            );
          }
          return (
            <div key={field.key}>
              <span className="text-xs text-muted-foreground font-medium">{field.label}: </span>
              <span>{String(val)}</span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="h-3 w-3 mr-1" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={onDeleteClick}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Delete
        </Button>
      </div>
    </>
  );
}
