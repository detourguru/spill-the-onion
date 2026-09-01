"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DEFAULT_ONION_NAME } from "@/lib/onion-config";
import { getReaction } from "@/lib/onion-reactions";
import { getTier } from "@/lib/onion-tiers";

type DayState = {
  date: string;
  count: number;
};

const DAY_PREFIX = "onion-vent:day:";
const NAME_KEY = "onion-vent:name";
const DEFAULT_NAME = DEFAULT_ONION_NAME;

function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function loadDay(date: string): DayState {
  try {
    const raw = window.localStorage.getItem(DAY_PREFIX + date);
    if (!raw) return { date, count: 0 };
    const parsed = JSON.parse(raw) as Partial<DayState>;
    return {
      date,
      count: parsed.count ?? 0,
    };
  } catch {
    return { date, count: 0 };
  }
}

function loadName(): string {
  try {
    return window.localStorage.getItem(NAME_KEY) || DEFAULT_NAME;
  } catch {
    return DEFAULT_NAME;
  }
}

export function useOnionVent() {
  const [day, setDay] = useState<DayState>(() => loadDay(todayKey()));
  const [name, setNameState] = useState<string>(() => loadName());
  const [burstSignal, setBurstSignal] = useState(0);
  const [reply, setReply] = useState<string | null>(null);

  const dayRef = useRef(day);
  const burstSignalRef = useRef(burstSignal);
  useEffect(() => {
    dayRef.current = day;
    burstSignalRef.current = burstSignal;
  });

  useEffect(() => {
    window.localStorage.setItem(DAY_PREFIX + day.date, JSON.stringify(day));
  }, [day]);

  const setName = useCallback((value: string) => {
    const trimmed = value.trim().slice(0, 4) || DEFAULT_NAME;
    setNameState(trimmed);
    window.localStorage.setItem(NAME_KEY, trimmed);
  }, []);

  const reset = useCallback(() => {
    const d = todayKey();
    window.localStorage.removeItem(DAY_PREFIX + d);
    window.localStorage.removeItem(NAME_KEY);
    setDay({ date: d, count: 0 });
    setNameState(DEFAULT_NAME);
    setBurstSignal(0);
    setReply(null);
  }, []);

  const addVent = useCallback(() => {
    const nextTier = getTier(dayRef.current.count + 1);
    const upcomingBurst = burstSignalRef.current + 1;
    const replyText = getReaction(nextTier);

    setDay((prev) => ({ ...prev, count: prev.count + 1 }));
    setBurstSignal(upcomingBurst);
    setReply(replyText);

    return replyText;
  }, []);

  const addVoiceVent = useCallback(async (transcript: string) => {
    const nextCount = dayRef.current.count + 1;
    const nextTier = getTier(nextCount);

    let replyText: string;
    let fallback = false;
    try {
      const res = await fetch("/api/onion-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: transcript, count: nextCount }),
      });
      if (!res.ok) throw new Error("onion-chat request failed");
      const data = (await res.json()) as { reply?: string; fallback?: boolean };
      if (!data.reply) throw new Error("empty reply");
      replyText = data.reply;
      fallback = Boolean(data.fallback);
    } catch {
      replyText = getReaction(nextTier);
      fallback = true;
    }

    const upcomingBurst = burstSignalRef.current + 1;
    setDay((prev) => ({ ...prev, count: prev.count + 1 }));
    setBurstSignal(upcomingBurst);
    setReply(replyText);

    return { reply: replyText, fallback };
  }, []);

  useEffect(() => {
    const check = () => {
      const d = todayKey();
      if (d !== dayRef.current.date) setDay(loadDay(d));
    };
    const intervalId = window.setInterval(check, 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const tier = getTier(day.count);

  return {
    count: day.count,
    tier,
    name,
    setName,
    addVent,
    addVoiceVent,
    burstSignal,
    reply,
    reset,
  };
}
