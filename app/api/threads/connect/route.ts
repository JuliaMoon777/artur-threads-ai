import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { secureCookie, THREADS_REDIRECT_COOKIE, THREADS_STATE_COOKIE } from "../../../../lib/threadsSession";

export const runtime = "nodejs";

const scopes = [
  "threads_basic",
  "threads_content_publish",
  "threads_keyword_search",
  "threads_profile_discovery",
  "threads_read_replies",
  "threads_manage_replies",
  "threads_manage_insights"
];

export async function GET(request: NextRequest) {
  const appId = process.env.THREADS_APP_ID;
  const origin = new URL(request.url).origin;

  if (!appId || !process.env.THREADS_APP_SECRET) {
    return NextResponse.redirect(new URL("/?threads_error=missing_meta_config#settings", origin));
  }

  const state = crypto.randomBytes(24).toString("base64url");
  const redirectUri = `${origin}/api/threads/callback`;
  const authorizeUrl = new URL("https://threads.net/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", appId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", scopes.join(","));
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(THREADS_STATE_COOKIE, state, { ...secureCookie, maxAge: 10 * 60 });
  response.cookies.set(THREADS_REDIRECT_COOKIE, redirectUri, { ...secureCookie, maxAge: 10 * 60 });
  return response;
}
