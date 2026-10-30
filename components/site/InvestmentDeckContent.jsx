import InvestmentDeckFrame from "./InvestmentDeckFrame";
import InvestmentDeckDemo from "./InvestmentDeckDemo";
import styles from "@/app/(public)/investment-deck/investment.module.css";

function Rows({ items }) {
  return <div className={styles.statementRows}>{items.map(([title, description]) => <div key={title}><h3>{title}</h3><p>{description}</p></div>)}</div>;
}
function Table({ headers, rows, label }) {
  return <div className={styles.tableWrap}><table className={styles.evidenceTable} aria-label={label}><thead><tr>{headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex} scope="row">{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

const slides = [
  {
    key: "thesis", label: "Investor presentation / October 2026", nav: "ACTPROVE", cover: true,
    title: <>Software infrastructure<br />for unmanned systems</>,
    content: <>
      <p className={styles.coverDescription}>Onboard computing and ground software for drone manufacturers. Technical requirements and development scope agreed for a 50-system ACT-1 programme with Wild Hornets.</p>
      <div className={styles.coverBottom}><p><strong>Zakhar Bernyk</strong><span>Founder, CEO and lead programmer / ex-Fire Point</span></p><p><strong>$1.5M</strong><span>Target equity raise</span></p><p><strong>$20M</strong><span>Target post-money valuation</span></p></div>
    </>
  },
  {
    key: "problem", label: "The manufacturer problem", nav: "Aircraft integration",
    title: <>Manufacturers need an<br />integrated software stack</>,
    content: <><p className={styles.lead}>A drone manufacturer must make its sensors, onboard computer and operator software work together. Every hardware change adds integration and testing work.</p><Rows items={[
      ["The integration burden", "Separate hardware and software components still need to work as one aircraft system."],
      ["ACTPROVE's approach", "Supply onboard processing and ground software together, adapted to each manufacturer's aircraft."],
    ]} /></>
  },
  {
    key: "product", label: "The initial product", nav: "ACT-1 + PROVE-1",
    title: <>ACT-1 and PROVE-1</>,
    content: <><div className={styles.coreProducts}>
      <article><span className={styles.label}>ONBOARD / BETA</span><h3>ACT-1</h3><p>Onboard computing and perception software integrated with the aircraft's sensors. Initial application: interceptor drones.</p></article>
      <article><span className={styles.label}>GROUND PLATFORM / BETA</span><h3>PROVE-1</h3><p>Operator software for control, telemetry and observation review. Ground hardware includes a controller and modular edge-computing unit.</p></article>
    </div><p className={styles.bridge}>ACT-1 processes observations onboard. PROVE-1 brings aircraft data to the operator. Integration and validation are specific to each aircraft configuration.</p></>
  },
  {
    key: "evidence", label: "Prototype evidence", nav: "ACT-1 test result",
    title: <>ACT-1 tested on a Savlo aircraft</>,
    content: <><div className={styles.evidenceLayout}>
      <div className={styles.testResult}><span className={styles.label}>ONBOARD-CAMERA ACQUISITION / TEST</span><strong>2 km</strong><p>ACT-1 acquired the target using the drone's own camera during testing with Savlo Dynamics.</p><p>The company reports a subsequent autonomous interception.</p></div>
      <figure className={styles.testFootage}><video controls muted playsInline preload="none" poster="/media/act-1-testing/detection-tracking-poster.jpg" aria-label="ACT-1 detection and tracking test footage"><source src="/media/act-1-testing/detection-tracking-test-silent.mp4" type="video/mp4" /><a href="/media/act-1-testing/detection-tracking-test-silent.mp4">Open ACT-1 test footage</a></video><img className={styles.printEvidence} src="/media/act-1-testing/detection-tracking-poster.jpg" alt="ACT-1 detection and tracking test sensor view" width="480" height="360" /><figcaption>Onboard-camera acquisition and tracking from the Savlo Dynamics test. The interception is not shown in this clip.</figcaption></figure>
    </div><p className={styles.sourceNote}>Company-reported prototype result. Repeatability and aircraft-specific acceptance remain validation milestones.</p></>
  },
  {
    key: "traction", label: "Wild Hornets programme", nav: "50-system scope + potential follow-on",
    title: <>50-system programme<br />with Wild Hornets</>,
    content: <><div className={styles.contractScale}>
      <div><span className={styles.label}>TECHNICAL SCOPE AGREED</span><strong>50</strong><p>ACT-1 systems for new interceptor drones. Technical requirements and development scope agreed.</p></div>
      <div><span className={styles.label}>CONDITIONAL FOLLOW-ON</span><strong>1,000+</strong><p>Proposed additional systems, subject to performance of the initial batch and final terms.</p></div>
    </div><div className={styles.contractValue}><strong>$2-2.5M</strong><p>Illustrative value for 1,000 systems at $2,000-$2,500 each. The follow-on is conditional and does not represent committed revenue.</p></div><p className={styles.sourceNote}>ACT-1 interceptor pricing: $2,000-$2,500 per system. Estimated cost markup: ~45%, implying ~31% gross margin.</p></>
  },
  {
    key: "manufacturers", label: "Manufacturer relationships", nav: "Manufacturers + test partners",
    title: <>Working with Ukrainian manufacturers</>,
    content: <><div className={styles.partnerContract}><div><span className={styles.label}>50-SYSTEM PROGRAMME</span><h3>Wild Hornets</h3></div><p>Technical requirements and development scope agreed for 50 ACT-1 systems.</p></div><div className={styles.manufacturerLayout}>
      <div><span className={styles.label}>COOPERATION DISCUSSIONS</span><ul className={styles.manufacturerNames}><li>Skyeton</li><li>Vyriy Drone</li><li>TAF Industries</li><li>SkyFall</li></ul></div>
      <div className={styles.collaborationNotes}><article><h3>Savlo Dynamics</h3><p>Close collaboration, integration and completed onboard tests.</p></article><article><h3>BRAVE1</h3><p>Close collaboration on data access and test opportunities.</p></article></div>
    </div><p className={styles.bridge}>Ukraine is our base for recurring tests and manufacturer feedback. We plan to expand to the US, Europe and the Middle East after validation.</p></>
  },
  {
    key: "model", label: "Business model", nav: "Pricing + unit economics",
    title: <>ACT-1 pricing and unit economics</>,
    content: <><div className={styles.unitEconomics}>
      <div><span className={styles.label}>ACT-1 / INTERCEPTOR SYSTEM</span><strong>$2k-$2.5k</strong><p>Price per system for interceptor drones.</p></div>
      <div><span className={styles.label}>ESTIMATED MARKUP ON COST</span><strong>~45%</strong><p>Implies approximately 31% gross margin.</p></div>
    </div><Rows items={[
      ["Sales and support", "Per-system sales, with integration, software updates and hardware support scoped per deployment."],
      ["Other configurations", "Larger-drone ACT-1 pricing varies. PROVE-1 hardware and software, ERA-1 and ARCA-1 pricing remains under discussion."],
    ]} /><p className={styles.sourceNote}>Pricing and markup are management estimates, subject to final production costs.</p></>
  },
  {
    key: "portfolio", label: "Platform expansion", nav: "Product roadmap",
    title: <>Product roadmap</>,
    content: <><p className={styles.lead}>Current development and testing focus on ACT-1 and PROVE-1.</p><Table label="ACTPROVE product expansion directions" headers={["System", "Expansion direction"]} rows={[
      ["DETECT-1", "Planned scene perception for long-range aircraft."],
      ["ARCA-1", "Radar/camera sensing and trajectory analysis. Near-term testing planned."],
      ["ERA-1 + mini", "Planned hardware adapters linking older equipment and sensors to PROVE-1."],
      ["VISTA-1", "Concept wearable interface for selected PROVE-1 information."],
    ]} /><p className={styles.sourceNote}>Each program has separate development and validation milestones. Future scope includes unmanned ground systems.</p></>
  },
  {
    key: "team", label: "Founder and team", nav: "Founder / ex-Fire Point",
    title: <>Founder and engineering team</>,
    content: <><div className={styles.founderLayout}>
      <article><span className={styles.label}>FOUNDER / CEO / LEAD PROGRAMMER</span><h3>Zakhar<br />Bernyk</h3><p className={styles.founderCredential}>ex-Fire Point</p><p>Computer science student. Leads core software development, product direction and manufacturer relationships.</p></article>
      <div className={styles.teamDetails}><article><span className={styles.label}>CURRENT SUPPORT</span><h3>Two interns</h3><p>One software intern and one hardware intern support implementation tasks and research.</p></article><article><span className={styles.label}>HIRING PRIORITY</span><h3>Senior engineering</h3><p>Add experienced embedded/hardware and perception engineers to support integration and validation.</p></article></div>
    </div></>
  },
  {
    key: "milestones", label: "Execution targets", nav: "Next 12 months",
    title: <>The next 12 months</>,
    content: <><div className={styles.milestoneRows}>
      <div><span>NOW</span><h3>Scope and testing</h3><p>Wild Hornets: requirements agreed for 50 systems. ACT-1 and PROVE-1 are the current test priorities.</p></div>
      <div><span>NEXT</span><h3>Initial programme</h3><p>Develop and validate ACT-1 against the agreed requirements, then prepare the 50-system batch.</p></div>
      <div><span>Q2 2027</span><h3>Formal field validation</h3><p>Planned structured testing in Ukraine, building on the completed prototype tests.</p></div>
      <div><span>ROUND OBJECTIVE</span><h3>Follow-on qualification</h3><p>Use customer results to qualify for the conditional 1,000+ system follow-on and international evaluations.</p></div>
    </div></>
  },
  {
    key: "demo", label: "System concept demo", nav: "Watch the concept demo", demo: true,
    title: <>ACT-1 + ARCA-1 concept demo</>,
    content: <InvestmentDeckDemo />
  },
  {
    key: "round", label: "Priced equity round", nav: "Funding + use of funds", light: true,
    title: <>A $1.5M equity round</>,
    content: <><div className={styles.termsStrip}><div><strong>$20M</strong><span>Target post-money valuation</span></div><div><strong>7.5%</strong><span>Implied new investor ownership</span></div><div><strong>12 months</strong><span>Planned operating runway</span></div></div><div className={styles.fundingLayout}>
      <Table label="Planned use of the 1.5 million dollar raise" headers={["Use of funds", "Share", "Amount"]} rows={[
        ["Team and software", "45%", "$675k"],
        ["Hardware and integration", "25%", "$375k"],
        ["Testing", "15%", "$225k"],
        ["Compliance and operations", "10%", "$150k"],
        ["Reserve", "5%", "$75k"],
      ]} /><div className={styles.fundingPurpose}><h3>Deliver the initial 50 systems</h3><p>Fund development, validation and delivery of Wild Hornets' 50-system programme, with ACT-1 and PROVE-1 testing as the priority.</p><a href="mailto:contact@actprove.com">contact@actprove.com <span aria-hidden="true">↗</span></a><span className={styles.label}>ZAKHAR BERNYK / FOUNDER & CEO</span></div>
    </div></>
  },
];

const briefKeys = new Set(["thesis", "product", "evidence", "traction", "demo", "round"]);
export default function InvestmentDeckContent({ brief = false }) {
  const visible = brief ? slides.filter(slide => briefKeys.has(slide.key)) : slides;
  return <InvestmentDeckFrame brief={brief} slides={visible.map(slide => slide.nav)}><div className={styles.content}>{visible.map((slide, index) => {
    const number = index + 1;
    const Heading = slide.cover ? "h1" : "h2";
    return <section key={slide.key} id={`slide-${number}`} data-investment-slide data-slide-key={slide.key} aria-labelledby={`slide-title-${number}`} className={`${styles.slide} ${slide.cover ? styles.cover : ""} ${slide.light ? styles.round : ""} ${slide.demo ? styles.demoSlide : ""}`}>
      <p className={styles.eyebrow}>{String(number).padStart(2, "0")} / {slide.label}</p>
      <Heading id={`slide-title-${number}`} className={styles.title}>{slide.title}</Heading>
      {slide.content}
    </section>;
  })}</div></InvestmentDeckFrame>;
}
