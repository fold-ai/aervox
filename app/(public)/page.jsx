import Image from "next/image";
import Drawings from "@/components/site/Drawings";
import wordmark from "@/public/actprove-wordmark.png";
import lockup from "@/public/actprove-lockup.png";

const roadmap = [
  { name: "ARCA-1", kind: "Future sensing system", copy: "A planned 3-6 metre radar and camera system for wide-area drone detection. A 50 km detection range is our design goal and has not been validated." },
  { name: "DETECT-1", kind: "Future onboard perception", copy: "A planned perception system for long-range drones that can interpret changing scenes, identify objects of interest, and surface new observations to operators." },
  { name: "ERA-1", kind: "Long-term research", copy: "A research direction for autonomous fighter-aircraft flight management, with object classification, civilian-risk awareness, and human authorization for consequential decisions." }
];

export default function Page() {
  return (
    <>
      <header className="nav">
        <a className="brand" href="#top" aria-label="Actprove Defense Technologies, home"><Image src={wordmark} alt="Actprove" priority sizes="220px" /></a>
        <nav aria-label="Main navigation"><ul>
          <li><a className="lnk" href="#platform">Platform</a></li>
          <li><a className="lnk" href="#partnership">Partnership</a></li>
          <li><a className="lnk" href="#roadmap">Roadmap</a></li>
          <li><a className="lnk" href="#contact">Contact</a></li>
        </ul></nav>
      </header>

      <main id="top">
        <section className="hero wrap">
          <p className="eyebrow">DRONE SOFTWARE + HARDWARE</p>
          <h1>Intelligence for the next generation of drones.</h1>
          <p className="lede">Actprove develops onboard computing, perception models, training data, and mission software for drone manufacturers. We build the systems around the aircraft, not the aircraft itself.</p>
          <div className="hero-actions"><a className="text-link" href="#platform">Explore the platform <span aria-hidden="true">↗</span></a><span className="hero-index">01 / SYSTEMS</span></div>
          <p className="status">Now working with <b>Savlo Dynamics</b> on a high-speed drone program.</p>
          <div className="hero-mark" aria-hidden="true">A / P</div>
        </section>

        <hr className="rule" />
        <section id="platform" className="wrap">
          <div className="section-head"><p className="eyebrow">01 / CURRENT PRODUCTS</p><h2>One connected system, from onboard sensing to operational insight.</h2></div>
          <div className="craft">
            <Drawings />
            <div><dl className="spec">
              <div className="row"><dt>PROVE-1</dt><dd>Ground platform for software control, telemetry, and analysis of collected data.</dd></div>
              <div className="row"><dt>ACT-1</dt><dd>Onboard compute and perception system, initially focused on interceptor drones.</dd></div>
              <div className="row"><dt>Models</dt><dd>Custom perception models developed for each aircraft, sensor set, and operating context.</dd></div>
              <div className="row"><dt>Data</dt><dd>Curated training datasets and evaluation workflows for partners building their own models.</dd></div>
            </dl><p className="fine">These products are in development. Capabilities and performance will be updated as they are tested.</p></div>
          </div>
        </section>

        <hr className="rule" />
        <section id="partnership" className="wrap partner-section">
          <div><p className="eyebrow">02 / FIRST PARTNER</p><h2>Savlo Dynamics</h2>
            <p className="lede">Savlo Dynamics is developing a drone designed to fly at 500 mph. We are building an onboard perception system for that platform to recognize relevant aerial objects and support high-speed interception decisions.</p>
            <p>The collaboration connects our models and compute systems to a real aircraft program. The system is under development; the speed is a partner-stated design figure, not a performance claim for Actprove hardware.</p>
          </div>
          <div className="partner-panel" aria-label="Savlo Dynamics collaboration summary"><span className="panel-label">ACTIVE COLLABORATION</span><strong>500 <small>MPH</small></strong><span>Partner aircraft design speed</span><div className="panel-rule" /><span>ACT-1 · ONBOARD PERCEPTION</span><span>PROVE-1 · CONTROL + ANALYSIS</span></div>
        </section>

        <hr className="rule" />
        <section id="roadmap" className="wrap">
          <div className="section-head"><p className="eyebrow">03 / PRODUCT ROADMAP</p><h2>What comes next.</h2><p>We are extending the same foundation into wider sensing and new classes of aircraft.</p></div>
          <div className="roadmap-grid">{roadmap.map((item, index) => <article className="roadmap-card" key={item.name}><span className="roadmap-number">0{index + 1} / PLANNED</span><h3>{item.name}</h3><span className="roadmap-kind">{item.kind}</span><p>{item.copy}</p></article>)}</div>
        </section>

        <hr className="rule" />
        <section id="company" className="wrap"><div className="section-head"><p className="eyebrow">04 / ACTPROVE</p><h2>Focused on the systems that make drones useful.</h2></div>
          <p>We work exclusively on drone software and hardware: onboard compute, perception, training data, model development, and the tools teams use to understand what their aircraft observed. Our work combines partner integration with a product roadmap of our own.</p>
          <div className="status-grid"><div className="stat"><b>02</b><span>Current product systems</span></div><div className="stat"><b>03</b><span>Future product directions</span></div><div className="stat"><b>01</b><span>First active company partnership</span></div></div>
        </section>

        <hr className="rule" />
        <section id="contact" className="wrap"><p className="eyebrow">05 / CONTACT</p><h2>Build with us.</h2><p>For partnerships, model development, and engineering conversations, contact our team.</p><a className="mail" href="mailto:contact@actprove.com">contact@actprove.com</a></section>
      </main>
      <footer><div className="lockup"><Image src={lockup} alt="Actprove Defense Technologies" sizes="300px" /></div><p>© 2026 Actprove Defense Technologies</p><p>Drone software + hardware</p></footer>
    </>
  );
}
