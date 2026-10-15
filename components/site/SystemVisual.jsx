"use client";

import { useId } from "react";
import InterceptionFilm from "./InterceptionFilm";
import VistaVisual from "./VistaVisual";
import ProveMonitor from "./ProveMonitor";
import DetectVisual from "./DetectVisual";
import ConnectionVisual from "./ConnectionVisual";
import styles from "./SystemVisual.module.css";

const names = {
  "act-1": "ACT-1 illustrative interception film",
  "prove-1": "PROVE-1 observation review software concept",
  "detect-1": "DETECT-1 abstract perception study",
  "arca-1": "ARCA-1 abstract sensing study",
  "era-1": "ERA-1 abstract equipment connection concept",
};

function Research({ kind = "era-1" }) {
  // An abstract mathematical ribbon, used only as a concept illustration.
  const project = (u, v) => {
    if (kind === "detect-1") {
      const radius = 204 + v * 72 * Math.cos(u);
      return [500 + radius * Math.cos(u), 325 + radius * .48 * Math.sin(u) - v * 105 * Math.sin(u)];
    }
    if (kind === "arca-1") {
      const latitude = v * Math.PI * .47;
      const radius = 212 * Math.cos(latitude);
      return [500 + radius * Math.cos(u), 325 + radius * .35 * Math.sin(u) - 175 * Math.sin(latitude)];
    }
    const radius = 214 + v * 78 * Math.cos(u / 2);
    const x = radius * Math.cos(u), y = radius * Math.sin(u), z = v * 100 * Math.sin(u / 2);
    return [500 + .98 * x + .25 * y, 325 + .52 * y - .9 * z];
  };
  const curve = (points) => points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  return <>
    <g fill="none" stroke="#b2b2ae" strokeWidth=".7">
      {Array.from({ length: 25 }, (_, row) => <path key={`r${row}`} d={curve(Array.from({ length: 145 }, (_, index) => project(index / 144 * Math.PI * 2, -1 + row / 12)))} opacity={.23 + Math.sin(row / 24 * Math.PI) * .47} />)}
      {Array.from({ length: 61 }, (_, column) => <path key={`c${column}`} d={curve(Array.from({ length: 21 }, (_, index) => project(column / 60 * Math.PI * 2, -1 + index / 10)))} opacity=".46" />)}
    </g>
    <g fill="none" stroke="#e3e3dd" strokeWidth="1.2" opacity=".75"><path d={curve(Array.from({ length: 181 }, (_, index) => project(index / 180 * Math.PI * 2, 1)))} /><path d={curve(Array.from({ length: 181 }, (_, index) => project(index / 180 * Math.PI * 2, -1)))} /></g>
    <path d="M165 325h92m489 0h93M500 94v50m0 360v51" stroke="#797976" opacity=".55" />
    <circle cx="500" cy="325" r="4" fill="none" stroke="#bebeb9" strokeWidth=".7" /><circle cx="500" cy="325" r="223" fill="none" stroke="#6d6d6a" strokeDasharray="1 10" opacity=".6" />
    <text x="167" y="579" className={styles.screenMicro}>{kind === "detect-1" ? "PERCEPTION / CONTEXT" : kind === "arca-1" ? "SENSING / CONNECTION" : "EQUIPMENT / CONNECTION"}</text><text x="835" y="579" textAnchor="end" className={styles.screenMicro}>CONCEPT STUDY</text>
  </>;
}

/** Distinct original illustrations. The geometry describes concepts, not hardware specifications. */
export default function SystemVisual({ type = "act-1", compact = false, className = "" }) {
  const id = `system-${useId().replace(/:/g, "")}-`;
  const kind = type.toLowerCase();
  if (kind === "act-1") return <InterceptionFilm className={className} />;
  if (kind === "vista-1") return <VistaVisual compact={compact} className={className} />;
  if (kind === "prove-1") return <ProveMonitor compact={compact} className={className} />;
  if (kind === "detect-1") return <DetectVisual className={className} />;
  if (kind === "era-1" || kind === "arca-1") return <ConnectionVisual type={kind} compact={compact} className={className} />;
  const Illustration = Research;
  return <div className={`${styles.visual} ${compact ? styles.compact : ""} ${className}`} data-system={kind}>
    <svg viewBox="0 0 1000 650" role="img" aria-label={names[kind] || names["act-1"]} preserveAspectRatio="xMidYMid meet"><Illustration id={id} kind={kind} /></svg>
    <span className={styles.artLabel}>ACTPROVE / {kind.toUpperCase()}</span><span className={styles.conceptLabel}>{kind === "prove-1" ? "PRODUCT ILLUSTRATION" : "CONCEPT STUDY"}</span>
  </div>;
}
