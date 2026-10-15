"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Arrow } from "./SiteChrome";
import { careerRoles } from "@/lib/careers/roles";
import { careerQuestions, openApplicationQuestion } from "@/lib/careers/questions";
import styles from "@/app/(public)/careers/careers.module.css";

export default function CareerApplicationForm({ roleSlug = "", configured = false }) {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedRole, setSelectedRole] = useState(roleSlug || "open-application");
  const applicationId = useRef(null);
  const statusRef = useRef(null);
  async function submit(event) {
    event.preventDefault();
    if (state === "sending") return;
    const data = new FormData(event.currentTarget);
    const file = data.get("resume");
    if (file?.size > 3 * 1024 * 1024) { setState("error"); setMessage("Your resume must be a PDF no larger than 3 MB."); return; }
    if (!file?.size && !String(data.get("resumeUrl") || "").trim()) { setState("error"); setMessage("Upload a PDF resume or add a link to your resume or professional profile."); return; }
    if (!applicationId.current) applicationId.current = crypto.randomUUID();
    data.set("applicationId", applicationId.current);
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/careers/submit", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "We could not save your application. Please try again.");
      setState("success");
      setMessage("Application received. Our team will review your experience and contact you if there is a match.");
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch (error) {
      setState("error");
      setMessage(error.message || "We could not save your application. Please try again.");
    }
  }
  if (state === "success") return <div className={styles.success} tabIndex={-1} ref={statusRef} role="status"><span className={styles.label}>APPLICATION RECEIVED</span><h3>Thank you for applying.</h3><p>{message}</p><span className={styles.fine}>Reference: {applicationId.current}</span></div>;
  return <form className={styles.applicationForm} onSubmit={submit} encType="multipart/form-data" aria-label="Career application" aria-busy={state === "sending"}>
    {!configured && <p className={styles.formNotice}>Online applications are being set up. For now, contact <a href="mailto:contact@actprove.com?subject=Career%20application">contact@actprove.com</a> about your role.</p>}
    <fieldset disabled={!configured || state === "sending"}>
      <legend className={styles.srOnly}>Your application details</legend>
      <div className={`${styles.formSection} ${styles.fullField}`}><h3>01 / About you</h3><p>All fields are required unless marked optional. A PDF or a resume/profile link is sufficient.</p></div>
      <label className={styles.fullField}>Role<select name="roleSlug" value={selectedRole} onChange={event => setSelectedRole(event.target.value)} required><option value="open-application">Open application</option>{careerRoles.map(role => <option value={role.slug} key={role.slug}>{role.title} / {role.team === "shared" ? "Platform & operations" : role.team === "leadership" ? "Leadership" : role.team.toUpperCase()}</option>)}</select></label>
      <label>Full name<input name="fullName" autoComplete="name" maxLength={120} required /></label>
      <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
      <label>Current location<input name="location" autoComplete="address-level2" placeholder="City, country" maxLength={160} required /></label>
      <label>Availability (optional)<input name="availability" placeholder="e.g. Available in 4 weeks" maxLength={160} /></label>
      <div className={styles.fullField}><label htmlFor={`resume-${roleSlug || "open"}`}>Resume / CV</label><div className={styles.fileInput}><input id={`resume-${roleSlug || "open"}`} name="resume" type="file" accept="application/pdf,.pdf" onChange={event => setFileName(event.target.files?.[0]?.name || "")} /><span>{fileName || "Choose a PDF, up to 3 MB"}</span><span aria-hidden="true">↑</span></div></div>
      <label className={styles.fullField}>Resume or professional profile link<input name="resumeUrl" type="url" placeholder="https://" maxLength={500} /><span className={styles.fieldHint}>Add a link if you are not uploading a PDF.</span></label>
      <label className={styles.fullField}>Portfolio / GitHub / work samples (optional)<input name="portfolioUrl" type="url" placeholder="https://" maxLength={500} /></label>
      <div className={`${styles.formSection} ${styles.fullField}`}><h3>02 / Work arrangements</h3><p>U.S. and Ukraine office locations are under review. These answers help us discuss suitable arrangements; they do not guarantee visa sponsorship or a specific work location.</p></div>
      <label className={styles.fullField}>Are you currently legally authorized to work in the United States?<select name="usWorkAuthorization" defaultValue="" required><option value="" disabled>Select an answer</option><option value="yes">Yes</option><option value="no">No</option><option value="unsure">Unsure</option><option value="outside_us">I am seeking work outside the U.S.</option></select></label>
      <label className={styles.fullField}>Will you now or in the future require employer sponsorship for an employment visa to work in the United States?<select name="usSponsorship" defaultValue="" required><option value="" disabled>Select an answer</option><option value="not_required">No</option><option value="required">Yes</option><option value="unsure">Unsure</option><option value="outside_us">I am seeking work outside the U.S.</option></select><span className={styles.fieldHint}>Please do not upload immigration or identity documents.</span></label>
      <label className={styles.fullField}>What working arrangements would you be open to?<select name="workArrangement" defaultValue="" required><option value="" disabled>Select an answer</option><option value="onsite_and_field">On-site work and role-relevant lab/field visits</option><option value="onsite">On-site work; travel to be discussed</option><option value="hybrid">Hybrid work; travel to be discussed</option><option value="remote">Remote work</option><option value="discuss">I would like to discuss the role requirements</option></select><span className={styles.fieldHint}>Travel, site duties and any required adjustments are discussed individually.</span></label>
      <div className={`${styles.formSection} ${styles.fullField}`}><h3>03 / Your experience</h3><p>Short, specific answers are enough. Share only work you are permitted to disclose.</p></div>
      <label className={styles.fullField}>Why ACTPROVE, and why this role?<textarea name="motivation" rows={3} minLength={20} maxLength={2000} required placeholder="What interests you about our mission and the work you would own?" /><span className={styles.fieldHint}>A few sentences in your own words.</span></label>
      <label className={styles.fullField}>What relevant technical or professional experience would you bring?<textarea name="statement" rows={5} minLength={20} maxLength={5000} required placeholder="Describe the systems, projects or work most relevant to this role, your own contribution and the tools or methods you used." /><span className={styles.fieldHint}>Engineering, research, operations, contract work and substantial independent projects are all relevant when they demonstrate the required skills.</span></label>
      <label className={styles.fullField}>{careerQuestions[selectedRole] || openApplicationQuestion}<textarea key={selectedRole} name="roleResponse" rows={5} minLength={20} maxLength={3000} required placeholder="Explain the problem, your decisions, your own contribution and the result." /><span className={styles.fieldHint}>This question follows your selected role. Please keep the example non-confidential.</span></label>
      <div className={styles.honeypot} aria-hidden="true"><label>Company website<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label></div>
      <p className={`${styles.fine} ${styles.fullField}`}>Your application and resume are used for recruitment. Unsuccessful or withdrawn applications are retained for up to 6 months after the last recruitment contact, subject to legal retention requirements. <Link href="/legal/retention" target="_blank" rel="noopener noreferrer">Retention details (opens in a new tab)</Link>. This acknowledgement is not consent to marketing.</p>
      <label className={`${styles.consent} ${styles.fullField}`}><input type="checkbox" name="consent" value="yes" required /><span>I have read the <Link href="/legal/applicants" target="_blank" rel="noopener noreferrer">Applicant Privacy Notice (opens in a new tab)</Link> and understand how Menuo Inc. handles my application for ACTPROVE.</span></label>
      <div className={`${styles.formBottom} ${styles.fullField}`}><button type="submit" className={styles.primaryButton}>{state === "sending" ? "Submitting…" : "Submit application"}<Arrow diagonal /></button><p>Questions or a data-removal request?<br /><a href="mailto:contact@actprove.com?subject=Careers%20inquiry">contact@actprove.com</a></p></div>
    </fieldset>
    {message && <p className={styles.formError} role="alert">{message}</p>}
    <noscript><p>Enable JavaScript to use this form, or contact contact@actprove.com about your application.</p></noscript>
  </form>;
}
