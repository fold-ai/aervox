"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PerceptionDemo, { TrackedScene } from "@/components/site/PerceptionDemo";
import FlightSequence from "@/components/site/FlightSequence";
import wordmark from "@/public/actprove-wordmark.png";
import styles from "./home.module.css";

const roadmap = [
  { name: "ARCA-1", category: "Wide-area sensing", copy: "A planned radar and camera system for wide-area drone detection. The proposed 3–6 metre system has a 50 km detection-range design goal, which has not been validated.", status: "PLANNED" },
  { name: "DETECT-1", category: "Long-range perception", copy: "A planned perception system for long-range drones, designed to interpret changing scenes, identify objects of interest, and surface new observations to operators.", status: "PLANNED" },
  { name: "ERA-1", category: "Next-generation autonomy", copy: "A long-term research direction for autonomous fighter-aircraft flight management, with object classification, civilian-risk awareness, and human authorization for consequential decisions.", status: "RESEARCH" }
];

function Arrow({ diagonal = false, down = false, className = "" }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: down ? "rotate(90deg)" : undefined }}><path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.4" /></svg>;
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [heroPlayback, setHeroPlayback] = useState("paused");
  const menuButton = useRef(null);
  const pageRef = useRef(null);
  const paused = motionPaused || reducedMotion;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.dataset.visible = "true";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    pageRef.current?.querySelectorAll("[data-reveal]").forEach(node => {
      node.dataset.visible = "false";
      observer.observe(node);
    });
    return () => { preference.removeEventListener("change", sync); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = event => {
      if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  return (
    <div ref={pageRef} className={`${styles.home} ${paused ? styles.motionPaused : ""}`}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label="Actprove home"><Image src={wordmark} alt="Actprove" priority sizes="170px" /><span>DEFENSE TECHNOLOGIES</span></a>
        <button className={styles.menuButton} ref={menuButton} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close" : "Menu"}<span aria-hidden="true">{menuOpen ? "−" : "+"}</span></button>
        <nav id="main-navigation" aria-label="Main navigation" className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`}>
          <a href="#vision" onClick={() => setMenuOpen(false)}>Vision systems</a>
          <a href="#software" onClick={() => setMenuOpen(false)}>Software</a>
          <a href="#platform" onClick={() => setMenuOpen(false)}>Platform</a>
          <a href="#company" onClick={() => setMenuOpen(false)}>Company</a>
          <a className={styles.navContact} href="#contact" onClick={() => setMenuOpen(false)}>Build with us <Arrow diagonal /></a>
        </nav>
      </header>
      <main id="main">
        <section id="top" className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroBackdrop} aria-hidden="true" />
          <FlightSequence variant="hero" motionPaused={paused} className={styles.heroFilm} onPlaybackStateChange={setHeroPlayback} />
          <div className={styles.heroShade} />
          <div className={styles.heroContent}>
            <h1 id="hero-title">See more.<br />Understand more.</h1>
            <p className={styles.heroDescription}>Computer vision, onboard intelligence, and decision support. Built to help operators understand the scene—and the consequences of acting.</p>
            <a className={styles.primaryLink} href="#vision">Explore our vision <Arrow down /></a>
          </div>
          <div className={styles.heroBottom}>
            <a className={styles.scrollCue} href="#vision"><span className={styles.scrollLine} /><span>SCROLL TO DISCOVER</span></a>
            <div className={styles.heroCaption}><span>01 — ACQUIRE. LOCK. FOLLOW.</span><span>A CINEMATIC FLIGHT SEQUENCE</span></div>
            {!["blocked", "error"].includes(heroPlayback) && <button className={styles.motionButton} onClick={() => setMotionPaused(!motionPaused)} aria-pressed={paused} disabled={reducedMotion} aria-label={reducedMotion ? "Film disabled by reduced motion preference" : paused ? "Resume films" : "Pause films"}><svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">{paused ? <path d="m6 3 10 7-10 7Z" /> : <path d="M5 4h3v12H5zm7 0h3v12h-3z" />}</svg><span>{reducedMotion ? "REDUCED MOTION" : paused ? "RESUME FILM" : "PAUSE FILM"}</span></button>}
          </div>
        </section>
        <div className={styles.disciplineBar}><span>ACTPROVE DEFENSE TECHNOLOGIES</span><div><span>Computer vision</span><span>Onboard intelligence</span><span>Decision support</span></div></div>

        <section id="vision" className={`${styles.visionSection} ${styles.sectionWrap}`}>
          <div className={styles.sectionHeading} data-reveal><div><p className={styles.eyebrow}>[ VISION SYSTEMS ]</p><h2>Understand the air.<br />Read the ground.</h2></div><p>From airborne tracking to reconnaissance. Follow movement, connect observations, and give operators a clearer view of the scene.</p></div>
          <div data-reveal><PerceptionDemo motionPaused={paused} /></div>
        </section>

        <section id="software" className={`${styles.softwareSection} ${styles.sectionWrap}`}>
          <div className={styles.softwareIntro} data-reveal><p className={styles.eyebrow}>[ DECISION SUPPORT ]</p><h2>Recognition is only<br />the beginning.</h2><p>An object is part of a larger environment. Actprove is developing software that brings object understanding, civilian-risk awareness, and operator review into the same picture.</p></div>
          <div className={styles.capabilities}>
            <article data-reveal><span className={styles.capabilityNumber}>01</span><h3>Object understanding</h3><p>Recognize object classes and analyze their visible features and structural characteristics. Give operators context beyond a detection box.</p></article>
            <article data-reveal><span className={styles.capabilityNumber}>02</span><h3>Civilian-risk awareness</h3><p>Bring surrounding activity and potential risks to civilians into the assessment. Support consideration of whether action is appropriate.</p></article>
            <article data-reveal><span className={styles.capabilityNumber}>03</span><h3>Human authorization</h3><p>Support operator judgment with relevant observations and scene context. Consequential decisions remain subject to human authorization.</p></article>
          </div>
          <p className={styles.developmentNote}>Capabilities in development. These illustrative scenes do not demonstrate validated safety or operational performance.</p>
        </section>

        <section id="platform" className={`${styles.platformSection} ${styles.sectionWrap}`}>
          <div className={styles.platformHeading} data-reveal><p className={styles.eyebrow}>[ OUR PLATFORM ]</p><h2>From the aircraft<br />to the operator.</h2><p>Two systems. A shared foundation of models, data, and partner integration.</p></div>
          <article className={styles.productLine} data-reveal>
            <div className={styles.productIdentity}><span>01 / ONBOARD INTELLIGENCE</span><h3>ACT-1</h3><span className={styles.productStatus}>IN DEVELOPMENT</span></div>
            <div className={styles.productDescription}><h4>Intelligence where it’s needed.</h4><p>Onboard compute and custom perception models, developed for the aircraft and its sensor suite. ACT-1 connects object recognition with understanding of the surrounding environment.</p><ul><li>Onboard processing</li><li>Object recognition &amp; characterization</li><li>Aircraft-specific integration</li></ul><details className={styles.productDetails}><summary>About ACT-1 <span aria-hidden="true">+</span></summary><p>ACT-1 development initially focuses on interceptor drones. Work with aircraft partners brings computing, perception models, and civilian-risk awareness into the integration process. Capabilities are being developed and evaluated.</p></details></div>
          </article>
          <article className={styles.productLine} data-reveal>
            <div className={styles.productIdentity}><span>02 / GROUND SOFTWARE</span><h3>PROVE-1</h3><span className={styles.productStatus}>IN DEVELOPMENT</span></div>
            <div className={styles.productDescription}><h4>The context behind the observation.</h4><p>A software platform for control, telemetry, and collected-data analysis. PROVE-1 helps teams review what their aircraft observed and supports the operator’s understanding of the mission.</p><ul><li>Telemetry &amp; observation review</li><li>Mission analysis</li><li>Model evaluation workflows</li></ul><details className={styles.productDetails}><summary>About PROVE-1 <span aria-hidden="true">+</span></summary><p>PROVE-1 connects ground software with partner development workflows, bringing software control and telemetry together with the review of collected information. Testing and partner feedback guide development.</p></details></div>
          </article>
        </section>

        <section id="company" className={styles.companySection}>
          <div className={styles.companyImage}><TrackedScene scene="ground" motionPaused={paused} className={styles.companyTrackedScene} /><span className={styles.imageCaption}>PERCEPTION, IN CONTEXT.</span></div>
          <div className={styles.companyContent} data-reveal><p className={styles.eyebrow}>[ BUILT TOGETHER ]</p><h2>Built around<br />your aircraft.</h2><p>We build the systems around the aircraft. Working alongside manufacturers, we bring onboard compute, perception models, training data, and mission tools into their programs.</p><div className={styles.partnerBlock}><span className={styles.partnerKicker}><span className={styles.signalDot} /> FIRST ACTIVE PARTNERSHIP</span><h3>Savlo Dynamics <Arrow diagonal /></h3><p>Developing onboard perception for a high-speed drone program, with ACT-1 and PROVE-1 connecting the aircraft to its ground systems.</p></div><a className={styles.textLink} href="#contact">Let’s build together <Arrow diagonal /></a></div>
        </section>

        <section id="roadmap" className={`${styles.roadmapSection} ${styles.sectionWrap}`}>
          <div className={styles.sectionHeading} data-reveal><div><p className={styles.eyebrow}>[ NEXT HORIZON ]</p><h2>Research beyond<br />the current platform.</h2></div><p>Extending our work into wider sensing and new classes of aircraft. A roadmap of research and planned capabilities.</p></div>
          <div className={styles.roadmapList} data-reveal>{roadmap.map((item, index) => <details className={styles.roadmapItem} key={item.name}><summary><span className={styles.roadmapIndex}>0{index + 1}</span><h3>{item.name}</h3><span className={styles.roadmapCategory}>{item.category}</span><span className={styles.roadmapStatus}>{item.status}</span><span className={styles.expandIcon} aria-hidden="true">+</span></summary><p>{item.copy}</p></details>)}</div>
        </section>

        <section id="contact" className={`${styles.contactSection} ${styles.sectionWrap}`}><div className={styles.contactGrid} aria-hidden="true" /><div data-reveal><p className={styles.eyebrow}>[ WORK WITH ACTPROVE ]</p><a className={styles.contactHeading} href="mailto:contact@actprove.com"><h2>Build what<br />comes next.</h2><span><Arrow diagonal /></span></a><div className={styles.contactBottom}><p>For aircraft manufacturers, engineering teams,<br />and technology partners.</p><a href="mailto:contact@actprove.com">contact@actprove.com <Arrow diagonal /></a></div></div></section>
      </main>
      <footer className={styles.footer}><div className={styles.footerTop}><a className={styles.brand} href="#top" aria-label="Actprove home"><Image src={wordmark} alt="Actprove" sizes="170px" /><span>DEFENSE TECHNOLOGIES</span></a><p>Intelligence for unmanned systems.</p><a href="#top">BACK TO TOP <Arrow down className={styles.backArrow} /></a></div><div className={styles.footerBottom}><span>© 2026 Actprove Defense Technologies</span><span>DRONE SOFTWARE + HARDWARE</span><span>DEVELOPED WITH PURPOSE.</span></div></footer>
    </div>
  );
}
