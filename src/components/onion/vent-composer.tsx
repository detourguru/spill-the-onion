"use client";

import { Send } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

type FlyingBubble = {
  id: string;
  text: string;
  size: number;
};

const BASE_FONT_SIZE = 16;
const FONT_SIZE_STEP = 4;
const MAX_FONT_SIZE = 64;

export function VentComposer({
  count,
  onSend,
}: {
  count: number;
  onSend: () => void;
}) {
  const [value, setValue] = useState("");
  const [flying, setFlying] = useState<FlyingBubble[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const text = value.trim();
    if (!text) return;

    onSend();
    setValue("");
    textareaRef.current?.focus();

    const size = Math.min(
      MAX_FONT_SIZE,
      BASE_FONT_SIZE + count * FONT_SIZE_STEP,
    );
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setFlying((prev) => [...prev, { id, text, size }]);
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
      </div>
    </div>
  );
}
