"use client";

import { useId } from "react";
import InterceptionFilm from "./InterceptionFilm";
import styles from "./SystemVisual.module.css";

const names = {
  "act-1": "ACT-1 illustrative interception film",
  "prove-1": "PROVE-1 observation review software concept",
  "detect-1": "DETECT-1 abstract perception study",
  "arca-1": "ARCA-1 abstract sensing study",
  "era-1": "ERA-1 abstract computational research surface",
};

function Software({ id }) {
  const contours = Array.from({ length: 16 }, (_, index) => <path key={index} d={`M296 ${166 + index * 20} C400 ${74 + index * 20} 426 ${253 + index * 8} 570 ${184 + index * 18} S740 ${95 + index * 27} 919 ${177 + index * 20}`} />);
  return <>
    <defs><clipPath id={`${id}map`}><rect x="294" y="153" width="584" height="344" /></clipPath><linearGradient id={`${id}screen`} x2="0" y2="1"><stop stopColor="#2a2a29" /><stop offset="1" stopColor="#171716" /></linearGradient></defs>
    <rect x="75" y="79" width="850" height="498" fill="#141414" stroke="#575755" />
    <path d="M75 124h850M271 124v453M75 528h850" stroke="#525250" strokeWidth=".8" />
    <text x="101" y="107" className={styles.softwareBrand}>PROVE—1</text><text x="891" y="106" textAnchor="end" className={styles.screenMicro}>OBSERVATION WORKSPACE</text>
    <text x="101" y="162" className={styles.screenMicro}>REVIEW</text><path d="M101 188h140" stroke="#424240" /><text x="101" y="216" className={styles.screenText}>Observations</text><text x="101" y="258" className={styles.screenMuted}>Telemetry</text><text x="101" y="300" className={styles.screenMuted}>Model review</text><path d="M101 330h140" stroke="#424240" />
    <text x="101" y="377" className={styles.screenMicro}>SELECTED FRAME</text><text x="100" y="410" className={styles.screenLarge}>03</text><path d="M101 438h79M101 450h122M101 462h97" stroke="#6f6f6c" strokeWidth="2" opacity=".6" />
    <rect x="294" y="153" width="584" height="344" fill={`url(#${id}screen)`} />
    <g clipPath={`url(#${id}map)`}>
      <g fill="none" stroke="#80807d" strokeWidth=".8" opacity=".32">{contours}</g>
      <path d="m301 221 77 39 44 18 81 54 64 29 87 63 94 44 100 74M384 148l50 103-4 45-37 61 11 101 21 53" fill="none" stroke="#989894" strokeWidth="3" opacity=".28" />
      <path d="m311 216 77 39 44 18 81 54 64 29 87 63 94 44 100 74" fill="none" stroke="#c5c5c0" strokeWidth=".7" opacity=".45" />
      <path d="m453 298 89 36 74-59 84 84" fill="none" stroke="#cdcdc8" strokeDasharray="3 6" opacity=".45" />
      <g fill="#cbcbc6"><circle cx="453" cy="298" r="3" /><circle cx="616" cy="275" r="3" /></g>
      <circle cx="542" cy="334" r="5" fill="#e7e7e1" /><circle cx="542" cy="334" r="15" fill="none" stroke="#e7e7e1" strokeWidth=".7" />
      <path d="M525 317v-9h9m17 0h9v9m0 34v9h-9m-17 0h-9v-9" fill="none" stroke="#e7e7e1" />
      <path d="M568 334h63l21-22" stroke="#cfcfca" strokeWidth=".7" fill="none" /><rect x="646" y="270" width="174" height="43" fill="#141414e6" stroke="#a1a19d" strokeWidth=".6" /><text x="662" y="296" className={styles.screenMicro}>OBSERVATION / 03</text>
      <path d="M313 477h50M313 472v10m50-10v10" stroke="#a1a19d" strokeWidth=".7" />
    </g>
    <text x="101" y="554" className={styles.screenMicro}>REVIEW SESSION</text><path d="M297 551h487" stroke="#626260" /><path d="M298 551h177" stroke="#dbdbd6" strokeWidth="2" /><circle cx="475" cy="551" r="4" fill="#dbdbd6" /><text x="871" y="555" textAnchor="end" className={styles.screenMicro}>FRAME 03</text>
    <path d="M54 72v-12h30m840 0h21v20M55 571v23h30m839 0h21v-23" fill="none" stroke="#7f7f7c" opacity=".35" />
  </>;
}

function Research({ kind = "era-1" }) {
  // An abstract mathematical ribbon, used only as a research illustration.
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
    <text x="167" y="579" className={styles.screenMicro}>{kind === "detect-1" ? "PERCEPTION / CONTEXT" : kind === "arca-1" ? "SENSING / CONNECTION" : "FORM / CONTEXT / INQUIRY"}</text><text x="835" y="579" textAnchor="end" className={styles.screenMicro}>{kind === "era-1" ? "OPEN RESEARCH" : "CONCEPT STUDY"}</text>
  </>;
}

/** Distinct original illustrations. The geometry describes concepts, not hardware specifications. */
export default function SystemVisual({ type = "act-1", compact = false, className = "" }) {
  const id = `system-${useId().replace(/:/g, "")}-`;
  const kind = type.toLowerCase();
  if (kind === "act-1") return <InterceptionFilm className={className} />;
  const Illustration = kind === "prove-1" ? Software : Research;
  return <div className={`${styles.visual} ${compact ? styles.compact : ""} ${className}`} data-system={kind}>
    <svg viewBox="0 0 1000 650" role="img" aria-label={names[kind] || names["act-1"]} preserveAspectRatio="xMidYMid meet"><Illustration id={id} kind={kind} /></svg>
    <span className={styles.artLabel}>ACTPROVE / {kind.toUpperCase()}</span><span className={styles.conceptLabel}>{kind === "prove-1" ? "PRODUCT ILLUSTRATION" : kind === "era-1" ? "RESEARCH STUDY" : "CONCEPT STUDY"}</span>
  </div>;
}
