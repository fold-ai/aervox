import "server-only";
import { policyVersion } from "../site-policies";
import { createHmac, randomUUID } from "node:crypto";
import { ApplicationError } from "./validation.mjs";

const RESUME_BUCKET = "career-resumes";
export function careersConfigured() {
  return Boolean(process.env.CAREERS_SUPABASE_URL && process.env.CAREERS_SUPABASE_SECRET_KEY);
}

function configuration() {
  const url = process.env.CAREERS_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.CAREERS_SUPABASE_SECRET_KEY;
  if (!url || !key) throw new ApplicationError("Online applications are temporarily unavailable. Please contact contact@actprove.com.", 503);
  return { url, key };
}

async function request(path: string, init: RequestInit = {}) {
  const { url, key } = configuration();
  return fetch(`${url}${path}`, { ...init, cache: "no-store", signal: AbortSignal.timeout(15000), headers: { apikey: key, ...init.headers } });
}

type Application = {
  id: string; roleSlug: string; roleTitle: string; fullName: string; email: string;
  location: string; availability: string; statement: string; resumeUrl: string;
  portfolioUrl: string; resume: File | null;
  usWorkAuthorization: string; usSponsorship: string; workArrangement: string;
  motivation: string; roleQuestion: string; roleResponse: string;
};

export async function saveCareerApplication(application: Application, ip: string) {
  const { key } = configuration();
  // A keyed digest supports abuse limits without retaining the visitor's IP.
  const ipHash = ip ? createHmac("sha256", key).update(ip).digest("hex") : null;
  const resumePath = application.resume ? `${application.id}/${randomUUID()}.pdf` : null;
  if (application.resume && resumePath) {
    const upload = await request(`/storage/v1/object/${RESUME_BUCKET}/${resumePath}`, { method: "POST", headers: { "Content-Type": "application/pdf", "x-upsert": "false" }, body: await application.resume.arrayBuffer() });
    if (!upload.ok) throw new ApplicationError("We could not upload your resume. Please try again or use a resume link.", 503);
  }
  let response: Response;
  try {
    response = await request("/rest/v1/rpc/submit_career_application", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ application: {
      id: application.id, role_slug: application.roleSlug, role_title: application.roleTitle,
      full_name: application.fullName, email: application.email, location: application.location,
      availability: application.availability || null, statement: application.statement,
      us_work_authorization: application.usWorkAuthorization, us_sponsorship: application.usSponsorship,
      work_arrangement: application.workArrangement, motivation: application.motivation,
      role_question: application.roleQuestion, role_response: application.roleResponse,
      resume_url: application.resumeUrl || null, portfolio_url: application.portfolioUrl || null,
      resume_path: resumePath, resume_filename: application.resume?.name.slice(0, 180) || null,
      ip_hash: ipHash, consent_version: policyVersion,
    } }) });
  } catch {
    // An uncertain network outcome may already have committed the record.
    // Keep its file; retrying the same application ID is idempotent.
    throw new ApplicationError("We could not confirm receipt. Please try again; your application will not be duplicated.", 503);
  }
  if (!response.ok) {
    if (resumePath) await removeResume(resumePath);
    throw new ApplicationError("We could not save your application. Please try again or contact contact@actprove.com.", 503);
  }
  const result = await response.json();
  if (result?.rate_limited) {
    if (resumePath) await removeResume(resumePath);
    throw new ApplicationError("Too many applications have been submitted recently. Please try again later.", 429);
  }
  if (!result?.ok || result.id !== application.id) throw new ApplicationError("We could not confirm your application. Please try again.", 503);
  if (result.duplicate && resumePath) await removeResume(resumePath);
  return { id: result.id };
}

async function removeResume(path: string) {
  try { await request(`/storage/v1/object/${RESUME_BUCKET}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prefixes: [path] }) }); } catch { /* Orphaned test uploads can be removed through the private storage dashboard. */ }
}
