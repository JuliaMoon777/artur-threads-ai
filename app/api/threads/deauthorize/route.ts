import { NextResponse } from "next/server";

export async function POST() {
  // No persistent Threads user data is stored in the MVP yet.
  return NextResponse.json({ success: true });
}
