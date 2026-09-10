import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // The MVP stores the Threads token only in the user's encrypted HttpOnly cookie,
  // not in a server database. There is therefore no persistent server-side user data to erase yet.
  const confirmationCode = crypto.randomBytes(10).toString("hex");
  const statusUrl = new URL("/api/threads/delete-data", request.url);
  statusUrl.searchParams.set("code", confirmationCode);
  return NextResponse.json({
    url: statusUrl.toString(),
    confirmation_code: confirmationCode
  });
}

export async function GET(request: NextRequest) {
  const code = new URL(request.url).searchParams.get("code");
  return NextResponse.json({
    status: "complete",
    confirmation_code: code || null,
    message: "No persistent Threads user data is stored by this MVP."
  });
}
