import Link from "next/link";
import { Arrow, SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contact | Actprove",
  description: "Contact Actprove about aircraft integration, engineering collaboration, or investment. Email contact@actprove.com.",
  alternates: { canonical: "/contact" },
};

const systemNames = new Map([
  ["act-1", "ACT-1"],
  ["prove-1", "PROVE-1"],
  ["detect-1", "DETECT-1"],
  ["arca-1", "ARCA-1"],
  ["era-1", "ERA-1"],
]);

const inquiries = [
  { title: "Aircraft integration", subject: "Aircraft integration inquiry", description: "For aircraft manufacturers and teams exploring ACT-1 or PROVE-1 integration.", label: "PLATFORMS + MANUFACTURERS" },
  { title: "Engineering & research", subject: "Engineering and research collaboration", description: "For collaboration in perception, onboard compute, ground software, and evaluation.", label: "TECHNOLOGY + DEVELOPMENT" },
  { title: "Investment & company", subject: "Investment and company inquiry", description: "For investment discussions and company inquiries.", label: "INVESTORS + COMPANY" },
];

export default async function ContactPage({ searchParams }) {
  const params = await searchParams;
  const system = typeof params?.system === "string" ? systemNames.get(params.system) : undefined;
  const directEmail = system ? `mailto:contact@actprove.com?subject=${encodeURIComponent(`${system} inquiry`)}` : "mailto:contact@actprove.com";

  return <div className={styles.page}>
    <SiteHeader theme="light" />
    <main id="main">
      <section className={styles.intro} aria-labelledby="contact-title">
        <div className={styles.sectionLabel}><span>01 / CONTACT</span><span>START WITH A CONVERSATION.</span></div>
        <div className={styles.heroGrid}><h1 id="contact-title">Let’s build<br />around your<br />aircraft.</h1><div className={styles.heroAside}><span className={`${styles.smallLabel}${system ? ` ${styles.systemContext}` : ""}`}>{system ? `SYSTEM INQUIRY / ${system}` : "WORK WITH ACTPROVE"}</span><p>Aircraft integration.<br />Engineering collaboration.<br />Investment.</p><span className={styles.asideNote}>Onboard intelligence and ground software for unmanned defense platforms.</span></div></div>
        <a className={styles.email} href={directEmail}><span>contact@actprove.com</span><Arrow diagonal /></a>
        <div className={styles.emailCaption}><span>DIRECT EMAIL</span><span>ACTPROVE DEFENSE TECHNOLOGIES</span></div>
      </section>

      <section className={styles.inquiries} aria-labelledby="inquiries-title">
        <div className={styles.inquiriesHeading}><span className={styles.smallLabel}>02 / COLLABORATION</span><h2 id="inquiries-title">Where do we begin?</h2></div>
        <div>{inquiries.map((inquiry, index) => <a key={inquiry.title} className={styles.inquiryRow} href={`mailto:contact@actprove.com?subject=${encodeURIComponent(system ? `${system} / ${inquiry.subject}` : inquiry.subject)}`} aria-label={`Email Actprove about ${inquiry.title.toLowerCase()}${system ? ` for ${system}` : ""}`}><span className={styles.rowNumber}>0{index + 1}</span><div className={styles.inquiryTitle}><span>{inquiry.label}</span><h3>{inquiry.title}</h3></div><p>{inquiry.description}</p><Arrow diagonal /></a>)}</div>
      </section>

      <section className={styles.companyLink} aria-label="Learn about Actprove"><span>THE COMPANY BEHIND THE SYSTEMS</span><Link href="/company">Leadership, partnerships,<br />and what comes next.<Arrow diagonal /></Link></section>
    </main>
    <SiteFooter />
  </div>;
}
