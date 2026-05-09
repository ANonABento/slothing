import { redirect } from "next/navigation";

export default function JobsCompatibilityPage({
  searchParams,
}: {
  searchParams?: { highlight?: string };
}) {
  const highlight = searchParams?.highlight;
  redirect(
    highlight
      ? `/opportunities?highlight=${encodeURIComponent(highlight)}`
      : "/opportunities",
  );
}
