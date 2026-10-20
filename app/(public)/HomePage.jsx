"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TrackedScene } from "@/components/site/PerceptionDemo";
import SystemVisual from "@/components/site/SystemVisual";
import { SiteHeader, SiteFooter } from "@/components/site/SiteChrome";
import styles from "./home.module.css";
const systems = [
  { name: "ACT-1", type: "act-1", category: "Onboard intelligence", status: "In development", headline: "Perception. On board.", text: "Compute and perception models developed around the aircraft, its sensors, and its operating environment. Our first focus: interceptor drones." },
  { name: "PROVE-1", type: "prove-1", category: "Ground software", status: "In development", headline: "One connected picture.", text: "Telemetry, observations, and mission analysis in one ground software platform. Connect what the aircraft sees with what the operator understands." },
];
const plannedSystems = [
  { name: "DETECT-1", type: "detect-1", category: "Long-range perception" },
  { name: "ARCA-1", type: "arca-1", category: "Wide-area sensing" },
  { name: "ERA-1", type: "era-1", category: "Equipment connection" },
  { name: "VISTA-1", type: "vista-1", category: "Operator interface" },
];
function Arrow({ down = false }) {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true" style={down ? { transform: "rotate(90deg)" } : undefined}><path d="M4 12h15M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.3" /></svg>;
}
export default function HomePage() {
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selected, setSelected] = useState(0);
  const active = systems[selected];
  const motionPaused = paused || reducedMotion;
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return <div className={styles.home} id="top">
    <SiteHeader theme="light" />
    <main id="main">
      <section className={styles.editorialHero} aria-labelledby="home-title">
        <div className={styles.editorialEyebrow}><span>ACTPROVE / DEFENSE TECHNOLOGIES</span><span>CONNECTED SYSTEMS / 01-06</span></div>
        <div className={styles.editorialHeading}>
          <h1 id="home-title">Intelligence.<br />Across the mission.</h1>
          <div className={styles.editorialSummary}><span>SOFTWARE + HARDWARE</span><p>We develop onboard intelligence for strike and interceptor drones, ground software for operators, and systems that connect sensors and existing equipment.</p></div>
        </div>
        <nav className={styles.editorialNav} aria-label="Explore our systems">
          <div className={styles.navGroup}><span className={styles.navGroupLabel}>IN DEVELOPMENT / THE FOUNDATION</span><div className={styles.navLinks}>{systems.map((system, index) => <a key={system.type} href="#systems" onClick={() => setSelected(index)}><span>0{index + 1}</span>{system.name}<Arrow down /></a>)}</div></div>
          <div className={styles.navGroup}><span className={styles.navGroupLabel}>PLANNED / EXPANDING THE PLATFORM</span><div className={styles.navLinks}>{plannedSystems.map((system, index) => <Link key={system.type} href={`/systems/${system.type}`}><span>0{index + 3}</span>{system.name}<Arrow down /></Link>)}</div></div>
        </nav>
      </section>
      <section id="introduction" className={styles.introduction}>
        <div className={styles.sectionLabel}><span>01 / WHAT WE BUILD</span><span>FROM SENSOR TO OPERATOR</span></div>
        <div className={styles.introGrid}><h2>One connected<br />operational picture.</h2><div><p>A clear view of the mission, from sensor to operator.</p><p>ACTPROVE connects onboard perception, ground software, and equipment integration. Our first applications are strike and interceptor drones; the same architecture is designed to bring more sensors and platforms into view.</p><Link className={styles.textLink} href="/company">Our approach <Arrow /></Link></div></div>
        <div className={styles.disciplines}><div><span>01 / PERCEIVE</span><p>Onboard compute and vision for the aircraft.</p></div><div><span>02 / UNDERSTAND</span><p>Observations, telemetry, and review in PROVE-1.</p></div><div><span>03 / CONNECT</span><p>Shared context across sensors and equipment.</p></div></div>
      </section>
      <section id="systems" className={styles.systemsSection}>
        <div className={styles.sectionLabel}><span>02 / THE SYSTEMS</span><Link href="/systems">View the full portfolio <Arrow /></Link></div>
        <div className={styles.systemHeading}><h2>The foundation,<br />working together.</h2><p>ACT-1 develops perception on board. PROVE-1 brings observations and control to the operator.</p></div>
        <div className={styles.systemSelector}>
          <div className={styles.systemList} role="group" aria-label="Explore ACTPROVE systems">
            {systems.map((system, index) => <button key={system.type} aria-pressed={selected === index} onClick={() => setSelected(index)} className={selected === index ? styles.systemActive : ""}><span className={styles.systemNumber}>0{index + 1}</span><span><strong>{system.name}</strong><small>{system.category}</small></span><Arrow /></button>)}
            <div className={styles.foundationNote}><span>CURRENT DEVELOPMENT</span><p>Two systems form the first connected foundation. Explore each system for its scope and development status.</p></div>
          </div>
          <div className={styles.systemPresentation}>
            <div className={styles.systemArt}><SystemVisual type={active.type} compact /></div>
            <div className={styles.systemStory} aria-live="polite"><div><span className={styles.status}>{active.status}</span><h3>{active.headline}</h3><p>{active.text}</p></div><Link href={`/systems/${active.type}`} aria-label={`Explore ${active.name}`}><Arrow /></Link></div>
          </div>
        </div>
        <div className={styles.roadmapPreview}><div className={styles.roadmapIntro}><span>LOOKING AHEAD / PLANNED SYSTEMS</span><p>Further sensing, perception, equipment connection, and operator interfaces.</p></div><div className={styles.roadmapLinks}>{plannedSystems.map((system, index) => <Link href={`/systems/${system.type}`} key={system.type}><span>0{index + 3}</span><strong>{system.name}</strong><small>{system.category}</small><Arrow /></Link>)}</div></div>
      </section>
      <section className={styles.platformSection} id="platform">
        <div className={styles.sectionLabel}><span>03 / CONNECTED PERCEPTION</span><span>THE ACTPROVE PLATFORM</span></div>
        <div className={styles.platformHeading}><h2>See the whole picture.<br /><span>Then change perspective.</span></h2><Link className={styles.lightLink} href="/platform">Explore the platform <Arrow /></Link></div>
        <div className={styles.platformFrame}><div className={styles.platformChrome}><span><i /> ACTPROVE / SHARED OBSERVATIONS</span><span>INTERACTIVE CONCEPT</span></div><TrackedScene motionPaused={motionPaused} /><div className={styles.platformCaption}><span>Select an aircraft to switch to its camera view.</span><button className={styles.mapMotion} onClick={() => setPaused(value => !value)} disabled={reducedMotion}>{reducedMotion ? "Motion off" : motionPaused ? "Resume motion" : "Pause motion"}<span aria-hidden="true">{motionPaused ? "▷" : "Ⅱ"}</span></button></div></div>
        <div className={styles.platformBenefits}><div><span>01</span><h3>A shared view</h3><p>Review armored equipment, reported positions, and connected personnel in one overview.</p></div><div><span>02</span><h3>An aircraft perspective</h3><p>Open a selected drone’s field camera for another perspective.</p></div><div><span>03</span><h3>Context for the operator</h3><p>Connect observations with telemetry and review in the PROVE-1 workflow.</p></div></div>
      </section>
      <section className={styles.integrationSection} id="company">
        <div className={styles.sectionLabel}><span>04 / BUILT TOGETHER</span><span>INTEGRATION ACROSS SYSTEMS</span></div>
        <div className={styles.integrationGrid}><h2>Built to fit<br />the mission.</h2><div><p>We work with aircraft manufacturers and defense technology partners to integrate onboard compute, perception, ground software, and connected equipment.</p><Link className={styles.textLink} href="/company">Meet ACTPROVE <Arrow /></Link></div></div>
        <div className={styles.partnerRows}><div><span>AIRCRAFT INTEGRATION PARTNER</span><strong>Savlo Dynamics</strong><p>Collaborating on aircraft integration for ACT-1 and PROVE-1.</p></div><div><span>ECOSYSTEM PARTNER</span><strong>BRAVE1</strong><p>A confirmed partnership in Ukraine’s defense technology ecosystem.</p></div><Link href="/contact"><span>BUILD WITH US</span><strong>Let’s connect <Arrow /></strong><p>For manufacturers and technology partners.</p></Link></div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
