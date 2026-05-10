import { getPageMetadata } from "@/lib/seo";

export const metadata = getPageMetadata("adminEvals");

export default function AdminEvalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
