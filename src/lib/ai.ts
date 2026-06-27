import { createServerFn } from "@tanstack/react-start";

export type PolishInput = {
  display_name: string;
  title: string;
  bio: string;
  projects: { title: string; description: string }[];
  experience: { role: string; company: string; description: string }[];
  achievements: { title: string; description: string }[];
};

export type PolishResult = {
  title: string;
  bio: string;
  projects: { description: string }[];
  experience: { description: string }[];
  achievements: { description: string }[];
};

export const polishPortfolio = createServerFn({ method: "POST" })
  .inputValidator((d: PolishInput) => d)
  .handler(async ({ data }): Promise<PolishResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured");

    const sys = `You rewrite messy portfolio drafts into crisp, premium copy. Keep facts intact. Be concise, confident, modern. No emojis. No exclamation points. Return ONLY valid JSON matching the requested schema.`;

    const userPrompt = `Rewrite the following portfolio fields. Return JSON with EXACTLY this shape:
{"title": string, "bio": string, "projects":[{"description": string}], "experience":[{"description": string}], "achievements":[{"description": string}]}

The output arrays MUST have the same length as the input arrays (in the same order).
Bios: 2-3 sentences, first person, no clichés.
Project descriptions: 1-2 sentences, focus on outcome.
Experience descriptions: 1-2 sentences, action + impact.
Achievements: 1 sentence.

INPUT:
${JSON.stringify(data, null, 2)}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`AI gateway error: ${res.status} ${txt.slice(0, 200)}`);
    }
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content ?? "{}";
    try {
      return JSON.parse(content) as PolishResult;
    } catch {
      throw new Error("AI returned invalid JSON");
    }
  });
