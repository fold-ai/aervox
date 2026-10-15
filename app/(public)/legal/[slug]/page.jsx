import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { getPolicy, policies, policyDate } from "@/lib/site-policies";
import styles from "../legal.module.css";

export function generateStaticParams() { return policies.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }) {
  const policy = getPolicy((await params).slug);
  if (!policy) return {};
  return { title: `${policy.title} | ACTPROVE`, description: policy.summary, alternates: { canonical: `/legal/${policy.slug}` } };
}

export default async function PolicyPage({ params }) {
  const policy = getPolicy((await params).slug);
  if (!policy) notFound();
  return <div className={styles.page}>
    <SiteHeader theme="light" />
    <main id="main" className={styles.main}>
      <header className={styles.documentHeader}>
        <Link href="/legal" className={styles.backLink}>All policies<Arrow /></Link>
        <span className={styles.eyebrow}>{policy.category}</span><h1>{policy.title}</h1><p>{policy.summary}</p>
        <div className={styles.documentMeta}><span>MENUO INC. / ACTPROVE</span><span>Effective & updated <time dateTime="2026-10-14">{policyDate}</time></span></div>
      </header>
      <div className={styles.documentLayout}>
        <aside className={styles.contents}><nav aria-label="On this page"><span className={styles.eyebrow}>ON THIS PAGE</span>{policy.sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>)}</nav></aside>
        <article className={styles.article} aria-label={policy.title}>
          {policy.sections.map((section, index) => <section id={section.id} className={styles.section} key={section.id} aria-labelledby={`heading-${section.id}`}>
            <span className={styles.sectionNumber}>{String(index + 1).padStart(2, "0")}</span><h2 id={`heading-${section.id}`}>{section.title}</h2>
            {section.paragraphs?.map(text => <p key={text}>{text}</p>)}
            {section.bullets && <ul>{section.bullets.map(text => <li key={text}>{text}</li>)}</ul>}
            {section.table && <div className={styles.tableWrap} role="region" aria-label={`${section.title} table`} tabIndex={0}><table><caption className={styles.srOnly}>{section.title}</caption><thead><tr>{section.table.headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th scope="row" key={i}>{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>}
            {section.paragraphsAfter?.map(text => <p key={text}>{text}</p>)}
            {section.links && <div className={styles.relatedLinks}>{section.links.map(link => <Link key={link.href} href={link.href}>{link.label}<Arrow diagonal /></Link>)}</div>}
          </section>)}
          <div className={styles.documentEnd}><Link href="/legal">All policies<Arrow /></Link><a href="#main">Back to top ↑</a></div>
        </article>
      </div>
    </main>
    <SiteFooter />
  </div>;
}
