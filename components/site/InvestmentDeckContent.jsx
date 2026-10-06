import InvestmentDeckFrame from "./InvestmentDeckFrame";
import styles from "@/app/(public)/investment-deck/investment.module.css";

const ministrySource = "https://mod.gov.ua/en/news/troops-have-ordered-over-590-000-ua-vs-through-brave1-market-since-the-start-of-the-year";
const auterionSource = "https://auterion.com/auterion-secures-contract-to-deliver-33000-skynode-drone-strike-kits-to-ukraine/";

function Rows({ items }) {
  return <div className={styles.statementRows}>{items.map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div>;
}
function Table({ headers, rows, label }) {
  return <div className={styles.tableWrap}><table className={styles.evidenceTable} aria-label={label}><thead><tr>{headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex} scope="row">{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

const slides = [
  {
    key: "thesis", label: "Investment overview · October 2026", nav: "ACTPROVE", cover: true,
    title: <>Onboard intelligence<br />for interceptor drones</>,
    content: <>
      <p className={styles.coverDescription}>ACT-1 onboard hardware and software. PROVE-1 operator software. Both are in beta; Savlo Dynamics is our first integration partner.</p>
      <div className={styles.coverBottom}><p><strong>Zakhar Bernyk</strong><span>CEO</span></p><p><strong>$1.5M</strong><span>Equity round</span></p><p><strong>$20M</strong><span>Target post-money valuation</span></p></div>
    </>
  },
  {
    key: "problem", label: "Customer", nav: "Customer problem", title: <>Drone manufacturers need<br />one working system</>,
    content: <><p className={styles.lead}>Our initial buyer is an aircraft manufacturer integrating onboard compute, perception software and an operator workflow into its drones.</p><Rows items={[
      ["Current work", "The manufacturer must connect sensors, compute and ground software, then maintain the integration as the aircraft changes."],
      ["ACTPROVE offer", "Supply ACT-1 and PROVE-1 together for the manufacturer's platform, with integration and continuing support."],
    ]} /></>
  },
  {
    key: "product", label: "Product", nav: "ACT-1 + PROVE-1", title: <>Two products<br />for one aircraft program</>,
    content: <><div className={styles.platformPair}><article><span className={styles.label}>ONBOARD</span><h3>ACT-1</h3><p>Compute hardware and perception software integrated with the aircraft and its sensors.</p><span className={styles.status}>Beta tested on a test drone</span></article><article><span className={styles.label}>GROUND</span><h3>PROVE-1</h3><p>Telemetry, observation review and mission analysis for operators and engineers.</p><span className={styles.status}>Beta in testing</span></article></div><p className={styles.bridge}>Initial application: interceptor drones. Next step: integrate both products into Savlo aircraft.</p></>
  },
  {
    key: "evidence", label: "Evidence", nav: "What exists today", title: <>Beta systems tested<br />Pilot integration agreed</>,
    content: <><Table label="ACTPROVE evidence at October 2026" headers={["Item", "Confirmed status", "Next proof"]} rows={[
      ["ACT-1 beta", "Founder reports target lock at 10 km and threat assessment on a test drone", "Share test footage, conditions and repeatability data"],
      ["PROVE-1 beta", "Founder reports ongoing successful tests", "Share recorded operator workflow and test results"],
      ["Savlo / BRAVE1", "Savlo cooperation agreed; pilot plans cover 10 Savlo aircraft and about 20 BRAVE1-related aircraft", "Confirm written orders, pricing and acceptance criteria"],
    ]} /><p className={styles.bridge}>Range and test claims are internal results reported by the founder; independent validation has not been provided.</p></>
  },
  {
    key: "market", label: "Market entry", nav: "Demand & route to market", title: <>Start with the manufacturer<br />Expand through accepted integrations</>,
    content: <><div className={styles.marketNumbers}><div><strong>590,000+</strong><p>UAV orders placed through Brave1 Market in the first nine months of 2026. Interceptors were the most ordered category.</p></div><div><strong>10 + ~20</strong><p>Planned Savlo pilot aircraft plus a BRAVE1-related batch. This is a partner plan, not recognized revenue.</p></div></div><Rows items={[
      ["First sale", "Complete the Savlo pilot, agree acceptance criteria and convert it to a priced order."],
      ["Second sale", "Use the accepted integration to approach another interceptor manufacturer."],
    ]} /><p className={styles.sourceNote}>Market context: <a href={ministrySource} target="_blank" rel="noreferrer">Ukraine Ministry of Defence, 25 September 2026 ↗</a>. The 590,000 figure covers all UAV types and is not ACTPROVE revenue.</p></>
  },
  {
    key: "position", label: "Competition", nav: "Positioning", title: <>A focused OEM integration<br />in a competitive market</>,
    content: <><Table label="Competitor comparison" headers={["Company", "Relevant offering", "ACTPROVE position"]} rows={[
      [<a key="auterion" href={auterionSource} target="_blank" rel="noreferrer">Auterion ↗</a>, "Established onboard autonomy hardware and software", "Competes for aircraft integrations"],
      ["The Fourth Law", "Ukrainian drone autonomy modules", "Competes for local manufacturer programs"],
      ["ACTPROVE", "ACT-1 plus PROVE-1 for the customer's aircraft", "First proof is Savlo integration and repeatable delivery"],
    ]} /><p className={styles.lead}>Our proposed advantage is one supplier for onboard and ground software, adapted to each OEM. We have not yet measured cost, speed or performance against competitors.</p></>
  },
  {
    key: "model", label: "Commercial model", nav: "How revenue works", title: <>Hardware and software delivery<br />with contracted support</>,
    content: <><Rows items={[
      ["Product revenue", "Target $5,000 to $10,000 per system, depending on camera and thermal configuration. Final price is not contracted."],
      ["Integration revenue", "Charge for aircraft-specific engineering and acceptance work."],
      ["Support revenue", "Offer PROVE-1 software updates, hardware upgrades and technical support after delivery."],
    ]} /><p className={styles.bridge}>Unit cost, gross margin and support pricing remain to be determined from pilot delivery.</p></>
  },
  {
    key: "milestones", label: "Execution", nav: "12-month plan", title: <>Aircraft tests first<br />Product acceptance next</>,
    content: <><div className={styles.timeline}><div><span className={styles.label}>OCTOBER 2026</span><h3>Savlo pilot</h3><p>Move from the test drone to a planned 10-aircraft pilot; document performance and acceptance.</p></div><div><span className={styles.label}>END OF 2026</span><h3>Release target</h3><p>Complete a production-intent ACT-1 and PROVE-1 version after test findings.</p></div><div><span className={styles.label}>Q1 2027</span><h3>Ukraine evaluation</h3><p>Target a field evaluation under real operational conditions, subject to readiness and coordination.</p></div></div><p className={styles.bridge}>Investment gates: test report, partner acceptance, priced pilot order and repeatable installation.</p></>
  },
  {
    key: "team", label: "People & capital", nav: "Team & use of funds", title: <>Three builders today<br />12 months to execute</>,
    content: <><div className={styles.founderLayout}><article><span className={styles.label}>CURRENT TEAM</span><h3>Zakhar<br />Bernyk</h3><p>CEO and lead programmer. Computer science student with software development experience for large corporations.</p><p>Two hired developers, one in software and one in hardware, are beginning research for the next products.</p></article><article><span className={styles.label}>ALLOCATION · $1.5M</span><Table label="Twelve-month use of funds" headers={["Use", "Share", "USD"]} rows={[
      ["Team and software", "45%", "$675k"], ["Hardware and integration", "25%", "$375k"], ["Testing", "15%", "$225k"], ["Office, operations and legal", "10%", "$150k"], ["Reserve", "5%", "$75k"],
    ]} /></article></div><p className={styles.sourceNote}>Management targets 12 months of operations, including office, salaries, hardware development and testing.</p></>
  },
  {
    key: "round", label: "Equity round", nav: "The ask", light: true, title: <>$1.5M to reach<br />accepted customer delivery</>,
    content: <><div className={styles.roundTerms}><div><strong>$1.5M</strong><span>Target equity raise</span></div><div><strong>$20M</strong><span>Target post-money valuation</span></div></div><p className={styles.roundPurpose}>Implied pre-money: $18.5M. New investor ownership: 7.5% before option-pool changes or other issuance.</p><p className={styles.roundPurpose}>The valuation is a management target. Pilot acceptance, unit economics and commercial orders remain to be proven.</p><div className={styles.roundContact}><p><strong>Zakhar Bernyk</strong><span>Chief Executive Officer</span></p><a href="mailto:contact@actprove.com">contact@actprove.com <span aria-hidden="true">↗</span></a></div></>
  },
];

const briefKeys = new Set(["thesis", "product", "evidence", "market", "model", "round"]);
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
