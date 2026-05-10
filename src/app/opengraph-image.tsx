import { OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og/config";
import { RocketIcon } from "@/lib/og/icons";
import { renderOgImage } from "@/lib/og/template";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    accentIcon: RocketIcon,
  });
}
