import { ImageResponse } from "next/og";

import { getJuaFont } from "@/lib/og-assets";
import { buildRootOgCard } from "@/lib/root-og-card";

export const alt =
  "비난양파 - 오늘 있었던 일을 양파에게 쏟아내는 감정 배출 웹토이";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [element, fontData] = await Promise.all([
    buildRootOgCard(),
    getJuaFont(),
  ]);

  return new ImageResponse(element, {
    ...size,
    fonts: [{ name: "Jua", data: fontData, style: "normal", weight: 400 }],
  });
}
