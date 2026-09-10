import { NextRequest, NextResponse } from "next/server";
import { THREADS_SESSION_COOKIE, unsealThreadsSession } from "../../../../lib/threadsSession";

export const runtime = "nodejs";

const fields = [
  "id",
  "media_product_type",
  "media_type",
  "permalink",
  "owner",
  "username",
  "text",
  "timestamp",
  "shortcode",
  "thumbnail_url",
  "is_quote_post",
  "has_replies"
].join(",");

export async function GET(request: NextRequest) {
  const session = unsealThreadsSession(request.cookies.get(THREADS_SESSION_COOKIE)?.value);
  if (!session || session.expiresAt <= Date.now()) {
    return NextResponse.json({ error: "Threads account is not connected." }, { status: 401 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();
  const searchType = url.searchParams.get("search_type") === "RECENT" ? "RECENT" : "TOP";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 25, 1), 50);

  if (!q) {
    return NextResponse.json({ error: "Search query is required." }, { status: 400 });
  }

  const apiUrl = new URL("https://graph.threads.net/v1.0/keyword_search");
  apiUrl.searchParams.set("q", q);
  apiUrl.searchParams.set("search_type", searchType);
  apiUrl.searchParams.set("search_mode", "KEYWORD");
  apiUrl.searchParams.set("limit", String(limit));
  apiUrl.searchParams.set("fields", fields);
  apiUrl.searchParams.set("access_token", session.accessToken);

  try {
    const response = await fetch(apiUrl, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Threads search failed.", details: data?.error || null },
        { status: response.status }
      );
    }
    return NextResponse.json({ query: q, searchType, ...data });
  } catch (error) {
    console.error("Threads keyword search failed", error);
    return NextResponse.json({ error: "Could not reach Threads API." }, { status: 502 });
  }
}
