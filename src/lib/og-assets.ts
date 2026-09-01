import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { TIERS } from "@/lib/onion-tiers";

const juaFontData = readFile(
  join(process.cwd(), "src/assets/fonts/Jua-Regular.ttf"),
);

export function getJuaFont() {
  return juaFontData;
}

const tierImageData = new Map(
  TIERS.map((tier) => [
    tier.key,
    readFile(join(process.cwd(), "public", tier.image), "base64").then(
      (base64) => `data:image/png;base64,${base64}`,
    ),
  ]),
);

export function getTierImageDataUrl(tierKey: string) {
  return tierImageData.get(tierKey) ?? tierImageData.get(TIERS[0].key)!;
}
