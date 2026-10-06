import InvestmentDeckFrame from "./InvestmentDeckFrame";
import styles from "@/app/(public)/investment-deck/investment.module.css";

const ministrySource = "https://mod.gov.ua/en/news/troops-have-ordered-over-590-000-ua-vs-through-brave1-market-since-the-start-of-the-year";
const auterionSource = "https://auterion.com/auterion-secures-contract-to-deliver-33000-skynode-drone-strike-kits-to-ukraine/";
const fourthLawSource = "https://thefourthlaw.ai/";

function Rows({ items }) {
  return <div className={styles.statementRows}>{items.map(([title, description]) => <div key={title}><h3>{title}</h3><p>{description}</p></div>)}</div>;
}
function Table({ headers, rows, label }) {
  return <div className={styles.tableWrap}><table className={styles.evidenceTable} aria-label={label}><thead><tr>{headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex} scope="row">{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

const slides = [
  {
    key: "thesis", label: "Investment overview · October 2026", nav: "ACTPROVE", cover: true,
    title: <>The autonomy stack<br />for interceptor drones</>,
    content: <>
      <p className={styles.coverDescription}>ACT-1 onboard perception and PROVE-1 operator software. Beta systems tested internally. Savlo Dynamics is our first aircraft integration partner.</p>
      <div className={styles.coverBottom}><p><strong>Zakhar Bernyk</strong><span>CEO and lead programmer</span></p><p><strong>$1.5M</strong><span>Target equity raise</span></p><p><strong>$20M</strong><span>Target post-money valuation</span></p></div>
    </>
  },
  {
    key: "problem", label: "Problem", nav: "OEM integration", title: <>Aircraft makers need<br />the complete workflow</>,
    content: <><p className={styles.lead}>Interceptor OEMs must make sensors, onboard compute, perception, flight control and operator software work together on a specific aircraft.</p><Rows items={[
      ["Integration burden", "Every airframe and sensor choice creates engineering, testing and maintenance work for the manufacturer."],
      ["ACTPROVE entry point", "Deliver a matched onboard and ground software stack, then integrate and support it with the OEM."],
    ]} /></>
  },
  {
    key: "product", label: "Product architecture", nav: "ACT-1 + PROVE-1", title: <>One aircraft program<br />Two connected products</>,
    content: <><div className={styles.architecture} aria-label="ACTPROVE system architecture"><article><span className={styles.label}>AIRCRAFT INPUT</span><h3>Sensors</h3><p>Camera and aircraft data chosen with the OEM.</p></article><article><span className={styles.label}>ONBOARD</span><h3>ACT-1</h3><p>Compute hardware and perception software for the aircraft.</p></article><article><span className={styles.label}>OPERATOR</span><h3>PROVE-1</h3><p>Telemetry, observation review and mission analysis.</p></article></div><p className={styles.bridge}>The first use case is interceptor aircraft. Both products are in beta; Savlo aircraft integration is the next gate.</p></>
  },
  {
    key: "evidence", label: "Internal beta evidence", nav: "ACT-1 test results", title: <>A 10 km result<br />A clear validation plan</>,
    content: <><div className={styles.testResult}><div><span className={styles.label}>ACT-1 INTERNAL BETA</span><strong>10 km</strong><p>Target lock on a moving object, achieved on the second attempt with a test drone.</p></div><div><span className={styles.label}>PROVE-1 INTERNAL BETA</span><h3>Operator software<br />in testing</h3><p>Telemetry and observation workflow are being tested alongside ACT-1 development.</p></div></div><div className={styles.stageGrid} aria-label="Perception workflow and validation status"><div><span>01</span><strong>Detection</strong><p>Internal test</p></div><div><span>02</span><strong>Classification</strong><p>Threat assessment tested</p></div><div><span>03</span><strong>Tracking</strong><p>Metrics to document</p></div><div><span>04</span><strong>Target lock</strong><p>Second attempt at 10 km</p></div><div><span>05</span><strong>Control handoff</strong><p>Savlo pilot gate</p></div></div><p className={styles.sourceNote}>Internal beta result from one successful acquisition after two attempts. Target type, optics, conditions, repeatability and false-positive rate still need a documented test report. Customer validation is planned with Savlo.</p></>
  },
  {
    key: "traction", label: "Customer traction", nav: "Savlo pilot", title: <>A first OEM relationship<br />A defined pilot path</>,
    content: <><div className={styles.marketNumbers}><div><strong>10</strong><p>Savlo aircraft in the pilot plan for ACT-1 and PROVE-1 integration.</p></div><div><strong>~20</strong><p>Additional BRAVE1-related aircraft discussed in the partner plan.</p></div></div><Rows items={[
      ["Savlo Dynamics", "Cooperation on aircraft integration is agreed in principle. The pilot quantities are not a signed or paid order."],
      ["Next commercial gate", "Confirm the pilot in writing, then agree acceptance criteria, pricing and a production order."],
    ]} /><p className={styles.sourceNote}>These quantities are a coordinated plan, not contracted revenue. BRAVE1 community and test coordination do not imply a purchase order.</p></>
  },
  {
    key: "market", label: "Market", nav: "Bottom-up demand", title: <>Large demand signal<br />Specific OEM market</>,
    content: <><div className={styles.marketNumbers}><div><strong>590,000+</strong><p>UAVs ordered through Brave1 Market in the first nine months of 2026. Interceptors were the most ordered category.</p></div><div><span className={styles.label}>ACTPROVE MARKET MODEL</span><p className={styles.marketEquation}>Relevant interceptor OEMs × annual aircraft volume × $5,000 to $10,000 per system</p><p>Plus integration projects and recurring PROVE-1 support.</p></div></div><div className={styles.revenueSteps}><div><strong>$1M</strong><span>100 to 200 systems</span></div><div><strong>$10M</strong><span>1,000 to 2,000 systems</span></div><div><strong>$100M</strong><span>10,000 to 20,000 systems</span></div></div><p className={styles.sourceNote}>System-only revenue equivalents at the target price, not a forecast or TAM. <a href={ministrySource} target="_blank" rel="noreferrer">Demand source: Ukraine Ministry of Defence ↗</a></p></>
  },
  {
    key: "model", label: "Business model", nav: "Unit economics", title: <>Product delivery<br />Integration and support</>,
    content: <><Table label="ACTPROVE commercial model" headers={["Revenue line", "Current estimate", "Commercial status"]} rows={[
      ["ACT-1 system", "$5,000 to $10,000 target price by sensor configuration", "Not yet contracted"],
      ["Unit cost", "$2,000 to $5,000 preliminary cost range", "Pilot BOM to confirm"],
      ["OEM integration", "Aircraft-specific engineering and acceptance", "Price to be quoted"],
      ["PROVE-1 support", "Software updates, hardware upgrades and technical support", "Annual terms to be set"],
    ]} /><p className={styles.bridge}>Gross margin is not forecast until price and cost are matched for each configuration.</p></>
  },
  {
    key: "position", label: "Competition", nav: "Why ACTPROVE", title: <>Strong incumbents<br />A focused opening</>,
    content: <><Table label="Competitive position using public evidence" headers={["Company", "Public evidence", "ACTPROVE response"]} rows={[
      [<a key="auterion" href={auterionSource} target="_blank" rel="noreferrer">Auterion ↗</a>, "33,000 Skynode strike kits announced under a $50M Pentagon contract", "Focus first on air-target perception for interceptor OEMs"],
      [<a key="fourth-law" href={fourthLawSource} target="_blank" rel="noreferrer">The Fourth Law ↗</a>, "Autonomy modules in production; Zerov-8 interceptor announced", "Prove the ACT-1 and PROVE-1 workflow on Savlo aircraft"],
      ["OEM in-house", "Manufacturer can build its own stack", "Compete on integration effort, test data and long-term support"],
    ]} /><p className={styles.bridge}>Our differentiation is a product thesis today. The Savlo pilot must measure performance, integration time and delivered cost.</p></>
  },
  {
    key: "team", label: "Team", nav: "People", title: <>Zakhar Bernyk leads<br />product and engineering</>,
    content: <><Table label="Current ACTPROVE team" headers={["Role", "Current responsibility", "Experience and status"]} rows={[
      ["Zakhar Bernyk, CEO", "Leads ACT-1 software, PROVE-1 direction and OEM partnership", "Computer science student; has developed software for large corporations"],
      ["Software intern", "Supports basic software tasks", "Relevant projects and employment status to document"],
      ["Hardware intern", "Supports basic hardware tasks", "Relevant projects and employment status to document"],
    ]} /><p className={styles.bridge}>Senior hardware, ML and aircraft integration leadership remains a hiring priority for the pilot and scale-up.</p></>
  },
  {
    key: "round", label: "Equity round", nav: "The ask", light: true, title: <>$1.5M for the next<br />customer proof</>,
    content: <><div className={styles.roundTerms}><div><strong>$1.5M</strong><span>Target priced equity raise</span></div><div><strong>$20M</strong><span>Target post-money valuation</span></div></div><div className={styles.roundMilestones}><span>01 · Savlo aircraft pilot and test report</span><span>02 · Production-intent ACT-1 and PROVE-1</span><span>03 · Priced order and repeatable installation</span></div><p className={styles.roundPurpose}>Planned 12-month allocation: 45% team and software, 25% hardware and integration, 15% testing, 10% compliance and operations, 5% reserve. Implied investor ownership is 7.5% before other issuance.</p><div className={styles.roundContact}><p><strong>Zakhar Bernyk</strong><span>Chief Executive Officer</span></p><a href="mailto:contact@actprove.com">contact@actprove.com <span aria-hidden="true">↗</span></a></div></>
  },
];

const briefKeys = new Set(["thesis", "product", "evidence", "traction", "market", "round"]);
export default function InvestmentDeckContent({ brief = false }) {
  const visible = brief ? slides.filter(slide => briefKeys.has(slide.key)) : slides;
  return <InvestmentDeckFrame brief={brief} slides={visible.map(slide => slide.nav)}><div className={styles.content}>{visible.map((slide, index) => {
    const number = index + 1;
    const Heading = slide.cover ? "h1" : "h2";
    return <section key={slide.key} id={`slide-${number}`} data-investment-slide aria-labelledby={`slide-title-${number}`} className={`${styles.slide} ${slide.cover ? styles.cover : ""} ${slide.light ? styles.round : ""}`}>
      <p className={styles.eyebrow}>{String(number).padStart(2, "0")} / {slide.label}</p>
      <Heading id={`slide-title-${number}`} className={styles.title}>{slide.title}</Heading>
      {slide.content}
    </section>;
  })}</div></InvestmentDeckFrame>;
}
