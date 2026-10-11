import { redirect } from "next/navigation";

export default function BuilderRedirectPage({
  params,
}: {
  params: { locale: string };
}) {
  redirect(`/${params.locale}/studio`);
}
