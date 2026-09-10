import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    openaiModel: process.env.OPENAI_MODEL || "gpt-5.6-sol",
    threadsConfigured: Boolean(process.env.THREADS_ACCESS_TOKEN && process.env.THREADS_USER_ID),
    imageModel: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2.5-sunburst",
  });
}
