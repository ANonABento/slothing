import { redirect } from "next/navigation";

export default function TailorRedirectPage({
  params,
  searchParams = {},
}: {
  params: { locale: string };
  searchParams?: { from?: string; tailorId?: string };
}) {
  const qs = new URLSearchParams();
  if (searchParams.from) qs.set("from", searchParams.from);
  if (searchParams.tailorId) qs.set("tailorId", searchParams.tailorId);
  const query = qs.toString();
  redirect(`/${params.locale}/studio${query ? `?${query}` : ""}`);
}
