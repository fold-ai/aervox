import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteChrome";
import styles from "./demo.module.css";

export const metadata = {
  title: "ACTPROVE | YC Application Demo",
  description: "ACTPROVE demos: system concept, deployment concept, perception interface and onboard tracking.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/yc-application-demo" },
};

const demos = [
  {
    id: "system-overview", title: "System overview", label: "CONCEPT ANIMATION", duration: "00:47",
    description: "ACT-1 and ARCA-1 in an illustrative sensing, launch and flight sequence.",
    src: "/media/investor-demo/system-concept.mp4", poster: "/media/investor-demo/system-concept-poster.jpg",
    width: 1280, height: 726,
  },
  {
    id: "deployment-concept", title: "Deployment concept", label: "CONCEPT ANIMATION", duration: "00:48",
    description: "A sensor station and four-aircraft enclosure, including aircraft models and a departure sequence.",
    src: "/media/yc-demo/deployment-concept.mp4", poster: "/media/yc-demo/deployment-concept-poster.jpg",
    width: 1280, height: 720,
  },
  {
    id: "perception-interface", title: "Perception interface", label: "SOFTWARE DEMO", duration: "00:33",
    description: "A screen recording showing object labels and tracking overlays on sample footage.",
    src: "/media/yc-demo/perception-interface.mp4", poster: "/media/yc-demo/perception-interface-poster.jpg",
    width: 702, height: 304,
  },
  {
    id: "onboard-tracking", title: "Onboard tracking", label: "TEST RECORDING", duration: "01:46",
    description: "Recorded onboard camera view with target tracking markers and telemetry overlays.",
    src: "/media/yc-demo/onboard-tracking.mp4", poster: "/media/yc-demo/onboard-tracking-poster.jpg",
    width: 480, height: 360,
  },
];

export default function YCApplicationDemo() {
  return <div className={styles.page}>
    <SiteHeader theme="light" />
    <main id="main" className={styles.main}>
      <header className={styles.intro}>
        <span className={styles.eyebrow}>ACTPROVE / YC APPLICATION</span>
        <h1>Product demos.</h1>
        <p>Onboard intelligence, sensing and connected software. Four views of what we are building.</p>
        <nav aria-label="Demo videos" className={styles.navigation}>
          {demos.map((demo, index) => <a key={demo.id} href={`#${demo.id}`}><span>0{index + 1}</span>{demo.title}<span aria-hidden="true">↓</span></a>)}
        </nav>
      </header>
      <div className={styles.demos}>
        {demos.map((demo, index) => <section key={demo.id} id={demo.id} className={styles.demo} aria-labelledby={`${demo.id}-title`}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>0{index + 1} / {demo.label}</span>
            <h2 id={`${demo.id}-title`}>{demo.title}</h2>
            <p id={`${demo.id}-description`}>{demo.description}</p>
            <span className={styles.duration}>{demo.duration} / SILENT VIDEO</span>
          </div>
          <figure className={styles.figure}>
            <video controls muted playsInline preload="none" poster={demo.poster} width={demo.width} height={demo.height} aria-label={`${demo.title} video`} aria-describedby={`${demo.id}-description`}>
              <source src={demo.src} type="video/mp4" />
              Your browser does not support video playback. <a href={demo.src}>Open video.</a>
            </video>
            <figcaption><span>{demo.label}</span><a href={demo.src} target="_blank" rel="noopener noreferrer" aria-label={`Open ${demo.title.toLowerCase()} video`}>Open video <span aria-hidden="true">↗</span></a></figcaption>
          </figure>
        </section>)}
      </div>
      <p className={styles.note}>The animations illustrate intended workflows, and the interface demo uses sample footage. The onboard tracking recording is shown separately. These videos do not establish repeatable performance across operating conditions.</p>
      <footer className={styles.footer}><Link href="/">ACTPROVE</Link><a href="mailto:contact@actprove.com">contact@actprove.com ↗</a></footer>
    </main>
  </div>;
}
