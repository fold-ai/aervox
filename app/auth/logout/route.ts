import { isSameOriginRequest } from "@/lib/auth/request.mjs";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH } from "@/lib/auth/config";
import { cookieOptions } from "@/lib/auth/session";

export const runtime = "nodejs";

/** Clear the session cookie. Accepts POST only, so a link cannot sign you out. */
export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) return NextResponse.json({ ok: false, error: "Request not allowed." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  const res = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  res.cookies.set({ ...cookieOptions(0), value: "" });
  return res;
}
