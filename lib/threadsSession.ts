import crypto from "node:crypto";

export type ThreadsSession = {
  accessToken: string;
  userId: string;
  expiresAt: number;
};

export const THREADS_SESSION_COOKIE = "threads_session";
export const THREADS_STATE_COOKIE = "threads_oauth_state";
export const THREADS_REDIRECT_COOKIE = "threads_oauth_redirect";

function key() {
  const secret = process.env.THREADS_APP_SECRET;
  if (!secret) throw new Error("THREADS_APP_SECRET is not configured.");
  return crypto.createHash("sha256").update(`artur-threads-ai:${secret}`).digest();
}

export function sealThreadsSession(session: ThreadsSession) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(session), "utf8"),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map((part) => part.toString("base64url")).join(".");
}

export function unsealThreadsSession(value?: string | null): ThreadsSession | null {
  if (!value) return null;
  try {
    const [ivPart, tagPart, dataPart] = value.split(".");
    if (!ivPart || !tagPart || !dataPart) return null;
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      key(),
      Buffer.from(ivPart, "base64url")
    );
    decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataPart, "base64url")),
      decipher.final()
    ]);
    const session = JSON.parse(decrypted.toString("utf8")) as ThreadsSession;
    if (!session.accessToken || !session.userId || !session.expiresAt) return null;
    return session;
  } catch {
    return null;
  }
}

export const secureCookie = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/"
};
