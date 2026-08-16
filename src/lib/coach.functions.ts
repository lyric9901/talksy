import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { generateJson, type AiPart } from "./ai.server";

const StyleSchema = z
  .object({
    length: z.string(),
    formality: z.string(),
    emoji: z.string(),
    humor: z.string(),
  })
  .nullable();

const AnalyzeInput = z.object({
  text: z.string().default(""),
  images: z.array(z.string()).default([]),
  context: z.string().default(""),
  style: StyleSchema.default(null),
});

const ProfileInput = z.object({
  handle: z.string().default(""),
  notes: z.string().default(""),
  images: z.array(z.string()).default([]),
});

const PracticeInput = z.object({
  scenario: z.string(),
  difficulty: z.string(),
  history: z.array(z.object({ role: z.string(), content: z.string() })).default([]),
  message: z.string().default(""),
  finish: z.boolean().default(false),
});

const StyleInput = z.object({ samples: z.string().min(1) });

function buildParts(text: string, images: string[]): AiPart[] {
  const parts: AiPart[] = [{ type: "text", text }];
  for (const url of images.slice(0, 4)) {
    parts.push({ type: "image_url", image_url: { url } });
  }
  return parts;
}

function styleLine(style: z.infer<typeof StyleSchema>) {
  if (!style) return "No personal style profile saved — use a natural, neutral-casual voice.";
  return `Match this writing style profile: message length ${style.length}, formality ${style.formality}, emoji usage ${style.emoji}, humour ${style.humor}.`;
}

export const analyzeConversation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalyzeInput.parse(input))
  .handler(async ({ data }) => {
    if (!data.text.trim() && data.images.length === 0) {
      throw new Error("Add a conversation or a screenshot first.");
    }

    const system = `You are a calm, practical communication coach. You read a conversation (from pasted text and/or screenshots of a chat) and help the user understand it and reply well.
${styleLine(data.style)}
Return JSON exactly shaped like:
{
  "summary": string,
  "topic": string,
  "tone": string,
  "momentum": string,
  "question_balance": string,
  "topic_diversity": string,
  "awkwardness": string,
  "next_action": string,
  "metrics": { "flow": number, "reciprocity": number, "topic_variety": number, "clarity": number, "follow_ups": number },
  "observations": string[],
  "suggestions": [ { "text": string, "style": string, "reason": string, "goal": string, "risk": "Low" | "Medium" | "High" } ],
  "coaching": { "observation": string, "suggestion": string, "skill": string }
}
Metrics are 0-10 conversation characteristics, never judgements about a person. Give 4-5 suggestions across different styles (natural, friendly, funny, confident, thoughtful, follow-up question, topic-changing).`;

    const prompt = `Conversation content:
${data.text || "(see screenshots)"}

Extra context from the user: ${data.context || "none"}`;

    return generateJson(system, buildParts(prompt, data.images));
  });

export const refineReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        reply: z.string().min(1),
        instruction: z.string().min(1),
        style: StyleSchema.default(null),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const system = `You rewrite a single chat reply on request. ${styleLine(data.style)}
Return JSON: { "text": string, "reason": string }`;
    return generateJson(system, [
      {
        type: "text",
        text: `Reply: ${data.reply}\n\nRewrite instruction: ${data.instruction}`,
      },
    ]);
  });

export const analyzeProfile = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ProfileInput.parse(input))
  .handler(async ({ data }) => {
    if (!data.notes.trim() && data.images.length === 0) {
      throw new Error(
        "We couldn't access enough public information. Paste public bio/captions or upload screenshots of the public profile.",
      );
    }

    const system = `You analyse ONLY the publicly visible Instagram profile information the user pasted or screenshotted. You never claim to have fetched private data and never guess sensitive personal characteristics (religion, health, sexuality, politics, ethnicity).
Return JSON:
{
  "handle": string,
  "observed": string[],
  "interests": string[],
  "themes": string[],
  "opportunities": [ { "topic": string, "strength": "Strong" | "Good" | "Possible", "evidence": string } ],
  "starters": [ { "text": string, "based_on": string, "why": string, "category": string } ],
  "caveat": string
}
Phrase interests as observations ("gaming appears repeatedly in the public content"), never as certainty.`;

    const prompt = `Handle: ${data.handle || "unknown"}
Publicly visible information provided by the user:
${data.notes || "(see screenshots)"}`;

    return generateJson(system, buildParts(prompt, data.images));
  });

export const practiceTurn = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PracticeInput.parse(input))
  .handler(async ({ data }) => {
    const transcript = data.history
      .map((m) => `${m.role === "user" ? "User" : "Partner"}: ${m.content}`)
      .join("\n");

    if (data.finish) {
      const system = `You score a practice conversation the user just had with a simulated partner. Be encouraging and specific.
Return JSON:
{
  "scores": { "flow": number, "follow_ups": number, "naturalness": number, "topic_development": number, "clarity": number },
  "strengths": string[],
  "weaknesses": string[],
  "examples": string[],
  "challenge": string
}
Scores are 0-100.`;
      return generateJson(system, [
        { type: "text", text: `Scenario: ${data.scenario}\n\nTranscript:\n${transcript}` },
      ]);
    }

    const system = `You role-play a realistic conversation partner so the user can practise. Scenario: ${data.scenario}. Difficulty: ${data.difficulty} (easy = warm and forthcoming, expert = short, distracted, hard to keep going). Stay in character, keep replies to chat length, never break character to coach.
Return JSON: { "reply": string, "hint": string } where hint is one short coaching nudge for the user's next message.`;

    return generateJson(system, [
      {
        type: "text",
        text: `Transcript so far:\n${transcript || "(none)"}\n\nUser just said: ${data.message}`,
      },
    ]);
  });

export const buildStyleProfile = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => StyleInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You analyse a user's own sample messages and describe their writing style.
Return JSON: { "length": string, "formality": string, "emoji": string, "humor": string, "questions": string, "vocabulary": string, "summary": string }
Each value is a short label or phrase.`;
    return generateJson(system, [{ type: "text", text: data.samples }]);
  });
