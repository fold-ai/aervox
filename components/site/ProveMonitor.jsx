"use client";

import { useId, useState } from "react";
import styles from "./ProveMonitor.module.css";

// Authored demonstration data. These are not real locations or equipment feeds.
const assets = [
  { id: "A-01", name: "Aircraft 01", type: "Aircraft", source: "ACT-1", x: 457, y: 277, state: "Connected" },
  { id: "A-02", name: "Aircraft 02", type: "Aircraft", source: "ACT-1", x: 566, y: 174, state: "Connected" },
  { id: "G-01", name: "Ground unit 01", type: "Vehicle", source: "ERA-1", x: 497, y: 388, state: "Connected" },
  { id: "G-02", name: "Ground unit 02", type: "Vehicle", source: "ERA-1", x: 602, y: 336, state: "Connected" },
  { id: "S-01", name: "Sensor station", type: "Sensor", source: "ARCA-1", x: 369, y: 326, state: "Connected" },
  { id: "E-01", name: "Equipment 01", type: "Equipment", source: "ERA-1", x: 651, y: 216, state: "Review" },
];
const islands = [
  "M399 367 418 350 416 321 435 313 443 281 463 273 479 290 472 317 489 331 521 316 551 318 559 300 581 306 590 329 611 339 615 364 596 378 583 401 556 404 542 426 514 420 490 439 461 432 451 417 426 425 410 406 391 401Z",
  "M525 73 551 62 564 81 587 86 596 110 618 120 623 141 651 149 668 179 657 202 670 222 650 244 627 235 615 216 598 218 589 196 569 189 560 167 540 155 543 134 523 114Z",
  "M305 291 325 280 343 289 346 306 365 315 377 338 363 356 344 349 332 331 312 327Z",
  "M672 388 689 376 707 386 710 405 700 419 677 416 663 400Z",
  "M157 61 191 67 211 91 230 89 242 110 227 132 236 151 217 169 191 153 171 157 156 135 129 126 119 99 134 79Z",
];

// Slightly irregular, curved shorelines keep the fictional map legible at small sizes.
const coastlines = islands.map((outline, island) => {
  const values = outline.match(/-?\d+/g).map(Number);
  const vertices = Array.from({ length: values.length / 2 }, (_, i) => [values[i * 2], values[i * 2 + 1]]);
  const points = vertices.flatMap(([x, y], i) => {
    const [nx, ny] = vertices[(i + 1) % vertices.length];
    const length = Math.hypot(nx - x, ny - y);
    return Array.from({ length: 4 }, (_, step) => {
      const t = step / 4;
      const offset = step ? Math.sin(i * 7.3 + step * 4.1 + island) * 2.4 : 0;
      return [x + (nx - x) * t - (ny - y) / length * offset, y + (ny - y) * t + (nx - x) / length * offset];
    });
  });
  const midpoint = (a, b) => `${((a[0] + b[0]) / 2).toFixed(2)} ${((a[1] + b[1]) / 2).toFixed(2)}`;
  return `M${midpoint(points[points.length - 1], points[0])}` + points.map((point, i) => `Q${point[0].toFixed(2)} ${point[1].toFixed(2)} ${midpoint(point, points[(i + 1) % points.length])}`).join(" ") + "Z";
});

function AssetSymbol({ type, ...props }) {
  return <g {...props}>{type === "Aircraft" ? <path d="m0-8 3 6 8 5-1 2-8-2-2 4-2-4-8 2-1-2 8-5Z" fill="currentColor" /> : type === "Sensor" ? <><path d="m0-7 7 7-7 7-7-7Z" fill="none" stroke="currentColor" /><circle r="2" fill="currentColor" /></> : <><rect x="-6" y="-4" width="12" height="8" fill="none" stroke="currentColor" /><path d="M-3-2v4M3-2v4" stroke="currentColor" /></>}</g>;
}

function Interface({ id, mode }) {
  const selected = assets[0];
  return <svg viewBox="0 0 1000 620" preserveAspectRatio="none" role="img" aria-labelledby={`${id}-title ${id}-desc`} className={styles.interface}>
    <title id={`${id}-title`}>{`PROVE-1 connected equipment workspace, ${mode} view`}</title>
    <desc id={`${id}-desc`}>A dark map-led interface with six illustrative aircraft, vehicles and sensor nodes, an equipment panel, compact edge tools and an event timeline. Displayed on a rugged field monitor concept.</desc>
    <defs>
      <clipPath id={`${id}-map`}><rect x="43" y="76" width="721" height="469" /></clipPath>
      <clipPath id={`${id}-land`}>{coastlines.map((d, i) => <path d={d} key={i} />)}</clipPath>
      <pattern id={`${id}-grid`} width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="#cbd5d6" strokeOpacity=".055" /></pattern>
      <radialGradient id={`${id}-sea`}><stop stopColor="#253138" /><stop offset="1" stopColor="#172026" /></radialGradient>
      <filter id={`${id}-gray`}><feColorMatrix type="saturate" values="0" /></filter>
    </defs>
    <rect width="1000" height="620" fill="#111517" />
    <path d="M0 40h1000M0 76h1000M43 76v469M764 76v469M0 545h1000M0 583h1000" stroke="#343b3f" />
    <path d="m18 26 10-13 10 13-10-5Z" fill="#eceeea" />
    <text x="49" y="28" className={styles.brand}>PROVE-1</text>
    <text x="163" y="26" className={styles.micro}>ACTPROVE / CONNECTED OPERATIONS</text>
    <circle cx="854" cy="22" r="3" fill="#c9d6be" /><text x="867" y="26" className={styles.micro}>DEMO SESSION</text>
    <text x="19" y="63" className={styles.small}>Workspace</text><text x="111" y="63" className={styles.dim}>/</text><text x="131" y="63" className={styles.small}>Coastal overview</text>
    <text x="742" y="62" textAnchor="end" className={styles.micro}>06 ASSETS</text>
    <text x="784" y="62" className={styles.micro}>{mode === "Activity" ? "EVENT LOG" : mode === "Equipment" ? "EQUIPMENT" : "ASSET DETAILS"}</text>
    <g clipPath={`url(#${id}-map)`}>
      <rect x="43" y="76" width="721" height="469" fill={`url(#${id}-sea)`} />
      <g fill="none" stroke="#859394" strokeOpacity=".08" strokeWidth="18">{coastlines.map((d, i) => <path d={d} key={i} />)}</g>
      <g fill="#56605d" stroke="#97a29c" strokeOpacity=".32">{coastlines.map((d, i) => <path d={d} key={i} />)}</g>
      <g clipPath={`url(#${id}-land)`}>
        <image href="/media/recon-terrain.webp" x="100" y="50" width="650" height="490" preserveAspectRatio="xMidYMid slice" opacity=".23" filter={`url(#${id}-gray)`} />
        <g fill="none" stroke="#aeb3aa" strokeWidth=".7" opacity=".3">{Array.from({ length: 34 }, (_, i) => <path key={i} d={`M106 ${72+i*12}C258 ${-15+i*15} 389 ${183+i*5} 484 ${76+i*12}S620 ${130+i*8} 754 ${60+i*15}`} />)}</g>
        <g fill="none" stroke="#d0d1c5" strokeWidth="1" opacity=".35"><path d="m428 398 36-35 35 25 48-41 47 18M463 363l-8-54 18-27M547 347l18-32M550 103l35 45 23 37 39 31" /></g>
        <g fill="#c0c2b5" opacity=".35">{Array.from({ length: 26 }, (_, i) => <rect key={i} x={430+(i%7)*22} y={352+Math.floor(i/7)*14} width={5+i%3} height="3" transform={`rotate(-23 ${430+(i%7)*22} ${352+Math.floor(i/7)*14})`} />)}</g>
      </g>
      <rect x="43" y="76" width="721" height="469" fill={`url(#${id}-grid)`} />
      <path d="M269 76 286 228 251 352 301 545M286 228l156-17 164 47 158-32M251 352l123 113 173 12 217-55" stroke="#b1bbc0" strokeOpacity=".21" fill="none" strokeDasharray="4 6" />
      <text x="80" y="111" className={styles.mapLabel}>SECTOR 01</text><text x="299" y="508" className={styles.mapLabel}>SOUTH CHANNEL</text><text x="636" y="116" className={styles.mapLabel}>NORTH RIDGE</text>
      <path d="m327 208 48 17 42 15 40 37 49-50 60-53" fill="none" stroke="#d1d9d9" strokeOpacity=".52" strokeDasharray="3 5" />
      <path d="m443 298 14-21 14 24" fill="#d8e0db" fillOpacity=".06" stroke="#d8e0db" strokeOpacity=".2" />
      <g className={styles.assetMarks}>{assets.map(asset => <g key={asset.id} transform={`translate(${asset.x} ${asset.y})`}>
        {asset.id === selected.id && <><circle r="24" fill="#e5ebe3" fillOpacity=".06" stroke="#ecf1ed" strokeOpacity=".32" /><path d="M-19-12v-7h7m24 0h7v7m0 24v7h-7m-24 0h-7v-7" fill="none" stroke="#eaf0e9" /></>}
        <AssetSymbol type={asset.type} style={{ color: asset.state === "Review" ? "#a7a397" : "#d7e2df" }} />
        <rect x="14" y="-20" width="42" height="15" fill="#172026" fillOpacity=".88" /><text x="19" y="-9" className={styles.assetLabel}>{asset.id}</text>
      </g>)}</g>
      <g transform="translate(729 105)" fill="none" stroke="#a2b0b1"><path d="M0 27V1m-5 9L0 0l5 10" /><text x="0" y="-7" textAnchor="middle" className={styles.micro}>N</text></g>
      <path d="M67 519h70m-70-4v8m70-8v8" stroke="#aab3b4" /><text x="67" y="507" className={styles.micro}>SCHEMATIC MAP</text>
      <text x="740" y="523" textAnchor="end" className={styles.micro}>ILLUSTRATIVE DATA</text>
    </g>
    <g stroke="#c1c7c7" fill="none" strokeWidth="1.2"><rect x="12" y="94" width="19" height="19" rx="2" /><path d="m16 108 4-9 5 8 3-5M13 138h18m-18 6h18m-18 6h18M14 174h16v15H14Zm4-5v5m8-5v5M14 221l8-9 8 9-8 9Z" /><circle cx="22" cy="506" r="8" /><path d="M18 506h8m-4-4v8" /></g>
    {mode === "Overview" ? <g>
      <text x="786" y="109" className={styles.micro}>SELECTED / A-01</text><text x="785" y="141" className={styles.heading}>Aircraft 01</text>
      <circle cx="789" cy="163" r="3" fill="#c9d6be" /><text x="800" y="167" className={styles.small}>Connected</text>
      <path d="M785 188h192" stroke="#343b3f" />
      {[["SOURCE", "ACT-1"], ["PLATFORM", "Aircraft"], ["LINK", "Available"], ["REVIEW", "Up to date"]].map(([key,value], i) => <g key={key}><text x="785" y={216+i*45} className={styles.micro}>{key}</text><text x="977" y={216+i*45} textAnchor="end" className={styles.small}>{value}</text></g>)}
      <path d="M785 373h192" stroke="#343b3f" /><text x="785" y="398" className={styles.micro}>CONNECTED THROUGH</text><text x="785" y="425" className={styles.small}>ACT-1 → PROVE-1</text>
      <text x="785" y="486" className={styles.micro}>ONE SHARED VIEW</text><text x="785" y="508" className={styles.dim}>Air. Ground. Equipment.</text>
    </g> : mode === "Equipment" ? <g>
      <text x="785" y="110" className={styles.heading}>Connected assets</text><text x="785" y="134" className={styles.micro}>AIR / GROUND / SENSORS</text>
      {assets.map((asset, i) => <g key={asset.id}><path d={`M785 ${155+i*60}h192`} stroke="#343b3f" /><AssetSymbol type={asset.type} transform={`translate(795 ${179+i*60})`} color="#d7e2df" /><text x="815" y={179+i*60} className={styles.small}>{asset.id}</text><text x="977" y={179+i*60} textAnchor="end" className={styles.micro}>{asset.source}</text><text x="815" y={197+i*60} className={styles.dim}>{asset.state}</text></g>)}
    </g> : <g>
      <text x="785" y="110" className={styles.heading}>Session activity</text><text x="785" y="134" className={styles.micro}>REVIEW / EXAMPLE EVENTS</text>
      {[["00:42", "A-01 observation", "Available for review"], ["00:35", "G-01 status", "Equipment updated"], ["00:28", "S-01 connected", "Sensor link available"], ["00:16", "E-01 equipment", "Review requested"], ["00:00", "Session opened", "Six assets in view"]].map(([time, title, detail], i) => <g key={time}><path d={`M785 ${155+i*70}h192`} stroke="#343b3f" /><text x="785" y={175+i*70} className={styles.micro}>{time}</text><text x="785" y={197+i*70} className={styles.small}>{title}</text><text x="785" y={214+i*70} className={styles.dim}>{detail}</text></g>)}
    </g>}
    <text x="18" y="569" className={styles.micro}>SESSION REVIEW</text><text x="179" y="569" className={styles.small}>00:42 / 01:00</text>
    <path d="M306 563h666" stroke="#4b5559" /><path d="M306 563h466" stroke="#d2dcd7" strokeWidth="2" />
    {Array.from({ length: 31 }, (_, i) => <path key={i} d={`M${306+i*22.2} 558v${i%5===0?12:6}`} stroke="#737d7e" />)}
    <path d="m772 551 4 5-4 5-4-5Z" fill="#e7eae5" /><path d="M772 557v20" stroke="#e7eae5" />
    <text x="18" y="606" className={styles.micro}>ACTPROVE</text><text x="125" y="606" className={styles.dim}>Connected equipment. Shared context.</text><text x="977" y="606" textAnchor="end" className={styles.micro}>PROVE-1 / INTERFACE CONCEPT</text>
  </svg>;
}

export default function ProveMonitor({ compact = false, className = "" }) {
  const id = `prove-${useId().replace(/:/g, "")}`;
  const [mode, setMode] = useState("Overview");
  const [expanded, setExpanded] = useState(false);
  return <figure className={`${styles.figure} ${compact ? styles.compact : ""} ${className}`} data-system="prove-1">
    <div className={styles.stage} data-expanded={expanded}><div className={styles.device}>
      <img className={styles.hardware} src="/media/prove-1-field-monitor.webp" alt="Graphite field monitor with protective casing and physical controls, an illustrative hardware presentation" width="1536" height="1024" loading="lazy" decoding="async" />
      <div className={styles.display}><Interface id={id} mode={mode} /></div>
    </div></div>
    <figcaption className={styles.caption}>
      <div className={styles.viewControls} role="group" aria-label="PROVE-1 interface views">{["Overview", "Equipment", "Activity"].map(view => <button type="button" key={view} aria-pressed={mode === view} onClick={() => setMode(view)}>{view}</button>)}</div>
      <button type="button" className={styles.expand} aria-pressed={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? "Show monitor" : "Inspect interface"}<span aria-hidden="true">{expanded ? "↙" : "↗"}</span></button>
    </figcaption>
  </figure>;
}
