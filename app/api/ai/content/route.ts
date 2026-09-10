import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RequestBody = {
  trend?: string;
  context?: string;
};

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hook: { type: "string" },
    post: { type: "string" },
    angle: { type: "string" },
    why_it_works: { type: "string" },
    quality_score: { type: "integer", minimum: 0, maximum: 100 },
    image_worth_it: { type: "boolean" },
    image_prompt: { type: "string" }
  },
  required: [
    "hook",
    "post",
    "angle",
    "why_it_works",
    "quality_score",
    "image_worth_it",
    "image_prompt"
  ]
};

function extractOutputText(data: any) {
  for (const item of data?.output ?? []) {
    if (item?.type !== "message") continue;
    for (const part of item?.content ?? []) {
      if (part?.type === "output_text" && typeof part.text === "string") {
        return part.text;
      }
    }
  }
  return "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const trend = body.trend?.trim();

    if (!trend) {
      return NextResponse.json({ error: "Trend is required." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured in Vercel Environment Variables." },
        { status: 503 }
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-5.6-sol";

    const instructions = `You are the Polish content strategist for Artur Creative.
Artur sells premium but practical websites, web design, branding and AI automation to small and medium businesses in Poland.
The source idea may come from the US market. Never translate it literally and never copy wording. Extract the mechanism that makes the idea interesting, then create an original Polish Threads post for the Polish market.

Writing rules:
- Output must be natural Polish only.
- Sound like a sharp practitioner, not a marketing agency or generic AI.
- Prefer a strong opinion, observation, mini-case or useful contrarian insight.
- Keep the final Threads post concise and skimmable, generally 250-700 characters unless the idea genuinely needs more.
- No fake client results, fake revenue, fake statistics or invented personal experiences.
- No corporate filler such as "w dzisiejszych czasach", "w erze cyfryzacji", "5 powodów dlaczego".
- Avoid excessive emoji and hashtags.
- The hook should earn attention without clickbait.
- The post should attract Polish business owners who could realistically need a website.
- If the source is a hypothetical case, clearly frame it as an example or teardown, not a real client.
- Set image_worth_it=true only if a visual materially improves the post. If false, image_prompt must be an empty string.
- If image_worth_it=true, write a concise English image-generation prompt suitable for GPT Image 2.5. Do not put text in the generated image unless text is essential.`;

    const input = `US trend / source idea:\n${trend}\n\nOptional context:\n${body.context?.trim() || "None"}`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        instructions,
        input,
        reasoning: { effort: "low" },
        store: false,
        text: {
          verbosity: "low",
          format: {
            type: "json_schema",
            name: "polish_threads_post",
            strict: true,
            schema
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "OpenAI request failed." },
        { status: response.status }
      );
    }

    const outputText = extractOutputText(data);
    if (!outputText) {
      return NextResponse.json({ error: "OpenAI returned no text output." }, { status: 502 });
    }

    const result = JSON.parse(outputText);
    return NextResponse.json({ ...result, model });
  } catch (error) {
    console.error("content generation failed", error);
    return NextResponse.json({ error: "Could not generate content." }, { status: 500 });
  }
}
