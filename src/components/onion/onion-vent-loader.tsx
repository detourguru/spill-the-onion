"use client";

import dynamic from "next/dynamic";

const OnionVentApp = dynamic(
  () => import("@/components/onion/onion-vent-app").then((m) => m.OnionVentApp),
  { ssr: false },
);

export function OnionVentLoader() {
  return <OnionVentApp />;
}
