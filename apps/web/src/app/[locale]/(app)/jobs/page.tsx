import { redirect } from "next/navigation";

export default function JobsCompatibilityPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { highlight?: string };
}) {
  const highlight = searchParams?.highlight;
  redirect(
    highlight
      ? `/${params.locale}/opportunities?highlight=${encodeURIComponent(
          highlight,
        )}`
      : `/${params.locale}/opportunities`,
  );
}
