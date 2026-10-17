import { NextRequest, NextResponse } from "next/server";
import { validateApplication, ApplicationError } from "@/lib/careers/validation.mjs";
import { saveCareerApplication, careersConfigured } from "@/lib/careers/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;
const MAX_REQUEST_BYTES = 3 * 1024 * 1024 + 65536;

function reply(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", ...(status === 429 ? { "Retry-After": "3600" } : {}) } });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowed = new Set([request.nextUrl.origin, "https://www.actprove.com", "https://actprove.com"]);
  if (!origin || !allowed.has(origin)) return reply({ ok: false, error: "Please submit your application through the ACTPROVE careers page." }, 403);
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) return reply({ ok: false, error: "Please submit the application form." }, 415);
  if (Number(request.headers.get("content-length") || 0) > MAX_REQUEST_BYTES) return reply({ ok: false, error: "Your resume must be a PDF no larger than 3 MB." }, 413);
  if (!careersConfigured()) return reply({ ok: false, error: "Online applications are temporarily unavailable. Please contact contact@actprove.com." }, 503);
  try {
    const form = await request.formData();
    const application = await validateApplication(form);
    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
    const saved = await saveCareerApplication(application, ip);
    return reply({ ok: true, id: saved.id }, 201);
  } catch (error) {
    if (error instanceof ApplicationError) return reply({ ok: false, error: error.message }, error.status);
    // Do not put applicant data, provider responses or credentials in logs.
    console.error("Career application submission failed.");
    return reply({ ok: false, error: "We could not save your application. Please try again or contact contact@actprove.com." }, 503);
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Use the application form to submit." }, { status: 405, headers: { "Allow": "POST", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
}
