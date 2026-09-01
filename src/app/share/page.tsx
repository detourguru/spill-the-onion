import { OnionVentApp } from "@/components/onion/onion-vent-app";
import { DEFAULT_ONION_NAME } from "@/lib/onion-config";
import { TIERS } from "@/lib/onion-tiers";

import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ level?: string; count?: string; name?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const sp = await searchParams;
  const tier = TIERS.find((t) => t.key === sp.level) ?? TIERS[0];
  const count = Math.max(0, Math.min(99999, Number(sp.count) || 0));
  const name = sp.name?.trim().slice(0, 8) || DEFAULT_ONION_NAME;

  const title = `레벨 ${tier.label}~`;
  const description = `이제까지 ${name}에게 ${count}번의 이야기를 공유했어요.`;
  const imageUrl = `/api/og?${new URLSearchParams({
    level: tier.key,
    count: String(count),
    name,
  }).toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function SharePage() {
  return <OnionVentApp />;
}
