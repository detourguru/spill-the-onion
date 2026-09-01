import { ImageResponse } from "next/og";

import { getJuaFont, getTierImageDataUrl } from "@/lib/og-assets";
import { DEFAULT_ONION_NAME } from "@/lib/onion-config";
import { getReaction } from "@/lib/onion-reactions";
import { TIERS } from "@/lib/onion-tiers";

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tier =
    TIERS.find((t) => t.key === searchParams.get("level")) ?? TIERS[0];
  const count = Math.max(
    0,
    Math.min(99999, Number(searchParams.get("count")) || 0),
  );
  const name =
    searchParams.get("name")?.trim().slice(0, 8) || DEFAULT_ONION_NAME;
  const line = getReaction(tier);

  const [onionSrc, fontData] = await Promise.all([
    getTierImageDataUrl(tier.key),
    getJuaFont(),
  ]);

  const imageWidth = 300;
  const imageHeight = Math.round(imageWidth * (tier.height / tier.width));

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #FF8FBB 0%, #FF4F93 55%, #E23C82 100%)",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Jua",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#fff",
            color: "#3f2a1f",
            fontSize: 34,
            padding: "18px 34px",
            borderRadius: 30,
            marginBottom: 26,
          }}
        >
          {line}
        </div>

        <img src={onionSrc} alt="" width={imageWidth} height={imageHeight} />

        <div
          style={{
            display: "flex",
            marginTop: 18,
            marginBottom: 30,
            fontSize: 28,
            color: "#fff",
            background: "rgba(0,0,0,0.18)",
            padding: "6px 24px",
            borderRadius: 999,
          }}
        >
          {name}
        </div>

        <div style={{ display: "flex", fontSize: 58, color: "#fff" }}>
          레벨 {tier.label}~
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 14,
            fontSize: 32,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          이제까지 {count}번의 비난을 {name}에게 던졌어요
        </div>

        <div
          style={{
            position: "absolute",
            display: "flex",
            right: 44,
            bottom: 36,
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          비난양파
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Jua", data: fontData, style: "normal", weight: 400 }],
    },
  );
}
