import { redirect } from "next/navigation";

export default function CoverLetterRedirectPage({
  params,
  searchParams = {},
}: {
  params: { locale: string };
  searchParams?: { from?: string; id?: string; coverLetterId?: string };
}) {
  const qs = new URLSearchParams();
  if (searchParams.from) qs.set("from", searchParams.from);
  if (searchParams.coverLetterId) {
    qs.set("coverLetterId", searchParams.coverLetterId);
  } else if (searchParams.id) {
    qs.set("coverLetterId", searchParams.id);
  }
  const query = qs.toString();
  redirect(`/${params.locale}/studio${query ? `?${query}` : ""}`);
}
