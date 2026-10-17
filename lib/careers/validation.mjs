import { careerRoles } from "./roles.js";
import { careerQuestions, openApplicationQuestion } from "./questions.js";

export const APPLICATION_VERSION = "2026-10-17-us-v1";
export const MAX_RESUME_BYTES = 3 * 1024 * 1024;
const roleSlugs = new Set(["open-application", ...careerRoles.map(role => role.slug)]);

export class ApplicationError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

function field(form, name, max, required = false) {
  const raw = form.get(name);
  if (raw !== null && typeof raw !== "string") throw new ApplicationError("Please check your application fields.");
  const value = String(raw || "").trim();
  if ((required && !value) || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new ApplicationError(`Please check ${name === "fullName" ? "your name" : name === "roleSlug" ? "your selected role" : name}.`);
  return value;
}

function link(value, label) {
  if (!value) return "";
  let url;
  try { url = new URL(value); } catch { throw new ApplicationError(`Please enter a valid HTTPS ${label} link.`); }
  if (url.protocol !== "https:" || url.username || url.password) throw new ApplicationError(`Please enter a valid HTTPS ${label} link.`);
  return url.href;
}

function choice(form, name, options, label) {
  const value = field(form, name, 40);
  if (!options.includes(value)) throw new ApplicationError(`Please select an answer for ${label}.`);
  return value;
}

function answer(form, name, max, label) {
  const value = field(form, name, max);
  if (value.length < 20) throw new ApplicationError(`Please add at least 20 characters for ${label}.`);
  return value;
}

export async function validateApplication(form) {
  if (field(form, "companyWebsite", 500)) throw new ApplicationError("Unable to submit this application.");
  const id = field(form, "applicationId", 36, true);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw new ApplicationError("Please reload the page and try again.");
  const roleSlug = field(form, "roleSlug", 100, true);
  if (!roleSlugs.has(roleSlug)) throw new ApplicationError("Please select a listed role or an open application.");
  const fullName = field(form, "fullName", 120, true);
  const email = field(form, "email", 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApplicationError("Please enter a valid email address.");
  const location = field(form, "location", 160, true);
  const availability = field(form, "availability", 160, true);
  const usWorkAuthorization = choice(form, "usWorkAuthorization", ["yes", "no", "unsure"], "U.S. work authorization");
  const usSponsorship = choice(form, "usSponsorship", ["not_required", "required", "unsure"], "visa sponsorship");
  const workArrangement = choice(form, "workArrangement", ["onsite"], "on-site working arrangements");
  const onSiteAvailability = choice(form, "onSiteAvailability", ["yes", "after_relocation", "depends_on_location", "no"], "on-site availability");
  const relocationWillingness = choice(form, "relocationWillingness", ["already_local", "yes", "depends_on_location", "no"], "relocation willingness");
  const relocationAssistance = choice(form, "relocationAssistance", ["yes", "no", "unsure"], "relocation assistance");
  const motivation = answer(form, "motivation", 2000, "your interest in ACTPROVE");
  const roleResponse = answer(form, "roleResponse", 3000, "your role-specific example");
  const roleQuestion = careerQuestions[roleSlug] || openApplicationQuestion;
  const statement = field(form, "statement", 5000, true);
  if (statement.length < 20) throw new ApplicationError("Please add a little more detail about your work (at least 20 characters).");
  const resumeUrl = link(field(form, "resumeUrl", 500), "resume or profile");
  const portfolioUrl = link(field(form, "portfolioUrl", 500), "portfolio");
  if (form.get("consent") !== "yes") throw new ApplicationError("Please acknowledge the Applicant Privacy Notice before submitting.");
  const entry = form.get("resume");
  const resume = entry && typeof entry !== "string" && entry.size > 0 ? entry : null;
  if (entry && typeof entry === "string") throw new ApplicationError("Please upload your resume as a PDF file.");
  if (!resume && !resumeUrl) throw new ApplicationError("Upload a PDF resume or add a link to your resume or professional profile.");
  if (resume) {
    if (resume.size > MAX_RESUME_BYTES) throw new ApplicationError("Your resume must be no larger than 3 MB.", 413);
    if (!resume.name.toLowerCase().endsWith(".pdf") || (resume.type && resume.type !== "application/pdf")) throw new ApplicationError("Please upload a PDF resume.");
    const signature = new TextDecoder().decode(await resume.slice(0, 5).arrayBuffer());
    if (signature !== "%PDF-") throw new ApplicationError("This file does not appear to be a valid PDF.");
  }
  return { applicationVersion: APPLICATION_VERSION, onSiteAvailability, relocationWillingness, relocationAssistance, id, roleSlug, roleTitle: careerRoles.find(role => role.slug === roleSlug)?.title || "Open application", fullName, email, location, availability, usWorkAuthorization, usSponsorship, workArrangement, motivation, roleQuestion, roleResponse, statement, resumeUrl, portfolioUrl, resume };
}
