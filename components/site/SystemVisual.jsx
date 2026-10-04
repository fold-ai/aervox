"use client";

import { useId } from "react";
import styles from "./SystemVisual.module.css";

const names = {
  "act-1": "ACT-1 exploded onboard compute concept",
  "prove-1": "PROVE-1 observation review software concept",
  "detect-1": "DETECT-1 aircraft perception illustration",
  "arca-1": "ARCA-1 radar and camera assembly concept",
  "era-1": "ERA-1 abstract computational research surface",
};

function Compute({ id }) {
  const fins = Array.from({ length: 17 }, (_, index) => {
    const t = index / 18;
    const ax = 264 + t * 299, ay = 225 - t * 75;
    const bx = 473 + t * 301, by = 312 - t * 80;
    return <g key={index}><path d={`M${ax} ${ay} ${bx} ${by} ${bx} ${by - 23} ${ax} ${ay - 23}Z`} fill={index % 2 ? "#363635" : "#41413f"} /><path d={`M${ax} ${ay - 23} ${bx} ${by - 23} ${bx + 5} ${by - 25} ${ax + 5} ${ay - 25}Z`} fill="#777774" /></g>;
  });
  return <>
    <defs><linearGradient id={`${id}metal`} x1="0" y1="0" x2=".7" y2="1"><stop stopColor="#838380" /><stop offset=".4" stopColor="#5a5a58" /><stop offset="1" stopColor="#2c2c2b" /></linearGradient><linearGradient id={`${id}edge`}><stop stopColor="#262625" /><stop offset="1" stopColor="#545452" /></linearGradient><filter id={`${id}shadow`}><feGaussianBlur stdDeviation="18" /></filter></defs>
    <ellipse cx="510" cy="565" rx="268" ry="28" fill="#60605e" opacity=".2" filter={`url(#${id}shadow)`} />
    <g stroke="#767673" strokeWidth="1" strokeDasharray="3 6" opacity=".47"><path d="M280 240v233M748 255v228M471 327v241M564 173v239" /></g>
    <path d="m235 455 331-86 237 94-332 97Z" fill={`url(#${id}metal)`} />
    <path d="m235 455 236 105v21L235 477Z" fill="#2a2a29" /><path d="m471 560 332-97v23l-332 95Z" fill={`url(#${id}edge)`} />
    <path d="m258 453 303-77 212 84-302 88Z" fill="none" stroke="#989894" strokeWidth="1.2" />
    <g fill="#1c1c1b" stroke="#797976"><ellipse cx="280" cy="455" rx="7" ry="3" /><ellipse cx="559" cy="388" rx="7" ry="3" /><ellipse cx="753" cy="465" rx="7" ry="3" /><ellipse cx="474" cy="545" rx="7" ry="3" /></g>
    <g transform="matrix(1 .42 0 1 291 488)"><rect width="70" height="21" fill="#121212" /><rect x="7" y="5" width="56" height="9" fill="#676764" /><path d="M10 9h50" stroke="#151514" strokeWidth="3" /><rect x="86" y="2" width="39" height="20" fill="#151514" /><path d="M93 7h25v8H93Z" fill="#6e6e6b" /></g>
    <path d="m261 354 301-79 211 88-302 88Z" fill="#363635" stroke="#1e1e1d" strokeWidth="3" /><path d="m262 354 209 97v9l-209-94Zm209 97 302-88v10l-302 87Z" fill="#1d1d1c" />
    <g fill="none" stroke="#71716e" strokeWidth="1" opacity=".7"><path d="m300 351 137 55 248-71M322 345l127 50 219-66M344 339l117 45 190-60M306 367l44-12 132 56 64-18M352 382l50-14 92 40 69-20" /></g>
    <path d="m408 348 113-31 84 34-113 34Z" fill="#979793" stroke="#bfbfba" /><path d="m408 348 84 37v12l-84-37Zm84 37 113-34v11l-113 35Z" fill="#595957" />
    <path d="m422 347 99-27 70 29-99 29Z" fill="#494947" /><path d="m437 347 82-22 54 23-82 23Z" fill="#323231" stroke="#7f7f7c" strokeWidth=".7" />
    <g fill="#181817" stroke="#858582" strokeWidth=".7"><path d="m318 348 45-12 35 15-45 12Z" /><path d="m581 305 48-12 48 20-48 13Z" /><path d="m620 367 55-16 45 19-55 16Z" /><path d="m392 405 45-13 37 16-45 13Z" /></g>
    <g fill="#9c9c98"><path d="m282 357 21-5 25 10-21 6Z" /><path d="m691 354 21-6 23 10-21 6Z" /><path d="m544 415 22-6 19 8-22 6Z" /></g>
    <path d="m258 225 303-81 219 91-306 93Z" fill={`url(#${id}metal)`} /><path d="m258 225 216 103v13L258 240Zm216 103 306-93v14l-306 92Z" fill="#2a2a29" />
    {fins}
    <path d="m258 225 216 103 306-93" fill="none" stroke="#a4a4a0" strokeWidth="1.2" />
    <g fill="#1a1a19" stroke="#90908c"><ellipse cx="276" cy="220" rx="5" ry="2.6" /><ellipse cx="566" cy="148" rx="5" ry="2.6" /><ellipse cx="757" cy="238" rx="5" ry="2.6" /><ellipse cx="474" cy="319" rx="5" ry="2.6" /></g>
    <path d="M178 316h48l29-14M793 398h36v47M621 576h100" fill="none" stroke="#7f7f7c" strokeWidth="1" /><text x="137" y="319" className={styles.micro}>01</text><text x="840" y="402" className={styles.micro}>02</text><text x="731" y="581" className={styles.micro}>03</text>
  </>;
}

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

function Perception({ id }) {
  return <>
    <defs><linearGradient id={`${id}field`} x2="0" y2="1"><stop stopColor="#b2b2ae" stopOpacity=".15" /><stop offset="1" stopColor="#b2b2ae" stopOpacity=".65" /></linearGradient></defs>
    <path d="m159 501 207-50 225 26 259-64v135H159Z" fill={`url(#${id}field)`} />
    <g fill="none" stroke="#848481" strokeWidth=".8" opacity=".5"><path d="m154 508 209-49 230 26 260-64M154 526l209-43 230 26 260-61M197 547l47-61m69 61 45-75m64 75 35-61m73 61 27-51m101 51 17-64m108 64 4-88" /><path d="M223 149v340M778 129v324M182 190h618M182 439h618" strokeDasharray="3 8" opacity=".5" /></g>
    <path d="m510 324-155 174m155-174 245 132" fill="none" stroke="#686865" strokeWidth=".8" /><path d="m510 324 90 154" stroke="#686865" strokeWidth=".8" strokeDasharray="4 7" />
    <image href="/media/flight-drone.png" x="-26" y="51" width="1020" height="510" />
    <g fill="#3d3d3b"><circle cx="356" cy="498" r="3" /><circle cx="600" cy="478" r="3" /><circle cx="755" cy="456" r="3" /></g>
    <path d="M151 137h44m-44 0v44M815 137h35v35M153 546h44m-44 0v-35M808 546h42v-35" fill="none" stroke="#464644" strokeWidth="1" />
    <text x="153" y="114" className={styles.micro}>AIRCRAFT / SENSOR CONTEXT</text><text x="850" y="577" textAnchor="end" className={styles.micro}>CONCEPT STUDY</text>
  </>;
}

function Sensor({ id }) {
  return <>
    <defs><linearGradient id={`${id}radome`} x1="0" y1="0" x2="1" y2=".6"><stop stopColor="#babab5" /><stop offset=".25" stopColor="#969692" /><stop offset=".72" stopColor="#5c5c5a" /><stop offset="1" stopColor="#343433" /></linearGradient><linearGradient id={`${id}stand`}><stop stopColor="#6d6d6a" /><stop offset=".4" stopColor="#494947" /><stop offset=".7" stopColor="#81817e" /><stop offset="1" stopColor="#464644" /></linearGradient><radialGradient id={`${id}glass`}><stop stopColor="#7e7e7b" /><stop offset=".18" stopColor="#1c1c1b" /><stop offset=".75" stopColor="#070707" /><stop offset="1" stopColor="#454543" /></radialGradient><filter id={`${id}blur`}><feGaussianBlur stdDeviation="14" /></filter></defs>
    <ellipse cx="519" cy="568" rx="167" ry="22" fill="#40403e" opacity=".19" filter={`url(#${id}blur)`} />
    <path d="m424 533 92-37 120 37-94 43Z" fill="#81817e" /><path d="m424 533 118 43v15l-118-39Z" fill="#595957" /><path d="m542 576 94-43v17l-94 41Z" fill="#383837" />
    <path d="M470 366h81l30 171-40 18-67-22Z" fill={`url(#${id}stand)`} /><path d="m552 371 29 166-40 18 6-184" fill="#41413f" />
    <ellipse cx="519" cy="359" rx="69" ry="38" fill="#2f2f2e" /><ellipse cx="519" cy="349" rx="69" ry="36" fill="#6b6b68" />
    <g transform="rotate(-15 510 240)">
      <ellipse cx="535" cy="237" rx="129" ry="173" fill="#41413f" />
      <path d="M533 64c69 0 129 78 129 173s-60 173-129 173l-34-2V66Z" fill="#4f4f4d" />
      <ellipse cx="505" cy="236" rx="128" ry="174" fill={`url(#${id}radome)`} stroke="#8e8e8a" strokeWidth="1.2" />
      <ellipse cx="505" cy="236" rx="113" ry="158" fill="none" stroke="#bcbcb7" opacity=".45" />
      <ellipse cx="505" cy="236" rx="99" ry="143" fill="none" stroke="#4f4f4d" opacity=".65" />
      <path d="M409 166q95 31 191 0M397 205q109 32 217 0M398 245q108 32 215 0M410 284q95 30 190 0M430 321q74 24 149 0" fill="none" stroke="#353534" strokeWidth="1.1" opacity=".38" />
      <ellipse cx="495" cy="206" rx="55" ry="95" fill="#c0c0bb" opacity=".07" />
    </g>
    <path d="m598 323 50-12 62 28-52 15Z" fill="#72726f" /><path d="m598 323 60 31v68l-60-29Z" fill="#555553" /><path d="m658 354 52-15v66l-52 17Z" fill="#353534" />
    <ellipse cx="627" cy="366" rx="24" ry="28" fill="#252524" transform="rotate(-24 627 366)" /><ellipse cx="627" cy="366" rx="18" ry="22" fill={`url(#${id}glass)`} transform="rotate(-24 627 366)" /><ellipse cx="624" cy="359" rx="5" ry="7" fill="#ccccc7" opacity=".24" />
    <g fill="none" stroke="#848481" strokeWidth=".8"><path d="M308 109h49m-40 0v364m-9 0h49M690 216h80v92M715 380h55" /><path d="M317 118v344" strokeDasharray="2 7" /><path d="M360 548H288" /></g>
    <text x="289" y="510" className={styles.micro}>SENSOR ASSEMBLY</text><text x="783" y="221" className={styles.micro}>01</text><text x="784" y="385" className={styles.micro}>02</text>
  </>;
}

function Research() {
  // An abstract mathematical ribbon, used only as a research illustration.
  const project = (u, v) => {
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
    <text x="167" y="579" className={styles.screenMicro}>FORM / CONTEXT / INQUIRY</text><text x="835" y="579" textAnchor="end" className={styles.screenMicro}>OPEN RESEARCH</text>
  </>;
}

/** Distinct original illustrations. The geometry describes concepts, not hardware specifications. */
export default function SystemVisual({ type = "act-1", compact = false, className = "" }) {
  const id = `system-${useId().replace(/:/g, "")}-`;
  const kind = type.toLowerCase();
  const Illustration = { "act-1": Compute, "prove-1": Software, "detect-1": Perception, "arca-1": Sensor, "era-1": Research }[kind] || Compute;
  return <div className={`${styles.visual} ${compact ? styles.compact : ""} ${className}`} data-system={kind}>
    <svg viewBox="0 0 1000 650" role="img" aria-label={names[kind] || names["act-1"]} preserveAspectRatio="xMidYMid meet"><Illustration id={id} /></svg>
    <span className={styles.artLabel}>ACTPROVE / {kind.toUpperCase()}</span><span className={styles.conceptLabel}>PRODUCT ILLUSTRATION</span>
  </div>;
}
