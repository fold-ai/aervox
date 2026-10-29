import InvestmentDeckFrame from "./InvestmentDeckFrame";
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
      <p className={styles.coverDescription}>Onboard intelligence and ground software for manufacturers. Contracted to supply 50 systems for Wild Hornets' new generation of interceptor drones.</p>
      <div className={styles.coverBottom}><p><strong>Zakhar Bernyk</strong><span>Founder, CEO and lead programmer / ex-Fire Point</span></p><p><strong>$1.5M</strong><span>Target equity raise</span></p><p><strong>$20M</strong><span>Target post-money valuation</span></p></div>
    </>
  },
  {
    key: "problem", label: "The manufacturer problem", nav: "OEM integration",
    title: <>Every platform needs<br />a working software stack</>,
    content: <><p className={styles.lead}>A manufacturer must connect its sensors and onboard compute to perception software and an operator interface. Each aircraft configuration adds integration and validation work.</p><Rows items={[
      ["Repeated engineering", "Changes to the airframe, camera or compute module can require software adaptation and another round of tests."],
      ["ACTPROVE's role", "Supply the onboard and ground software together, integrate it with the manufacturer, and support each deployed configuration."],
    ]} /></>
  },
  {
    key: "product", label: "The initial product", nav: "ACT-1 + PROVE-1",
    title: <>ACT-1 and PROVE-1</>,
    content: <><div className={styles.coreProducts}>
      <article><span className={styles.label}>ONBOARD / BETA</span><h3>ACT-1</h3><p>Compute and perception software integrated with the aircraft and its sensors. Our first application is interceptor drones.</p></article>
      <article><span className={styles.label}>OPERATOR / BETA</span><h3>PROVE-1</h3><p>Ground software for control, telemetry, observation review and equipment status. Connects the aircraft's data to the operator.</p></article>
    </div><p className={styles.bridge}>One integration covers the onboard system and the operator workflow. Manufacturers retain their aircraft; ACTPROVE supplies the intelligence layer.</p></>
  },
  {
    key: "evidence", label: "Prototype evidence", nav: "ACT-1 test result",
    title: <>ACT-1 tested on a Savlo aircraft</>,
    content: <><div className={styles.evidenceLayout}>
      <div className={styles.testResult}><span className={styles.label}>DRONE TARGET LOCK / BETA TEST</span><strong>7 km</strong><p>ACT-1 successfully acquired and locked a drone target during testing on a Savlo Dynamics aircraft.</p><p>PROVE-1 beta is also undergoing tests.</p></div>
      <figure className={styles.testFootage}><video controls muted playsInline preload="none" poster="/media/act-1-testing/detection-tracking-poster.jpg" aria-label="ACT-1 detection and tracking test footage"><source src="/media/act-1-testing/detection-tracking-test-silent.mp4" type="video/mp4" /><a href="/media/act-1-testing/detection-tracking-test-silent.mp4">Open ACT-1 test footage</a></video><img className={styles.printEvidence} src="/media/act-1-testing/detection-tracking-poster.jpg" alt="ACT-1 detection and tracking test sensor view" width="480" height="360" /><figcaption>Real detection and tracking test footage. This clip shows the sensor view, not an interception.</figcaption></figure>
    </div><p className={styles.sourceNote}>Company-reported prototype result. Repeatability and configuration-level acceptance are the next validation gates.</p></>
  },
  {
    key: "traction", label: "Wild Hornets contract", nav: "50 systems + potential follow-on",
    title: <>50 systems contracted<br />with Wild Hornets</>,
    content: <><div className={styles.contractScale}>
      <div><span className={styles.label}>CONTRACTED INITIAL BATCH</span><strong>50</strong><p>For a new generation of interceptor drones from Wild Hornets, a Ukrainian drone supplier.</p></div>
      <div><span className={styles.label}>PROPOSED FOLLOW-ON</span><strong>1,000+</strong><p>Potential additional systems for later drone batches if the initial 50 systems perform well.</p></div>
    </div><div className={styles.contractValue}><strong>$2-2.5M</strong><p>Indicative value of the follow-on proposed by Wild Hornets. Dependent on initial-batch performance and final commercial terms; not committed revenue.</p></div></>
  },
  {
    key: "manufacturers", label: "Manufacturer collaboration", nav: "Ukrainian manufacturers",
    title: <>Working directly with manufacturers</>,
    content: <><div className={styles.manufacturerLayout}>
      <div><span className={styles.label}>AGREEMENTS TO COLLABORATE</span><ul className={styles.manufacturerNames}><li>Skyeton</li><li>Vyriy Drone</li><li>TAF Industries</li><li>SkyFall</li></ul></div>
      <div className={styles.collaborationNotes}><article><h3>Savlo Dynamics</h3><p>Aircraft integration collaboration and completed ACT-1 beta testing on a Savlo drone.</p></article><article><h3>BRAVE1</h3><p>Access to Ukraine's defense technology community, selected data and a pathway to evaluation partners.</p></article></div>
    </div><p className={styles.bridge}>We work closely with Ukrainian manufacturers on platform fit, test access and feedback. Collaboration scope is agreed with each company.</p></>
  },
  {
    key: "validation", label: "Why Ukraine first", nav: "Continuous validation",
    title: <>Ukraine is our validation base</>,
    content: <><p className={styles.lead}>Our concentration on Ukraine is deliberate. Close manufacturer relationships create a path to recurring tests on partner aircraft and direct feedback on what needs to improve.</p>
      <ol className={styles.processList}>
        <li><span>01</span><div><h3>Integrate with the OEM</h3><p>Adapt the system to the manufacturer's aircraft, sensors and operator workflow.</p></div></li>
        <li><span>02</span><div><h3>Test and record</h3><p>Evaluate each configuration with partners and retain the results and failure cases.</p></div></li>
        <li><span>03</span><div><h3>Improve the release</h3><p>Use the findings to update the system, then test the next version against the same criteria.</p></div></li>
      </ol><p className={styles.bridge}>The goal is a repeatable product that can enter the United States, Europe and the Middle East after validation.</p>
    </>
  },
  {
    key: "model", label: "Business model", nav: "Commercial model",
    title: <>System supply, integration and support</>,
    content: <><Rows items={[
      ["System supply", "Hardware and software supplied to drone manufacturers. The Wild Hornets contract covers an initial 50 systems."],
      ["OEM integration", "Aircraft-specific installation and acceptance work, scoped to the customer's configuration."],
      ["Support and upgrades", "PROVE-1 software updates, technical support and hardware upgrades."],
    ]} /><p className={styles.sourceNote}>Pricing and costs are specific to each configuration. The proposed follow-on remains subject to initial-batch performance and commercial terms.</p></>
  },
  {
    key: "portfolio", label: "Platform expansion", nav: "Product roadmap",
    title: <>One foundation, more connected systems</>,
    content: <><p className={styles.lead}>ACT-1 and PROVE-1 are the initial focus. The same software foundation is intended to support additional sensors, existing equipment and field operators.</p><Table label="ACTPROVE planned product directions" headers={["System", "Role in the platform"]} rows={[
      ["DETECT-1", "Scene perception for long-range unmanned aircraft."],
      ["ARCA-1", "Radar and camera sensing, with planned flight-pattern and trajectory analysis."],
      ["ERA-1 + mini", "Hardware adapters connecting older or incompatible equipment and sensors to PROVE-1."],
      ["VISTA-1", "A wearable interface for selected observations and personnel context in the field."],
    ]} /><p className={styles.sourceNote}>These are expansion directions at different research and concept stages. Future scope also includes adapting the core software to unmanned ground platforms.</p></>
  },
  {
    key: "team", label: "Founder and team", nav: "Founder / ex-Fire Point",
    title: <>Founder-led product and engineering</>,
    content: <><div className={styles.founderLayout}>
      <article><span className={styles.label}>FOUNDER / CEO / LEAD PROGRAMMER</span><h3>Zakhar<br />Bernyk</h3><p className={styles.founderCredential}>ex-Fire Point</p><p>Computer science student. Leads core software development, product direction and manufacturer relationships.</p></article>
      <div className={styles.teamDetails}><article><span className={styles.label}>CURRENT SUPPORT</span><h3>Two interns</h3><p>One software intern and one hardware intern support implementation tasks and research.</p></article><article><span className={styles.label}>HIRING PRIORITY</span><h3>Senior engineering</h3><p>Add experienced embedded/hardware and perception engineers to support integration and validation.</p></article></div>
    </div></>
  },
  {
    key: "milestones", label: "Execution targets", nav: "Next 12 months",
    title: <>The next 12 months</>,
    content: <><div className={styles.milestoneRows}>
      <div><span>NOW</span><h3>First supply contract</h3><p>50 systems contracted with Wild Hornets. ACT-1 tested on a Savlo aircraft; PROVE-1 beta under test.</p></div>
      <div><span>NEXT</span><h3>Initial batch delivery</h3><p>Deliver and integrate the contracted 50 systems, then evaluate performance with the customer.</p></div>
      <div><span>Q2 2027</span><h3>Formal field programme</h3><p>Planned first testing programme in actual operating conditions in Ukraine, building on initial prototype tests.</p></div>
      <div><span>ROUND OBJECTIVE</span><h3>Qualify for expansion</h3><p>Use initial-batch results to secure the potential 1,000+ system follow-on and prepare international OEM evaluations.</p></div>
    </div></>
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
      ]} /><div className={styles.fundingPurpose}><h3>Deliver the first customer batch</h3><p>Fulfil the 50-system Wild Hornets contract, validate ACT-1 and PROVE-1, and prepare for potential follow-on production.</p><a href="mailto:contact@actprove.com">contact@actprove.com <span aria-hidden="true">↗</span></a><span className={styles.label}>ZAKHAR BERNYK / FOUNDER & CEO</span></div>
    </div></>
  },
];

const briefKeys = new Set(["thesis", "product", "evidence", "traction", "validation", "round"]);
export default function InvestmentDeckContent({ brief = false }) {
  const visible = brief ? slides.filter(slide => briefKeys.has(slide.key)) : slides;
  return <InvestmentDeckFrame brief={brief} slides={visible.map(slide => slide.nav)}><div className={styles.content}>{visible.map((slide, index) => {
    const number = index + 1;
    const Heading = slide.cover ? "h1" : "h2";
    return <section key={slide.key} id={`slide-${number}`} data-investment-slide data-slide-key={slide.key} aria-labelledby={`slide-title-${number}`} className={`${styles.slide} ${slide.cover ? styles.cover : ""} ${slide.light ? styles.round : ""}`}>
      <p className={styles.eyebrow}>{String(number).padStart(2, "0")} / {slide.label}</p>
      <Heading id={`slide-title-${number}`} className={styles.title}>{slide.title}</Heading>
      {slide.content}
    </section>;
  })}</div></InvestmentDeckFrame>;
}
