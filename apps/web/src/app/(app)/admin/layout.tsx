import type { ReactNode } from "react";
import { requireOwner } from "@/lib/admin/owner";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireOwner();
  return children;
}
