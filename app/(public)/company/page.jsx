import Link from "next/link";
import { Arrow, SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import styles from "./company.module.css";

export const metadata = {
  title: "Company | Actprove",
  description: "Actprove develops onboard intelligence, ground software, and connected defense systems. Learn about its leadership, partnerships, and planned milestones.",
};

export default function CompanyPage() {
  return <div className={styles.page}>
    <SiteHeader theme="light" />
    <main id="main">
      <section className={styles.intro} aria-labelledby="company-title">
        <div className={styles.sectionLabel}><span>01 / COMPANY</span><span>ACTPROVE DEFENSE TECHNOLOGIES</span></div>
        <h1 id="company-title">Intelligence.<br />Across the mission.</h1>
        <div className={styles.introBottom}><span className={styles.smallLabel}>OUR FOCUS</span><p>We develop onboard intelligence, ground software, sensing, and equipment integration. Our first focus is strike and interceptor drones.</p><Link href="/systems" className={styles.textLink}>Explore the systems<Arrow diagonal /></Link></div>
      </section>

      <section className={styles.approach} aria-labelledby="approach-title">
        <div><span className={styles.smallLabel}>AIRCRAFT + SOFTWARE</span><h2 id="approach-title">An integrated<br />point of view.</h2></div>
        <div className={styles.approachCopy}><p>The aircraft, its sensors, and the operator are parts of the same system. Actprove’s development connects onboard perception with the software used to review observations and understand the mission.</p><p>ACT-1 and PROVE-1 are in development. Work with aircraft partners shapes the integration of compute, models, and ground software.</p><Link href="/platform" className={styles.textLink}>ACT-1 + PROVE-1<Arrow diagonal /></Link></div>
      </section>

      <section className={styles.leadership} aria-labelledby="leadership-title">
        <div className={styles.sectionLabel}><span>02 / LEADERSHIP</span><span>ACTPROVE</span></div>
        <div className={styles.leadershipGrid}><span className={styles.leadershipRole}>CHIEF EXECUTIVE OFFICER</span><div><h2 id="leadership-title">Zakhar<br />Bernyk.</h2><div className={styles.leadershipCaption}><span>CEO, ACTPROVE</span><Link href="/contact">Company inquiries<Arrow diagonal /></Link></div></div></div>
      </section>

      <section className={styles.partners} aria-labelledby="partners-title">
        <div className={styles.sectionLabel}><span>03 / PARTNERSHIPS</span><span>DEVELOPMENT THROUGH COLLABORATION</span></div>
        <div className={styles.sectionHeading}><h2 id="partners-title">Built together.</h2><p>Aircraft integration and partnerships are part of how Actprove develops its systems.</p></div>
        <div className={styles.partnerRow}><span className={styles.rowNumber}>01</span><h3>Savlo Dynamics</h3><div><span className={styles.relationship}>AIRCRAFT INTEGRATION PARTNER</span><p>Collaborating on aircraft integration for ACT-1 onboard perception and PROVE-1 ground software.</p></div><Arrow diagonal /></div>
        <div className={styles.partnerRow}><span className={styles.rowNumber}>02</span><h3>BRAVE1</h3><div><span className={styles.relationship}>CONFIRMED PARTNERSHIP</span><p>Actprove is a BRAVE1 partner within Ukraine’s defense technology ecosystem.</p></div><Arrow diagonal /></div>
      </section>

      <section className={styles.milestones} aria-labelledby="milestones-title">
        <div className={styles.sectionLabel}><span>04 / NEXT STEPS</span><span>PLANNED MILESTONES</span></div>
        <h2 id="milestones-title">The next stage<br />of development.</h2>
        <div className={styles.milestoneRows}>
          <div className={styles.milestoneRow}><span className={styles.milestoneDate}>Q2 2027</span><div><h3>First combat testing.</h3><p>First testing in actual combat conditions in Ukraine is planned for Q2 2027.</p></div><span className={styles.planned}>PLANNED</span></div>
          <div className={styles.milestoneRow}><span className={styles.milestoneDate}>U.S. + UKRAINE</span><div><h3>Office locations under review.</h3><p>We are currently evaluating office locations in the United States and Ukraine.</p></div><span className={styles.planned}>UNDER REVIEW</span></div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
