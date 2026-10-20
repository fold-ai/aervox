// Authored fictional records for the public website. No live or geographic data.
export const OVERVIEW_CAMERA_ASSETS = [
  { id: "A-01", label: "Tracked armor", kind: "armor", color: "#858a85" },
  { id: "A-02", label: "Armored carrier", kind: "carrier", color: "#7b827d" },
  { id: "A-03", label: "Tracked armor", kind: "armor", color: "#92958a" },
];
export const OVERVIEW_DRONES = [
  { id: "D-01", label: "Drone 01", view: "drone01", x: 383, y: 218, rx: 43, ry: 22, phase: .5 },
  { id: "D-02", label: "Drone 02", view: "drone02", x: 638, y: 502, rx: 36, ry: 25, phase: 3 },
];
export const OVERVIEW_ASSETS = [
  { id: "A-01", x: 327, y: 322, heading: -28, kind: "armor", label: "Tracked armor", source: "ERA-1", affiliation: "Friendly" },
  { id: "A-02", x: 459, y: 393, heading: 22, kind: "carrier", label: "Armored carrier", source: "ERA-1", affiliation: "Friendly" },
  { id: "A-03", x: 533, y: 479, heading: -15, kind: "armor", label: "Tracked armor", source: "ERA-1", affiliation: "Friendly" },
  { id: "A-04", x: 208, y: 464, heading: -40, kind: "carrier", label: "Armored carrier", source: "ERA-1", affiliation: "Friendly" },
  { id: "A-05", x: 535, y: 157, heading: 18, kind: "armor", label: "Tracked armor", source: "ERA-1", affiliation: "Friendly" },
  { id: "A-06", x: 294, y: 568, heading: -12, kind: "carrier", label: "Armored carrier", source: "ERA-1", affiliation: "Friendly" },
  { id: "F-01", x: 596, y: 277, kind: "position", label: "Fortified position", source: "PROVE-1 / report", affiliation: "Friendly" },
  { id: "F-02", x: 666, y: 427, kind: "position", label: "Fortified position", source: "PROVE-1 / report", affiliation: "Friendly" },
  { id: "F-03", x: 615, y: 589, kind: "position", label: "Field position", source: "PROVE-1 / report", affiliation: "Friendly" },
  { id: "P-01", x: 256, y: 240, kind: "personnel", label: "VISTA personnel", source: "VISTA-1", affiliation: "Friendly" },
  { id: "P-02", x: 458, y: 325, kind: "personnel", label: "VISTA personnel", source: "VISTA-1", affiliation: "Friendly" },
  { id: "P-03", x: 575, y: 236, kind: "personnel", label: "VISTA personnel", source: "VISTA-1", affiliation: "Friendly" },
  { id: "P-04", x: 546, y: 527, kind: "personnel", label: "VISTA personnel", source: "VISTA-1", affiliation: "Friendly" },
  { id: "P-05", x: 677, y: 356, kind: "personnel", label: "VISTA personnel", source: "VISTA-1", affiliation: "Friendly" },
  { id: "R-01", x: 943, y: 117, kind: "aircraft", label: "Air observation", source: "Recon / D-01", affiliation: "Opposing" },
  { id: "R-02", x: 1077, y: 84, kind: "aircraft", label: "Air observation", source: "Recon / D-01", affiliation: "Opposing" },
  { id: "R-03", x: 903, y: 354, heading: 32, kind: "armor", label: "Tracked armor", source: "Recon / D-02", affiliation: "Opposing" },
  { id: "R-04", x: 1030, y: 430, heading: -25, kind: "armor", label: "Tracked armor", source: "Recon / D-02", affiliation: "Opposing" },
  { id: "R-05", x: 1065, y: 216, heading: -5, kind: "armor", label: "Tracked armor", source: "Recon / D-01", affiliation: "Opposing" },
  { id: "R-06", x: 1100, y: 571, heading: 24, kind: "carrier", label: "Armored carrier", source: "Recon / D-02", affiliation: "Opposing" },
  { id: "R-07", x: 989, y: 295, heading: -12, kind: "carrier", label: "Armored carrier", source: "Recon / D-01", affiliation: "Opposing" },
  { id: "R-08", x: 868, y: 236, kind: "position", label: "Reported position", source: "Recon / D-01", affiliation: "Opposing" },
  { id: "R-09", x: 936, y: 513, kind: "position", label: "Fortified position", source: "Recon / D-02", affiliation: "Opposing" },
  { id: "R-10", x: 877, y: 601, kind: "position", label: "Field position", source: "Recon / D-02", affiliation: "Opposing" },
  { id: "R-11", x: 994, y: 622, kind: "position", label: "Reported position", source: "Recon / D-02", affiliation: "Opposing" },
  { id: "R-12", x: 874, y: 165, kind: "position", label: "Reported position", source: "Recon / D-01", affiliation: "Opposing" },
  { id: "O-01", x: 728, y: 191, kind: "position", label: "Unconfirmed observation", source: "Recon / review", affiliation: "Unconfirmed" },
  { id: "O-02", x: 742, y: 552, kind: "position", label: "Unconfirmed observation", source: "Recon / review", affiliation: "Unconfirmed" },
];
export const OVERVIEW_COUNT = OVERVIEW_ASSETS.length + OVERVIEW_DRONES.length;
export function overviewRecord(id) {
  return OVERVIEW_ASSETS.find(item => item.id === id) || { id, label: "Observation", source: "PROVE-1", affiliation: "Unconfirmed" };
}
