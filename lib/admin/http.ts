import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const ownOrigin = new URL(request.url).origin;
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  // Next's bind address can differ from the browser's Host during local preview.
  // Browsers cannot forge Host in a cross-origin fetch.
  let sameHost = false;
  try {
    const parsed = new URL(origin ?? "");
    sameHost = ["https:", "http:"].includes(parsed.protocol) && parsed.origin === origin && parsed.host === request.headers.get("host");
  } catch { /* Invalid / opaque origins fail closed. */ }
  if (!origin || (origin !== ownOrigin && origin !== siteOrigin && !sameHost)) throw new Error("FORBIDDEN");
}

export async function readBody(request: Request, limit = 100_000) {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new Error("INVALID_BODY");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("INVALID_BODY");
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); throw new Error("TOO_LARGE"); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new Error("INVALID_BODY"); }
}

export function apiError(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ error: error.issues[0]?.message ?? "Please check the form fields." }, { status: 400 });
  const code = error instanceof Error ? error.message : "UNKNOWN";
  if (code === "UNAUTHORIZED") return NextResponse.json({ error: "Sign in with an authorised studio account." }, { status: 401 });
  if (code === "FORBIDDEN") return NextResponse.json({ error: "This request is not permitted." }, { status: 403 });
  if (code === "DATABASE_NOT_CONFIGURED") return NextResponse.json({ error: "The studio inbox is temporarily unavailable. Please try again shortly." }, { status: 503 });
  if (code === "INVALID_BODY" || code === "TOO_LARGE") return NextResponse.json({ error: "Please check your request and try again." }, { status: code === "TOO_LARGE" ? 413 : 400 });
  return NextResponse.json({ error: "We couldn’t save this change. Please try again." }, { status: 500 });
}
