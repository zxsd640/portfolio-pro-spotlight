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

export type BioStyle = "professional" | "creative" | "bold";
export type BioVariant = { style: BioStyle; text: string };
export type BiosInput = {
  display_name: string;
  title: string;
  bio: string;
  skills: string[];
  seed?: number;
};

async function callGateway(messages: Array<{ role: string; content: string }>) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI is not configured");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 429) throw new Error("Rate limited — try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in your workspace billing.");
    throw new Error(`AI gateway error: ${res.status} ${txt.slice(0, 200)}`);
  }
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(content);
  } catch {
    throw new Error("AI returned invalid JSON");
  }
}

export const generateBios = createServerFn({ method: "POST" })
  .inputValidator((d: BiosInput) => d)
  .handler(async ({ data }): Promise<{ variants: BioVariant[] }> => {
    const sys = `You write portfolio bios in three distinct voices. Each bio is first-person, 2-3 sentences, 35-55 words, no clichés, no emojis, no exclamation points. The three voices MUST sound clearly different from one another.

professional: calm, precise, credibility-first. Lead with role and outcomes.
creative: warm, vivid, a touch of personality. Lead with craft and curiosity.
bold: confident, punchy, momentum-forward. Short sentences, strong verbs.

Return ONLY: {"variants":[{"style":"professional","text":""},{"style":"creative","text":""},{"style":"bold","text":""}]}`;
    const user = `Person:
name: ${data.display_name || "(unknown)"}
title: ${data.title || "(unknown)"}
skills: ${(data.skills || []).slice(0, 12).join(", ") || "(none)"}
draft bio: ${data.bio || "(none — invent from name/title/skills)"}
variation seed: ${data.seed ?? Date.now()}

Write three fresh bios. Do NOT repeat phrasing across variants.`;
    const out = await callGateway([
      { role: "system", content: sys },
      { role: "user", content: user },
    ]);
    const variants: BioVariant[] = Array.isArray(out?.variants) ? out.variants : [];
    const order: BioStyle[] = ["professional", "creative", "bold"];
    const byStyle = new Map(variants.map((v) => [v.style, v.text]));
    return {
      variants: order.map((style) => ({ style, text: (byStyle.get(style) ?? "").trim() })),
    };
  });

export const polishPortfolio = createServerFn({ method: "POST" })
  .inputValidator((d: PolishInput) => d)
  .handler(async ({ data }): Promise<PolishResult> => {
    const sys = `You are a senior portfolio editor. Rewrite messy drafts into crisp, premium copy that hiring managers respect. Keep facts intact, never invent companies, dates, or metrics. Be concise, confident, modern. No emojis, no exclamation points, no clichés ("passionate about", "team player", "results-driven"). Use strong verbs and concrete outcomes. Return ONLY valid JSON matching the requested schema.`;

    const userPrompt = `Rewrite the following portfolio fields. Return JSON with EXACTLY this shape:
{"title": string, "bio": string, "projects":[{"description": string}], "experience":[{"description": string}], "achievements":[{"description": string}]}

The output arrays MUST have the same length as the input arrays, in the same order.
- title: 2-6 words, role + specialty (e.g. "Product Designer · Fintech").
- bio: 2-3 sentences, 40-60 words, first person, opens with what you do and who you do it for.
- project descriptions: 1-2 sentences, lead with the outcome or problem solved.
- experience descriptions: 1-2 sentences, action verb + measurable impact when present.
- achievements: 1 sentence, name the thing and why it matters.

INPUT:
${JSON.stringify(data, null, 2)}`;

    const json = await callGateway([
      { role: "system", content: sys },
      { role: "user", content: userPrompt },
    ]);
    return json as PolishResult;
  });
