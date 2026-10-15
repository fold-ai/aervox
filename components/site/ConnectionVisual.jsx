"use client";

import { useId, useState } from "react";
import styles from "./ConnectionVisual.module.css";

const concepts = {
  "era-1": {
    label: "EQUIPMENT INTEGRATION", title: "Different platforms. One picture.",
    steps: [
      { name: "Equipment", title: "Start with the equipment you have.", copy: "Older vehicles and standalone equipment, connected through the interfaces each platform supports." },
      { name: "ERA-1 adapter", title: "A bridge between generations.", copy: "A planned hardware adapter relays available equipment status into the Actprove platform." },
      { name: "PROVE-1", title: "Status in one shared view.", copy: "Review adapted equipment alongside connected systems in PROVE-1." },
    ],
  },
  "arca-1": {
    label: "CONNECTED SENSING", title: "Separate observations. Shared context.",
    steps: [
      { name: "Radar", title: "An observation begins.", copy: "Explore how radar observations could contribute to a wider picture of aerial activity." },
      { name: "Camera", title: "Add visual context.", copy: "Camera observations provide another perspective for operator review." },
      { name: "Shared view", title: "Bring the observations together.", copy: "A planned connection to PROVE-1 places sensor observations in a common workspace." },
    ],
  },
};

function Equipment({ x, y, vehicle = false }) {
  return <g transform={`translate(${x} ${y})`} stroke="#afb5b5" strokeWidth="1.4" fill="none" strokeLinejoin="round">
    {vehicle ? <>
      <path d="M0 29 39 9 100 28 100 55 61 77 0 57Z" fill="#252b2d" />
      <path d="m0 29 61 21 39-22M61 50v27M17 34V19L42 5l29 10 16 17M17 19l29 10 25-14M46 29v15" />
      <path d="m23 28 18 6v10l-18-6Z" fill="#626a6b" stroke="none" />
      <ellipse cx="20" cy="60" rx="8" ry="10" fill="#151a1c" /><ellipse cx="80" cy="66" rx="8" ry="10" fill="#151a1c" />
    </> : <>
      <path d="m8 20 39-20 51 18v45L59 85 8 66Z" fill="#252b2d" /><path d="m8 20 51 19 39-21M59 39v46" />
      {[0,1,2,3].map(i=><path key={i} d={`m20 ${36+i*7} 26 10`} stroke="#687173" />)}
      <path d="m71 45 16-8v15l-16 9Z" fill="#40494b" />
    </>}
  </g>;
}

function EraDiagram({ active, id }) {
  return <svg viewBox="0 0 960 460" role="img" aria-label="Concept: legacy equipment connects through an ERA-1 adapter to a shared PROVE-1 equipment view">
    <defs><linearGradient id={`${id}-module`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#717b7c" /><stop offset="1" stopColor="#343d40" /></linearGradient></defs>
    <g className={styles.guide}><path d="M55 358H905M312 70V360M632 70V360" /><path d="m55 354 4 4-4 4m850-8-4 4 4 4" /></g>
    <g opacity={active===0?1:.65}><Equipment x={104} y={118} vehicle /><Equipment x={110} y={251} />
      <text x="101" y="109" className={styles.micro}>01 / VEHICLE</text><text x="101" y="242" className={styles.micro}>02 / EQUIPMENT</text></g>
    <g fill="none" stroke={active===1?"#e0e5e2":"#657073"} strokeWidth="1.3"><path d="M218 169H270V231H371M220 300H270V231" /><path d="M565 231H677" /><circle cx="270" cy="231" r="3" fill="#c7cece" /><path d="m668 226 9 5-9 5" /></g>
    <g transform="translate(382 142)">
      <ellipse cx="91" cy="167" rx="97" ry="17" fill="#080b0c" opacity=".45" />
      <path d="m0 39 76-39 110 36-75 40Z" fill={`url(#${id}-module)`} stroke="#9da8a9" />
      <path d="m0 39 111 37v64L0 103Z" fill="#2c3538" stroke="#7f8b8d" />
      <path d="m111 76 75-40v63l-75 41Z" fill="#1c2427" stroke="#7f8b8d" />
      <path d="m15 57 79 26M15 65l79 26" stroke="#4b575a" />
      <text x="17" y="88" transform="rotate(18 17 88)" className={styles.moduleBrand}>ERA-1</text>
      <circle cx="92" cy="115" r="3" fill="#e0e5e2" />
      {[0,1,2].map(i=><path key={i} d={`m${126+i*17} ${82-i*9}v20l9-5V${77-i*9}Z`} fill="#080e11" stroke="#667276" />)}
      {active===1&&<path d="M-14 42v-17h20m178-6h18v18M-14 104v17H6m178 5h18v-17" fill="none" stroke="#e0e5e2" />}
    </g>
    <text x="471" y="105" textAnchor="middle" className={styles.micro}>HARDWARE BRIDGE</text>
    <g transform="translate(685 117)" opacity={active===2?1:.7}>
      <rect width="204" height="205" rx="2" fill="#151b1d" stroke={active===2?"#d9dfdd":"#586467"} />
      <text x="18" y="30" className={styles.brand}>PROVE-1</text><path d="M0 47H204" stroke="#343b3f" />
      {["Vehicle 01","Equipment 02","Aircraft 03"].map((name,i)=><g key={name} transform={`translate(18 ${79+i*43})`}><rect y="-7" width="6" height="6" fill={i===2?"none":"#dce1df"} stroke="#dce1df" /><text x="17" className={styles.small}>{name}</text><path d="M149-4h18" stroke="#869292" /></g>)}
    </g>
    <text x="163" y="393" textAnchor="middle" className={styles.label}>Existing equipment</text><text x="471" y="393" textAnchor="middle" className={styles.label}>ERA-1</text><text x="786" y="393" textAnchor="middle" className={styles.label}>Shared equipment view</text>
  </svg>;
}

function ArcaDiagram({ active, id }) {
  const contacts=[{x:215,y:140,label:"A-01"},{x:487,y:111,label:"A-02"},{x:555,y:270,label:"A-03"}];
  return <svg viewBox="0 0 960 460" role="img" aria-label="Illustrative ARCA-1 sensing concept with three aerial observations and a shared observation card. Geometry is not a coverage map.">
    <defs><radialGradient id={`${id}-field`}><stop stopColor="#465256" stopOpacity=".25" /><stop offset="1" stopColor="#465256" stopOpacity="0" /></radialGradient></defs>
    <ellipse cx="355" cy="240" rx="287" ry="180" fill={`url(#${id}-field)`} />
    <g fill="none" stroke="#434f53" strokeWidth="1">{[75,135,198,262].map(r=><ellipse key={r} cx="355" cy="257" rx={r} ry={r*.56} />)}<path d="M68 257h575M355 91v322" strokeDasharray="2 8" /></g>
    <path d="M355 257 146 165A262 147 0 0 1 422 115Z" fill="#a9b5b8" opacity={active===0?.12:.04} />
    <path d="M355 257 448 105 536 127Z" fill="#c8d1d1" opacity={active===1?.18:.04} />
    <g fill="none" stroke="#b2bdbf" strokeWidth="1.2" opacity={active===2?1:.5}>{contacts.map(c=><path key={c.label} d={`M355 257 ${c.x} ${c.y}`} strokeDasharray="3 7" />)}</g>
    {contacts.map((c,i)=><g key={c.label} transform={`translate(${c.x} ${c.y})`}>
      <path d="m-29 16 11-7" stroke="#6f7c80" /><path d="m-15 8 9-5" stroke="#a2afb2" />
      <path d="m0-6 6 6-6 6-6-6Z" fill="#dce3e2" />
      {((active===1&&i===1)||active===2)&&<path d="M-15-6v-9h9m12 0h9v9m0 12v9H6m-12 0h-9V6" fill="none" stroke="#e0e5e2" />}
      <text x="21" y="4" className={styles.small}>{c.label}</text>
    </g>)}
    <g transform="translate(355 257)"><circle r="23" fill="#202a2d" stroke="#a4b2b5" /><circle r="6" fill="#dce3e2" /><path d="M-7 35H7" stroke="#94a3a7" /><text y="57" textAnchor="middle" className={styles.brand}>ARCA-1</text><text y="77" textAnchor="middle" className={styles.micro}>SENSING NODE</text></g>
    <path d="M620 257h55m-8-5 8 5-8 5" fill="none" stroke="#94a3a7" />
    <g transform="translate(687 120)"><rect width="212" height="223" rx="2" fill="#151b1d" stroke="#586467" />
      <text x="18" y="29" className={styles.micro}>{active===2?"PROVE-1 / SHARED VIEW":"OBSERVATION / A-02"}</text><path d="M0 48h212" stroke="#343b3f" />
      <text x="18" y="80" className={styles.label}>{["Radar observation","Visual observation","Connected context"][active]}</text>
      <g transform="translate(18 102)" fill="none" stroke="#7c8c91"><rect width="176" height="57" fill="#20292c" /><path d="M0 39h39l12-17 12 10 14-26 13 42 12-15h74" opacity={active===0?1:.18} />{active!==0&&<><path d="M62 15v-6h10m32 0h10v6m0 28v6h-10m-32 0H62v-6" /><path d="m88 21 9 8-9 8-9-8Z" fill="#b9c5c6" /></>}</g>
      <text x="18" y="191" className={styles.micro}>ILLUSTRATIVE SENSOR INPUT</text>
    </g>
    <text x="355" y="413" textAnchor="middle" className={styles.micro}>CONCEPT GEOMETRY / NOT TO SCALE</text>
  </svg>;
}

export default function ConnectionVisual({ type, compact = false, className = "" }) {
  const [active,setActive]=useState(1);
  const id=useId().replace(/:/g,"");
  const concept=concepts[type];
  const step=concept.steps[active];
  return <figure className={`${styles.figure} ${compact ? styles.compact : ""} ${className}`} data-connection-concept={type}>
    <div className={styles.workspace}>
      <header className={styles.header}><img src="/actprove-wordmark.png" alt="Actprove" width="110" height="11" /><strong>{type.toUpperCase()}</strong><span>{concept.label}</span><small>CONCEPT STUDY</small></header>
      <div className={styles.heading}><h3>{concept.title}</h3><span>01 / SYSTEM OVERVIEW</span></div>
      <div className={styles.diagram}>{type==="era-1"?<EraDiagram active={active} id={id}/>:<ArcaDiagram active={active} id={id}/>}</div>
      <div className={styles.controls} role="group" aria-label={`${type.toUpperCase()} concept views`}>{concept.steps.map((item,i)=><button key={item.name} type="button" aria-pressed={active===i} onClick={()=>setActive(i)}><span>0{i+1}</span>{item.name}<span aria-hidden="true">↗</span></button>)}</div>
      <div className={styles.detail} aria-live="polite"><strong>{step.title}</strong><p>{step.copy}</p></div>
    </div>
    <figcaption className={styles.caption}><span>{type.toUpperCase()} / {type==="era-1"?"Equipment connection":"Shared observations"}</span><span>Illustrative concept</span></figcaption>
  </figure>;
}
