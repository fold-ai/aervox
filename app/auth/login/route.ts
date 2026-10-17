import { NextResponse, type NextRequest } from "next/server";
import { isSameOriginRequest } from "@/lib/auth/request.mjs";
import { AUTH } from "@/lib/auth/config";
import { verifyPassword } from "@/lib/auth/password";
import { checkLoginAllowed, clearAccountFailures, recordAttempt } from "@/lib/auth/rate-limit";
import { cookieOptions, signSession } from "@/lib/auth/session";
import { isConfigured, one, query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sign in.
 *
 * Under /auth rather than /api so it cannot collide with the Python solver
 * functions, which own /api/* on Vercel.
 *
 * The response is deliberately uniform: an unknown account and a wrong password
 * return the same message and take a comparable amount of time, so the endpoint
 * cannot be used to enumerate operators.
 */
function json(payload: unknown, init: { status?: number; headers?: Record<string, string> } = {}) {
  return NextResponse.json(payload, { ...init, headers: { ...init.headers, "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  if (!isSameOriginRequest(req)) return json({ ok: false, error: "Request not allowed." }, { status: 403 });
  if (!(req.headers.get("content-type") ?? "").startsWith("application/json")) return json({ ok: false, error: "JSON required." }, { status: 415 });
  if (Number(req.headers.get("content-length") ?? 0) > 16384) return json({ ok: false, error: "Request too large." }, { status: 413 });
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  let email = "";
  let password = "";
  try {
    const raw = await req.text();
    if (raw.length > 16384) return json({ ok: false, error: "Request too large." }, { status: 413 });
    const body = JSON.parse(raw) as { email?: string; password?: string };
    email = String(body.email ?? "").trim().toLowerCase();
    password = String(body.password ?? "");
  } catch {
    return json({ ok: false, error: "Malformed request." }, { status: 400 });
  }
  if (!email || !password || email.length > 254 || password.length > 1024) {
    return json({ ok: false, error: "Email and password are required." }, { status: 400 });
  }
  if (!isConfigured()) {
    return json(
      { ok: false, error: "Sign-in is temporarily unavailable." },
      { status: 503 },
    );
  }

  try {
    const verdict = await checkLoginAllowed(ip, email);
    if (!verdict.allowed) {
      return json(
        { ok: false, error: verdict.reason, retryAfterSeconds: verdict.retryAfterSeconds },
        { status: 429, headers: { "Retry-After": String(verdict.retryAfterSeconds ?? 60) } },
      );
    }

    const operator = await one<{ id: string; email: string; password_hash: string; role: string }>(
      "SELECT id, email, password_hash, role FROM operators WHERE email = $1 AND disabled_at IS NULL",
      [email],
    );

    // Verify even when the account is unknown, against a fixed hash, so a missing
    // account and a wrong password cost the same time.
    const hash =
      operator?.password_hash ??
      "$argon2id$v=19$m=19456,t=2,p=1$YWN0cHJvdmVwbGFjZWhvbGRlcg$3s1ijQmYQ0KcT0eSPr6uJyTPEDXdPFO0lRygZUqbBK0";
    const ok = await verifyPassword(hash, password);

    if (!operator || !ok) {
      await recordAttempt(ip, email, false);
      return json(
        { ok: false, error: "Those credentials were not accepted." },
        { status: 401 },
      );
    }

    await recordAttempt(ip, email, true);
    await clearAccountFailures(email);
    await query("UPDATE operators SET last_login = NOW() WHERE id = $1", [operator.id]);

    const token = await signSession({
      sub: operator.id,
      email: operator.email,
      role: operator.role,
    });
    const res = json({ ok: true, email: operator.email, role: operator.role });
    res.cookies.set({ ...cookieOptions(AUTH.sessionSeconds), value: token });
    return res;
  } catch {
    console.error("Operator sign-in failed.");
    return json({ ok: false, error: "Sign-in is temporarily unavailable." }, { status: 503 });
  }
}
