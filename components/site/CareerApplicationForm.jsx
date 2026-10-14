"use client";

import { useRef, useState } from "react";
import { Arrow } from "./SiteChrome";
import { careerRoles } from "@/lib/careers/roles";
import styles from "@/app/(public)/careers/careers.module.css";

export default function CareerApplicationForm({ roleSlug = "", configured = false }) {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
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
      <label className={styles.fullField}>Role<select name="roleSlug" defaultValue={roleSlug || "open-application"} required><option value="open-application">Open application</option>{careerRoles.map(role => <option value={role.slug} key={role.slug}>{role.title} / {role.team === "shared" ? "Platform & operations" : role.team === "leadership" ? "Leadership" : role.team.toUpperCase()}</option>)}</select></label>
      <label>Full name<input name="fullName" autoComplete="name" maxLength={120} required /></label>
      <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
      <label>Current location<input name="location" autoComplete="address-level2" placeholder="City, country" maxLength={160} required /></label>
      <label>Availability<input name="availability" placeholder="e.g. Available in 4 weeks" maxLength={160} /></label>
      <div className={styles.fullField}><label htmlFor={`resume-${roleSlug || "open"}`}>Resume / CV</label><div className={styles.fileInput}><input id={`resume-${roleSlug || "open"}`} name="resume" type="file" accept="application/pdf,.pdf" onChange={event => setFileName(event.target.files?.[0]?.name || "")} /><span>{fileName || "Choose a PDF, up to 3 MB"}</span><span aria-hidden="true">↑</span></div></div>
      <label className={styles.fullField}>Resume or professional profile link<input name="resumeUrl" type="url" placeholder="https://" maxLength={500} /><span className={styles.fieldHint}>Add a link if you are not uploading a PDF.</span></label>
      <label className={styles.fullField}>Portfolio / GitHub / work samples<input name="portfolioUrl" type="url" placeholder="https://" maxLength={500} /></label>
      <label className={styles.fullField}>Tell us about your work<textarea name="statement" rows={5} minLength={20} maxLength={5000} required placeholder="What have you built or owned? Which part of ACTPROVE would you like to work on?" /><span className={styles.fieldHint}>Relevant projects and your personal contribution are most useful.</span></label>
      <div className={styles.honeypot} aria-hidden="true"><label>Company website<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label></div>
      <label className={`${styles.consent} ${styles.fullField}`}><input type="checkbox" name="consent" value="yes" required /><span>I agree that ACTPROVE may store and review my application and resume for recruitment, and contact me about relevant roles.</span></label>
      <div className={`${styles.formBottom} ${styles.fullField}`}><button type="submit" className={styles.primaryButton}>{state === "sending" ? "Submitting…" : "Submit application"}<Arrow diagonal /></button><p>Questions or a data-removal request?<br /><a href="mailto:contact@actprove.com?subject=Careers%20inquiry">contact@actprove.com</a></p></div>
    </fieldset>
    {message && <p className={styles.formError} role="alert">{message}</p>}
    <noscript><p>Enable JavaScript to use this form, or contact contact@actprove.com about your application.</p></noscript>
  </form>;
}
