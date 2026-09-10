import { NextRequest, NextResponse } from "next/server";
import { THREADS_SESSION_COOKIE, unsealThreadsSession } from "../../../../lib/threadsSession";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const configured = Boolean(process.env.THREADS_APP_ID && process.env.THREADS_APP_SECRET);
  const session = unsealThreadsSession(request.cookies.get(THREADS_SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ configured, connected: false });
  }

  if (session.expiresAt <= Date.now()) {
    return NextResponse.json({ configured, connected: false, expired: true });
  }

  try {
    const url = new URL("https://graph.threads.net/v1.0/me");
    url.searchParams.set("fields", "id,username,threads_profile_picture_url,threads_biography");
    url.searchParams.set("access_token", session.accessToken);
    const response = await fetch(url, { cache: "no-store" });
    const profile = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        configured,
        connected: false,
        invalidToken: true,
        error: profile?.error?.message || "Threads token validation failed."
      });
    }

    return NextResponse.json({
      configured,
      connected: true,
      userId: profile.id || session.userId,
      username: profile.username || null,
      profilePictureUrl: profile.threads_profile_picture_url || null,
      biography: profile.threads_biography || null,
      expiresAt: new Date(session.expiresAt).toISOString()
    });
  } catch (error) {
    console.error("Threads status check failed", error);
    return NextResponse.json({ configured, connected: false, error: "Could not verify Threads account." });
  }
}
