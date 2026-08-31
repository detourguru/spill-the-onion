"use client";

import { RotateCcw } from "lucide-react";

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
    reset,
  } = useOnionVent();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center gap-4 bg-[#EEF0FB] p-4 sm:p-6">
      <section className="relative flex w-full flex-1 items-center justify-center rounded-4xl bg-[#FF6FA9] px-6 py-9 shadow-[0_6px_0_0_rgba(0,0,0,0.08)]">
        <button
          type="button"
          aria-label="양파 초기화"
          onClick={() => {
            if (window.confirm("양파 레벨과 이름을 초기화할까요?")) reset();
          }}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/30 p-2 text-white transition hover:bg-white/50 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

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
