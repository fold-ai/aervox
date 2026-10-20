// Enclosure renderings supplied in ERA1_ALL_RENDERS_R05. No validated sensor specifications are inferred.
const moduleViews = ["exterior", "rear"];

export const eraViewLabels = {
  exterior: "Exterior",
  rear: "Rear",
};

export const eraModules = [
  {
    id: "era-1", name: "ERA-1", label: "Main module", revision: "R05",
    description: "The main adapter enclosure for bringing equipment data and additional sensor inputs into the planned PROVE-1 workflow.",
    dimensions: "288 × 214.5 × 147.65 mm", views: moduleViews,
  },
  {
    id: "era-1-mini", name: "ERA-1 mini", label: "Compact module", revision: "R03",
    description: "A smaller enclosure option for installations with less available space. The compact format follows the same equipment-integration direction, with its own interface layout.",
    dimensions: "236 × 178.6 × 126.65 mm", views: moduleViews,
  },
];

export const eraSensors = [
  { id: "eo", name: "EO camera", label: "Visible light", description: "A visible-light camera module concept for adding an external view to the equipment integration." },
  { id: "thermal", name: "Thermal camera", label: "Thermal imaging", description: "A separate enclosure concept for a thermal camera input, alongside the equipment's available status data." },
  { id: "eo-ir", name: "EO/IR module", label: "Dual camera", description: "Visible-light and thermal camera concepts brought together in one housing. Each input remains a distinct sensor channel." },
  { id: "quad", name: "QUAD camera module", label: "Four camera positions", description: "Four independent camera positions in one module. The concept does not imply a stitched panoramic image." },
  { id: "low-profile", name: "Low-profile camera", label: "Reduced-height housing", description: "A lower camera enclosure for exploring installations where mounting height is constrained." },
  { id: "lidar", name: "LiDAR module", label: "Spatial sensing", description: "A LiDAR sensor and mounting concept for exploring spatial measurements alongside camera inputs." },
];

export function eraRenderPath(id, view) {
  return `/media/era-hardware/${id}-${view}.webp`;
}
