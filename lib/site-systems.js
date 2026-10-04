/** Public product descriptions: development scope, not deployed performance claims. */
export const systems = [
  {
    slug: "act-1", name: "ACT-1", number: "01", category: "Onboard intelligence", status: "In development", stage: "development",
    headline: "Perception on\nthe aircraft.",
    summary: "Onboard compute and custom perception models, developed around the aircraft and its sensor suite.",
    purposeTitle: "Understand more.\nProcess onboard.",
    purpose: [
      "ACT-1 brings computing and perception into the aircraft. Its development connects object recognition with a broader understanding of the surrounding environment, using models adapted to the platform’s sensors.",
      "Initial work focuses on interceptor drones. We develop with aircraft partners so that hardware, perception models, and integration are considered together. These capabilities are being developed and evaluated."
    ],
    capabilities: [
      { title: "Onboard processing", copy: "Bring sensor processing into the aircraft’s computing environment. Develop the perception layer alongside the hardware that carries it." },
      { title: "Object understanding", copy: "Recognize object classes and examine visible characteristics. Connect an observation with context from the surrounding scene." },
      { title: "Aircraft-specific integration", copy: "Adapt compute and custom models to the aircraft and its sensor suite, with partner testing informing each development step." }
    ],
    processTitle: "Developed with\nthe aircraft.",
    processIntro: "An integration program connects the platform, its sensors, and the way its observations will be used.",
    process: [
      { title: "Understand the platform", copy: "Review the partner’s aircraft, computing environment, and sensor inputs to define the integration work." },
      { title: "Develop the perception layer", copy: "Bring custom models and onboard processing into the platform’s development workflow." },
      { title: "Test and refine", copy: "Use collected observations and partner feedback to evaluate the implementation and guide the next iteration." }
    ],
    note: "Development includes consideration of civilian-risk awareness. Capability and performance remain subject to testing and validation.",
    related: "prove-1", relatedReason: "Connect onboard observations with ground software and operator review.",
    contactTitle: "Bring ACT-1 into\nyour program.", contactCopy: "Discuss an aircraft integration project with our team.",
    illustration: "Exploded compute assembly / product illustration"
  },
  {
    slug: "prove-1", name: "PROVE-1", number: "02", category: "Ground software", status: "In development", stage: "development",
    headline: "Context for\nthe operator.",
    summary: "A software platform for control, telemetry, observation review, and analysis of collected information.",
    purposeTitle: "The context behind\nthe observation.",
    purpose: [
      "PROVE-1 connects aircraft observations with the software used on the ground. It is being developed to bring software control, telemetry, and the review of collected information into one development workflow.",
      "The goal is to help teams understand what an aircraft observed and use that context in mission and model analysis. Testing and partner feedback guide the software as it develops."
    ],
    capabilities: [
      { title: "Control and telemetry", copy: "Bring software control and aircraft telemetry into the partner’s ground workflow, connecting the aircraft with the team reviewing its activity." },
      { title: "Observation review", copy: "Examine collected information and revisit what the aircraft observed. Preserve the context needed to interpret an observation." },
      { title: "Mission and model analysis", copy: "Support the evaluation of missions and perception models. Turn test observations into feedback for continued development." }
    ],
    processTitle: "From observations\nto development feedback.",
    processIntro: "Ground software is shaped by the aircraft it connects to and the people who use its information.",
    process: [
      { title: "Connect the workflow", copy: "Define how partner software, telemetry, and collected observations come together." },
      { title: "Build review tools", copy: "Develop the software views that help teams examine information and understand the surrounding context." },
      { title: "Evaluate with partners", copy: "Use testing and feedback to refine the control, review, and model-evaluation experience." }
    ],
    note: "PROVE-1 is in development. The interface shown here is an original product illustration, not a deployed operator system.",
    related: "act-1", relatedReason: "Start with the compute and perception layer on the aircraft.",
    contactTitle: "Connect your aircraft\nto its ground workflow.", contactCopy: "Talk with us about software integration and observation review.",
    illustration: "Observation workspace / interface concept"
  },
  {
    slug: "detect-1", name: "DETECT-1", number: "03", category: "Long-range perception", status: "Planned", stage: "planned",
    headline: "Understand the\nscene ahead.",
    summary: "Planned onboard perception for long-range aircraft, connecting object recognition with a changing environment.",
    purposeTitle: "A changing scene.\nA clearer picture.",
    purpose: [
      "DETECT-1 is a planned perception system for long-range drones, including strike aircraft. Its intended role is to recognize objects of interest, interpret changes in the surrounding scene, and surface observations for operator review.",
      "This is a product direction on our roadmap. Work would build on the perception models, aircraft integration, and evaluation workflows being developed across the Actprove platform."
    ],
    capabilities: [
      { title: "Object recognition", copy: "Planned recognition of objects of interest from onboard sensor observations, with attention to visible characteristics and scene context." },
      { title: "Scene interpretation", copy: "Explore how perception can describe changing conditions around the aircraft and help teams understand new observations." },
      { title: "Operator context", copy: "Surface relevant observations for operator review and connect them with the wider mission picture." }
    ],
    processTitle: "A roadmap shaped\nby integration.",
    processIntro: "The next steps are to define the intended platform, develop the perception workflow, and evaluate the concept.",
    process: [
      { title: "Define the aircraft context", copy: "Establish the intended aircraft and sensor suite with potential integration partners." },
      { title: "Develop and evaluate models", copy: "Explore the perception models and collected information needed to interpret the intended scenes." },
      { title: "Validate the concept", copy: "Assess the system through partner integration and testing before treating intended capabilities as demonstrated." }
    ],
    note: "DETECT-1 is planned. The illustration describes the product direction; it does not demonstrate detection coverage or operational performance.",
    related: "act-1", relatedReason: "Explore the onboard intelligence foundation currently in development.",
    contactTitle: "Shape the next\nperception system.", contactCopy: "Discuss long-range aircraft and future integration requirements.",
    illustration: "Aircraft perception / concept study"
  },
  {
    slug: "arca-1", name: "ARCA-1", number: "04", category: "Wide-area sensing", status: "Planned", stage: "planned",
    headline: "A wider view of\naerial activity.",
    summary: "A planned radar and camera system for drone detection and connected aerial observations.",
    purposeTitle: "Connect sensing\nwith understanding.",
    purpose: [
      "ARCA-1 is a planned sensing system that would bring radar and camera observations together for drone detection. The concept extends Actprove’s work from onboard perception to a wider view of aerial activity.",
      "The product direction explores how those observations could connect with aircraft and operator context. Sensor selection, integration, and validation remain part of the development work ahead."
    ],
    capabilities: [
      { title: "Radar and camera sensing", copy: "Explore a combined sensing approach that brings radar observations and camera imagery into the same system concept." },
      { title: "Drone detection", copy: "Develop and evaluate the planned use of those sensor inputs to identify aerial activity relevant to operators." },
      { title: "Connected observations", copy: "Consider how aerial observations can be shared with aircraft and ground software to support a broader picture." }
    ],
    processTitle: "A sensing concept.\nA path to validation.",
    processIntro: "ARCA-1 remains a planned program. Its proposed sensing architecture needs development and evaluation.",
    process: [
      { title: "Define the sensing architecture", copy: "Explore the radar and camera roles within the intended system concept." },
      { title: "Connect the observations", copy: "Develop how information from the sensing assembly would reach aircraft and operator workflows." },
      { title: "Evaluate the system", copy: "Test the integrated concept and validate its capabilities before making performance claims." }
    ],
    designGoal: "The existing concept brief proposes a 3–6 metre assembly and a 50 km detection-range goal. These are design goals, not validated capabilities.",
    note: "ARCA-1 is planned. Sensor geometry is illustrative; detection range and coverage have not been demonstrated.",
    related: "prove-1", relatedReason: "Explore the ground software being developed for review and analysis.",
    contactTitle: "Explore a wider\nsensing picture.", contactCopy: "Connect with our team about future sensing partnerships.",
    illustration: "Radar and camera assembly / concept study"
  },
  {
    slug: "era-1", name: "ERA-1", number: "05", category: "Autonomy research", status: "Research", stage: "research",
    headline: "Research for\nwhat comes next.",
    summary: "A long-term research direction for fighter-aircraft flight management, object understanding, and human authorization.",
    purposeTitle: "Long-term questions.\nDeliberate research.",
    purpose: [
      "ERA-1 is Actprove’s long-term research direction for autonomous fighter-aircraft flight management. It considers how object classification and an understanding of the surrounding environment could inform future systems.",
      "Civilian-risk awareness and human authorization for consequential decisions are part of that research direction. ERA-1 is a research program, with its intended capabilities still to be investigated and validated."
    ],
    capabilities: [
      { title: "Flight-management research", copy: "Investigate the questions around autonomous flight management for future fighter-aircraft systems." },
      { title: "Object and scene understanding", copy: "Explore how classification and surrounding context could inform the aircraft’s understanding of its environment." },
      { title: "Human authorization", copy: "Consider civilian-risk awareness and the role of human authorization in consequential decisions." }
    ],
    processTitle: "Investigate.\nEvaluate. Understand.",
    processIntro: "The program begins with research questions and the evidence needed to assess them.",
    process: [
      { title: "Frame the research", copy: "Define the flight-management and perception questions that the program intends to explore." },
      { title: "Examine the concepts", copy: "Study how object understanding, surrounding context, and human authorization relate to future systems." },
      { title: "Build an evidence base", copy: "Evaluate research outcomes before progressing toward validated product capabilities." }
    ],
    note: "ERA-1 is a long-term research direction. The abstract study shown here is not an aircraft design or an operational system.",
    related: "detect-1", relatedReason: "See the planned perception direction for long-range aircraft.",
    contactTitle: "Explore the\nresearch direction.", contactCopy: "Talk with us about future research and collaboration.",
    illustration: "Computational surface / abstract research study"
  }
];

export function getSystem(slug) {
  return systems.find(system => system.slug === slug);
}
