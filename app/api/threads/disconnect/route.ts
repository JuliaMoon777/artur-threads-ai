import { NextResponse } from "next/server";
import { secureCookie, THREADS_SESSION_COOKIE } from "../../../../lib/threadsSession";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(THREADS_SESSION_COOKIE, "", { ...secureCookie, maxAge: 0 });
  return response;
}
