const PRIMARY_MODEL = "google/gemma-4-26b-a4b-it:free";
const FALLBACK_MODEL = "google/gemini-2.5-flash-lite";

export type AiPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

async function callModel(
  model: string,
  system: string,
  parts: AiPart[],
  apiKey: string,
): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-Title": "Converse AI Coach",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: parts },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${model} failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error(`${model} returned empty content`);
  return content;
}

function extractJson(raw: string): unknown {
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error("Model did not return valid JSON");
  }
}

/** Calls the free primary model, falling back to the secondary model on failure. */
export async function generateJson(system: string, parts: AiPart[]): Promise<unknown> {
  const apiKey = process.env["OPENROUTER_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured yet.");

  const guarded = `${system}

Rules you must always follow:
- Never claim certainty about another person's feelings, intentions, attraction or future behaviour. Use hedged language such as "one reasonable reading is" or "this may suggest".
- Separate observed information from interpretation.
- Never suggest manipulation, deception or pressure.
- Respond with a single valid JSON object and nothing else. No markdown fences.`;

  const models = [PRIMARY_MODEL, FALLBACK_MODEL];
  let lastError: unknown;
  for (const model of models) {
    try {
      const raw = await callModel(model, guarded, parts, apiKey);
      return extractJson(raw);
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(
    lastError instanceof Error ? lastError.message : "Analysis failed. Please try again.",
  );
}
