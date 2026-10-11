import { redirect } from "next/navigation";

export default function DocumentsPage({
  params,
}: {
  params: { locale: string };
}) {
  redirect(`/${params.locale}/bank`);
}
