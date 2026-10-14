import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import CareerApplicationForm from "@/components/site/CareerApplicationForm";
import { careerRoles, getCareerRole, getCareerTeam, getHiringStage } from "@/lib/careers/roles";
import { careersConfigured } from "@/lib/careers/supabase";
import styles from "../careers.module.css";

export const dynamicParams = false;
export function generateStaticParams() { return careerRoles.map(role => ({ slug: role.slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const role = getCareerRole(slug);
  if (!role) return {};
  return { title: `${role.title} | Careers | Actprove`, description: role.ownership, alternates: { canonical: `/careers/${role.slug}` } };
}

export default async function CareerRolePage({ params }) {
  const { slug } = await params;
  const role = getCareerRole(slug);
  if (!role) notFound();
  const team = getCareerTeam(role.team);
  const stage = getHiringStage(role.stage);
  return <div className={styles.page}>
    <SiteHeader theme="light" />
    <main id="main">
      <section className={styles.roleHero} aria-labelledby="role-title">
        <Link href="/careers#roles" className={styles.backLink}>← All opportunities</Link>
        <div className={styles.eyebrow}><span>ACTPROVE / {team.label.toUpperCase()}</span><span>{stage.label.toUpperCase()}</span></div>
        <h1 id="role-title">{role.title}</h1>
        <div className={styles.roleHeroFoot}><span>{role.level} / {role.type}</span><a href="#apply" className={styles.primaryButton}>{role.stage > 1 ? "Express interest" : "Apply for this role"}<Arrow diagonal /></a></div>
      </section>
      <section className={styles.roleDetails} aria-label="Role details">
        <aside className={styles.roleAside}><span className={styles.label}>THE ROLE</span><dl><div><dt>TEAM</dt><dd>{team.label}</dd></div><div><dt>HIRING PHASE</dt><dd>{stage.label}</dd></div><div><dt>EXPERIENCE</dt><dd>{role.experience}</dd></div><div><dt>LOCATION</dt><dd>U.S. / Ukraine office locations under review. Work arrangements and travel discussed by role.</dd></div><div><dt>COMPENSATION</dt><dd>Equity participation. Written terms discussed during hiring.</dd></div></dl><Link href="/careers#process" className={styles.textLink}>How we hire<Arrow /></Link></aside>
        <div className={styles.roleCopy}>
          <div><span className={styles.label}>01 / OWNERSHIP</span><h2>What you will own.</h2><p>{role.ownership}</p>{role.stage > 1 && <p className={styles.fine}>This role is part of our {stage.label.toLowerCase()}. We welcome expressions of interest as the program develops.</p>}</div>
          <div><span className={styles.label}>02 / SKILLS</span><h2>What you bring.</h2><ul>{role.requirements.map(item => <li key={item}>{item}</li>)}</ul></div>
          {!!role.preferred.length && <div><span className={styles.label}>03 / ADDITIONAL EXPERIENCE</span><h2>Useful experience.</h2><ul>{role.preferred.map(item => <li key={item}>{item}</li>)}</ul></div>}
          <div><span className={styles.label}>WORKING TOGETHER</span><p>We look for independent ownership, clear written communication, practical judgment and honest reporting of limitations and test results. Role-specific access requirements and field responsibilities will be discussed during the process.</p></div>
        </div>
      </section>
      <section id="apply" className={styles.applicationSection} aria-labelledby="apply-title">
        <div className={styles.applicationIntro}><span className={styles.label}>YOUR APPLICATION</span><h2 id="apply-title">Let’s talk.</h2><p>Apply for {role.title} with relevant experience and examples of your work.</p><p className={styles.fine}>Please share only material you are permitted to disclose. Do not submit classified, controlled or employer-confidential information.</p></div>
        <CareerApplicationForm roleSlug={role.slug} configured={careersConfigured()} />
      </section>
    </main>
    <SiteFooter />
  </div>;
}
