"use client";

import { Loader2, Plus } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "./ui";

export function AddJobButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="primary" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      {pending ? "Reading the posting…" : "Add job"}
    </Button>
  );
}
