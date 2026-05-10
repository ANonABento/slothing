import { OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og/config";
import { EditPenIcon } from "@/lib/og/icons";
import { renderOgImage } from "@/lib/og/template";
import { getOgSeo } from "@/lib/seo";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    ...getOgSeo("builder"),
    eyebrow: "Builder",
    accentIcon: EditPenIcon,
  });
}
