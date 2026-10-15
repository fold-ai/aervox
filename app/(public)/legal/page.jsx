import Link from "next/link";
import { Arrow, SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { companyIdentity, policies } from "@/lib/site-policies";
import styles from "./legal.module.css";

export const metadata = {
  title: "Legal & Privacy | ACTPROVE",
  description: "Privacy, recruitment data, retention, cookies and website policies for ACTPROVE, operated by Menuo Inc.",
  alternates: { canonical: "/legal" },
};

export default function LegalIndex() {
  return <div className={styles.page}>
    <SiteHeader theme="light" />
    <main id="main" className={styles.main}>
      <header className={styles.intro}>
        <span className={styles.eyebrow}>ACTPROVE / LEGAL & PRIVACY</span>
        <h1>Clear policies.<br />Responsible handling.</h1>
        <div className={styles.introBottom}><p>{companyIdentity}</p><p>How we handle information, protect access and set expectations for the use of our website.</p></div>
      </header>
      <div className={styles.policyGrid}>
        {policies.map(policy => <Link className={styles.policyCard} href={`/legal/${policy.slug}`} key={policy.slug}>
          <span className={styles.eyebrow}>{policy.category}</span>
          <h2>{policy.title}</h2><p>{policy.summary}</p><span className={styles.cardAction}>Read policy<Arrow /></span>
        </Link>)}
      </div>
      <aside className={styles.contactPanel} aria-label="Privacy contact"><div><span className={styles.eyebrow}>YOUR INFORMATION</span><h2>Questions or a privacy request?</h2><p>For access, correction or deletion, contact us with enough context to locate your information. Do not include identity documents in your initial message.</p></div><a href="mailto:contact@actprove.com?subject=Privacy%20request">contact@actprove.com<Arrow diagonal /></a></aside>
    </main>
    <SiteFooter />
  </div>;
}
