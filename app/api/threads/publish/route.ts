import { NextRequest, NextResponse } from "next/server";
import { THREADS_SESSION_COOKIE, unsealThreadsSession } from "../../../../lib/threadsSession";

export const runtime = "nodejs";

type PublishBody = {
  text?: string;
  replyToId?: string;
};

export async function POST(request: NextRequest) {
  const session = unsealThreadsSession(request.cookies.get(THREADS_SESSION_COOKIE)?.value);
  if (!session || session.expiresAt <= Date.now()) {
    return NextResponse.json({ error: "Threads account is not connected." }, { status: 401 });
  }

  const body = (await request.json()) as PublishBody;
  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "Text is required." }, { status: 400 });
  }

  try {
    const createUrl = new URL("https://graph.threads.net/v1.0/me/threads");
    createUrl.searchParams.set("media_type", "TEXT");
    createUrl.searchParams.set("text", text);
    createUrl.searchParams.set("access_token", session.accessToken);
    if (body.replyToId?.trim()) createUrl.searchParams.set("reply_to_id", body.replyToId.trim());

    const createResponse = await fetch(createUrl, { method: "POST", cache: "no-store" });
    const createData = await createResponse.json();
    if (!createResponse.ok || !createData?.id) {
      return NextResponse.json(
        { error: createData?.error?.message || "Could not create Threads post container." },
        { status: createResponse.status || 502 }
      );
    }

    const publishUrl = new URL("https://graph.threads.net/v1.0/me/threads_publish");
    publishUrl.searchParams.set("creation_id", createData.id);
    publishUrl.searchParams.set("access_token", session.accessToken);

    const publishResponse = await fetch(publishUrl, { method: "POST", cache: "no-store" });
    const publishData = await publishResponse.json();
    if (!publishResponse.ok || !publishData?.id) {
      return NextResponse.json(
        { error: publishData?.error?.message || "Could not publish Threads post." },
        { status: publishResponse.status || 502 }
      );
    }

    return NextResponse.json({ ok: true, id: publishData.id, reply: Boolean(body.replyToId) });
  } catch (error) {
    console.error("Threads publish failed", error);
    return NextResponse.json({ error: "Could not reach Threads API." }, { status: 502 });
  }
}
