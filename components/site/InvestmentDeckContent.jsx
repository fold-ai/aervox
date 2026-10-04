import InvestmentDeckFrame from "./InvestmentDeckFrame";
import styles from "@/app/(public)/investment-deck/investment.module.css";

const sources = {
  market: "https://www.marketsandmarkets.com/Market-Reports/anti-drone-market-177013645.html",
  procurement: "https://mod.gov.ua/en/news/troops-have-ordered-over-590-000-ua-vs-through-brave1-market-since-the-start-of-the-year",
  auterion: "https://auterion.com/auterion-secures-contract-to-deliver-33000-skynode-drone-strike-kits-to-ukraine/",
  shield: "https://shield.ai/hivemind/",
  fourth: "https://thefourthlaw.ai/",
  gotham: "https://www.palantir.com/platforms/gotham/",
  bis: "https://www.bis.gov/licensing",
  ddtc: "https://www.pmddtc.state.gov/ddtc_public",
};

function Note({ children }) { return <p className={styles.note}>{children}</p>; }
function Rows({ items }) {
  return <div className={styles.statementRows}>{items.map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div>;
}
function Steps({ items }) {
  return <ol className={styles.processList}>{items.map(([title, text], i) => <li key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>;
}
function Source({ href, children }) { return <a href={href} target="_blank" rel="noreferrer">{children} ↗</a>; }
function Table({ headers, rows, label }) {
  return <div className={styles.tableWrap}><table className={styles.evidenceTable} aria-label={label}><thead><tr>{headers.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th scope="row" key={j}>{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

const slides = [
  {
    key: "thesis", label: "Investment overview · October 2026", nav: "The investment thesis", cover: true,
    title: <>Onboard intelligence.<br />Built for interceptors.</>,
    content: <>
      <p className={styles.coverDescription}>ACT-1 onboard hardware and software. PROVE-1 ground software.<br />Starting with drone-interceptor manufacturers.</p>
      <div className={styles.signalLine}><span>Prototypes built</span><span>Savlo integration agreement</span><span>Flight tests planned · October 2026</span></div>
      <div className={styles.coverBottom}><p><strong>Zakhar Bernyk</strong><span>CEO · Computer science student &amp; software developer</span></p><p><strong>$1.5M</strong><span>Target equity raise</span></p><p><strong>$20M</strong><span>Target post-money valuation</span></p></div>
      <Note>October 2026 · Prototype stage · First aircraft testing planned for mid-October.</Note>
    </>
  },
  {
    key: "problem", label: "Customer problem", nav: "The customer & the problem", title: <>The aircraft is only<br />part of the system.</>,
    content: <><p className={styles.lead}>Our initial customer is a drone manufacturer that needs onboard perception, integrated hardware and a usable ground workflow in one delivery.</p><Rows items={[
      ["An integration burden", "Sensors, compute, software and ground tools must work together on the manufacturer’s aircraft. Buying separate components leaves the integration work with the OEM."],
      ["A lifecycle burden", "The manufacturer needs a partner that can maintain the system, adapt it to platform changes and support deployed versions."],
      ["Our proposition", "Deliver ACT-1 and PROVE-1 as an integrated package, then earn ongoing revenue through technical support and product improvements."],
    ]} /><Note>Customer thesis under validation through the Savlo program. Integration time and cost savings have not yet been measured.</Note></>
  },
  {
    key: "product", label: "Product · initial commercial focus", nav: "ACT-1 + PROVE-1", title: <>One integrated offer.<br />Two connected products.</>,
    content: <><div className={styles.platformPair}><article><span className={styles.label}>ONBOARD HARDWARE + SOFTWARE</span><h3>ACT-1</h3><p>Compute and perception software integrated with the manufacturer’s aircraft and sensors.</p><span className={styles.status}>Prototype built</span></article><article><span className={styles.label}>GROUND SOFTWARE</span><h3>PROVE-1</h3><p>Telemetry, observation review and mission analysis for the operator and engineering team.</p><span className={styles.status}>Prototype built</span></article></div><p className={styles.bridge}>Aircraft testing planned for mid-October 2026. First production-intent release targeted by year-end.</p><Note>Initial application: interceptor drones. Human authorization and civilian-risk awareness are design principles; their implementation and performance require validation.</Note></>
  },
  {
    key: "traction", label: "Early traction", nav: "Partnerships & prototypes", title: <>A manufacturing partner.<br />A path to testing.</>,
    content: <><div className={styles.partnerRows}><article><div><h3>Savlo Dynamics</h3><span className={styles.status}>Integration agreement</span></div><p>Agreement for Savlo’s drones to incorporate ACTPROVE software and hardware across its drone output. The agreement establishes the integration relationship; production orders and pricing remain to be agreed.</p></article><article><div><h3>BRAVE1</h3><span className={styles.status}>Confirmed partnership</span></div><p>Multiple working meetings; access to the defense-tech community and selected data; support for arranging early drone testing.</p></article><article><div><h3>ACT-1 + PROVE-1</h3><span className={styles.status}>Prototypes built</span></div><p>Hardware and software prototypes are ready for the next development stage. Aircraft tests are planned for mid-October 2026.</p></article></div><Note>Integration and ecosystem access are established relationships. Paid orders and flight-test results are the next milestones.</Note></>
  },
  {
    key: "market", label: "Market & timing", nav: "Market & demand", title: <>Demand is visible.<br />Our entry point is specific.</>,
    content: <><div className={styles.marketNumbers}><div><strong>$4.48B <span>→</span> $14.51B</strong><p>Global anti-drone market estimate, 2025 → 2030 forecast</p></div><div><strong>590,000+</strong><p>UAVs ordered through BRAVE1 Market in the first nine months of 2026</p></div></div><Rows items={[
      ["Start with the OEM", "Sell onboard systems and companion software into interceptor manufacturers, beginning with the Savlo integration."],
      ["Expand through delivery", "Use validated integrations to pursue additional manufacturers and, over time, turnkey country-level programs with partners."],
    ]} /><p className={styles.sourceNote}><Source href={sources.market}>MarketsandMarkets · June 2025</Source>: broad counter-drone category, not ACTPROVE’s addressable revenue. <Source href={sources.procurement}>Ukraine MoD · 25 September 2026</Source>: all UAV types; interceptors were the most-ordered category. Orders are not deliveries or ACTPROVE traction.</p></>
  },
  {
    key: "business", label: "Business model", nav: "How we earn revenue", title: <>Deliver the system.<br />Support its lifetime.</>,
    content: <><Steps items={[
      ["Turnkey delivery", "Sell an integrated hardware and software package. Scope each program around the customer’s aircraft, ground workflow and acceptance requirements."],
      ["Technical support", "Contract for maintenance, troubleshooting and support over the installed system’s service life."],
      ["Product upgrades", "Offer improvements and additional integrations as separately scoped work or through a contracted upgrade plan."],
    ]} /><Rows items={[["First route to market", "Aircraft manufacturers and integration partners. Longer-term ambition: turnkey systems for national defense customers."]]} /><Note>Planned business model. Selling prices, margins, recurring contract values and revenue forecasts have not yet been established for this deck.</Note></>
  },
  {
    key: "gtm", label: "Go to market", nav: "From integration to orders", title: <>Turn one integration<br />into a repeatable sale.</>,
    content: <><Steps items={[
      ["Validate with Savlo", "Complete the first aircraft tests and document results against an agreed acceptance plan."],
      ["Convert to delivery", "Translate the integration agreement into a priced scope, delivery schedule and purchase commitments."],
      ["Repeat with another OEM", "Support Savlo’s ambition to produce tens of thousands of drones annually through partners in Ukraine and Europe, while qualifying additional OEMs."],
    ]} /><Rows items={[["Acquisition channel", "Founder-led OEM relationships and the BRAVE1 community. Savlo plans to pursue further agreements through this ecosystem; those future contracts are not yet secured."],["Commercial milestones", "Accepted integration → first paid delivery → repeat order → second OEM. Each is a future milestone, not current booked business."]]} /></>
  },
  {
    key: "competition", label: "Competitive landscape", nav: "Competition & positioning", title: <>A focused entry into<br />a competitive market.</>,
    content: <><Table label="Competitive positioning" headers={["Company", "Established offering / focus", "Relevance to ACTPROVE"]} rows={[
      [<Source href={sources.auterion}>Auterion</Source>, "Onboard autonomy hardware and software", "Direct overlap; announced a $50M contract for 33,000 Skynode kits in 2025."],
      [<Source href={sources.fourth}>The Fourth Law</Source>, "Ukrainian drone-autonomy modules", "Direct domestic competitor for manufacturer integrations."],
      [<Source href={sources.shield}>Shield AI</Source>, "Hivemind autonomy and development tooling", "Broader autonomy platform; competes for OEM programs."],
      [<Source href={sources.gotham}>Palantir</Source>, "Gotham intelligence and operational software", "Adjacent to the ground-software and information workflow."],
    ]} /><p className={styles.lead}>Our intended position: aircraft-specific integration of ACT-1 and PROVE-1, sold and supported as one system.</p><Note>This is positioning, not a claim of technical superiority. The first proof must be a validated partner integration, measured economics and a repeat purchase.</Note></>
  },
  {
    key: "validation", label: "Evidence & defensibility", nav: "What the next tests must prove", title: <>The next milestone<br />is evidence.</>,
    content: <><Table label="Product evidence and next validation" headers={["Area", "Current evidence", "Next evidence to establish"]} rows={[
      ["Product", "ACT-1 / PROVE-1 prototypes reported built", "Versioned prototype demonstration and aircraft test report"],
      ["Performance", "Aircraft testing scheduled for October 2026", "Documented perception, latency, power and reliability results with test conditions"],
      ["Integration", "Savlo integration agreement", "Partner acceptance record and repeatable installation process"],
      ["Defensibility", "Aircraft-specific development approach", "Documented IP ownership, permitted data use and reusable integration assets"],
    ]} /><p className={styles.lead}>The intended advantage compounds through integration know-how and rights-cleared data from customer programs.</p><Note>Measured performance results are pending. Website animations are illustrative concepts, not test evidence; proprietary IP and dataset rights require diligence.</Note></>
  },
  {
    key: "team", label: "Founder & hiring priorities", nav: "Leadership & team building", title: <>Software experience.<br />A team to build around it.</>,
    content: <><div className={styles.founderLayout}><article><span className={styles.label}>CHIEF EXECUTIVE OFFICER</span><h3>Zakhar<br />Bernyk</h3><p>Computer science student with experience developing software for large corporations.</p><p>Leading ACTPROVE’s product direction, partnerships and fundraising.</p></article><article><span className={styles.label}>PRIORITY CAPABILITIES TO ADD</span><Rows items={[["Embedded systems", "Hardware integration, reliability and manufacturing readiness."],["Perception / ML", "Model development, evaluation and data governance."],["Integration & testing", "Partner engineering, acceptance testing and technical support."]]} /></article></div><Note>Planned roles are distinct from the current team. Founder project references, the team roster and ownership documentation are diligence priorities.</Note></>
  },
  {
    key: "roadmap", label: "Execution plan", nav: "October tests → Q1 validation", title: <>One core release.<br />Clear acceptance gates.</>,
    content: <><div className={styles.timeline}><div><span className={styles.label}>MID-OCTOBER 2026</span><h3>First aircraft tests</h3><p>Test the ACT-1 and PROVE-1 prototypes on drones. Record findings and resolve integration issues.</p></div><div><span className={styles.label}>BY END OF 2026</span><h3>Production-intent release</h3><p>Target the first final release of ACT-1 and PROVE-1, subject to test results and partner acceptance.</p></div><div><span className={styles.label}>Q1 2027</span><h3>Operational field evaluation</h3><p>Planned evaluation in Ukraine under real operational conditions, subject to readiness, coordination and required approvals.</p></div></div><Rows items={[["Release gate", "Documented test results, resolved critical issues and an agreed partner acceptance record."],["Expansion gate", "Validate the core integration and its economics before committing material resources to additional product lines."]]} /><Note>Dates are management targets, not completed milestones. DETECT-1 and ARCA-1 targets are detailed in the portfolio appendix.</Note></>
  },
  {
    key: "funds", label: "Use of funds · proposed planning scenario", nav: "$1.5M capital plan", title: <>Fund the core product<br />through customer validation.</>,
    content: <><div className={styles.budgetLayout}><Table label="Proposed use of investment proceeds" headers={["Allocation", "Share", "USD"]} rows={[
      ["Team & software development", "45%", "$675,000"],
      ["Hardware R&D & integration", "25%", "$375,000"],
      ["Testing & partner validation", "15%", "$225,000"],
      ["Office, operations & legal", "10%", "$150,000"],
      ["Contingency reserve", "5%", "$75,000"],
    ]} /><aside className={styles.budgetAside}><strong>12</strong><span className={styles.label}>MONTH MANAGEMENT TARGET</span><p>$1.425M operating envelope + $75k reserve.</p><p>$125k average monthly capital envelope, including reserve.</p></aside></div><Note>Management targets 12 months of operations. Category allocations are a proposed scenario, pending a costed monthly budget. The $1.425M operating portion averages $118,750 per month, plus a $75k reserve. Office costs are included in operations.</Note></>
  },
  {
    key: "valuation", label: "Equity round", nav: "Terms & valuation case", title: <>$1.5M to move from<br />prototype to accepted product.</>,
    content: <><div className={styles.termsStrip}><div><strong>$20M</strong><span>Target post-money</span></div><div><strong>$18.5M</strong><span>Implied pre-money</span></div><div><strong>7.5%</strong><span>Illustrative new investor ownership</span></div></div><Rows items={[["The case today", "Built prototypes, an integration agreement covering Savlo’s drone output, and BRAVE1 support for access and early testing."],["What must support the price", "Reviewable agreement terms, aircraft test evidence, a credible costed team plan and visibility into paid unit deliveries."],["Round structure", "Priced equity at a target valuation, subject to diligence and negotiated terms. No independent valuation or comparable-deal benchmark is claimed."]]} /><Note>7.5% assumes the full raise, before any additional option-pool expansion or other issuance. Final ownership depends on the fully diluted cap table and financing documents.</Note></>
  },
  {
    key: "ask", label: "Investment opportunity", nav: "The ask & next conversation", light: true, title: <>Build the product.<br />Prove it with a customer.</>,
    content: <><div className={styles.roundTerms}><div><strong>$1.5M</strong><span>Target equity raise · USD</span></div><div><strong>$20M</strong><span>Target post-money valuation · USD</span></div></div><p className={styles.roundPurpose}>12 months of operations to pursue aircraft validation, the ACT-1 / PROVE-1 release, partner acceptance and first paid deliveries.</p><p className={styles.roundPurpose}>Led by Zakhar Bernyk, a computer science student with corporate software-development experience. Planned U.S. presence: Atlanta, Georgia.</p><div className={styles.roundContact}><p><strong>Zakhar Bernyk</strong><span>Chief Executive Officer</span></p><a href="mailto:contact@actprove.com">contact@actprove.com <span aria-hidden="true">↗</span></a></div><Note>Next discussion: Savlo agreement scope, prototype demonstration, October test plan and financing terms.</Note></>
  },
  {
    key: "portfolio", label: "Appendix A · portfolio discipline", nav: "Appendix · future products", title: <>Expand from the core.<br />Stage the next commitments.</>,
    content: <><Table label="Product development roadmap" headers={["Product", "Management target", "Scope / dependency"]} rows={[
      ["ACT-1 + PROVE-1", "First final release · end of 2026", "Core focus of the round; subject to aircraft testing and acceptance."],
      ["DETECT-1", "Final prototype · Q1 2027", "Perception for long-range aircraft. Additional scope must fit the core team and budget."],
      ["ARCA-1", "First prototype · Q2 2027", "Radar and camera sensing concept. Resourcing and feasibility require a separate gate."],
      ["ERA-1", "Long-term research · no committed date", "Fighter-aircraft research direction; outside the core execution case for this raise."],
    ]} /><Note>These are development targets. No deployment, detection range or validated performance is implied. The capital plan does not assume five parallel product launches.</Note></>
  },
  {
    key: "economics", label: "Appendix B · commercial underwriting", nav: "Appendix · unit economics", title: <>Economics start with<br />each delivered system.</>,
    content: <><Table label="Commercial model inputs required" headers={["Input", "Why it matters", "Current disclosure"]} rows={[
      ["Annual aircraft volume", "Sets the potential integration base", "Partner ambition: tens of thousands per year; no committed quantity established"],
      ["Net price per installed system", "Determines product revenue", "Budget-oriented positioning; final selling price not yet determined"],
      ["Delivered system cost", "Hardware, assembly, QA, warranty and delivery", "Final hardware cost and gross margin not yet established"],
      ["Support & upgrade contracts", "Establishes recurring revenue and delivery cost", "Contract scope and renewal terms to be defined"],
    ]} /><p className={styles.formula}>Program revenue = accepted units × net system price<br /><span>+ contracted integration, support and upgrade fees</span></p><Note>Savlo’s scale ambition depends on future agreements and partner production in Ukraine and Europe. It is not an order book. A low-cost design is the goal; attractive gross margin still needs to be demonstrated with actual pricing and delivery costs.</Note></>
  },
  {
    key: "governance", label: "Appendix C · responsible market entry", nav: "Appendix · safeguards & market entry", title: <>A product built for<br />accountable deployment.</>,
    content: <><Rows items={[["Human authorization", "Design around operator responsibility, reviewable observations and documented limitations. Civilian-risk awareness is an engineering objective, not a guarantee of harm prevention."],["Data & intellectual property", "Establish partner permissions for data use, contributor IP assignments and access controls before reusing customer material."],["Cross-border delivery", "Before international transfers, obtain qualified review of product and technical-data classification, destination, end user and any required permissions."],["Atlanta presence", "A planned office for U.S. partnerships and business development. Entity structure, cost and timing remain to be finalized."]]} /><p className={styles.sourceNote}>U.S. regulatory references: <Source href={sources.bis}>BIS export licensing</Source> · <Source href={sources.ddtc}>DDTC defense trade controls</Source>. Applicability depends on jurisdiction and the specific transaction; no license or compliance status is claimed.</p></>
  },
  {
    key: "diligence", label: "Appendix D · evidence for the next meeting", nav: "Appendix · diligence checklist", title: <>Make every material<br />claim reviewable.</>,
    content: <><Table label="Investor diligence materials" headers={["Evidence", "What to review"]} rows={[
      ["Savlo agreement", "Executed terms, product coverage, volumes, payment obligations and acceptance conditions"],
      ["BRAVE1 relationship", "Correspondence documenting access, support and testing coordination"],
      ["Product evidence", "Prototype demonstration, version history and October test results when completed"],
      ["People & ownership", "Founder project references, current team roster, IP assignments and cap table"],
      ["Financial plan", "Supplier quotes, hiring costs, opening cash, commercial pricing and approved monthly budget"],
    ]} /><Note>This is a diligence request list, not a claim that a completed data room is available. Company statements reflect founder information supplied on 4 October 2026; external market figures link to their sources.</Note><p className={styles.note}>This page uses noindex to discourage search indexing. It is accessible by URL and is not an access-controlled data room.</p></>
  },
];

const briefKeys = new Set(["thesis", "product", "traction", "market", "business", "ask"]);
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
