import test from "node:test";
import assert from "node:assert/strict";
import { validateApplication, ApplicationError } from "../lib/careers/validation.mjs";

function application() {
  const form = new FormData();
  for (const [name, value] of Object.entries({ applicationId: "941a434c-27ea-489f-a7b7-671d2521e970", roleSlug: "chief-technology-officer", fullName: "Test Applicant", email: "TEST@example.com", location: "Test city", statement: "I have built and maintained software systems.", resumeUrl: "https://example.com/resume", consent: "yes" })) form.set(name, value);
  return form;
}

test("normalizes a complete application and resolves its listed role", async () => {
  const result = await validateApplication(application());
  assert.equal(result.email, "test@example.com");
  assert.equal(result.roleTitle, "Chief Technology Officer");
});
test("rejects missing consent and unknown roles", async () => {
  const missingConsent = application(); missingConsent.delete("consent");
  await assert.rejects(validateApplication(missingConsent), ApplicationError);
  const unknownRole = application(); unknownRole.set("roleSlug", "invented-role");
  await assert.rejects(validateApplication(unknownRole), ApplicationError);
});
test("rejects unsafe links, spam and absent resume evidence", async () => {
  for (const [key, value] of [["resumeUrl", "javascript:alert(1)"], ["portfolioUrl", "https://user:password@example.com"], ["companyWebsite", "spam"], ["resumeUrl", ""]]) {
    const form = application(); form.set(key, value);
    await assert.rejects(validateApplication(form), ApplicationError);
  }
});
test("requires an actual PDF and rejects oversized uploads", async () => {
  const invalid = application(); invalid.set("resume", new File(["not a PDF"], "resume.pdf", { type: "application/pdf" }));
  await assert.rejects(validateApplication(invalid), /valid PDF/);
  const oversized = application(); oversized.set("resume", new File([new Uint8Array(3 * 1024 * 1024 + 1)], "resume.pdf", { type: "application/pdf" }));
  await assert.rejects(validateApplication(oversized), /3 MB/);
  const valid = application(); valid.delete("resumeUrl"); valid.set("resume", new File(["%PDF-1.7\n"], "resume.pdf", { type: "application/pdf" }));
  assert.equal((await validateApplication(valid)).resume.name, "resume.pdf");
});
