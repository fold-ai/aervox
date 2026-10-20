// Fictional, authored records for the public website demonstration only.
export const OVERVIEW_ROUTES = [
  { id: "a", path: "M-70 556 C132 542 249 499 372 426 S628 332 778 308 S1068 250 1280 170" },
  { id: "b", path: "M146 -70 C172 80 294 147 324 265 S325 451 456 548 S613 635 627 785" },
  { id: "c", path: "M-80 175 C182 174 300 179 483 215 S798 291 970 400 S1130 530 1280 532" },
  { id: "d", path: "M929 -65 C905 78 927 176 860 261 S722 365 730 466 S930 617 1067 771" },
  { id: "e", path: "M-75 337 C133 337 168 281 274 279 S425 295 483 406 S653 568 803 581 S1088 626 1280 674" },
];
export const OVERVIEW_VEHICLES = [
  { id: "V-01", route: "a", offset: .72, duration: 112 }, { id: "V-02", route: "a", offset: .48, duration: 112 },
  { id: "V-03", route: "a", offset: .25, duration: 112 }, { id: "V-04", route: "b", offset: .24, duration: 125 },
  { id: "V-05", route: "b", offset: .62, duration: 125 }, { id: "V-06", route: "c", offset: .18, duration: 133 },
  { id: "V-07", route: "c", offset: .57, duration: 133 }, { id: "V-08", route: "c", offset: .83, duration: 133 },
  { id: "V-09", route: "d", offset: .29, duration: 118 }, { id: "V-10", route: "d", offset: .68, duration: 118 },
  { id: "V-11", route: "e", offset: .20, duration: 137 }, { id: "V-12", route: "e", offset: .70, duration: 137 },
  { id: "F-01", route: "a", offset: .32, duration: 112, friendly: true },
  { id: "F-02", route: "b", offset: .40, duration: 125, friendly: true },
  { id: "F-03", route: "e", offset: .34, duration: 137, friendly: true },
];
export const OVERVIEW_DRONES = [
  { id: "D-01", label: "Drone 01", view: "drone01", x: 383, y: 218, rx: 43, ry: 22, phase: .5 },
  { id: "D-02", label: "Drone 02", view: "drone02", x: 638, y: 502, rx: 36, ry: 25, phase: 3 },
];
export const OVERVIEW_REPORTS = [
  { id: "R-01", x: 943, y: 117, kind: "aircraft", label: "Air observation", source: "Recon / D-01", affiliation: "Opposing" },
  { id: "R-02", x: 1065, y: 216, kind: "vehicle", label: "Vehicle observation", source: "Recon / D-01", affiliation: "Opposing" },
  { id: "R-03", x: 903, y: 354, kind: "position", label: "Reported position", source: "Recon / D-02", affiliation: "Opposing" },
  { id: "R-04", x: 1030, y: 430, kind: "vehicle", label: "Vehicle observation", source: "Recon / D-02", affiliation: "Opposing" },
  { id: "R-05", x: 936, y: 513, kind: "position", label: "Reported position", source: "Recon / D-02", affiliation: "Opposing" },
  { id: "R-06", x: 1100, y: 571, kind: "vehicle", label: "Vehicle observation", source: "Recon / D-02", affiliation: "Opposing" },
  { id: "R-07", x: 868, y: 236, kind: "position", label: "Reported position", source: "Recon / D-01", affiliation: "Opposing" },
  { id: "R-08", x: 1077, y: 84, kind: "aircraft", label: "Air observation", source: "Recon / D-01", affiliation: "Opposing" },
  { id: "P-01", x: 256, y: 240, kind: "personnel", label: "VISTA personnel", source: "VISTA-1", affiliation: "Friendly" },
  { id: "P-02", x: 458, y: 325, kind: "personnel", label: "VISTA personnel", source: "VISTA-1", affiliation: "Friendly" },
  { id: "P-03", x: 575, y: 236, kind: "personnel", label: "VISTA personnel", source: "VISTA-1", affiliation: "Friendly" },
  { id: "P-04", x: 546, y: 527, kind: "personnel", label: "VISTA personnel", source: "VISTA-1", affiliation: "Friendly" },
  { id: "P-05", x: 677, y: 396, kind: "personnel", label: "VISTA personnel", source: "VISTA-1", affiliation: "Friendly" },
];
export const OVERVIEW_COUNT = OVERVIEW_VEHICLES.length + OVERVIEW_DRONES.length + OVERVIEW_REPORTS.length;
export function overviewRecord(id) {
  const report = OVERVIEW_REPORTS.find(item => item.id === id);
  if (report) return report;
  const vehicle = OVERVIEW_VEHICLES.find(item => item.id === id);
  return { id, label: vehicle?.friendly ? "Friendly vehicle" : "Vehicle track", source: vehicle?.friendly ? "ERA-1" : "Recon observation", affiliation: vehicle?.friendly ? "Friendly" : "Unclassified" };
}
