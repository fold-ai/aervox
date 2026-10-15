import test from "node:test";
import assert from "node:assert/strict";
import { validateApplication, ApplicationError } from "../lib/careers/validation.mjs";
import { careerRoles } from "../lib/careers/roles.js";
import { careerProfiles } from "../lib/careers/profiles.js";
import { careerQuestions, openApplicationQuestion } from "../lib/careers/questions.js";

function application() {
  const form = new FormData();
  for (const [name, value] of Object.entries({ applicationId: "941a434c-27ea-489f-a7b7-671d2521e970", roleSlug: "chief-technology-officer", fullName: "Test Applicant", email: "TEST@example.com", location: "Test city", usWorkAuthorization: "yes", usSponsorship: "not_required", workArrangement: "discuss", motivation: "I want to own reliable hardware and software integration.", roleResponse: "I owned the integration, investigated failures and verified the result.", statement: "I have built and maintained software systems.", resumeUrl: "https://example.com/resume", consent: "yes" })) form.set(name, value);
  return form;
}

test("normalizes a complete application and resolves its listed role", async () => {
  const result = await validateApplication(application());
  assert.equal(result.email, "test@example.com");
  assert.equal(result.roleTitle, "Chief Technology Officer");
  assert.equal(result.roleQuestion, careerQuestions["chief-technology-officer"]);
  assert.equal(result.usWorkAuthorization, "yes");
  assert.match(result.roleResponse, /verified/);
});

test("requires complete screening answers without rejecting a work-authorization status", async () => {
  for (const name of ["usWorkAuthorization", "usSponsorship", "workArrangement", "motivation", "roleResponse"]) {
    const missing = application(); missing.delete(name);
    await assert.rejects(validateApplication(missing), ApplicationError);
  }
  for (const [name, value] of [["usWorkAuthorization", "invented"], ["usSponsorship", "maybe"], ["workArrangement", "anything"], ["motivation", "too short"], ["roleResponse", "x".repeat(3001)]]) {
    const invalid = application(); invalid.set(name, value);
    await assert.rejects(validateApplication(invalid), ApplicationError);
  }
  for (const value of ["yes", "no", "unsure", "outside_us"]) {
    const form = application(); form.set("usWorkAuthorization", value); form.set("usSponsorship", "required");
    assert.equal((await validateApplication(form)).usWorkAuthorization, value);
  }
});

test("stores the trusted prompt for the selected role, including open applications", async () => {
  const form = application(); form.set("roleSlug", "mechanical-engineer"); form.set("roleQuestion", "untrusted prompt");
  assert.equal((await validateApplication(form)).roleQuestion, careerQuestions["mechanical-engineer"]);
  form.set("roleSlug", "open-application");
  assert.equal((await validateApplication(form)).roleQuestion, openApplicationQuestion);
});

test("all 58 published roles have complete individual profiles and matching application prompts", () => {
  assert.equal(careerRoles.length, 58);
  assert.deepEqual(Object.keys(careerProfiles).sort(), careerRoles.map(role => role.slug).sort());
  assert.deepEqual(Object.keys(careerQuestions).sort(), Object.keys(careerProfiles).sort());
  assert.equal(new Set(Object.values(careerProfiles).map(profile => profile.discussion)).size, 58);
  for (const role of careerRoles) {
    const profile = careerProfiles[role.slug];
    assert.equal(profile.responsibilities.length, 4, role.slug);
    assert.equal(profile.expectations.length, 2, role.slug);
    assert.equal(profile.outcomes.length, 2, role.slug);
    assert.equal(careerQuestions[role.slug], profile.discussion, role.slug);
    assert.ok(!/[\u2013\u2014]/.test(JSON.stringify({ role, profile })), role.slug);
  }
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
