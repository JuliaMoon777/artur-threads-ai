import { NextRequest, NextResponse } from "next/server";
import {
  sealThreadsSession,
  secureCookie,
  THREADS_REDIRECT_COOKIE,
  THREADS_SESSION_COOKIE,
  THREADS_STATE_COOKIE
} from "../../../../lib/threadsSession";

export const runtime = "nodejs";

type TokenResponse = {
  access_token?: string;
  user_id?: string | number;
  expires_in?: number;
  error?: { message?: string };
};

function redirectHome(origin: string, key: string, value: string) {
  const url = new URL("/", origin);
  url.searchParams.set(key, value);
  url.hash = "settings";
  return url;
}

export async function GET(request: NextRequest) {
  const currentUrl = new URL(request.url);
  const origin = currentUrl.origin;
  const code = currentUrl.searchParams.get("code");
  const state = currentUrl.searchParams.get("state");
  const oauthError = currentUrl.searchParams.get("error") || currentUrl.searchParams.get("error_message");

  if (oauthError) {
    return NextResponse.redirect(redirectHome(origin, "threads_error", oauthError));
  }

  const expectedState = request.cookies.get(THREADS_STATE_COOKIE)?.value;
  const redirectUri = request.cookies.get(THREADS_REDIRECT_COOKIE)?.value || `${origin}/api/threads/callback`;
  const appId = process.env.THREADS_APP_ID;
  const appSecret = process.env.THREADS_APP_SECRET;

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(redirectHome(origin, "threads_error", "invalid_oauth_state"));
  }

  if (!appId || !appSecret) {
    return NextResponse.redirect(redirectHome(origin, "threads_error", "missing_meta_config"));
  }

  try {
    const shortResponse = await fetch("https://graph.threads.net/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code
      }),
      cache: "no-store"
    });

    const shortData = (await shortResponse.json()) as TokenResponse;
    if (!shortResponse.ok || !shortData.access_token || !shortData.user_id) {
      const message = shortData.error?.message || "token_exchange_failed";
      return NextResponse.redirect(redirectHome(origin, "threads_error", message));
    }

    const longUrl = new URL("https://graph.threads.net/access_token");
    longUrl.searchParams.set("grant_type", "th_exchange_token");
    longUrl.searchParams.set("client_secret", appSecret);
    longUrl.searchParams.set("access_token", shortData.access_token);

    const longResponse = await fetch(longUrl, { cache: "no-store" });
    const longData = (await longResponse.json()) as TokenResponse;
    if (!longResponse.ok || !longData.access_token) {
      const message = longData.error?.message || "long_token_exchange_failed";
      return NextResponse.redirect(redirectHome(origin, "threads_error", message));
    }

    const expiresIn = longData.expires_in || 60 * 24 * 60 * 60;
    const sessionValue = sealThreadsSession({
      accessToken: longData.access_token,
      userId: String(shortData.user_id),
      expiresAt: Date.now() + expiresIn * 1000
    });

    const response = NextResponse.redirect(redirectHome(origin, "threads", "connected"));
    response.cookies.set(THREADS_SESSION_COOKIE, sessionValue, {
      ...secureCookie,
      maxAge: expiresIn
    });
    response.cookies.delete(THREADS_STATE_COOKIE);
    response.cookies.delete(THREADS_REDIRECT_COOKIE);
    return response;
  } catch (error) {
    console.error("Threads OAuth callback failed", error);
    return NextResponse.redirect(redirectHome(origin, "threads_error", "oauth_callback_failed"));
  }
}
