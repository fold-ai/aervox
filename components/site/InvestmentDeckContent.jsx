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
      <p className={styles.coverDescription}>Onboard perception and operator software for interceptor drones. ACT-1 beta has been tested successfully on a Savlo Dynamics aircraft.</p>
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
    key: "product", label: "Product portfolio", nav: "Six systems", title: <>Two products in beta<br />Four product directions</>,
    content: <><div className={styles.coreProducts} aria-label="Current ACTPROVE products"><article><span className={styles.label}>ONBOARD / BETA</span><h3>ACT-1</h3><p>Compute and perception for interceptor aircraft, integrated with the drone and its sensors.</p></article><article><span className={styles.label}>GROUND / BETA</span><h3>PROVE-1</h3><p>Operator software for telemetry, observation review and mission analysis.</p></article></div><div className={styles.futureProducts} aria-label="ACTPROVE product directions"><article><h3>DETECT-1</h3><p>Planned scene perception for long-range drones.</p></article><article><h3>ARCA-1</h3><p>Radar and camera sensing; early prototype research.</p></article><article><h3>ERA-1</h3><p>Long-term aircraft autonomy research.</p></article><article><h3>VISTA-1</h3><p>Wearable operator view; interface concept.</p></article></div><p className={styles.portfolioNote}>The round funds ACT-1 and PROVE-1 validation. Other systems advance through separate research and product gates.</p></>
  },
  {
    key: "evidence", label: "Beta test evidence", nav: "ACT-1 tests", title: <>ACT-1 tested<br />on a Savlo drone</>,
    content: <><div className={styles.testResult}><div><span className={styles.label}>SAVLO DYNAMICS AIRCRAFT</span><strong>ACT-1</strong><p>ACT-1 beta was tested successfully on a Savlo Dynamics drone.</p></div><div><span className={styles.label}>DRONE TARGET LOCK</span><strong>7 km</strong><p>ACT-1 acquired and locked a drone target at 7 km during beta testing.</p></div></div><p className={styles.bridge}>PROVE-1 beta is also under test. The next evidence gate is a documented, repeatable partner test with defined acceptance criteria.</p><p className={styles.sourceNote}>ACTPROVE reports target-lock capability up to 10 km. The measured result presented here is 7 km; performance at 10 km still needs a documented test.</p></>
  },
  {
    key: "traction", label: "Partner collaboration", nav: "Route to market", title: <>An OEM integration path<br />A defined next gate</>,
    content: <><Rows items={[
      ["Savlo Dynamics", "Agreed aircraft integration collaboration. ACT-1 beta testing on a Savlo drone has been completed successfully."],
      ["BRAVE1", "Confirmed collaboration provides access to the defense-tech community, selected data and a testing pathway."],
      ["Next commercial gate", "Document repeatable results, agree acceptance criteria and convert partner interest into a priced order."],
    ]} /><p className={styles.sourceNote}>No purchase order, committed production volume or partner revenue is claimed.</p></>
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
      [<a key="fourth-law" href={fourthLawSource} target="_blank" rel="noreferrer">The Fourth Law ↗</a>, "Autonomy modules in production; Zerov-8 interceptor announced", "Prove the ACT-1 and PROVE-1 workflow on a partner aircraft"],
      ["OEM in-house", "Manufacturer can build its own stack", "Compete on integration effort, test data and long-term support"],
    ]} /><p className={styles.bridge}>Our differentiation is a product thesis today. Partner testing must measure performance, integration time and delivered cost.</p></>
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
    content: <><div className={styles.roundTerms}><div><strong>$1.5M</strong><span>Target priced equity raise</span></div><div><strong>$20M</strong><span>Target post-money valuation</span></div></div><div className={styles.roundMilestones}><span>01 · Repeatable partner acceptance tests</span><span>02 · Production-intent ACT-1 and PROVE-1</span><span>03 · Priced order and repeatable installation</span></div><p className={styles.roundPurpose}>Planned 12-month use of funds: $675k team and software, $375k hardware and integration, $225k testing, $150k compliance and operations, $75k reserve. Implied investor ownership is 7.5% before other issuance.</p><div className={styles.roundContact}><p><strong>Zakhar Bernyk</strong><span>Chief Executive Officer</span></p><a href="mailto:contact@actprove.com">contact@actprove.com <span aria-hidden="true">↗</span></a></div></>
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
