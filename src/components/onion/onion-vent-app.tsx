"use client";

import { OnionStage } from "@/components/onion/onion-stage";
import { VentComposer } from "@/components/onion/vent-composer";
import { useOnionVent } from "@/hooks/use-onion-vent";

export function OnionVentApp() {
  const {
    count,
    tier,
    name,
    setName,
    addVent,
    burstSignal,
    reply,
  } = useOnionVent();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center gap-4 bg-[#EEF0FB] p-4 sm:p-6">
      <section className="relative flex w-full flex-1 items-center justify-center rounded-4xl bg-[#FF6FA9] px-6 py-9 shadow-[0_6px_0_0_rgba(0,0,0,0.08)]">
        <OnionStage
          tier={tier}
          name={name}
          onRename={setName}
          burstSignal={burstSignal}
          reply={reply}
        />
      </section>

      <VentComposer count={count} onSend={addVent} />
    </main>
  );
}
