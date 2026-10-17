import StructuredData from "@/components/site/StructuredData";
import { pageMetadata, absoluteUrl, breadcrumbs } from "@/lib/seo";
import Link from "next/link";
import { Arrow, SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import CareerBenefits from "@/components/site/CareerBenefits";
import CareersDirectory from "@/components/site/CareersDirectory";
import CareerApplicationForm from "@/components/site/CareerApplicationForm";
import { careerRoles } from "@/lib/careers/roles";
import { careersConfigured } from "@/lib/careers/supabase";
import styles from "./careers.module.css";

export const metadata = pageMetadata({"title": "Defense Tech Careers & Engineering Roles | ACTPROVE", "description": "Explore on-site U.S. defense technology careers at ACTPROVE. See role-specific pay ranges, employee benefits and relocation support, and apply directly.", "path": "/careers"});

export default function CareersPage() {
  return <div className={styles.page}>
    <StructuredData data={breadcrumbs([["Home", "/"], ["Careers", "/careers"]])} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "ACTPROVE careers and role profiles", url: absoluteUrl("/careers"), description: "Current priorities and future role profiles across the ACTPROVE hiring plan.", mainEntity: { "@type": "ItemList", itemListElement: careerRoles.map((role, index) => ({ "@type": "ListItem", position: index + 1, name: role.title, url: absoluteUrl(`/careers/${role.slug}`) })) } }} />
    <SiteHeader theme="light" />
    <main id="main">
      <section className={styles.hero} aria-labelledby="careers-title">
        <div className={styles.eyebrow}><span>ACTPROVE / CAREERS</span><span>BUILD WITH US</span></div>
        <div className={styles.heroGrid}><h1 id="careers-title">Build the systems.<br /><span>Shape the mission.</span></h1><div className={styles.heroAside}><p>We are building the team behind connected defense systems. Take ownership of real software, hardware and the work that brings them together.</p><a className={styles.textLink} href="#roles">Find your role<Arrow /></a></div></div>
        <div className={styles.heroFoot}><span>SIX PRODUCTS. ONE CONNECTED PLATFORM.</span><span>ENGINEERING / OPERATIONS / LEADERSHIP</span></div>
      </section>

      <section className={styles.context} aria-labelledby="work-title">
        <span className={styles.label}>01 / THE WORK</span>
        <div><h2 id="work-title">Own a part.<br />Understand the whole.</h2><p>ACT-1 and PROVE-1 are our first focus: onboard intelligence and ground software. DETECT-1, ARCA-1, ERA-1 and VISTA-1 extend the platform through perception, sensing, equipment integration and wearable interfaces.</p><p>We value practical engineering, clear writing and honest test results. The work moves between code, the bench and the field.</p><Link href="/systems" className={styles.textLink}>Explore our systems<Arrow /></Link></div>
        <dl className={styles.workFacts}><div><dt>OWNERSHIP</dt><dd>Build your area, document decisions and work directly with the people who depend on it.</dd></div><div><dt>LOCATION</dt><dd>We are hiring for on-site work in the United States. Our U.S. office location is being finalized and will be confirmed before an offer. Role-relevant lab, field work and travel apply.</dd></div><div><dt>COMPENSATION</dt><dd>U.S. pay ranges are listed for every role. Full-time employees receive our benefits package. Equity is reserved for selected key leadership roles and is stated only in those listings.</dd></div></dl>
      </section>

      <section id="roles" className={styles.rolesSection} aria-labelledby="roles-title">
        <div className={styles.sectionTop}><div><span className={styles.label}>02 / OPPORTUNITIES</span><h2 id="roles-title">Find your place.</h2></div><p>We welcome applications across {careerRoles.length} role profiles. Priority and core-team candidates are reviewed first. Hiring is phased; future opportunities are expressions of interest, not immediate openings.</p></div>
        <CareersDirectory />
      </section>

      <section id="benefits" className={styles.benefitsSection} aria-label="U.S. employee benefits"><CareerBenefits /></section>

      <section id="process" className={styles.process} aria-labelledby="process-title">
        <div className={styles.sectionTop}><div><span className={styles.label}>03 / HOW WE HIRE</span><h2 id="process-title">Show us the work.</h2></div><p>Our process follows the role. Engineers discuss systems they built; hardware candidates work at the bench; pilots demonstrate flight judgment; operations candidates work through practical cases.</p></div>
        <ol className={styles.processList}>
          <li><span>01</span><h3>Start a conversation</h3><p>Apply with your experience and examples of your work. We discuss your motivation, the mission, ownership and role-specific working arrangements.</p></li>
          <li><span>02</span><h3>Go deep on a project</h3><p>Walk us through something you built. Explain your decisions, what failed, what you learned and what you would change.</p></li>
          <li><span>03</span><h3>Work through the role</h3><p>A paid, relevant work sample, technical discussion, bench exercise or practical scenario helps us understand how you work. We use non-sensitive evaluation material.</p></li>
          <li><span>04</span><h3>Meet the team</h3><p>Discuss the product and the people you would work with. Where practical, this includes time in the lab or a controlled test environment.</p></li>
          <li><span>05</span><h3>References and decision</h3><p>We use independent interview feedback and role-specific criteria. References are checked with your consent. We aim to respond within a few days of the final meeting.</p></li>
          <li><span>06</span><h3>Offer and onboarding</h3><p>Agree written compensation, benefits, on-site responsibilities and any role-specific equity terms. Onboarding covers secure access, the platform, lab and field safety, a mentor and your first owned project.</p></li>
        </ol>
        <div className={styles.processNote}><span className={styles.label}>WHAT WE LOOK FOR</span><p>Depth in the role. Practical judgment. Ownership. Clear communication. The founder and relevant technical reviewers assess evidence against the role requirements. Specialist advisers may join where needed. We discuss your own contribution, how you verified the outcome and what you learned when something did not work.</p><Link href="/legal/recruitment" className={styles.textLink}>Read our recruitment policy<Arrow /></Link></div>
      </section>

      <section id="apply" className={styles.applicationSection} aria-labelledby="application-title">
        <div className={styles.applicationIntro}><span className={styles.label}>04 / APPLY</span><h2 id="application-title">Start here.</h2><p>Choose a role or send an open application. We review candidates against the work we need next and the available hiring budget. Show us what you have built and what you want to own.</p><p className={styles.fine}>Send only work you are permitted to share. Please leave out classified material, controlled technical data and confidential information from previous employers.</p><a className={styles.textLink} href="mailto:contact@actprove.com?subject=Careers%20inquiry">Careers questions<Arrow diagonal /></a></div>
        <CareerApplicationForm configured={careersConfigured()} />
      </section>
    </main>
    <SiteFooter />
  </div>;
}
