"use client";

import { Loader2, Mic, Send, Volume2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type FlyingBubble = {
  id: string;
  text: string;
  size: number;
};

type VoiceStatus = "idle" | "listening" | "thinking" | "speaking";

const BASE_FONT_SIZE = 16;
const FONT_SIZE_STEP = 4;
const MAX_FONT_SIZE = 64;

export function VentComposer({
  count,
  onSend,
  onVoiceSend,
}: {
  count: number;
  onSend: () => string;
  onVoiceSend: (transcript: string) => Promise<{ reply: string }>;
}) {
  const [value, setValue] = useState("");
  const [flying, setFlying] = useState<FlyingBubble[]>([]);
  const [voiceSupported, setVoiceSupported] = useState(() => {
    try {
      return (
        Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition) &&
        "speechSynthesis" in window
      );
    } catch {
      return false;
    }
  });
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const pushFlyingBubble = useCallback(
    (text: string) => {
      const size = Math.min(
        MAX_FONT_SIZE,
        BASE_FONT_SIZE + count * FONT_SIZE_STEP,
      );
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setFlying((prev) => [...prev, { id, text, size }]);
    },
    [count],
  );

  function handleSend() {
    const text = value.trim();
    if (!text) return;

    const replyText = onSend();
    setValue("");
    textareaRef.current?.focus();
    pushFlyingBubble(text);
    speak(replyText);
  }

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    const koVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang?.startsWith("ko"));
    if (koVoice) utterance.voice = koVoice;
    utterance.onend = () => setVoiceStatus("idle");
    utterance.onerror = () => setVoiceStatus("idle");
    setVoiceStatus("speaking");
    window.speechSynthesis.speak(utterance);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "ko-KR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (!transcript) {
        setVoiceStatus("idle");
        return;
      }

      pushFlyingBubble(transcript);
      setVoiceStatus("thinking");
      try {
        const { reply } = await onVoiceSend(transcript);
        speak(reply);
      } catch {
        setVoiceStatus("idle");
      }
    };

    recognition.onerror = () => setVoiceStatus("idle");
    recognition.onend = () => {
      setVoiceStatus((prev) => (prev === "listening" ? "idle" : prev));
    };

    recognitionRef.current = recognition;
    setVoiceStatus("listening");
    recognition.start();
  }, [onVoiceSend, pushFlyingBubble, speak]);

  function handleMicClick() {
    if (voiceStatus === "listening") {
      recognitionRef.current?.stop();
      return;
    }
    if (voiceStatus === "idle") startListening();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="relative flex w-full flex-col gap-2">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-visible">
        {flying.map((bubble) => (
          <div
            key={bubble.id}
            onAnimationEnd={() =>
              setFlying((prev) => prev.filter((b) => b.id !== bubble.id))
            }
            style={{ fontSize: bubble.size }}
            className="animate-onion-fly absolute bottom-2 whitespace-nowrap font-medium text-neutral-800/80"
          >
            {bubble.text}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="양파에게 무엇이든 말해보세요..."
          className={cn(
            "h-11 flex-1 resize-none scrollbar-hide rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-base leading-normal outline-none",
            "focus-visible:border-neutral-400",
          )}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim()}
          aria-label="뒷담 까기"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white shadow-sm transition-transform disabled:opacity-30 enabled:active:scale-95"
        >
          <Send className="size-4" />
        </button>

        {voiceSupported && (
          <button
            type="button"
            onClick={handleMicClick}
            disabled={voiceStatus === "thinking" || voiceStatus === "speaking"}
            aria-label={
              voiceStatus === "listening" ? "음성 인식 중지" : "음성으로 뒷담 까기"
            }
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-transform disabled:opacity-50 enabled:active:scale-95",
              voiceStatus === "listening" ? "animate-pulse bg-rose-500" : "bg-neutral-900",
            )}
          >
            {voiceStatus === "thinking" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : voiceStatus === "speaking" ? (
              <Volume2 className="size-4" />
            ) : (
              <Mic className="size-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
