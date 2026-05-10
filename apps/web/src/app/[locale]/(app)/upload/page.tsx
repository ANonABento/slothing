import { redirect } from "next/navigation";

export default function UploadPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/bank`);
}
