import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader, SiteFooter, Arrow } from "@/components/site/SiteChrome";
import SystemVisual from "@/components/site/SystemVisual";
import { systems, getSystem } from "@/lib/site-systems";
import styles from "../systems.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return systems.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const system = getSystem(slug);
  if (!system) return { title: "System not found — Actprove" };
  return {
    title: `${system.name} — ${system.category} | Actprove`,
    description: `${system.summary} ${system.status}.`,
    alternates: { canonical: `/systems/${system.slug}` },
    openGraph: { title: `${system.name} — Actprove`, description: system.summary, type: "website" },
  };
}

export default async function SystemPage({ params }) {
  const { slug } = await params;
  const system = getSystem(slug);
  if (!system) notFound();
  const related = getSystem(system.related);
  return <div className={styles.page}>
    <SiteHeader theme="light" />
    <main id="main">
      <section className={styles.productHero} aria-labelledby="product-title">
        <div className={styles.productBreadcrumb}><Link href="/systems">All systems<Arrow /></Link><span>{system.number} / {system.category}</span><span className={styles.status}><i />{system.status}</span></div>
        <h1 id="product-title">{system.name}</h1>
        <div className={styles.heroDescription}><h2>{system.headline}</h2><p>{system.summary}</p></div>
        <div className={styles.productArt}><SystemVisual type={system.slug} /></div>
        <div className={styles.artCaption}><span>{system.illustration}</span><span>{system.status} / ACTPROVE</span></div>
      </section>

      <section className={styles.purpose} aria-labelledby="purpose-title">
        <div className={styles.smallSectionLabel}>01 / PURPOSE</div>
        <div className={styles.purposeGrid}><h2 id="purpose-title">{system.purposeTitle}</h2><div>{system.purpose.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div>
      </section>

      <section className={styles.capabilities} aria-labelledby="capabilities-title">
        <div className={styles.capabilityHeading}><span className={styles.smallSectionLabel}>02 / {system.stage === "research" ? "RESEARCH DIRECTIONS" : "CAPABILITY FOCUS"}</span><h2 id="capabilities-title">{system.stage === "research" ? "Questions worth exploring." : "Designed around the task."}</h2></div>
        <div className={styles.capabilityGrid}>{system.capabilities.map((capability, index) => <article key={capability.title}><span className={styles.capabilityNumber}>0{index + 1}</span><h3>{capability.title}</h3><p>{capability.copy}</p></article>)}</div>
      </section>

      <section className={styles.process} aria-labelledby="process-title">
        <span className={styles.smallSectionLabel}>03 / {system.stage === "research" ? "RESEARCH APPROACH" : "DEVELOPMENT APPROACH"}</span>
        <div className={styles.processHeading}><h2 id="process-title">{system.processTitle}</h2><p>{system.processIntro}</p></div>
        <ol className={styles.processSteps}>{system.process.map((step, index) => <li key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.copy}</p></li>)}</ol>
        <div className={styles.developmentNote}><span>{system.status}</span><p>{system.note}</p></div>
        {system.designGoal && <aside className={styles.designGoal}><span>CURRENT CONCEPT BRIEF</span><p>{system.designGoal}</p></aside>}
      </section>

      <section className={styles.related} aria-labelledby="related-title"><div><span className={styles.smallSectionLabel}>04 / CONNECTED SYSTEM</span><p>{system.relatedReason}</p></div><Link href={`/systems/${related.slug}`} className={styles.relatedLink}><h2 id="related-title">{related.name}</h2><span>{related.category}</span><Arrow diagonal /></Link></section>
      <section className={styles.productContact} aria-labelledby="contact-title"><div><h2 id="contact-title">{system.contactTitle}</h2><p>{system.contactCopy}</p></div><Link href={`/contact?system=${system.slug}`} className={styles.contactLink}>Start a conversation<Arrow diagonal /></Link></section>
    </main>
    <SiteFooter />
  </div>;
}
