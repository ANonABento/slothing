import { redirect } from "next/navigation";

export default function CoverLetterRedirectPage({
  params,
}: {
  params: { locale: string };
}) {
  redirect(`/${params.locale}/studio`);
}
