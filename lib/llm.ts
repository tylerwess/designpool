import { classifyRole, isAmbiguousClassification, type Classification, type ClassifyInput } from "./classify";
import { TYPICAL_MIN_YEARS, isSeniority } from "./taxonomy";

/**
 * Rules always run. An optional LLM pass can refine truly ambiguous titles
 * (today: "Lead" without a clear people-management signal) when
 * LLM_CLASSIFIER_ENABLED=true and LLM_API_URL / LLM_API_KEY are set.
 * It is off by default and any failure falls back to the rules.
 */
export async function classifyListing(input: ClassifyInput): Promise<Classification> {
  const draft = classifyRole(input);
  if (process.env.LLM_CLASSIFIER_ENABLED !== "true") return draft;
  if (!isAmbiguousClassification(input.title, input.description ?? "")) return draft;

  const url = process.env.LLM_API_URL;
  const key = process.env.LLM_API_KEY;
  if (!url || !key) return draft;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || "gpt-4o-mini",
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "Classify the design job into exactly one level: new_grad, mid, senior, staff, principal, manager, director, executive. Reply with the level only.",
          },
          {
            role: "user",
            content: `Title: ${input.title}\n\n${(input.description ?? "").slice(0, 4000)}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return draft;
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = payload.choices?.[0]?.message?.content?.trim().toLowerCase().replace(/\s+/g, "_") ?? "";
    if (!isSeniority(text)) return draft;
    const floor = input.yearsMin ?? input.yearsMax ?? null;
    return {
      seniority: text,
      stretch: floor != null && floor < TYPICAL_MIN_YEARS[text],
    };
  } catch {
    return draft;
  }
}
