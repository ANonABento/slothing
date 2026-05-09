"use client";

import { Loader2 } from "lucide-react";
import { PageWorkspace } from "@/components/ui/page-layout";

export function StudioLoading() {
  return (
    <PageWorkspace className="items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </PageWorkspace>
  );
}
