import { getLocalizedPageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: string } }) {
  return getLocalizedPageMetadata("jobs", params.locale);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
