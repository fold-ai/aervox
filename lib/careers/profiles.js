// Detailed role content stays on the server; the directory uses the compact role catalog.
function profile(responsibilities, expectations, outcomes, discussion) {
  return { responsibilities, expectations, outcomes, discussion };
}

export const careerProfiles = {
  "chief-technology-officer": profile([
    "Translate the company strategy into a focused technical roadmap, with ACT-1 and PROVE-1 first and explicit gates for later programs.",
    "Review architecture and implementation directly, resolve hardware/software trade-offs and establish clear technical decision owners.",
    "Set engineering standards for reproducible builds, testing, security, interface documentation and evidence-backed product claims.",
    "Recruit the first technical leads, coach engineers and make realistic build, buy and partner decisions within the available budget."
  ], [
    "Show how you personally took an integrated system from uncertain requirements to repeatable validation, including a difficult failure or architecture decision.",
    "Be comfortable contributing technically in a founder-led company before a large management structure exists. Prioritize work and explain what should wait."
  ], [
    "An architecture and resourcing plan with named risks, measurable acceptance criteria and a realistic sequence of product milestones.",
    "A working technical review rhythm that improves implementation quality and gives the founder a truthful view of readiness."
  ], "Walk us through a hardware/software program you led. What did you build yourself, what did you delegate and what evidence changed your technical direction?"),

  "vp-engineering": profile([
    "Turn product priorities into integrated delivery plans across software, electronics, mechanical work and verification.",
    "Expose dependencies, staffing gaps and long-lead components early; agree scope changes rather than hide schedule risk.",
    "Establish lightweight engineering reviews, release ownership and configuration control that a small team can maintain.",
    "Develop technical leads and coordinate handovers from prototypes to repeatable builds and partner integration."
  ], [
    "Demonstrate delivery leadership across hardware and software, with specific examples of improving reliability or predictability.",
    "Stay close enough to the engineering details to challenge estimates, resolve blocked interfaces and make resource trade-offs with the CTO."
  ], [
    "A shared delivery baseline covering owners, dependencies, verification gates and the highest program risks.",
    "A release and review process that catches integration issues before they become field-test failures."
  ], "Describe a mixed hardware/software delivery that was slipping. Which constraints did you uncover and how did your decisions change the outcome?"),

  "head-of-operations": profile([
    "Build practical operating processes for purchasing, laboratory setup, inventory, equipment access and vendor payments.",
    "Compare U.S. and Ukraine facility options with leadership, accounting for cost, staffing, logistics and specialist advice.",
    "Coordinate production planning, people operations and finance without adding approval steps that the stage does not need.",
    "Maintain operating budgets, supplier risks and continuity plans as prototypes move into controlled pilot builds."
  ], [
    "Bring evidence of establishing operations in a hardware business, including supplier or facility problems you resolved directly.",
    "Distinguish essential controls from later-stage processes and make spending decisions using clear cost and delivery information."
  ], [
    "An operating plan with transparent costs, accountable owners and a prioritized path to lab and pilot-build readiness.",
    "Reliable purchasing and inventory records that engineering and finance can use without manual reconciliation."
  ], "Tell us about an operation you built from an early stage. What did you set up first and how did you manage a serious supplier or logistics disruption?"),

  "perception-lead": profile([
    "Define ACT-1 perception interfaces, evaluation datasets and release criteria together with embedded and systems engineers.",
    "Compare candidate detection and tracking approaches on representative EO/IR data, with documented errors and uncertainty.",
    "Review model and runtime changes end to end, including camera timing, compute limitations and operator-visible outputs.",
    "Lead technical reviews, mentor contributors and turn controlled test findings into a ranked development backlog."
  ], [
    "Demonstrate ownership of a deployed perception pipeline and explain accuracy, latency and robustness trade-offs using measurements.",
    "Separate dataset performance from field evidence, investigate false positives and document where the system is not yet reliable."
  ], [
    "A reproducible perception baseline with representative evaluation slices and versioned model, sensor and runtime configuration.",
    "A reviewed improvement supported by measured results and a clear account of remaining failure modes."
  ], "Describe a perception system you shipped on real hardware. Which failure mode mattered most and how did you measure and improve it?"),

  "senior-ml-cv-engineer": profile([
    "Build reproducible training and evaluation experiments for ACT-1 using approved, traceable image and video datasets.",
    "Investigate model errors across lighting, motion and sensor conditions instead of relying only on an aggregate benchmark.",
    "Maintain dataset splits, experiment records and regression checks so reported improvements can be independently reproduced.",
    "Work with inference and data engineers to move promising models into a tested edge deployment."
  ], [
    "Explain your personal contribution to a CV project, including dataset quality, baseline selection and held-out evaluation.",
    "Write maintainable training code and communicate when a result reflects data leakage, an unrepresentative test or an unresolved limitation."
  ], [
    "An experiment that another engineer can rerun from versioned data and configuration.",
    "A model improvement accompanied by error analysis and confirmation that important regression cases remain covered."
  ], "Choose a CV experiment you owned. What was the baseline, how was the test data separated and what did the unsuccessful experiments teach you?"),

  "edge-ai-inference-engineer": profile([
    "Implement and instrument the camera-to-inference pipeline on the selected onboard compute platform.",
    "Profile memory movement, scheduling and runtime behavior under realistic sustained workloads.",
    "Evaluate model conversion and optimization changes against output correctness, latency, memory, power and temperature.",
    "Create repeatable device benchmarks, deployment packages and diagnostics that integration engineers can use."
  ], [
    "Show measured optimization work on an embedded accelerator, including the methodology and any accuracy or stability cost.",
    "Debug problems across camera drivers, Linux services and inference runtimes rather than treating the model as an isolated component."
  ], [
    "A reproducible device benchmark that identifies the actual bottleneck under sustained operation.",
    "An optimized pipeline with documented resource use, regression checks and a recovery path for runtime faults."
  ], "Describe an edge pipeline you profiled. What was slow, how did you prove the cause and what changed after your optimization?"),

  "embedded-flight-software-engineer": profile([
    "Implement documented interfaces between ACT-1 compute, sensors and the partner flight controller.",
    "Handle time synchronization, service startup, connection loss and diagnostic logging in the onboard software.",
    "Add unit, bench and simulated integration tests before changes reach an aircraft.",
    "Reproduce integration defects with hardware and flight-test colleagues, then release traceable software/configuration updates."
  ], [
    "Demonstrate embedded debugging using logs, bus traces or test equipment and explain how you isolated a fault across components.",
    "Use explicit interface contracts and review failure behavior; understand the boundary between application software and aircraft safety functions."
  ], [
    "A documented integration that can be brought up on a known hardware and software baseline.",
    "Repeatable tests for disconnects, restarts and malformed data, with useful diagnostics for the test crew."
  ], "Walk through an embedded integration you owned. How did you reproduce an intermittent fault and verify the fix before field use?"),

  "gnc-engineer": profile([
    "Translate aircraft integration needs into testable state-estimation and control-interface requirements.",
    "Maintain simulation and analysis tools to compare expected behavior with recorded test data.",
    "Review sensor timing, coordinate conventions and model assumptions with perception and flight-software engineers.",
    "Support controlled test readiness, analyze anomalies and document validated operating limits with the flight-test lead."
  ], [
    "Explain the assumptions and limitations of a dynamics or estimation model you personally validated.",
    "Use evidence from simulation and controlled trials to support changes, and raise uncertainty before it becomes an unsafe test condition."
  ], [
    "A reproducible model and analysis baseline with documented assumptions and acceptance checks.",
    "A closed-loop investigation connecting a test anomaly to a verified engineering correction."
  ], "Describe a state-estimation or control-validation problem you solved. How did you distinguish a model issue from a sensor or integration issue?"),

  "electronics-hardware-engineer": profile([
    "Own schematic, layout, BOM and manufacturing outputs for compute and sensor-interface board revisions.",
    "Plan board bring-up and measure power integrity, interface behavior and thermal performance on the bench.",
    "Work with firmware, mechanical and manufacturing partners to resolve component, enclosure and assembly constraints.",
    "Maintain revision history, test instructions and evidence for design decisions before releasing boards for pilot builds."
  ], [
    "Show a board you brought up personally and explain at least one measured fault, design revision and verification result.",
    "Make component and layout choices that consider availability, manufacturability and serviceability as well as nominal performance."
  ], [
    "A reviewable design package and bring-up checklist tied to a specific board revision.",
    "A validated board baseline with recorded measurements, known limitations and a prioritized revision plan."
  ], "Take us through a PCB from design to bring-up. What failed on the first revision and what measurements guided your correction?"),

  "ml-data-engineer": profile([
    "Build ingestion workflows for approved sensor recordings, preserving metadata, provenance and access restrictions.",
    "Define dataset versions, train/test separation and annotation handoffs with the perception team.",
    "Automate integrity checks for missing frames, broken timestamps, duplicate samples and inconsistent labels.",
    "Make evaluation datasets and experiment inputs discoverable and reproducible without copying sensitive data into uncontrolled tools."
  ], [
    "Demonstrate a reliable data pipeline with explicit failure handling and a practical approach to annotation quality.",
    "Explain how you prevent leakage across evaluation splits and trace a model result back to the exact source data."
  ], [
    "A repeatable path from an approved recording to a versioned, quality-checked dataset.",
    "A dataset audit showing provenance, split logic and actionable quality issues."
  ], "Describe a data-quality problem that affected an ML result. How did you find it and prevent the same issue in later datasets?"),

  "data-labeling-vendor": profile([
    "Agree an annotation guide, permitted data-access method and sample acceptance process before starting a batch.",
    "Label approved video and imagery consistently, preserving object identities and flagging genuinely ambiguous examples.",
    "Run reviewer checks, track disagreements and return corrections in the engineering team's agreed format.",
    "Deliver versioned batches with quality summaries, access records and a documented data-return or deletion handoff."
  ], [
    "Provide non-confidential examples of annotation quality, reviewer calibration and reliable delivery against a written specification.",
    "Identify who may access the data, where it is processed and how subcontractor access is controlled before accepting work."
  ], [
    "A calibration batch accepted against the agreed annotation guide and review criteria.",
    "A repeatable batch handoff with traceable corrections and no unresolved data-handling questions."
  ], "Describe your annotation QA process, how you measure reviewer agreement and how you handle ambiguous frames or a rejected batch."),

  "ground-software-lead": profile([
    "Define PROVE-1 service boundaries, data contracts and the connection between live observations, equipment status and review workflows.",
    "Choose a practical architecture for intermittent connectivity, access control, audit history and recoverable deployments.",
    "Work directly with interface and integration engineers to deliver complete operator workflows rather than isolated services.",
    "Review implementation, establish release and observability standards and mentor the first ground-software contributors."
  ], [
    "Show ownership of a live distributed product and explain how it behaved during disconnects, partial failures or inconsistent data.",
    "Make architecture choices appropriate to a small team, with explicit reliability targets and a plan to evolve the system."
  ], [
    "A documented end-to-end PROVE-1 workflow with stable interface contracts and clear service ownership.",
    "A deployable baseline with access checks, operational diagnostics and a tested recovery procedure."
  ], "Describe a real-time platform you designed. How did you handle stale data, permissions and recovery when part of the system failed?"),

  "senior-backend-engineer": profile([
    "Build and maintain PROVE-1 ingestion, telemetry, observation and equipment-status APIs.",
    "Define schemas and service contracts that preserve timestamps, identity and data provenance across integrations.",
    "Implement authorization, bounded resource use and reliable retry behavior for unreliable connections.",
    "Own automated tests, migrations, service instrumentation and troubleshooting from development through deployment."
  ], [
    "Demonstrate delivery and support of a backend service with measurable reliability and clear failure handling.",
    "Explain data consistency, query performance and API compatibility using decisions you made on a real system."
  ], [
    "A tested service change that remains compatible with its consumers and has a safe migration path.",
    "Useful operational telemetry and a reproducible investigation of a latency or data-integrity issue."
  ], "Tell us about a backend failure you owned in production. How did you diagnose it, recover the service and prevent a repeat?"),

  "frontend-3d-map-engineer": profile([
    "Implement PROVE-1 maps, equipment-state views, camera panels and observation review using documented backend contracts.",
    "Make live, delayed and unavailable data visually distinct so operators understand what the interface actually knows.",
    "Profile rendering and state updates on representative hardware and realistically sized datasets.",
    "Work with design and test engineers on accessible interactions, responsive layouts and repeatable UI regression checks."
  ], [
    "Show an interactive application you built and explain your own work on state management, usability and performance.",
    "Understand geospatial coordinates and streaming-data behavior, including reconnects, out-of-order updates and stale state."
  ], [
    "A usable map-to-detail workflow that communicates data age and connection status clearly.",
    "Measured rendering performance and tested behavior for loading, empty, disconnected and error states."
  ], "Describe a data-heavy interface you built. How did you keep the map responsive and prevent misleading stale or incomplete information?"),

  "product-ux-designer": profile([
    "Study operator tasks and turn research into prioritized PROVE-1 workflows, information architecture and interactive prototypes.",
    "Design clear map, video, equipment-status and review states, including uncertainty and interrupted connectivity.",
    "Maintain a restrained component system and detailed interaction specifications engineers can implement consistently.",
    "Run usability sessions with permitted participants and use observed task problems to guide iteration."
  ], [
    "Present a portfolio showing the problem, your personal decisions, research evidence and what changed after testing.",
    "Balance information density with legibility and demonstrate accessible interaction design for complex, consequential workflows."
  ], [
    "A researched operator workflow with a testable prototype and clear rationale for prioritization.",
    "A documented set of reusable components and resolved usability issues confirmed through follow-up evaluation."
  ], "Choose a complex workflow from your portfolio. What did users struggle with and what evidence showed your redesign improved it?"),
  "senior-cv-long-range": profile([
    "Establish DETECT-1 evaluation methods using representative imagery and documented sensor conditions.",
    "Compare sensor and model options with image-quality, onboard-compute and integration constraints in view.",
    "Investigate small-object errors, image instability and changes in visibility using reproducible experiments.",
    "Work with aircraft integration and PROVE-1 engineers to make observations traceable and useful for human review."
  ], [
    "Explain how optics and image formation affected a CV system you built, and distinguish measured capability from extrapolation.",
    "Turn research into maintainable software with held-out evaluation, error analysis and a realistic deployment path."
  ], [
    "A sensor/model evaluation baseline with documented assumptions and representative failure cases.",
    "A reviewed prototype improvement supported by reproducible results and an integration recommendation."
  ], "Describe a perception project where sensor quality limited the result. How did you isolate the limitation and evaluate alternatives?"),

  "ml-scene-understanding": profile([
    "Prototype scene interpretation and change-detection methods on approved, versioned imagery.",
    "Compare learned approaches with simple baselines and define evaluation criteria with the perception lead.",
    "Represent uncertainty and evidence in observation outputs intended for PROVE-1 review.",
    "Document runtime cost, dataset limitations and failure cases before recommending a model for further integration."
  ], [
    "Show an ML project with a clear question, credible baseline and reproducible evaluation rather than only a polished demonstration.",
    "Explain where a model's outputs should not be trusted and how those limitations would be communicated to a user."
  ], [
    "A repeatable experiment linking scene outputs to source frames and evaluation labels.",
    "A concise recommendation explaining measured value, resource cost and conditions that require further work."
  ], "Tell us about a segmentation, change-detection or scene-understanding project. How did you evaluate ambiguous cases and communicate uncertainty?"),

  "aircraft-integration-engineer": profile([
    "Translate partner-aircraft constraints into interface documents and practical DETECT-1 installation requirements.",
    "Coordinate mounting, mass, electrical power, cooling and data interfaces with the relevant engineering owners.",
    "Build bench integration checks and maintain a known aircraft, payload, firmware and configuration baseline.",
    "Prepare integration evidence for test-readiness reviews and turn controlled test findings into tracked corrective actions."
  ], [
    "Demonstrate hands-on payload integration and explain how you verified electrical, mechanical and software compatibility.",
    "Communicate requirements clearly to an external platform partner and resolve ambiguity before hardware reaches a test site."
  ], [
    "A partner-reviewed installation and interface package with unresolved risks made explicit.",
    "A repeatable bench acceptance procedure and a configuration record suitable for controlled flight evaluation."
  ], "Walk through a payload integration you completed. Which cross-discipline constraint caused the most difficulty and how did you verify the final installation?"),

  "radar-systems-lead": profile([
    "Translate ARCA-1 sensing needs into measurable subsystem requirements and architecture trade studies.",
    "Evaluate radar, camera and processing options against cost, integration, environmental and test constraints.",
    "Define a staged bench and field-validation program with traceable configurations and honest performance reporting.",
    "Guide RF, signal-processing, digital and mechanical contributors while coordinating observation interfaces with PROVE-1."
  ], [
    "Show technical ownership of a radar system through integration and measured validation, including assumptions that did not hold in testing.",
    "Separate analytical expectations from demonstrated results and identify the evidence needed before accepting a capability claim."
  ], [
    "A reviewed ARCA-1 architecture with documented budgets, uncertainties and a prioritized validation plan.",
    "A repeatable test baseline connecting subsystem measurements to agreed system acceptance criteria."
  ], "Describe a radar architecture trade-off you owned. Which measurements confirmed or contradicted your initial assumptions?"),

  "rf-antenna-engineer": profile([
    "Develop and compare antenna and RF subsystem concepts against the radar lead's documented requirements.",
    "Prepare simulation models, prototype hardware and calibration procedures with traceable revisions.",
    "Measure RF performance using appropriate laboratory equipment and reconcile results with simulation.",
    "Work with mechanical and digital engineers on packaging, connectors, interference and repeatable assembly."
  ], [
    "Explain a design you personally measured, including calibration uncertainty and the reasons simulation differed from the bench.",
    "Deliver engineering files and measurement records that another engineer or supplier can use without undocumented assumptions."
  ], [
    "A reviewable RF design and measurement plan tied to explicit subsystem requirements.",
    "A characterized prototype with reproducible calibration, documented discrepancies and clear next design decisions."
  ], "Describe an antenna or RF prototype you designed and tested. How did you calibrate the measurement and explain disagreement with simulation?"),

  "radar-signal-processing-engineer": profile([
    "Implement maintainable processing and analysis software for approved recorded and live sensor data.",
    "Create deterministic datasets and regression tests that expose numerical errors and inconsistent processing behavior.",
    "Profile throughput and resource use with digital-hardware and host-software engineers.",
    "Document algorithm assumptions, measurement conditions and failure cases for review by the radar systems lead."
  ], [
    "Demonstrate practical DSP work with real measurements and explain how you established a trustworthy reference implementation.",
    "Balance numerical correctness, runtime cost and maintainability; investigate unexpected outputs before tuning around them."
  ], [
    "A versioned reference pipeline with meaningful regression cases and documented numerical behavior.",
    "An evaluated implementation change with measured resource use and an explanation of remaining limitations."
  ], "Choose a signal-processing implementation you owned. How did you establish correctness and isolate a discrepancy between reference and real-time outputs?"),

  "fpga-digital-hardware-engineer": profile([
    "Develop verified FPGA interfaces for sensor acquisition, preprocessing and host-data transfer.",
    "Create simulation testbenches, interface assertions and hardware bring-up procedures before releasing a bitstream.",
    "Analyze timing closure, clock-domain crossings, resource use and data-integrity faults.",
    "Maintain reproducible toolchain versions, register documentation and configuration handoffs for software and electronics colleagues."
  ], [
    "Show an FPGA design you debugged in simulation and on hardware, with evidence of timing and interface verification.",
    "Explain reset behavior, clock boundaries and error reporting clearly enough for other engineers to integrate your design."
  ], [
    "A reproducible design build with passing verification and a documented interface contract.",
    "A bench-validated data path with timing results, resource measurements and diagnostics for data loss or corruption."
  ], "Describe a digital-hardware fault that passed initial simulation. How did you find it on the bench and strengthen verification afterward?"),

  "sensor-fusion-tracking-engineer": profile([
    "Define shared time, coordinate and observation conventions across ARCA-1 sensors and PROVE-1 interfaces.",
    "Implement and evaluate fusion and track-lifecycle software using approved recorded data and reproducible scenarios.",
    "Investigate inconsistent observations, timing errors and uncertainty propagation with sensor owners.",
    "Document when tracks are tentative, stale or unsupported and ensure those states reach downstream software."
  ], [
    "Explain a multi-sensor system you built, including calibration assumptions and how you evaluated consistency rather than only visual plausibility.",
    "Write testable estimation software and communicate limitations when observations disagree or a sensor becomes unavailable."
  ], [
    "A versioned fusion baseline with documented conventions and representative missing-data tests.",
    "A traceable investigation connecting an inconsistent track to a verified sensor, timing or software correction."
  ], "Tell us about a sensor-fusion problem you solved. How did you diagnose inconsistent measurements and verify that the combined estimate was credible?"),

  "mechanical-engineer": profile([
    "Develop ARCA-1 enclosures, supports and positioning assemblies from concept through manufactured prototypes.",
    "Use analytical checks and appropriate simulation to evaluate structural, vibration and thermal assumptions.",
    "Create drawings, tolerance decisions and supplier-ready manufacturing packages with controlled revisions.",
    "Test assembly, access for maintenance and transport practicality with electronics and field-test colleagues."
  ], [
    "Present hardware you designed and helped build, including a manufacturing or test problem that changed the design.",
    "Balance stiffness, weight, thermal behavior, cost and serviceability; verify important assumptions with physical evidence."
  ], [
    "A manufacturable prototype package with resolved interfaces, drawings and an assembly plan.",
    "A physical validation report documenting fit, relevant loads and the design changes needed before further builds."
  ], "Walk through a mechanical assembly you took from CAD to hardware. Which tolerance, manufacturing or test issue required the most judgment?"),

  "power-electronics-engineer": profile([
    "Develop ARCA-1 power distribution, wiring and protection requirements with sensor and compute owners.",
    "Design and bring up power boards and cable assemblies with traceable component and connector choices.",
    "Measure startup, steady-state and fault behavior using safe, documented bench procedures.",
    "Coordinate thermal, grounding and electromagnetic-compatibility issues with electronics and mechanical engineers."
  ], [
    "Demonstrate hands-on electrical troubleshooting and explain how measured behavior changed a power-design decision.",
    "Work methodically around batteries and external supplies, documenting protection assumptions and test limitations."
  ], [
    "A reviewed power and harness package with explicit load assumptions and a practical bring-up plan.",
    "Bench evidence covering normal operation and agreed fault cases, with corrective actions recorded."
  ], "Describe a power-system problem you diagnosed. What did you measure and how did you verify the protection or design change?"),

  "antenna-array-consultant": profile([
    "Review the proposed array requirements and identify assumptions that need independent analysis or measurement.",
    "Deliver agreed design studies, simulation files and integration recommendations with a clearly bounded scope.",
    "Review prototype and chamber results with the RF team, explaining uncertainty and design discrepancies.",
    "Transfer design knowledge and acceptance criteria so internal engineers can maintain the work after the engagement."
  ], [
    "Provide evidence of comparable delivered work and explain the exact part of each project you owned.",
    "Agree milestones, source-file delivery, review criteria and permitted data access before starting the engagement."
  ], [
    "An independent technical review with actionable findings and a prioritized validation recommendation.",
    "A complete, usable handoff of agreed models, design files and measurement interpretation."
  ], "Describe a consulting engagement where your array analysis changed the hardware plan. What did the client receive and how was acceptance agreed?"),

  "embedded-hardware-lead": profile([
    "Define ERA-1 adapter architecture for connecting older or incompatible equipment to PROVE-1.",
    "Choose compute, positioning, power and interface components against practical installation and maintenance needs.",
    "Lead schematic reviews, board bring-up and hardware/firmware integration with explicit interface boundaries.",
    "Plan staged validation on representative equipment without disrupting the platform's existing critical functions."
  ], [
    "Show ownership of an embedded product from board design to a repeatable installation and explain how compatibility risks were controlled.",
    "Make cost, availability, security and serviceability trade-offs suitable for equipment with different electrical and interface constraints."
  ], [
    "A documented adapter architecture and compatibility matrix for the first selected equipment interfaces.",
    "A bench-validated hardware baseline that reports status to PROVE-1 and records its installation limits."
  ], "Describe an embedded adapter or gateway you built for existing equipment. How did you verify compatibility and avoid interfering with its original functions?"),

  "firmware-engineer": profile([
    "Implement ERA-1 device drivers, interface parsers and status reporting against documented hardware contracts.",
    "Build reliable startup, watchdog, logging and update behavior for constrained devices.",
    "Test interrupted updates, malformed input, disconnects and resource exhaustion on the bench.",
    "Maintain reproducible firmware builds, hardware-version compatibility and clear diagnostics for integration engineers."
  ], [
    "Explain firmware you personally debugged using real hardware, including an intermittent fault or failed update.",
    "Write clear, bounded embedded code and make recovery behavior explicit rather than relying on manual resets."
  ], [
    "A versioned firmware baseline with working drivers and an automated bench-test path.",
    "Verified recovery behavior for agreed interruption cases and documentation that links firmware to supported board revisions."
  ], "Walk through a firmware reliability issue you solved. How did you reproduce it and prove that the device could recover correctly?"),

  "vehicle-equipment-interface-engineer": profile([
    "Survey permitted equipment interfaces and document signals, data ownership and integration constraints.",
    "Develop read-only status and telemetry integrations where appropriate, preserving the original system's critical behavior.",
    "Build bench adapters and diagnostic tools to validate data interpretation before installation.",
    "Maintain a compatibility matrix, installation instructions and evidence for each supported equipment revision."
  ], [
    "Demonstrate protocol or equipment integration using documented bus captures and a defensible interpretation of the signals.",
    "Work with authorized access, respect platform safety boundaries and escalate unknown electrical or functional behavior."
  ], [
    "A reviewed interface definition with verified signal interpretation and explicit unsupported cases.",
    "A repeatable installation and acceptance procedure that confirms both telemetry quality and unaffected original operation."
  ], "Tell us about an integration with equipment you did not design. How did you validate the interface and confirm that the original system remained unaffected?"),

  "comms-datalink-engineer": profile([
    "Define connectivity requirements between ERA-1 devices, local networks and PROVE-1.",
    "Evaluate available radio and network components against approved operating conditions and integration constraints.",
    "Implement secure configuration, connection monitoring and recovery behavior with software and security engineers.",
    "Measure network performance in controlled tests and document installation, configuration and troubleshooting procedures."
  ], [
    "Show a communications integration you measured in practice, including reliability problems that differed from the nominal specification.",
    "Separate transport reliability, application behavior and security requirements when diagnosing a connection failure."
  ], [
    "A tested connectivity baseline with documented configuration and useful connection-health telemetry.",
    "Repeatable measurements and a recovery plan for interrupted or degraded links."
  ], "Describe a field-network reliability problem you resolved. How did you isolate the cause and verify the improvement under representative conditions?"),

  "ruggedization-contractor": profile([
    "Translate ERA-1 installation and handling needs into an enclosure and mounting specification.",
    "Prototype seals, connectors, fasteners and service access with the hardware team.",
    "Plan agreed environmental checks and document test fixtures, conditions and observed failures.",
    "Deliver production-ready design files and assembly instructions within the contracted scope."
  ], [
    "Show protected hardware that you designed and tested, explaining which environmental claims were actually verified.",
    "Make enclosure decisions that preserve cooling, electrical integration, repair access and manufacturability."
  ], [
    "A supplier-ready enclosure package with resolved mounting and connector interfaces.",
    "Documented validation results and a clear distinction between completed checks and future qualification work."
  ], "Describe an enclosure project where environmental testing exposed a weakness. What changed and how was the revised design verified?"),

  "field-ux-researcher": profile([
    "Investigate when operators would benefit from VISTA-1 and when a wearable would add distraction or workload.",
    "Plan consent-based interviews and observation sessions with appropriate access and safety arrangements.",
    "Create and evaluate glanceable workflows using permitted prototypes and representative tasks.",
    "Translate findings into prioritized product decisions, including evidence that a proposed feature should not be built."
  ], [
    "Present research that changed a product decision, with a clear account of participants, methodology and limitations.",
    "Understand small-screen human factors and communicate findings without presenting a small research sample as universal proof."
  ], [
    "A documented set of operator needs and a ranked list of wearable use cases supported by research.",
    "A tested prototype with actionable findings on legibility, interruptions and task completion."
  ], "Describe research in a constrained or field setting. What assumption did it overturn and how did the finding change the interface or product scope?"),

  "mobile-embedded-ui-engineer": profile([
    "Build the VISTA-1 interface prototype and its authenticated data connection to PROVE-1.",
    "Implement clear states for old data, offline operation, reconnection and limited device resources.",
    "Profile startup time, rendering, connectivity and battery use on representative hardware.",
    "Work with research and hardware contributors to test small-screen interactions and maintain repeatable software builds."
  ], [
    "Show mobile or embedded UI work that ran on a real device and explain your approach to constrained resources.",
    "Own integration and error handling beyond the visible screen, including data freshness and reconnect behavior."
  ], [
    "A runnable device prototype with a complete, testable PROVE-1 data flow.",
    "Measured resource behavior and verified user-visible states for disconnects, delays and service errors."
  ], "Describe a mobile or embedded interface you delivered. How did you handle unreliable connectivity and measure its impact on responsiveness or battery use?"),

  "industrial-designer": profile([
    "Develop VISTA-1 form and attachment concepts around documented user tasks and equipment constraints.",
    "Build physical mockups to evaluate fit, glove access, movement and interference with other equipment.",
    "Coordinate display, battery, connector and enclosure packaging with engineering contributors.",
    "Deliver agreed CAD, material recommendations and prototype findings with a clear handoff to mechanical development."
  ], [
    "Show physical products and prototypes, with evidence of iteration from user feedback rather than renderings alone.",
    "Explain trade-offs between ergonomics, durability, manufacturing feasibility and access for maintenance."
  ], [
    "A selected form concept supported by physical evaluation and documented design trade-offs.",
    "A complete handoff package with resolved packaging constraints and remaining validation questions."
  ], "Choose a wearable or handheld product you designed. What did physical testing reveal that the initial CAD or rendering did not?"),

  "wearable-hardware-contractor": profile([
    "Evaluate display, compute, power and battery options for the VISTA-1 prototype against an agreed requirements brief.",
    "Build compact electronics prototypes and instrument actual power, temperature and display behavior.",
    "Coordinate electrical and mechanical interfaces with the software and industrial-design contributors.",
    "Deliver schematics, BOM, bring-up instructions and measured limitations as part of the contracted handoff."
  ], [
    "Demonstrate compact electronics you personally brought up and explain measured battery and thermal behavior.",
    "Choose components and protection approaches appropriate to a device worn on the body, with documented testing and unresolved risks."
  ], [
    "A working hardware prototype with traceable component choices and reproducible bring-up steps.",
    "A measurement report that guides display, battery and packaging decisions for the next iteration."
  ], "Describe compact battery-powered hardware you built. Which power, thermal or display constraint dominated and how did you verify the design?"),
  "chief-systems-engineer": profile([
    "Define a coherent platform architecture linking ACT-1, PROVE-1 and the planned sensing, adapter and wearable programs.",
    "Convert product needs into measurable requirements, interface contracts and staged verification plans.",
    "Lead cross-discipline trade studies, risk reviews and configuration decisions without imposing unnecessary process.",
    "Resolve integration ambiguities and maintain a truthful view of what has been demonstrated, assumed or deferred."
  ], [
    "Show system-level ownership across software and hardware, including a requirement or interface decision that prevented an integration failure.",
    "Use modeling and requirements tools to improve engineering decisions, and adapt the process to a small team building prototypes."
  ], [
    "An agreed architecture and interface baseline with owners and verification methods for critical requirements.",
    "A prioritized system-risk register and technical review process tied to actual integration evidence."
  ], "Describe a complex system you helped deliver. How did you resolve conflicting requirements and trace the final decision through verification?"),

  "systems-engineer": profile([
    "Maintain measurable requirements, interface documents and configuration baselines with product engineers.",
    "Link requirements to practical bench, simulation and field checks, including evidence and unresolved discrepancies.",
    "Support change-impact reviews so a modification in one subsystem does not silently break another.",
    "Prepare concise technical-review material and follow corrective actions through verification."
  ], [
    "Demonstrate requirements and integration work that improved a delivered system, beyond maintaining a documentation repository.",
    "Communicate across software, electronics and mechanical disciplines and recognize when a requirement cannot yet be verified."
  ], [
    "A usable requirement-to-test traceability baseline for an owned subsystem.",
    "A reviewed interface or configuration change with its affected tests and open risks recorded."
  ], "Tell us about a requirement or interface ambiguity you resolved. How did you make it testable and confirm that the implementation matched?"),

  "technical-program-manager": profile([
    "Build integrated plans that connect engineering deliverables, hardware lead times, partner commitments and test readiness.",
    "Maintain a concise view of dependencies, decisions, risks and the critical path with accountable owners.",
    "Coordinate partner meetings and internal reviews, turning discussion into specific actions and verified closure.",
    "Present scope, cost and timing alternatives when a milestone becomes unrealistic."
  ], [
    "Show a hardware/software program you coordinated and explain your direct contribution to resolving a critical dependency.",
    "Understand enough technical detail to identify incomplete handoffs and challenge a plan respectfully with evidence."
  ], [
    "An integrated program baseline that engineers and leadership can use to make decisions.",
    "A resolved cross-team dependency and transparent reporting that identifies risk before a milestone is missed."
  ], "Describe a program where a hardware dependency threatened software or test delivery. What did you change and how did you track recovery?"),

  "qa-test-automation-engineer": profile([
    "Build risk-based regression coverage for PROVE-1 workflows, APIs and agreed onboard-software interfaces.",
    "Create reproducible fixtures for streaming data, connectivity changes and hardware-dependent behavior.",
    "Investigate failures with developers and report precise reproduction steps, environment details and user impact.",
    "Integrate useful checks into CI and maintain clear release evidence without accumulating unreliable tests."
  ], [
    "Explain a test suite you maintained, including how you reduced flakiness and selected meaningful coverage.",
    "Investigate causes rather than only filing failures; communicate when a test environment cannot support a readiness claim."
  ], [
    "Repeatable checks for a critical user workflow with useful failure artifacts.",
    "A release regression report that separates product defects, test issues and uncovered risk."
  ], "Tell us about a defect your automation caught that a simple happy-path test missed. How did you keep the check reliable over time?"),

  "hil-sil-simulation-engineer": profile([
    "Develop reproducible software and hardware simulation environments for controlled integration testing.",
    "Model relevant interfaces and sensor timing with explicit assumptions and documented fidelity limits.",
    "Build automated scenarios for software regressions, connection failures and repeatable defect reproduction.",
    "Compare simulation behavior with bench and test recordings, then improve the model where evidence justifies it."
  ], [
    "Demonstrate a simulation or HIL environment that engineering teams actually used to find and resolve defects.",
    "Explain what the environment cannot validate and avoid treating simulated results as equivalent to flight evidence."
  ], [
    "A versioned test environment another engineer can reproduce from documented configuration.",
    "A validated scenario set with known fidelity limits and an example of a defect reproduced before field testing."
  ], "Describe a HIL or simulation environment you built. How did you check its realism and identify a case where it gave misleading confidence?"),

  "devops-mlops-engineer": profile([
    "Build reproducible software, firmware and model delivery paths with controlled artifacts and versioned configuration.",
    "Operate appropriately sized development and GPU infrastructure with access controls, cost visibility and useful monitoring.",
    "Implement release promotion, rollback, backup and recovery procedures for PROVE-1 and engineering services.",
    "Help engineers reproduce builds and experiments while keeping credentials and restricted data out of logs and public services."
  ], [
    "Show infrastructure you operated and explain recovery, incident handling and the cost/reliability trade-offs you made.",
    "Prefer maintainable automation a small team can support; justify additional orchestration or infrastructure complexity."
  ], [
    "A traceable build-to-release pipeline linking deployed artifacts to source and configuration.",
    "A tested recovery or rollback procedure with practical operational documentation and controlled access."
  ], "Describe an infrastructure or deployment failure you handled. How did you restore service and make builds or releases more reproducible afterward?"),

  "it-security-engineer": profile([
    "Establish device inventory, identity management, least-privilege access and secure onboarding/offboarding.",
    "Define data-handling boundaries with compliance and engineering, using tools the team can operate consistently.",
    "Implement monitoring, backup checks, incident-response procedures and practical security training.",
    "Map applicable customer or regulatory requirements to evidence and remediation plans without claiming unearned certification."
  ], [
    "Demonstrate hands-on security administration and an incident or access-control problem you resolved.",
    "Prioritize risks pragmatically and distinguish a documented policy from a control that is implemented and tested."
  ], [
    "A working identity and device-access baseline with accountable owners and an offboarding checklist.",
    "A prioritized security plan and an exercised response or recovery procedure supported by evidence."
  ], "Tell us about a security control you implemented in a growing organization. How did you verify that it worked without blocking legitimate engineering work?"),

  "flight-test-lead": profile([
    "Build a controlled test program with clear objectives, readiness gates, crew responsibilities and stop criteria.",
    "Coordinate permissions, site arrangements and aircraft/configuration readiness with the relevant authorized parties.",
    "Lead briefings, anomaly handling and debriefs while preserving accurate flight, software and instrumentation records.",
    "Turn test evidence into engineering findings and support the planned Q2 2027 Ukraine field-testing milestone."
  ], [
    "Show leadership of a documented flight-test campaign, including a decision to postpone or stop a test when readiness was inadequate.",
    "Maintain disciplined reporting and distinguish an observed event from a validated capability or operational claim."
  ], [
    "An approved test-readiness package with permissions, configuration, risk controls and measurable objectives.",
    "A complete test report linking observations and anomalies to engineering actions and the next readiness decision."
  ], "Describe a flight-test campaign you led. What caused you to change or stop a test and how did you turn the evidence into corrective action?"),

  "uas-test-operator": profile([
    "Prepare aircraft, batteries, software configuration and ground equipment using agreed checklists.",
    "Conduct only authorized test activities within the approved plan, crew roles and operating limits.",
    "Report abnormal behavior promptly and preserve logs, configuration details and observations for engineering review.",
    "Maintain flight and equipment records and support post-flight inspection and routine readiness work."
  ], [
    "Provide a clear account of recent flight experience, applicable qualifications and your personal role in test operations.",
    "Demonstrate disciplined checklist use, sound judgment and willingness to stop when conditions or equipment are unsuitable."
  ], [
    "Consistent preflight and post-flight records for a known aircraft configuration.",
    "Useful, timely test feedback and complete data handoffs that let engineers investigate observed behavior."
  ], "Tell us about an unexpected event during a flight or test. What did you do, how did you report it and what changed before the next flight?"),

  "test-assembly-technician": profile([
    "Assemble boards, harnesses, aircraft components and test fixtures from controlled drawings and work instructions.",
    "Perform incoming checks, continuity measurements and agreed bench tests, recording results against serial numbers or revisions.",
    "Identify assembly defects and ambiguous instructions, then coordinate corrections with the responsible engineer.",
    "Maintain tools, ESD practices, parts traceability and equipment readiness for lab and controlled field work."
  ], [
    "Show careful hands-on assembly and troubleshooting, including how you verify work before powering equipment.",
    "Follow documented processes, raise discrepancies and keep records that make a build repeatable for someone else."
  ], [
    "A correctly assembled and documented unit that passes its agreed acceptance checks.",
    "An improved work instruction or fixture that prevents a recurring assembly or test error."
  ], "Describe an assembly or bench-test fault you found. How did you isolate it and improve the instructions or inspection to prevent repeats?"),

  "supply-chain-production-lead": profile([
    "Create a component and supplier plan that connects prototype BOMs, pilot builds and realistic lead times.",
    "Qualify manufacturing partners, agree quality and delivery expectations and track supplier corrective actions.",
    "Maintain revision-aware purchasing, inventory and material traceability with engineering and finance.",
    "Identify availability, counterfeit, cost and logistics risks early and propose technically reviewed alternatives."
  ], [
    "Show direct sourcing or pilot-production ownership for electronics or comparable complex hardware.",
    "Use demand assumptions, supplier evidence and total cost to make decisions rather than treating an unconfirmed forecast as an order."
  ], [
    "A supplier and material readiness baseline for the next planned build with long-lead risks exposed.",
    "A traceable purchasing and build handoff with agreed acceptance criteria and clear shortage ownership."
  ], "Tell us about a constrained-component or supplier-quality problem you resolved. How did you protect the build schedule without losing configuration or quality control?"),

  "trade-compliance-manager": profile([
    "Build a practical export-compliance program with outside counsel, including classification records and authorization workflows.",
    "Review proposed transfers, demonstrations, partner access and cross-border data handling before commitments are made.",
    "Maintain screening, license-condition tracking, technology-control procedures and staff training.",
    "Document decisions and escalate uncertain cases, coordinating with recruiting, engineering, logistics and leadership."
  ], [
    "Demonstrate hands-on export-compliance work and explain how you translated a legal requirement into a usable operating process.",
    "Recognize the limits of your authority and obtain appropriate legal review instead of assuming a classification or exemption applies."
  ], [
    "A prioritized compliance work plan and auditable records for the first products, partners and planned transfers.",
    "A functioning review workflow that prevents unauthorized release while giving teams clear next steps."
  ], "Describe a complex export or data-access review you managed. How did you establish the facts, involve counsel and document the decision?"),

  "export-control-counsel": profile([
    "Advise on jurisdiction, classification and authorization questions for the company's proposed products and activities.",
    "Review cross-border technical collaboration, demonstrations, contracts and controlled-data arrangements.",
    "Provide scoped written advice, licensing support and escalation paths for uncertain or potentially non-compliant activity.",
    "Help internal owners translate advice into training, review procedures and defensible records."
  ], [
    "Hold the professional authorization required for the legal services and jurisdictions within the agreed engagement.",
    "Show relevant defense-technology matters, practical written advice and a clear approach to conflicts, scope and confidentiality."
  ], [
    "A written assessment of priority jurisdiction and licensing questions with assumptions and next actions identified.",
    "An agreed counsel/compliance review process and complete handoff of the contracted legal deliverables."
  ], "Describe a non-confidential export-control matter involving emerging hardware or software. How did you resolve uncertainty and make the advice operational?"),

  "facility-security-consultant": profile([
    "Assess facility-security requirements only when a specific future contract and sponsorship create a demonstrated need.",
    "Review readiness gaps, responsibilities and documentation with leadership and appropriate authorities.",
    "Develop a scoped implementation and training plan for the actual contract requirements.",
    "Support authorized application and review activities without implying that ACTPROVE already holds a facility clearance."
  ], [
    "Demonstrate facility-security program experience and a clear understanding of sponsorship and approval dependencies.",
    "Distinguish advisory work from responsibilities that require formal designation, eligibility or government authorization."
  ], [
    "A contract-specific readiness assessment and costed action plan if this conditional need becomes active.",
    "Accurate application and operating documentation with unresolved dependencies explicitly tracked."
  ], "Describe your role in a facility-security readiness or clearance process. Which dependencies were outside your control and how did you manage them?"),

  "controller-accountant": profile([
    "Establish accurate bookkeeping, reconciliations, payroll coordination and a predictable monthly close.",
    "Track spending against budgets and maintain evidence for hardware purchases, contractor costs and any restricted funding.",
    "Coordinate tax and statutory matters with qualified external advisers in the relevant jurisdictions.",
    "Prepare clear management reports and maintain audit-ready records appropriate to the company's size."
  ], [
    "Show hands-on ownership of a close and control process, including a material discrepancy you identified and resolved.",
    "Build practical approval and record-keeping controls while keeping cash, commitments and booked expenses clearly distinguished."
  ], [
    "Reconciled accounts and a documented close checklist with accountable review ownership.",
    "Reliable budget-versus-actual reporting and a clear record of outstanding commitments and compliance deadlines."
  ], "Describe a finance process you built or repaired. How did you reconcile the records and make the resulting reports useful to leadership?"),

  "fractional-cfo": profile([
    "Maintain a driver-based financial model covering hiring, hardware iteration, testing, facilities and working capital.",
    "Evaluate runway and financing scenarios with clear assumptions, sensitivities and milestone dependencies.",
    "Prepare management and investor reporting that reconciles forecasts with actual results and contractual evidence.",
    "Support fundraising and diligence with the founder, controller and counsel within an agreed fractional scope."
  ], [
    "Demonstrate early-stage finance leadership and explain how your advice changed a concrete capital or operating decision.",
    "Distinguish targets, non-binding partner plans, signed orders and recognized revenue in financial communication."
  ], [
    "A reconciled financial model with visible assumptions, runway scenarios and spending decision points.",
    "A concise investor-reporting and diligence package supported by traceable financial evidence."
  ], "Tell us about an early-stage company where you improved capital planning. Which assumptions mattered most and how did you test them against actual results?"),

  "people-operations-manager": profile([
    "Build consistent onboarding, employment administration and employee-record processes with qualified advisers.",
    "Coordinate payroll inputs, leave, policy communication and contractor/employee handoffs with finance and counsel.",
    "Establish practical manager support, feedback and development routines as the team grows.",
    "Protect personnel information and keep employment decisions, access needs and compliance responsibilities clearly separated."
  ], [
    "Show hands-on people operations in a growing organization, including how you resolved an administrative or employee-experience problem.",
    "Handle sensitive information with discretion and recognize when a jurisdiction-specific question needs professional legal advice."
  ], [
    "A reliable onboarding and offboarding workflow with clear records, owners and access handoffs.",
    "A concise policy and administration baseline that employees can understand and managers can apply consistently."
  ], "Describe a people process you introduced at an early-stage company. How did you make it consistent, useful and proportionate to the team's size?"),

  "technical-recruiter": profile([
    "Calibrate each search with the founder and relevant technical reviewer using written, role-specific evidence criteria.",
    "Build targeted candidate pipelines across embedded software, perception, hardware and operational specialties.",
    "Run structured screens, coordinate interviews and maintain accurate candidate communication and pipeline records.",
    "Use funnel data and candidate feedback to improve the search while representing the company's stage and terms accurately."
  ], [
    "Demonstrate full-cycle technical recruiting and explain how you evaluate relevant evidence without substituting brand names for ability.",
    "Learn unfamiliar engineering domains, challenge unrealistic requirements and maintain respectful, consistent candidate follow-up."
  ], [
    "A calibrated priority-role brief, sourcing plan and interview process with accountable reviewers.",
    "A maintained pipeline report that explains search quality, bottlenecks and specific next actions."
  ], "Describe a difficult technical search you owned. How did you calibrate the requirements and change your approach when the first pipeline was weak?"),

  "corporate-counsel": profile([
    "Advise on corporate governance, financing documentation, equity arrangements and essential company records.",
    "Draft and review commercial, confidentiality, intellectual-property and employment-related agreements within the engagement scope.",
    "Identify jurisdiction-specific issues and coordinate specialist counsel where the matter falls outside your practice.",
    "Provide concise decision-ready advice and maintain clear responsibility for open legal actions."
  ], [
    "Hold the professional authorization required for the agreed legal services and demonstrate relevant startup transaction work.",
    "Balance commercial urgency with clear risk communication, including conflicts review and an explicit engagement scope."
  ], [
    "A prioritized corporate housekeeping and contracting plan based on the company's actual records.",
    "Usable agreement templates and a clear legal-review workflow for the next financing and partner engagements."
  ], "Describe a non-confidential startup transaction or contracting matter. How did you prioritize risks and help the founder make an informed decision?"),

  "head-of-bd-capture": profile([
    "Identify a focused set of customer needs and procurement paths aligned with demonstrated ACT-1 and PROVE-1 maturity.",
    "Build partner and customer relationships with clear qualification, next steps and evidence-based opportunity records.",
    "Coordinate demonstrations, pilot proposals and capture plans with engineering, contracts and compliance owners.",
    "Translate customer feedback into product priorities without promising unvalidated capability or unapproved delivery dates."
  ], [
    "Show your personal contribution to a defense or complex hardware opportunity from initial qualification to a concrete outcome.",
    "Distinguish interest from funded demand and explain procurement, technical readiness and commercial risk candidly."
  ], [
    "A qualified, prioritized opportunity pipeline with documented customer problems and procurement steps.",
    "A credible pilot or capture plan connecting a customer need to delivery scope, evidence and commercial terms."
  ], "Walk through a customer or government opportunity you developed. What did you personally own and how did you distinguish serious demand from general interest?"),

  "capture-contracts-manager": profile([
    "Translate solicitations and customer discussions into compliance matrices, proposal plans and tracked deliverables.",
    "Coordinate technical scope, pricing inputs and contractual review with engineering, finance and counsel.",
    "Maintain obligation, milestone and change records after award or signature.",
    "Flag acceptance, data-rights, export and delivery issues early and route specialist questions to the responsible adviser."
  ], [
    "Show ownership of a proposal or contract lifecycle and explain how you identified a consequential requirement or commercial risk.",
    "Keep exact versions, approvals and evidence organized without assuming that every procurement mechanism applies to the company."
  ], [
    "A complete proposal or contract review package with requirements, owners and unresolved issues visible.",
    "An obligation tracker that connects signed commitments to delivery, acceptance and invoicing."
  ], "Describe a proposal or contract where an overlooked requirement could have changed the outcome. How did you find and resolve it?"),

  "field-applications-engineer": profile([
    "Guide partners through approved installation, interface configuration and acceptance checks for ACTPROVE products.",
    "Diagnose hardware, network and software issues using logs, measurements and controlled reproduction steps.",
    "Deliver role-appropriate operator training and clear integration documentation.",
    "Return structured field findings to engineering, distinguishing configuration errors, product defects and new requirements."
  ], [
    "Demonstrate direct customer-facing integration work and explain a technically difficult issue you resolved under practical constraints.",
    "Communicate calmly with users and engineers, keep commitments within validated capability and discuss role-specific travel requirements."
  ], [
    "A partner integration with documented configuration, acceptance evidence and clear support ownership.",
    "Actionable field feedback that leads to a verified fix, improved documentation or a prioritized product decision."
  ], "Tell us about a partner integration that did not work as expected. How did you isolate the issue, communicate with the customer and close the loop with engineering?"),

  "proposal-writer": profile([
    "Turn a solicitation or funding opportunity into a clear outline, compliance checklist and contributor plan.",
    "Interview technical and business owners and write accurate narratives supported by approved evidence.",
    "Coordinate revisions, figures, references and consistency checks against submission instructions.",
    "Deliver an organized final package with version history and a reusable record of approved source material."
  ], [
    "Provide permitted writing samples and explain your contribution, the submission constraints and how factual claims were verified.",
    "Write clearly about unfamiliar technology, meet agreed deadlines and challenge unsupported claims rather than polishing them."
  ], [
    "A compliant proposal structure with complete ownership of each required response.",
    "A submission-ready narrative that is technically accurate, internally consistent and traceable to approved evidence."
  ], "Describe a technical proposal you wrote. How did you obtain reliable inputs and resolve a gap between the desired narrative and the available evidence?"),
};
