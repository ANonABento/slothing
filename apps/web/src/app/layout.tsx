// Root layout shim — required by Next.js when there's a non-locale-scoped
// not-found.tsx. The real app layout lives under [locale]/layout.tsx;
// this just provides the minimum HTML scaffold so the orphan not-found page
// can render. If/when src/app/not-found.tsx is consolidated into the
// locale segment, this file can be deleted.
import { getSiteMetadata } from "@/lib/seo";

export const metadata = getSiteMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
