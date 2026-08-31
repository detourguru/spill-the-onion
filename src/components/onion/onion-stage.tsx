"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { SOURCE_POT_PX, type Tier } from "@/lib/onion-tiers";

const DISPLAY_POT_PX = 150;
const SCALE = DISPLAY_POT_PX / SOURCE_POT_PX;

const PLATE_BOTTOM_PX = 105 * SCALE;

function PlateNameLabel({
  name,
  onRename,
}: {
  name: string;
  onRename: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function commit() {
    onRename(draft);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.nativeEvent.isComposing) commit();
          if (e.key === "Escape") {
            setDraft(name);
            setEditing(false);
          }
        }}
        maxLength={4}
        style={{ bottom: PLATE_BOTTOM_PX }}
        className="absolute left-1/2 w-20 -translate-x-1/2 translate-y-1/2 rounded bg-white/70 text-center font-jua text-sm text-[#6b4a34] outline-none"
      />
    );
  }

  const chars = Array.from(name);
  const mid = (chars.length - 1) / 2;

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(name);
        setEditing(true);
      }}
      style={{ bottom: PLATE_BOTTOM_PX }}
      className="absolute left-1/2 flex max-w-[80%] -translate-x-1/2 translate-y-1/2 justify-center font-jua text-sm text-[#6b4a34]"
    >
      {chars.map((char, i) => (
        // Pot's corner tag dips toward its fold, so letters tilt away from
        // the label's center to sit flush with that V-shaped seam.
        <span key={i} style={{ transform: `rotate(${(mid - i) * 3}deg)` }}>
          {char}
        </span>
      ))}
    </button>
  );
}

export function OnionStage({
  tier,
  name,
  onRename,
  burstSignal,
  reply,
}: {
  tier: Tier;
  name: string;
  onRename: (value: string) => void;
  burstSignal: number;
  reply: string | null;
}) {
  const displayWidth = SCALE * tier.width;

  return (
    <div className="relative flex w-full items-end justify-center">
      {burstSignal > 0 && (
        <div
          key={`burst-${burstSignal}`}
          className="animate-onion-burst pointer-events-none absolute bottom-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.12)_45%,transparent_72%)] sm:h-56 sm:w-56"
        />
      )}

      {reply && burstSignal > 0 && (
        <div
          key={`reply-${burstSignal}`}
          className="animate-onion-reply pointer-events-none absolute bottom-full left-1/2 mb-2 max-w-55"
        >
          <div className="relative rounded-2xl bg-white px-3 py-2 text-center font-jua text-sm text-neutral-800 shadow-md">
            {reply}
            <span
              aria-hidden
              className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-x-transparent border-t-8 border-t-white"
            />
          </div>
        </div>
      )}

      <div key={`punch-${burstSignal}`} className="animate-onion-punch relative">
        <Image
          key={tier.image}
          src={tier.image}
          alt={tier.label}
          width={tier.width}
          height={tier.height}
          unoptimized
          priority
          style={{ width: displayWidth, height: "auto" }}
          className="drop-shadow-lg"
        />
        <PlateNameLabel name={name} onRename={onRename} />
      </div>
    </div>
  );
}
