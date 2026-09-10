import { NextResponse } from "next/server";

export const runtime = "nodejs";

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trends: {
      type: "array",
      minItems: 5,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          trend_score: { type: "integer", minimum: 0, maximum: 100 },
          why_now: { type: "string" },
          mechanism: { type: "string" },
          polish_angle: { type: "string" },
          source_hint: { type: "string" }
        },
        required: ["title", "trend_score", "why_now", "mechanism", "polish_angle", "source_hint"]
      }
    },
    summary: { type: "string" }
  },
  required: ["trends", "summary"]
};

function extractOutputText(data: any) {
  for (const item of data?.output ?? []) {
    if (item?.type !== "message") continue;
    for (const part of item?.content ?? []) {
      if (part?.type === "output_text" && typeof part.text === "string") return part.text;
    }
  }
  return "";
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 503 });
    }

    const body = await request.json().catch(() => ({}));
    const niche = String(body?.niche || "web design, websites, AI for business, automation, branding, marketing, lead generation, small business").trim();
    const model = process.env.OPENAI_MODEL || "gpt-5.6-sol";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        store: false,
        reasoning: { effort: "low" },
        tools: [{ type: "web_search_preview", search_context_size: "medium" }],
        tool_choice: "auto",
        instructions: `You are a trend researcher for a Polish web designer and AI automation consultant. Search the current public web for US-market conversations, debates, creator posts, business discussions and recurring themes from roughly the last 7 days. Prioritize signals from the United States and practical topics that could be adapted into strong Threads text posts for Polish small-business owners. Do not claim exact social-platform popularity metrics unless a source explicitly provides them. Treat trend_score as an editorial estimate based on freshness, repetition across sources, relevance, controversy/usefulness and adaptation potential. Do not copy source wording.`,
        input: `Research current US-market trends for this niche: ${niche}. Return the strongest 5-10 themes worth turning into original Polish Threads posts today. For each one explain why it is timely, the underlying content mechanism, a Polish-market angle, and a short source hint.`,
        text: {
          verbosity: "low",
          format: {
            type: "json_schema",
            name: "usa_trend_radar",
            strict: true,
            schema
          }
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data?.error?.message || "Trend research failed." }, { status: response.status });
    }

    const outputText = extractOutputText(data);
    if (!outputText) {
      return NextResponse.json({ error: "OpenAI returned no trend output." }, { status: 502 });
    }

    return NextResponse.json({ ...JSON.parse(outputText), model, researchedAt: new Date().toISOString() });
  } catch (error) {
    console.error("trend research failed", error);
    return NextResponse.json({ error: "Could not research trends." }, { status: 500 });
  }
}
