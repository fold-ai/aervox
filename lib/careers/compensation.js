// U.S. hiring bands reviewed for the early-stage hiring plan on 2026-10-17.
// Annual employee base pay and hourly contractor fees
// are distinct; equity is limited to the three explicitly approved key roles.
const annual = (min, max, equity = null) => ({ min, max, period: "year", equity });
const hourly = (min, max) => ({ min, max, period: "hour", equity: null });

export const careerCompensation = {
  "chief-technology-officer": annual(160000, 190000, [0.3, 0.5]),
  "vp-engineering": annual(160000, 200000, [0.1, 0.3]),
  "head-of-operations": annual(110000, 145000),
  "perception-lead": annual(140000, 170000),
  "senior-ml-cv-engineer": annual(130000, 165000),
  "edge-ai-inference-engineer": annual(135000, 170000),
  "embedded-flight-software-engineer": annual(110000, 150000),
  "gnc-engineer": annual(130000, 165000),
  "electronics-hardware-engineer": annual(120000, 150000),
  "ml-data-engineer": annual(90000, 120000),
  "data-labeling-vendor": hourly(18, 32),
  "ground-software-lead": annual(140000, 175000),
  "senior-backend-engineer": annual(125000, 155000),
  "frontend-3d-map-engineer": annual(105000, 140000),
  "product-ux-designer": annual(95000, 125000),
  "senior-cv-long-range": annual(140000, 175000),
  "ml-scene-understanding": annual(105000, 135000),
  "aircraft-integration-engineer": annual(110000, 145000),
  "radar-systems-lead": annual(165000, 205000),
  "rf-antenna-engineer": annual(130000, 165000),
  "radar-signal-processing-engineer": annual(115000, 155000),
  "fpga-digital-hardware-engineer": annual(135000, 175000),
  "sensor-fusion-tracking-engineer": annual(130000, 165000),
  "mechanical-engineer": annual(100000, 130000),
  "power-electronics-engineer": annual(90000, 120000),
  "antenna-array-consultant": hourly(140, 230),
  "embedded-hardware-lead": annual(140000, 175000),
  "firmware-engineer": annual(95000, 125000),
  "vehicle-equipment-interface-engineer": annual(110000, 145000),
  "comms-datalink-engineer": annual(125000, 160000),
  "ruggedization-contractor": hourly(85, 140),
  "field-ux-researcher": annual(95000, 125000),
  "mobile-embedded-ui-engineer": annual(95000, 130000),
  "industrial-designer": hourly(70, 115),
  "wearable-hardware-contractor": hourly(90, 160),
  "chief-systems-engineer": annual(155000, 185000, [0.1, 0.2]),
  "systems-engineer": annual(110000, 145000),
  "technical-program-manager": annual(110000, 145000),
  "qa-test-automation-engineer": annual(85000, 110000),
  "hil-sil-simulation-engineer": annual(115000, 150000),
  "devops-mlops-engineer": annual(120000, 155000),
  "it-security-engineer": annual(100000, 135000),
  "flight-test-lead": annual(125000, 160000),
  "uas-test-operator": annual(70000, 100000),
  "test-assembly-technician": hourly(24, 34),
  "supply-chain-production-lead": annual(105000, 140000),
  "trade-compliance-manager": annual(110000, 145000),
  "export-control-counsel": hourly(275, 550),
  "facility-security-consultant": hourly(90, 160),
  "controller-accountant": annual(90000, 125000),
  "fractional-cfo": hourly(230, 325),
  "people-operations-manager": annual(80000, 105000),
  "technical-recruiter": annual(80000, 105000),
  "corporate-counsel": hourly(230, 460),
  "head-of-bd-capture": annual(145000, 185000),
  "capture-contracts-manager": annual(105000, 140000),
  "field-applications-engineer": annual(110000, 145000),
  "proposal-writer": hourly(55, 90),
};

export function compensationForRole(slug) {
  const compensation = careerCompensation[slug];
  if (!compensation) throw new Error(`Missing compensation for career role: ${slug}`);
  return compensation;
}

export function formatCompensation(compensation) {
  const dollars = value => `$${value.toLocaleString("en-US")}`;
  return `${dollars(compensation.min)} - ${dollars(compensation.max)} USD / ${compensation.period}`;
}

export const usEmployeeBenefits = [
  { title: "Health coverage", description: "Medical, dental and vision coverage. Company contribution: 90% of employee premiums and 50% of eligible dependent premiums." },
  { title: "Time to recharge", description: "20 working days of paid vacation, 10 paid sick days and paid company holidays each year, with applicable local requirements honored." },
  { title: "Family support", description: "8 weeks of company-paid parental leave. Mental health support through our health coverage or a separate assistance program." },
  { title: "Retirement", description: "A 401(k) program with a company contribution of up to 3% of salary once the plan launches." },
  { title: "Learning and equipment", description: "Up to $1,000 per year for approved professional development. The computer, software and engineering tools needed for your role are provided." },
  { title: "Relocation and field work", description: "Up to $7,500 in approved, documented U.S. relocation expenses. Required business travel, test-site expenses and safety equipment are company-funded." },
];

export const employeeBenefitsNote = "This is our approved U.S. benefits package for eligible full-time employees. Enrollment dates, eligibility, coverage and plan availability are confirmed in the written offer and plan documents. Provider arrangements are being finalized. Relocation support requires prior approval. Visa sponsorship is considered individually.";
export const compensationNote = "The published range is our good-faith U.S. base-pay range for the stated responsibilities and experience level. Final pay depends on relevant experience, the confirmed work location and applicable requirements. Benefits and any explicitly listed equity are separate. Future-opportunity ranges describe planned roles and will be reviewed before hiring opens; they are not a promise of an immediate opening. Contract fees require an agreed scope and budget.";
