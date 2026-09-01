"use client";

import { RotateCcw, Share2 } from "lucide-react";
import { useState } from "react";

import { OnionStage } from "@/components/onion/onion-stage";
import { VentComposer } from "@/components/onion/vent-composer";
import { useOnionVent } from "@/hooks/use-onion-vent";
import { useViewportHeight } from "@/hooks/use-viewport-height";

export function OnionVentApp() {
  const {
    count,
    tier,
    name,
    setName,
    addVent,
    addVoiceVent,
    burstSignal,
    reply,
    reset,
  } = useOnionVent();

  useViewportHeight();

  const [shareNotice, setShareNotice] = useState<string | null>(null);

  async function handleShare() {
    const params = new URLSearchParams({
      level: tier.key,
      count: String(count),
      name,
    });
    const url = `${window.location.origin}/share?${params.toString()}`;
    const shareData = {
      title: `레벨 ${tier.label}~`,
      text: `이제까지 ${name}에게 ${count}번의 이야기를 공유했어요.`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // 사용자가 공유를 취소한 경우
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareNotice("링크를 복사했어요!");
    } catch {
      setShareNotice("링크 복사에 실패했어요");
    }
    window.setTimeout(() => setShareNotice(null), 1800);
  }

  return (
    <main
      className="fixed inset-x-0 mx-auto flex w-full max-w-md flex-col items-center gap-4 bg-[#EEF0FB] p-4 sm:p-6"
      style={{
        top: "var(--app-offset-top, 0px)",
        height: "var(--app-height, 100dvh)",
      }}
    >
      <section className="relative flex w-full min-h-0 flex-1 justify-center rounded-4xl bg-[#FF6FA9] px-6 py-9 shadow-[0_6px_0_0_rgba(0,0,0,0.08)]">
        <button
          type="button"
          aria-label="결과 공유하기"
          onClick={handleShare}
          className="absolute left-4 top-4 z-10 rounded-full bg-white/30 p-2 text-white transition hover:bg-white/50 active:scale-95"
        >
          <Share2 className="h-4 w-4" />
        </button>

        {shareNotice && (
          <div className="font-jua absolute left-4 top-14 z-10 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
            {shareNotice}
          </div>
        )}

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

      <VentComposer count={count} onSend={addVent} onVoiceSend={addVoiceVent} />
    </main>
  );
}
