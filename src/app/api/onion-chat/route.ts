import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

import { buildOnionSystemInstruction, sanitizeReply } from "@/lib/onion-persona";
import { getReaction } from "@/lib/onion-reactions";
import { getTier } from "@/lib/onion-tiers";

const MODEL = "gemini-3.7-flash";
const MAX_MESSAGE_LENGTH = 500;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const message =
    typeof body?.message === "string"
      ? body.message.trim().slice(0, MAX_MESSAGE_LENGTH)
      : "";
  const count = typeof body?.count === "number" ? body.count : 0;
  const tier = getTier(count);

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: getReaction(tier), fallback: true });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const interaction = await ai.interactions.create({
      model: MODEL,
      input: message,
      system_instruction: buildOnionSystemInstruction(tier),
      generation_config: {
        thinking_level: "low",
      },
    });

    const text = interaction.output_text?.trim();
    if (!text) throw new Error("empty gemini response");

    return NextResponse.json({ reply: sanitizeReply(text) });
  } catch (error) {
    console.error("onion-chat: gemini call failed", error);
    return NextResponse.json({ reply: getReaction(tier), fallback: true });
  }
}
