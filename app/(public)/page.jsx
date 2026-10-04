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
  { name: "DETECT-1", type: "detect-1", category: "Long-range perception", status: "Planned system", headline: "Understand the scene ahead.", text: "Planned onboard perception for long-range strike aircraft. Connect object recognition and scene context with observations for operator review." },
  { name: "ARCA-1", type: "arca-1", category: "Wide-area sensing", status: "Planned system", headline: "Extend the field of view.", text: "A planned radar and camera system for drone detection, designed to connect aerial observations with aircraft and ground software." },
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
        <div className={styles.editorialEyebrow}><span>ACTPROVE / DEFENSE TECHNOLOGIES</span><span>SOFTWARE × HARDWARE</span></div>
        <div className={styles.editorialHeading}>
          <h1 id="home-title">Intelligence.<br />Built into the aircraft.</h1>
          <p>Onboard intelligence for strike and interceptor drones. Ground software for the operator. Built together, around your aircraft.</p>
        </div>
        <nav className={styles.editorialNav} aria-label="Explore our systems">
          {systems.map((system, index) => <a key={system.type} href="#systems" onClick={() => setSelected(index)}><span>0{index + 1}</span>{system.name}<Arrow down /></a>)}
          <Link href="/systems/era-1"><span>05</span>ERA-1<Arrow down /></Link>
        </nav>
      </section>
      <section id="introduction" className={styles.introduction}>
        <div className={styles.sectionLabel}><span>01 / THE MISSION</span><span>FROM PERCEPTION TO UNDERSTANDING</span></div>
        <div className={styles.introGrid}><h2>The aircraft is<br />only the beginning.</h2><div><p>What matters is the intelligence it carries.</p><p>ACTPROVE develops the computing, perception, and ground software behind unmanned aircraft. A connected foundation for one-way strike and drone interception.</p><Link className={styles.textLink} href="/company">Our approach <Arrow /></Link></div></div>
        <div className={styles.disciplines}><span>ONBOARD COMPUTE</span><span>COMPUTER VISION</span><span>GROUND SOFTWARE</span><span>AIRCRAFT INTEGRATION</span></div>
      </section>
      <section id="systems" className={styles.systemsSection}>
        <div className={styles.sectionLabel}><span>02 / THE SYSTEMS</span><Link href="/systems">View the full portfolio <Arrow /></Link></div>
        <div className={styles.systemHeading}><h2>Intelligence,<br />from end to end.</h2><p>Onboard systems. Ground software. A common development path.</p></div>
        <div className={styles.systemSelector}>
          <div className={styles.systemList} role="group" aria-label="Explore ACTPROVE systems">
            {systems.map((system, index) => <button key={system.type} aria-pressed={selected === index} onClick={() => setSelected(index)} className={selected === index ? styles.systemActive : ""}><span className={styles.systemNumber}>0{index + 1}</span><span><strong>{system.name}</strong><small>{system.category}</small></span><Arrow /></button>)}
            <Link className={styles.researchLink} href="/systems/era-1"><span>ERA-1 / Future autonomy research</span><Arrow /></Link>
          </div>
          <div className={styles.systemPresentation}>
            <div className={styles.systemArt}><SystemVisual type={active.type} compact /></div>
            <div className={styles.systemStory} aria-live="polite"><div><span className={styles.status}>{active.status}</span><h3>{active.headline}</h3><p>{active.text}</p></div><Link href={`/systems/${active.type}`} aria-label={`Explore ${active.name}`}><Arrow /></Link></div>
          </div>
        </div>
      </section>
      <section className={styles.platformSection} id="platform">
        <div className={styles.sectionLabel}><span>03 / CONNECTED PERCEPTION</span><span>THE ACTPROVE PLATFORM</span></div>
        <div className={styles.platformHeading}><h2>See the whole picture.<br /><span>Then change perspective.</span></h2><Link className={styles.lightLink} href="/platform">Explore the platform <Arrow /></Link></div>
        <div className={styles.platformFrame}><div className={styles.platformChrome}><span><i /> ACTPROVE / SHARED OBSERVATIONS</span><span>INTERACTIVE CONCEPT</span></div><TrackedScene motionPaused={motionPaused} /><div className={styles.platformCaption}><span>Select an aircraft to switch to its camera view.</span><button className={styles.mapMotion} onClick={() => setPaused(value => !value)} disabled={reducedMotion}>{reducedMotion ? "Motion off" : motionPaused ? "Resume motion" : "Pause motion"}<span aria-hidden="true">{motionPaused ? "▷" : "Ⅱ"}</span></button></div></div>
        <div className={styles.platformBenefits}><div><span>01</span><h3>A shared view</h3><p>Follow moving objects, friendly vehicles, and connected aircraft in one overview.</p></div><div><span>02</span><h3>An aircraft perspective</h3><p>Move from the area view to a selected drone’s color camera scene.</p></div><div><span>03</span><h3>Context for the operator</h3><p>Connect observations with telemetry and review in the PROVE-1 workflow.</p></div></div>
      </section>
      <section className={styles.integrationSection} id="company">
        <div className={styles.sectionLabel}><span>04 / BUILT TOGETHER</span><span>AIRCRAFT-SPECIFIC INTEGRATION</span></div>
        <div className={styles.integrationGrid}><h2>Your aircraft.<br />Our intelligence.</h2><div><p>We work alongside aircraft manufacturers, bringing onboard compute, custom perception models, and ground software into their programs.</p><Link className={styles.textLink} href="/company">Meet ACTPROVE <Arrow /></Link></div></div>
        <div className={styles.partnerRows}><div><span>AIRCRAFT DEVELOPMENT PARTNER</span><strong>Savlo Dynamics</strong><p>Onboard perception for a high-speed drone program.</p></div><div><span>ECOSYSTEM PARTNER</span><strong>BRAVE1</strong><p>A confirmed partnership in Ukraine’s defense technology ecosystem.</p></div><Link href="/contact"><span>BUILD WITH US</span><strong>Let’s connect <Arrow /></strong><p>For aircraft manufacturers and technology partners.</p></Link></div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
