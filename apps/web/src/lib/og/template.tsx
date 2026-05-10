import { ImageResponse } from "next/og";
import type { ComponentType, SVGProps } from "react";
import { OG_BRAND, OG_SIZE } from "./config";
import { RocketIcon } from "./icons";

type AccentIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface OgImageInput {
  title: string;
  description?: string;
  eyebrow?: string;
  accentIcon?: AccentIcon;
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}...`;
}

export function renderOgImage({
  title,
  description,
  eyebrow = "Slothing",
  accentIcon: AccentIcon,
}: OgImageInput) {
  const safeDescription = description ? truncate(description, 150) : "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${OG_BRAND.primary} 0%, ${OG_BRAND.primaryDark} 100%)`,
        color: OG_BRAND.surface,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 78,
          top: 64,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 14,
            backgroundColor: OG_BRAND.surface,
            color: OG_BRAND.primary,
          }}
        >
          <RocketIcon width={30} height={30} />
        </div>
        <div
          style={{
            marginLeft: 18,
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: 0,
          }}
        >
          Slothing
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 78,
          top: 72,
          display: "flex",
          padding: "12px 20px",
          borderRadius: 999,
          border: "1px solid #ffffff40",
          backgroundColor: "#ffffff18",
          color: "#ffffffd9",
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        {eyebrow}
      </div>

      <div
        style={{
          position: "absolute",
          left: 78,
          top: 210,
          width: 760,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: title.length > 42 ? 64 : 78,
            lineHeight: 1.02,
            fontWeight: 850,
            letterSpacing: 0,
          }}
        >
          {title}
        </div>
        {safeDescription ? (
          <div
            style={{
              marginTop: 26,
              maxWidth: 720,
              color: "#ffffffe0",
              fontSize: 32,
              lineHeight: 1.32,
              fontWeight: 500,
            }}
          >
            {safeDescription}
          </div>
        ) : null}
      </div>

      <div
        style={{
          position: "absolute",
          right: 74,
          bottom: 58,
          width: 306,
          height: 230,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
          border: "1px solid #ffffff30",
          backgroundColor: "#ffffff14",
          color: "#ffffff5c",
        }}
      >
        {AccentIcon ? (
          <AccentIcon width={164} height={164} />
        ) : (
          <RocketIcon width={164} height={164} />
        )}
      </div>

      <div
        style={{
          position: "absolute",
          left: 78,
          bottom: 62,
          display: "flex",
          color: "#ffffffbf",
          fontSize: 25,
          fontWeight: 650,
        }}
      >
        AI-powered job search workspace
      </div>
    </div>,
    OG_SIZE,
  );
}
