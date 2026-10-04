import Link from "next/link";
import { SiteHeader, SiteFooter, Arrow } from "@/components/site/SiteChrome";
import SystemVisual from "@/components/site/SystemVisual";
import { systems } from "@/lib/site-systems";
import styles from "./systems.module.css";

export const metadata = {
  title: "Systems — Actprove Defense Technologies",
  description: "Explore Actprove’s onboard intelligence, ground software, and planned perception systems: ACT-1, PROVE-1, DETECT-1, ARCA-1, and ERA-1.",
  alternates: { canonical: "/systems" },
};

export default function SystemsPage() {
  return <div className={styles.page}>
    <SiteHeader theme="light" />
    <main id="main">
      <section className={styles.indexIntro} aria-labelledby="systems-title">
        <div className={styles.eyebrowRow}><span>ACTPROVE / SYSTEMS</span><span>01—05</span></div>
        <div className={styles.introLayout}><h1 id="systems-title">Intelligence.<br />Built into the aircraft.</h1><p>Onboard compute. Ground software. Connected perception. Explore the systems we are developing, and the directions we are pursuing next.</p></div>
        <nav className={styles.productNav} aria-label="Systems on this page">{systems.map(system => <a key={system.slug} href={`#${system.slug}`}><span>{system.number}</span>{system.name}<Arrow /></a>)}</nav>
      </section>

      <section className={styles.featured} aria-labelledby="development-title">
        <div className={styles.sectionLabel}><span>01 / IN DEVELOPMENT</span><h2 id="development-title">The current foundation.</h2></div>
        {systems.slice(0, 2).map(system => <article key={system.slug} id={system.slug} className={styles.featuredProduct} aria-labelledby={`${system.slug}-title`}>
          <div className={styles.featuredCopy}><div className={styles.productKicker}><span>{system.number} / {system.category}</span><span className={styles.status}><i />{system.status}</span></div><h3 id={`${system.slug}-title`}>{system.name}</h3><p>{system.summary}</p><Link href={`/systems/${system.slug}`} className={styles.textLink}>Explore {system.name}<Arrow diagonal /></Link></div>
          <div className={styles.featuredArt}><SystemVisual type={system.slug} compact /></div>
        </article>)}
      </section>

      <section className={styles.roadmap} aria-labelledby="roadmap-title">
        <div className={styles.roadmapHeading}><div className={styles.sectionLabel}><span>02 / LOOKING AHEAD</span><h2 id="roadmap-title">The next directions.</h2></div><p>Planned systems and long-term research build on a shared foundation of perception and aircraft integration.</p></div>
        <div className={styles.roadmapGrid}>{systems.slice(2).map(system => <article key={system.slug} id={system.slug} className={styles.roadmapProduct} aria-labelledby={`${system.slug}-title`}>
          <div className={styles.roadmapArt}><SystemVisual type={system.slug} compact /></div>
          <div className={styles.roadmapTop}><span>{system.number} / {system.category}</span><span>{system.status}</span></div>
          <Link href={`/systems/${system.slug}`} className={styles.roadmapLink}><h3 id={`${system.slug}-title`}>{system.name}</h3><Arrow diagonal /></Link><p>{system.summary}</p>
        </article>)}</div>
        <p className={styles.roadmapNote}>Roadmap systems are planned or under research. Their intended capabilities are subject to development and validation.</p>
      </section>

      <section className={styles.platformBand} aria-labelledby="platform-title"><span>ONE CONNECTED PLATFORM</span><h2 id="platform-title">The aircraft.<br />The operator.<br />The same picture.</h2><div><p>Explore how onboard intelligence and ground software come together around an aircraft program.</p><Link href="/platform" className={styles.textLink}>Explore the platform<Arrow diagonal /></Link></div></section>
    </main>
    <SiteFooter />
  </div>;
}
