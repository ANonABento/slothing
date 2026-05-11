import { redirect } from "next/navigation";

const APPLICATION_STATUSES = "applied,interviewing,offered";

export default function ApplicationsCompatibilityPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { status?: string };
}) {
  redirect(
    `/${params.locale}/opportunities?status=${encodeURIComponent(
      searchParams?.status ?? APPLICATION_STATUSES,
    )}`,
  );
}
