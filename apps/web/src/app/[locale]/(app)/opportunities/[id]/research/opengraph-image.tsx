import { getJobByIdAnyUser } from "@/lib/db/jobs";
import { OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og/config";
import { BriefcaseIcon } from "@/lib/og/icons";
import { renderOgImage } from "@/lib/og/template";
import { getOgSeo } from "@/lib/seo";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const dynamic = "force-dynamic";

export default async function Image({ params }: { params: { id: string } }) {
  const opportunity = getJobByIdAnyUser(params.id);

  if (!opportunity) {
    return renderOgImage({
      ...getOgSeo("jobs"),
      eyebrow: "Company Research",
      accentIcon: BriefcaseIcon,
    });
  }

  return renderOgImage({
    title: `Researching ${opportunity.company}`,
    description: `Company brief, news, and people for ${opportunity.title}.`,
    eyebrow: "Company Research",
    accentIcon: BriefcaseIcon,
  });
}
