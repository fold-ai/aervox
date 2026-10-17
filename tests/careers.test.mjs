import test from "node:test";
import assert from "node:assert/strict";
import { validateApplication, ApplicationError, APPLICATION_VERSION } from "../lib/careers/validation.mjs";
import { careerCompensation, compensationForRole, formatCompensation } from "../lib/careers/compensation.js";
import { careerRoles } from "../lib/careers/roles.js";
import { careerProfiles } from "../lib/careers/profiles.js";
import { careerQuestions, openApplicationQuestion } from "../lib/careers/questions.js";

function application() {
  const form = new FormData();
  for (const [name, value] of Object.entries({ applicationId: "941a434c-27ea-489f-a7b7-671d2521e970", roleSlug: "chief-technology-officer", fullName: "Test Applicant", email: "TEST@example.com", location: "Test city", usWorkAuthorization: "yes", usSponsorship: "not_required", workArrangement: "onsite", availability: "Four weeks after confirmation", onSiteAvailability: "after_relocation", relocationWillingness: "yes", relocationAssistance: "yes", motivation: "I want to own reliable hardware and software integration.", roleResponse: "I owned the integration, investigated failures and verified the result.", statement: "I have built and maintained software systems.", resumeUrl: "https://example.com/resume", consent: "yes" })) form.set(name, value);
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
  for (const name of ["usWorkAuthorization", "usSponsorship", "workArrangement", "availability", "onSiteAvailability", "relocationWillingness", "relocationAssistance", "motivation", "roleResponse"]) {
    const missing = application(); missing.delete(name);
    await assert.rejects(validateApplication(missing), ApplicationError);
  }
  for (const [name, value] of [["usWorkAuthorization", "invented"], ["usSponsorship", "maybe"], ["workArrangement", "anything"], ["motivation", "too short"], ["roleResponse", "x".repeat(3001)]]) {
    const invalid = application(); invalid.set(name, value);
    await assert.rejects(validateApplication(invalid), ApplicationError);
  }
  for (const value of ["yes", "no", "unsure"]) {
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


test("retains relocation and on-site answers without automatically excluding candidates", async () => {
  const form = application();
  form.set("onSiteAvailability", "no");
  form.set("relocationWillingness", "no");
  form.set("relocationAssistance", "unsure");
  const result = await validateApplication(form);
  assert.equal(result.applicationVersion, APPLICATION_VERSION);
  assert.equal(result.onSiteAvailability, "no");
  assert.equal(result.relocationWillingness, "no");
  assert.equal(result.relocationAssistance, "unsure");
  for (const [field, value] of [["onSiteAvailability", "invented"], ["relocationWillingness", "invented"], ["relocationAssistance", "invented"], ["workArrangement", "remote"], ["workArrangement", "hybrid"]]) {
    const invalid = application(); invalid.set(field, value);
    await assert.rejects(validateApplication(invalid), ApplicationError);
  }
});

test("all 58 roles publish U.S. pay with only approved leadership equity", () => {
  assert.deepEqual(Object.keys(careerCompensation).sort(), careerRoles.map(role => role.slug).sort());
  assert.deepEqual(Object.entries(careerCompensation).filter(([, pay]) => pay.equity).map(([slug]) => slug).sort(), ["chief-technology-officer", "vp-engineering", "chief-systems-engineer"].sort());
  for (const role of careerRoles) {
    const pay = compensationForRole(role.slug);
    assert.ok(pay.min > 0 && pay.max > pay.min, role.slug);
    assert.equal(pay.period, role.type === "Contract" || role.slug === "test-assembly-technician" ? "hour" : "year", role.slug);
    assert.match(formatCompensation(pay), /USD \/ (year|hour)$/);
    assert.ok(!/[\u2013\u2014]/.test(formatCompensation(pay)));
    if (pay.equity) assert.ok(pay.equity[0] >= 0.1 && pay.equity[1] <= 0.5);
  }
});
