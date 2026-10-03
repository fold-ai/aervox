import InvestmentDeckFrame from "@/components/site/InvestmentDeckFrame";
import styles from "./investment.module.css";

export const metadata = {
  title: "Actprove — Investment Deck",
  description: "Actprove investment overview. Raising $1.5 million at a $20 million post-money valuation.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/investment-deck" },
};

const slides = [
  "Investment overview", "Our objective", "The platform", "ACT-1", "PROVE-1",
  "Decision support", "Models and data", "Partnerships", "Product roadmap",
  "Q1 2027 testing", "Leadership and Atlanta", "The investment round",
];

const braveLaunch = "https://www.kmu.gov.ua/en/news/v-ukraini-zapustyly-defense-tech-cluster-brave1-iakyi-stymuliuvatyme-rozvytok-viiskovykh-innovatsii-ta-oboronnykh-tekhnolohii";

function Slide({ number, label, children, className = "" }) {
  return <section id={`slide-${number}`} data-investment-slide aria-labelledby={`slide-title-${number}`} className={`${styles.slide} ${className}`}>
    <p className={styles.eyebrow}>{String(number).padStart(2, "0")} / {label}</p>
    {children}
  </section>;
}

function Title({ number, children }) {
  return <h2 id={`slide-title-${number}`} className={styles.title}>{children}</h2>;
}

export default function InvestmentDeckPage() {
  return <InvestmentDeckFrame slides={slides}>
    <div className={styles.content}>
      <Slide number={1} label="Investment overview" className={styles.cover}>
        <p className={styles.company}>ACTPROVE<span>DEFENSE TECHNOLOGIES</span></p>
        <h1 id="slide-title-1">Intelligence for<br />unmanned systems</h1>
        <p className={styles.coverDescription}>Onboard computing and perception software,<br className={styles.desktopBreak} /> built around the aircraft and its operator.</p>
        <div className={styles.coverBottom}>
          <p><strong>Zakhar Bernyk</strong><span>Chief Executive Officer</span></p>
          <p><strong>$1.5M</strong><span>Raising</span></p>
          <p><strong>$20M</strong><span>Post-money valuation</span></p>
        </div>
      </Slide>

      <Slide number={2} label="Our objective">
        <Title number={2}>Better understanding.<br />More informed decisions.</Title>
        <p className={styles.lead}>Aircraft generate observations. Operators need to understand the objects, the surroundings, and the consequences of acting.</p>
        <div className={styles.statementRows}>
          <div><h3>The need</h3><p>Object recognition must connect with onboard processing and the tools used to review a mission.</p></div>
          <div><h3>Our goal</h3><p>Develop an integrated hardware and software foundation that helps aircraft manufacturers bring this understanding to their platforms.</p></div>
          <div><h3>The principle</h3><p>Make civilian-risk awareness part of the assessment. Keep consequential decisions under human authorization.</p></div>
        </div>
      </Slide>

      <Slide number={3} label="The platform">
        <Title number={3}>Two systems.<br />One development foundation.</Title>
        <div className={styles.platformPair}>
          <article><span className={styles.label}>ON THE AIRCRAFT</span><h3>ACT-1</h3><p>Onboard compute and perception, adapted to the aircraft and its sensors.</p><span className={styles.status}>In development</span></article>
          <article><span className={styles.label}>WITH THE OPERATOR</span><h3>PROVE-1</h3><p>Ground software for telemetry, observation review, and mission analysis.</p><span className={styles.status}>In development</span></article>
        </div>
        <p className={styles.bridge}>Shared models, training data, and aircraft-specific integration connect the two.</p>
      </Slide>

      <Slide number={4} label="Onboard intelligence">
        <div className={styles.productLayout}>
          <div><h2 id="slide-title-4" className={styles.productName}>ACT-1</h2><p className={styles.productTagline}>Perception on the aircraft</p><span className={styles.status}>In development</span></div>
          <div className={styles.productBody}>
            <p className={styles.lead}>Compute and custom perception models designed around the aircraft’s sensor suite.</p>
            <dl className={styles.definitionRows}>
              <div><dt>Process onboard</dt><dd>Bring sensor processing into the aircraft’s computing environment.</dd></div>
              <div><dt>Recognize objects</dt><dd>Identify object classes and interpret their visible characteristics.</dd></div>
              <div><dt>Integrate with partners</dt><dd>Adapt models and hardware to the platform. Initial development focuses on interceptor drones.</dd></div>
            </dl>
          </div>
        </div>
      </Slide>

      <Slide number={5} label="Ground software">
        <div className={styles.productLayout}>
          <div><h2 id="slide-title-5" className={styles.productName}>PROVE-1</h2><p className={styles.productTagline}>Context for the operator</p><span className={styles.status}>In development</span></div>
          <div className={styles.productBody}>
            <p className={styles.lead}>A software platform connecting aircraft observations with ground control and review.</p>
            <dl className={styles.definitionRows}>
              <div><dt>Control &amp; telemetry</dt><dd>Bring software control and telemetry into the partner’s ground workflow.</dd></div>
              <div><dt>Observation review</dt><dd>Help teams examine collected information and understand what the aircraft observed.</dd></div>
              <div><dt>Mission &amp; model analysis</dt><dd>Support evaluation workflows and turn test results into development feedback.</dd></div>
            </dl>
          </div>
        </div>
      </Slide>

      <Slide number={6} label="Decision support">
        <Title number={6}>Context before<br />consequential decisions</Title>
        <div className={styles.statementRows}>
          <div><h3>Object understanding</h3><p>Recognize classes, visible features, and structural characteristics. Give operators context beyond a detection box.</p></div>
          <div><h3>Civilian-risk awareness</h3><p>Bring surrounding activity and potential risks to civilians into the assessment of whether action is appropriate.</p></div>
          <div><h3>Human authorization</h3><p>Support operator judgment with relevant observations. Keep consequential decisions subject to human authorization.</p></div>
        </div>
        <p className={styles.note}>Capabilities in development; safety and operational performance remain subject to validation.</p>
      </Slide>

      <Slide number={7} label="Models & data">
        <Title number={7}>Built for the partner’s<br />aircraft and sensors</Title>
        <p className={styles.lead}>Actprove combines model development with the datasets and evaluation workflows needed to support integration.</p>
        <ol className={styles.processList}>
          <li><span>01</span><div><h3>Collect &amp; curate</h3><p>Organize sensor observations into training and evaluation datasets.</p></div></li>
          <li><span>02</span><div><h3>Develop &amp; integrate</h3><p>Build custom perception models around partner hardware and sensor inputs.</p></div></li>
          <li><span>03</span><div><h3>Evaluate &amp; improve</h3><p>Review results, identify limitations, and guide the next development cycle.</p></div></li>
        </ol>
      </Slide>

      <Slide number={8} label="Partnerships">
        <Title number={8}>Working with aircraft<br />and innovation partners</Title>
        <div className={styles.partnerRows}>
          <article><div><h3>BRAVE1</h3><span className={styles.status}>Confirmed partnership</span></div><p>A partnership with Ukraine’s defence technology cluster, connecting Actprove with the country’s defence innovation ecosystem.</p></article>
          <article><div><h3>Savlo Dynamics</h3><span className={styles.status}>Active integration partnership</span></div><p>Developing onboard perception for a high-speed drone program, with ACT-1 and PROVE-1 connecting aircraft and ground systems.</p></article>
        </div>
        <p className={styles.sourceNote}>BRAVE1 background: Ukraine’s Ministry of Defence was among the institutions that launched the cluster in 2023. Mykhailo Fedorov participated as Minister of Digital Transformation. <a href={braveLaunch} target="_blank" rel="noreferrer">Official launch announcement ↗</a></p>
      </Slide>

      <Slide number={9} label="Product roadmap">
        <Title number={9}>A broader sensing<br />and autonomy roadmap</Title>
        <div className={styles.roadmapTable} role="table" aria-label="Future Actprove products">
          <div className={styles.tableHead} role="row"><span role="columnheader">Product</span><span role="columnheader">Development direction</span><span role="columnheader">Stage</span></div>
          <div role="row"><h3 role="cell">ARCA-1</h3><p role="cell">Wide-area drone detection using radar and cameras. Proposed 3–6 metre system, with a 50 km detection-range design goal.</p><span role="cell">Planned</span></div>
          <div role="row"><h3 role="cell">DETECT-1</h3><p role="cell">Perception for long-range drones, identifying objects of interest and surfacing changes in the environment.</p><span role="cell">Planned</span></div>
          <div role="row"><h3 role="cell">ERA-1</h3><p role="cell">Research into fighter-aircraft flight management, object classification, and civilian-risk awareness with human authorization.</p><span role="cell">Research</span></div>
        </div>
        <p className={styles.note}>Roadmap goals are not deployed capabilities. ARCA-1’s proposed range has not been validated.</p>
      </Slide>

      <Slide number={10} label="Validation milestone" className={styles.milestone}>
        <div className={styles.milestoneTop}><h2 id="slide-title-10">Q1 2027</h2><span className={styles.status}>Planned</span></div>
        <p className={styles.milestoneTitle}>First testing in actual<br />combat conditions in Ukraine</p>
        <div className={styles.timeline}>
          <div><span className={styles.label}>NOW</span><h3>Development &amp; integration</h3><p>Advance ACT-1 and PROVE-1 with partner hardware and perception models.</p></div>
          <div><span className={styles.label}>Q1 2027 — TARGET</span><h3>First combat testing</h3><p>Begin planned testing in Ukraine to evaluate the systems in their intended environment.</p></div>
          <div><span className={styles.label}>FOLLOWING TESTS</span><h3>Evaluation &amp; iteration</h3><p>Review findings with partners and define the next integration milestones.</p></div>
        </div>
        <p className={styles.note}>Timing is a development target, dependent on readiness and partner coordination.</p>
      </Slide>

      <Slide number={11} label="Leadership & expansion">
        <Title number={11}>Leadership and<br />our planned U.S. presence</Title>
        <div className={styles.leadership}>
          <article><span className={styles.label}>CHIEF EXECUTIVE OFFICER</span><h3>Zakhar<br />Bernyk</h3><p>Actprove Defense Technologies</p></article>
          <article><span className={styles.label}>PLANNED OFFICE</span><h3>Atlanta,<br />Georgia</h3><p>A planned U.S. office to support partner relationships, business development, and team growth.</p></article>
        </div>
      </Slide>

      <Slide number={12} label="The investment round" className={styles.round}>
        <Title number={12}>Financing the next<br />stage of development</Title>
        <div className={styles.roundTerms}>
          <div><strong>$1.5M</strong><span>Raising · USD</span></div>
          <div><strong>$20M</strong><span>Post-money valuation · USD</span></div>
        </div>
        <p className={styles.roundPurpose}>Funding priorities: ACT-1 and PROVE-1 development, partner integration and testing, perception models, and the planned Atlanta office.</p>
        <div className={styles.roundContact}><p><strong>Zakhar Bernyk</strong><span>Chief Executive Officer</span></p><a href="mailto:contact@actprove.com">contact@actprove.com <span aria-hidden="true">↗</span></a></div>
      </Slide>
    </div>
  </InvestmentDeckFrame>;
}
