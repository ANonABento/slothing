import { redirect } from "next/navigation";

export default function TailorRedirectPage({
  params,
}: {
  params: { locale: string };
}) {
  redirect(`/${params.locale}/studio`);
}
