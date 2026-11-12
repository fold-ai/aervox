import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import styles from "./x24.module.css";

const heroImage = "/media/x24/three-quarter.webp";
const summary = "X24 is ACTPROVE's new in-house autonomous aircraft, with a stated flight range of up to 200 km and an 82 kg payload.";
const page = pageMetadata({
  title: "Introducing X24 | ACTPROVE News",
  description: summary,
  path: "/news/x24",
});

export const metadata = {
  ...page,
  openGraph: {
    ...page.openGraph,
    type: "article",
    publishedTime: "2026-11-11",
    images: [{ url: absoluteUrl(heroImage), width: 1920, height: 1080, alt: "ACTPROVE X24 aircraft render" }],
  },
  twitter: { ...page.twitter, images: [absoluteUrl(heroImage)] },
};

export default function X24Announcement() {
  return <div className={styles.page}>
    <SiteHeader theme="light" />
    <main id="main">
      <article className={styles.article} aria-labelledby="x24-title">
        <header className={styles.intro}>
          <div className={styles.byline}><Link href="/#news">ACTPROVE News</Link><time dateTime="2026-11-11">November 11, 2026</time></div>
          <h1 id="x24-title">Introducing X24.</h1>
          <p>ACTPROVE’s new autonomous aircraft, developed in-house.</p>
        </header>
        <figure className={styles.hero}>
          <Image src={heroImage} alt="Three-quarter view of the X24 flying-wing aircraft with landing gear extended" width={1920} height={1080} sizes="90vw" priority />
          <figcaption>X24 aircraft render</figcaption>
        </figure>
        <section className={styles.details} aria-labelledby="x24-specs-title">
          <div className={styles.copy}>
            <h2>An airframe of our own.</h2>
            <p>X24 is designed for fully autonomous flight and low observability in contested airspace, including missions beyond the front line. Intended payload configurations include light bombs and selected air-to-air missiles.</p>
            <p>The program brings ACTPROVE’s aircraft and ground software together on a platform we develop in-house. X24 has the potential to become a core product for ACTPROVE.</p>
          </div>
          <div className={styles.specifications}>
            <h2 id="x24-specs-title">Stated specifications</h2>
            <dl>
              <div><dt>Flight range</dt><dd><span>Up to</span> 200 km</dd></div>
              <div><dt>Payload</dt><dd>82 kg</dd></div>
              <div><dt>Flight control</dt><dd>Autonomous</dd></div>
            </dl>
          </div>
        </section>
        <figure className={styles.topView}>
          <Image src="/media/x24/top-view.webp" alt="Top view render of the X24 flying-wing airframe" width={1600} height={900} sizes="90vw" />
          <figcaption>X24 viewed from above</figcaption>
        </figure>
      </article>
    </main>
    <SiteFooter />
  </div>;
}
