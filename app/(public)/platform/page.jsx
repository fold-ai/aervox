import Link from "next/link";
import PerceptionDemo from "@/components/site/PerceptionDemo";
import { SiteHeader, SiteFooter } from "@/components/site/SiteChrome";
import styles from "./platform.module.css";

export const metadata = {
  title: "Connected Platform | Actprove",
  description: "Explore Actprove’s connected platform concept: onboard ACT-1 intelligence, shared observations, and PROVE-1 operator review.",
};

const workflow = [
  { number: "01", label: "ON THE AIRCRAFT", name: "ACT-1", copy: "Bring sensor inputs and onboard perception together, close to the source. ACT-1 is being developed as the intelligence layer within the aircraft.", detail: "Sensor inputs / Onboard compute", href: "/systems/act-1", link: "Explore ACT-1" },
  { number: "02", label: "ACROSS THE AREA", name: "Shared observations", copy: "A common view connects observations with their aircraft and location. Move from an area overview to an individual perspective without losing the wider context.", detail: "Aircraft context / Observation history" },
  { number: "03", label: "WITH THE OPERATOR", name: "PROVE-1", copy: "Review the picture, compare perspectives, and understand what changed. PROVE-1 is being developed as the ground software for operator review and mission analysis.", detail: "Operator review / Mission analysis", href: "/systems/prove-1", link: "Explore PROVE-1" },
];

function Arrow({ down = false }) {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={down ? { transform: "rotate(90deg)" } : undefined}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.4" /></svg>;
}

function SectionLabel({ number, children }) {
  return <div className={styles.sectionLabel}><span>{number}</span><span>{children}</span></div>;
}

export default function PlatformPage() {
  return <div className={styles.page}>
    <SiteHeader theme="light" />
    <main id="main">
      <section className={styles.intro} aria-labelledby="platform-title">
        <div className={styles.introTop}><span>ACTPROVE / PLATFORM</span><span className={styles.status}><i aria-hidden="true" />IN DEVELOPMENT</span></div>
        <div className={styles.introGrid}>
          <h1 id="platform-title">One connected<br />picture.</h1>
          <div className={styles.introCopy}>
            <p>From the aircraft to the operator. Onboard intelligence, shared observations, and ground software—designed to work together.</p>
            <a className={styles.textLink} href="#explore">Explore the platform <Arrow down /></a>
          </div>
        </div>
        <div className={styles.introFoot}><span>ONBOARD INTELLIGENCE</span><span aria-hidden="true">→</span><span>SHARED CONTEXT</span><span aria-hidden="true">→</span><span>OPERATOR REVIEW</span></div>
      </section>

      <section id="explore" className={styles.explore} aria-labelledby="explore-title">
        <div>
          <SectionLabel number="01">CONNECTED VIEW</SectionLabel>
          <div className={styles.exploreTitle}><h2 id="explore-title">The whole area.<br />Every perspective.</h2><p>Select an aircraft to open its camera. Follow a vehicle, change the viewpoint, and return to the connected overview.</p></div>
        </div>
        <PerceptionDemo />
        <div className={styles.demoFoot}><span>INTERACTIVE PLATFORM CONCEPT</span><span>Authored scenarios. Simulated observations.</span></div>
      </section>

      <section className={styles.architecture} aria-labelledby="architecture-title">
        <SectionLabel number="02">CONNECTED BY DESIGN</SectionLabel>
        <div className={styles.sectionHeading}><h2 id="architecture-title">Different layers.<br />One workflow.</h2><p>Intelligence belongs where it is useful: onboard the aircraft, across the shared picture, and in front of the operator.</p></div>
        <ol className={styles.workflow}>
          {workflow.map(stage => <li key={stage.number}>
            <div className={styles.stageIndex}><span>{stage.number}</span><i aria-hidden="true" /></div>
            <div className={styles.stageName}><span>{stage.label}</span><h3>{stage.name}</h3><small>{stage.detail}</small></div>
            <div className={styles.stageCopy}><p>{stage.copy}</p>{stage.href && <Link className={styles.textLink} href={stage.href}>{stage.link}<Arrow /></Link>}</div>
          </li>)}
        </ol>
        <div className={styles.architectureNote}><span>ACT-1 → SHARED OBSERVATIONS → PROVE-1</span><span>Platform architecture / In development</span></div>
      </section>

      <section className={styles.development} aria-labelledby="development-title">
        <SectionLabel number="03">WHERE WE ARE</SectionLabel>
        <div className={styles.sectionHeading}><h2 id="development-title">A clear view<br />of what comes next.</h2><p>The interface above demonstrates the platform direction. The underlying aircraft and ground systems are in development.</p></div>
        <div className={styles.developmentGrid}>
          <div className={styles.developmentColumn}>
            <div className={styles.developmentLabel}><span className={styles.currentMark} aria-hidden="true" />EXPLORE TODAY</div>
            <h3>The interactive concept.</h3>
            <ul><li>Connected overview with moving vehicle and friendly aircraft markers.</li><li>Selectable aircraft views and full-color 3D camera perspectives.</li><li>Track selection, playback controls, and an air-sequence concept film.</li></ul>
            <a className={styles.textLink} href="#explore">Open the demonstration <Arrow /></a>
          </div>
          <div className={styles.developmentColumn}>
            <div className={styles.developmentLabel}><span className={styles.futureMark} aria-hidden="true" />IN DEVELOPMENT</div>
            <h3>The connected systems.</h3>
            <ul><li>ACT-1 onboard integration and perception workflows.</li><li>Shared observation exchange between aircraft and ground software.</li><li>PROVE-1 operator review and mission analysis.</li></ul>
            <p className={styles.developmentNote}>The demonstration uses authored data; it does not represent a live sensor feed or validated system performance.</p>
          </div>
        </div>
      </section>

      <section className={styles.systems} aria-labelledby="systems-title">
        <div className={styles.systemsHeading}><SectionLabel number="04">THE SYSTEMS</SectionLabel><h2 id="systems-title">Built to connect.</h2></div>
        <Link className={styles.systemLink} href="/systems/act-1"><span>01 / ONBOARD INTELLIGENCE</span><strong>ACT-1</strong><Arrow /></Link>
        <Link className={styles.systemLink} href="/systems/prove-1"><span>02 / GROUND SOFTWARE</span><strong>PROVE-1</strong><Arrow /></Link>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
