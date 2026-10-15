"use client";

import { useId, useRef, useState } from "react";
import styles from "./ProveMonitor.module.css";

// Fictional website demonstration only. No real people, coordinates or live feeds.
const assets = [
  { id: "R-01", name: "Recon aircraft 01", type: "Aircraft", layer: "air", source: "Recon feed", side: "Friendly", x: 407, y: 225, dx: 10, dy: -5 },
  { id: "R-02", name: "Recon aircraft 02", type: "Aircraft", layer: "air", source: "Recon feed", side: "Friendly", x: 420, y: 405, dx: -6, dy: -8 },
  { id: "G-01", name: "Ground vehicle 01", type: "Vehicle", layer: "ground", source: "ERA-1", side: "Friendly", x: 236, y: 281, dx: 9, dy: 2 },
  { id: "G-02", name: "Ground vehicle 02", type: "Vehicle", layer: "ground", source: "ERA-1", side: "Friendly", x: 315, y: 425, dx: 3, dy: -5 },
  { id: "S-01", name: "Sensor station", type: "Sensor", layer: "ground", source: "ARCA-1", side: "Friendly", x: 188, y: 387 },
  { id: "V-01", name: "VISTA wearer 01", type: "Personnel", layer: "vista", source: "VISTA-1", side: "Friendly", x: 335, y: 191, dx: 2, dy: 3 },
  { id: "V-02", name: "VISTA wearer 02", type: "Personnel", layer: "vista", source: "VISTA-1", side: "Friendly", x: 369, y: 302, dx: -2, dy: 2 },
  { id: "V-03", name: "VISTA wearer 03", type: "Personnel", layer: "vista", source: "VISTA-1", side: "Friendly", x: 337, y: 345, dx: 3, dy: 0 },
  { id: "V-04", name: "VISTA wearer 04", type: "Personnel", layer: "vista", source: "VISTA-1", side: "Friendly", x: 403, y: 457, dx: -2, dy: -2 },
  { id: "O-01", name: "Observed vehicle 01", type: "Vehicle", layer: "observations", source: "Recon R-01", side: "Opposing", x: 602, y: 182 },
  { id: "O-02", name: "Observed position 02", type: "Position", layer: "observations", source: "Recon R-01", side: "Opposing", x: 571, y: 285, appears: 1 },
  { id: "O-03", name: "Observed vehicle 03", type: "Vehicle", layer: "observations", source: "Recon R-02", side: "Opposing", x: 640, y: 376, appears: 1 },
  { id: "O-04", name: "Observed position 04", type: "Position", layer: "observations", source: "Recon R-02", side: "Opposing", x: 567, y: 449, appears: 2 },
];
const layerNames = { air: "Recon aircraft", ground: "Ground equipment", vista: "VISTA personnel", observations: "Recon observations" };
const snapshots = ["00:00", "00:20", "00:40"];
const front = "M491 82C470 117 511 131 489 161S455 190 482 218 527 249 496 281 461 306 489 340 535 368 509 399 476 423 500 451 533 494 510 542";
const zone = `${front}H762V82Z`;
const events = [
  { at: 2, asset: "O-04", title: "Position observation", detail: "Recon R-02 report" },
  { at: 2, asset: "V-02", title: "Personnel update", detail: "VISTA-1 status received" },
  { at: 1, asset: "O-02", title: "New observation", detail: "Recon R-01 report" },
  { at: 1, asset: "O-03", title: "Vehicle observation", detail: "Recon R-02 report" },
  { at: 0, asset: "G-01", title: "Equipment connected", detail: "ERA-1 status available" },
];
function point(asset, frame) { return { x: asset.x + (asset.dx || 0) * frame, y: asset.y + (asset.dy || 0) * frame }; }
function SvgButton({ x, y, width = 40, height = 40, label, pressed, disabled = false, onClick, children }) {
  const activate = () => { if (!disabled) onClick(); };
  return <g transform={`translate(${x} ${y})`} role="button" tabIndex={disabled ? -1 : 0} aria-label={label} aria-pressed={pressed} aria-disabled={disabled || undefined} className={styles.svgButton} onClick={activate} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); } }}>
    <title>{label}</title><rect className={styles.hitArea} width={width} height={height} rx="3" />{children}
  </g>;
}
function Symbol({ type, ...props }) {
  return <g {...props}>{type === "Aircraft" ? <path d="m0-9 3 7 9 5-1 2-9-2-2 5-2-5-9 2-1-2 9-5Z" fill="currentColor" /> : type === "Personnel" ? <><circle cy="-5" r="3" fill="currentColor" /><path d="M-6 6V3q6-7 12 0v3Z" fill="currentColor" /></> : type === "Sensor" || type === "Position" ? <><path d="m0-8 8 8-8 8-8-8Z" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle r="2" fill="currentColor" /></> : <><rect x="-7" y="-4" width="14" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M-3-2v4M3-2v4" stroke="currentColor" /></>}</g>;
}
function Terrain({ id }) {
  return <>
    <rect x="52" y="82" width="710" height="460" fill="#222929" />
    <image href="/media/recon-terrain.webp" x="52" y="82" width="710" height="460" preserveAspectRatio="xMidYMid slice" filter={`url(#${id}-gray)`} opacity=".09" />
    <g fill="none" stroke="#a6b4ad" opacity=".12" strokeWidth=".7">{Array.from({ length: 28 }, (_, i) => <path key={i} d={`M52 ${96+i*17}C156 ${24+i*18} 222 ${179+i*11} 351 ${93+i*17}S592 ${178+i*11} 790 ${68+i*18}`} />)}</g>
    <g fill="#59605a" fillOpacity=".12" stroke="#9fa99f" strokeOpacity=".14"><path d="m88 139 103-28 50 83-111 19Zm64 191 94-20 32 74-108 29Zm176-210 73 10-12 58-67-14Zm239 11 83-14 31 65-92 28Zm-25 218 92-14 34 74-115 13ZM112 459l83-13 34 52-104 18Z" /></g>
    <path d="M63 220C158 224 171 279 258 277S399 236 473 273 643 298 773 270M279 82C299 174 271 199 301 263S333 373 304 425 294 499 335 551" fill="none" stroke="#101716" strokeWidth="12" />
    <path d="M63 220C158 224 171 279 258 277S399 236 473 273 643 298 773 270M279 82C299 174 271 199 301 263S333 373 304 425 294 499 335 551" fill="none" stroke="#747d77" strokeWidth="2" opacity=".6" />
    <path d="M81 405C181 441 175 380 280 371S421 415 486 399 609 351 753 412" fill="none" stroke="#90968c" strokeWidth="1.1" opacity=".5" />
    <g fill="#b6b9ad" fillOpacity=".25" stroke="#c0c4ba" strokeOpacity=".2">{[[209,236],[319,345],[600,236]].flatMap(([x,y], n) => Array.from({ length: 10 }, (_, i) => <rect key={`${n}-${i}`} x={x+(i%4)*17} y={y+Math.floor(i/4)*16} width={8+i%3} height="6" transform={`rotate(-12 ${x} ${y})`} />))}</g>
    <rect x="52" y="82" width="710" height="460" fill={`url(#${id}-grid)`} />
    <path d={zone} fill="#b84e4a" fillOpacity=".075" /><path d={zone} fill={`url(#${id}-hatch)`} />
    <path d={front} fill="none" stroke="#e29288" strokeWidth="2" strokeOpacity=".85" />
    <text x="83" y="117" className={styles.mapLabel}>WEST / FRIENDLY</text><text x="559" y="117" className={styles.hostileLabel}>OPPOSING CONTROL</text>
    <text x="104" y="487" className={styles.mapLabel}>SECTOR 07 / FICTIONAL</text><text x="322" y="137" className={styles.mapLabel}>NORTH RIDGE</text>
  </>;
}
function Interface({ id, state, setState }) {
  const { mode, selectedId, frame, layers, zoom, page } = state;
  const visible = assets.filter(asset => layers[asset.layer] && (asset.appears || 0) <= frame);
  const selected = visible.find(asset => asset.id === selectedId);
  const shownEvents = events.filter(event => event.at <= frame);
  const pages = Math.max(1, Math.ceil(visible.length / 6));
  const currentPage = Math.min(page, pages - 1);
  const update = patch => setState(previous => ({ ...previous, ...patch }));
  const choose = asset => update({ selectedId: asset.id, mode: "Overview" });
  const selectFrame = value => update({ frame: value, page: 0 });
  return <svg viewBox="0 0 1000 620" preserveAspectRatio="none" role="group" aria-labelledby={`${id}-title ${id}-desc`} className={styles.interface}>
    <title id={`${id}-title`}>{`PROVE-1 interactive demonstration, ${mode} view`}</title>
    <desc id={`${id}-desc`}>Explore a fictional land sector. Select markers, change layers, zoom or step through example updates. A curved front line separates a red hatched opposing zone. VISTA-1 markers represent friendly personnel. All data is illustrative.</desc>
    <defs>
      <clipPath id={`${id}-map`}><rect x="52" y="82" width="710" height="460" /></clipPath>
      <pattern id={`${id}-grid`} width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="#cbd5d6" strokeOpacity=".05" /></pattern>
      <pattern id={`${id}-hatch`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(32)"><path d="M0 0V12" stroke="#dc7770" strokeWidth="1" strokeOpacity=".25" /></pattern>
      <filter id={`${id}-gray`}><feColorMatrix type="saturate" values="0" /></filter>
    </defs>
    <rect width="1000" height="620" fill="#111517" />
    <path d="m18 26 10-13 10 13-10-5Z" fill="#eceeea" /><text x="49" y="28" className={styles.brand}>PROVE-1</text>
    <text x="166" y="26" className={styles.micro}>ACTPROVE / SECTOR WORKSPACE</text><text x="780" y="26" className={styles.micro}>FICTIONAL DEMO</text>
    <SvgButton x={914} y={4} width={76} height={32} label="Reset demo" onClick={() => setState(initialState())}><text x="38" y="21" textAnchor="middle" className={styles.small}>Reset ↺</text></SvgButton>
    {["Overview", "Equipment", "Layers", "Activity"].map((view, i) => <SvgButton key={view} x={62+i*117} y={42} width={111} height={36} label={`Open ${view.toLowerCase()} view`} pressed={mode === view} onClick={() => update({ mode: view })}><text x="55" y="24" textAnchor="middle" className={styles.small}>{view}</text></SvgButton>)}
    <text x="740" y="66" textAnchor="end" className={styles.micro}>{`${visible.length} VISIBLE / ${assets.length} TOTAL`}</text><text x="780" y="66" className={styles.micro}>{mode === "Overview" ? "SELECTION" : mode.toUpperCase()}</text>
    <g clipPath={`url(#${id}-map)`}>
      <g transform={`translate(407 312) scale(${zoom}) translate(-407 -312)`}>
        <Terrain id={id} />
        {layers.air && <g stroke="#c3d3d3" strokeOpacity=".28" fill="none" strokeDasharray="3 5"><path d="M345 246 386 236 427 215M367 447 390 417 408 389" /></g>}
        {visible.map(asset => { const pos = point(asset, frame); return <SvgButton key={asset.id} x={pos.x-20} y={pos.y-20} width={40} height={40} label={`Select ${asset.id}: ${asset.name}`} pressed={selected?.id === asset.id} onClick={() => choose(asset)}>
          {selected?.id === asset.id && <circle cx="20" cy="20" r="23" fill="#e5ebe3" fillOpacity=".06" stroke="#eaf0e9" strokeWidth="1" />}
          <Symbol type={asset.type} transform="translate(20 20)" style={{ color: asset.side === "Opposing" ? "#ed9c91" : asset.layer === "vista" ? "#c9ddcf" : "#e0e9e7" }} />
          <rect x="31" y="-2" width="38" height="15" fill="#151c1d" fillOpacity=".9" /><text x="35" y="9" className={styles.assetLabel}>{asset.id}</text>
        </SvgButton>; })}
      </g>
      <g transform="translate(730 110)" fill="none" stroke="#c4cecc"><path d="M0 22V1m-5 9L0 0l5 10" /><text x="0" y="-8" textAnchor="middle" className={styles.micro}>N</text></g>
      <rect x="65" y="512" width="683" height="23" fill="#111517" fillOpacity=".85" /><text x="76" y="528" className={styles.micro}>○ VISTA / FRIENDLY</text><text x="240" y="528" className={styles.micro}>◇ RECON REPORT</text><text x="731" y="528" textAnchor="end" className={styles.micro}>ILLUSTRATIVE DATA</text>
    </g>
    {[{ label: "Open overview view", view: "Overview", icon: "◎" }, { label: "Open equipment list", view: "Equipment", icon: "≡" }, { label: "Open map layers", view: "Layers", icon: "▱" }, { label: "Open event log", view: "Activity", icon: "◷" }].map((tool, i) => <SvgButton key={tool.view} x={5} y={91+i*48} label={tool.label} pressed={mode === tool.view} onClick={() => update({ mode: tool.view })}><text x="20" y="27" textAnchor="middle" className={styles.toolIcon}>{tool.icon}</text></SvgButton>)}
    <SvgButton x={5} y={390} label="Zoom in" disabled={zoom >= 1.6} onClick={() => update({ zoom: Math.min(1.6, +(zoom+.2).toFixed(1)) })}><text x="20" y="27" textAnchor="middle" className={styles.toolIcon}>+</text></SvgButton>
    <SvgButton x={5} y={435} label="Zoom out" disabled={zoom <= 1} onClick={() => update({ zoom: Math.max(1, +(zoom-.2).toFixed(1)) })}><text x="20" y="27" textAnchor="middle" className={styles.toolIcon}>−</text></SvgButton>
    <SvgButton x={5} y={483} label="Reset map zoom" onClick={() => update({ zoom: 1 })}><text x="20" y="26" textAnchor="middle" className={styles.small}>{`${zoom.toFixed(1)}×`}</text></SvgButton>
    {mode === "Overview" && (selected ? <g>
      <text x="782" y="108" className={styles.micro}>{`SELECTED / ${selected.id}`}</text><text x="782" y="139" className={styles.heading}>{selected.name}</text>
      <circle cx="786" cy="164" r="3" fill={selected.side === "Opposing" ? "#ed9c91" : "#c9ddcf"} /><text x="797" y="168" className={styles.small}>{selected.side === "Opposing" ? "Reported observation" : "Connected / demo"}</text>
      <path d="M782 188h199" stroke="#343b3f" />
      {[["SOURCE", selected.source], ["TYPE", selected.type], ["AFFILIATION", selected.side], ["SNAPSHOT", snapshots[frame]]].map(([key,value], i) => <g key={key}><text x="782" y={218+i*44} className={styles.micro}>{key}</text><text x="981" y={218+i*44} textAnchor="end" className={styles.small}>{value}</text></g>)}
      <path d="M782 377h199" stroke="#343b3f" /><text x="782" y="403" className={styles.micro}>{selected.layer === "vista" ? "WEARABLE CONNECTION" : selected.side === "Opposing" ? "OBSERVATION SOURCE" : "SHARED CONTEXT"}</text>
      <text x="782" y="430" className={styles.small}>{`${selected.source} → PROVE-1`}</text><text x="782" y="475" className={styles.dim}>{selected.side === "Opposing" ? "Reported by recon aircraft." : selected.layer === "vista" ? "Personnel location via VISTA-1." : "Equipment status in one view."}</text><text x="782" y="497" className={styles.dim}>Illustrative record.</text>
    </g> : <g><text x="782" y="120" className={styles.heading}>Select a marker</text><text x="782" y="153" className={styles.dim}>Click a visible object on the map.</text><text x="782" y="176" className={styles.dim}>Use Layers to show more objects.</text></g>)}
    {mode === "Equipment" && <g><text x="782" y="113" className={styles.heading}>Sector objects</text><text x="782" y="137" className={styles.micro}>SELECT A RECORD TO INSPECT</text>
      {visible.slice(currentPage*6, currentPage*6+6).map((asset, i) => <SvgButton key={asset.id} x={775} y={151+i*53} width={213} height={49} label={`Inspect ${asset.id} record`} onClick={() => choose(asset)}><Symbol type={asset.type} transform="translate(15 20)" color={asset.side === "Opposing" ? "#ed9c91" : "#d7e2df"} /><text x="34" y="21" className={styles.small}>{asset.id}</text><text x="202" y="21" textAnchor="end" className={styles.micro}>{asset.source}</text><text x="34" y="39" className={styles.dim}>{`${asset.side} / ${asset.type}`}</text></SvgButton>)}
      <SvgButton x={779} y={486} width={48} label="Previous object page" disabled={currentPage === 0} onClick={() => update({ page: currentPage-1 })}><text x="24" y="26" textAnchor="middle" className={styles.small}>←</text></SvgButton><text x="880" y="513" textAnchor="middle" className={styles.micro}>{`${currentPage+1} / ${pages}`}</text><SvgButton x={936} y={486} width={48} label="Next object page" disabled={currentPage+1 >= pages} onClick={() => update({ page: currentPage+1 })}><text x="24" y="26" textAnchor="middle" className={styles.small}>→</text></SvgButton>
    </g>}
    {mode === "Layers" && <g><text x="782" y="113" className={styles.heading}>Map layers</text><text x="782" y="138" className={styles.micro}>SHOW / HIDE SECTOR OBJECTS</text>
      {Object.entries(layerNames).map(([key, label], i) => <SvgButton key={key} x={776} y={161+i*70} width={211} height={57} label={`Toggle ${label.toLowerCase()}`} pressed={layers[key]} onClick={() => setState(previous => ({ ...previous, page: 0, layers: { ...previous.layers, [key]: !previous.layers[key] } }))}><rect x="9" y="17" width="16" height="16" fill={layers[key] ? "#c5d3ca" : "none"} stroke="#a6b5ad" />{layers[key] && <path d="m12 24 4 4 7-8" fill="none" stroke="#17201b" strokeWidth="1.5" />}<text x="36" y="28" className={styles.small}>{label}</text><text x="36" y="45" className={styles.dim}>{`${assets.filter(asset => asset.layer === key && (asset.appears || 0) <= frame).length} in this snapshot`}</text></SvgButton>)}
      <text x="782" y="483" className={styles.dim}>Red hatching: opposing control.</text><text x="782" y="505" className={styles.dim}>Reports cover observed objects.</text>
    </g>}
    {mode === "Activity" && <g><text x="782" y="113" className={styles.heading}>Session activity</text><text x="782" y="137" className={styles.micro}>SELECT AN EVENT TO INSPECT</text>
      {shownEvents.map((event, i) => <SvgButton key={`${event.at}-${event.asset}`} x={775} y={155+i*70} width={213} height={64} label={`Review ${event.asset} event at ${snapshots[event.at]}`} onClick={() => { const asset=assets.find(item => item.id === event.asset); setState(previous => ({ ...previous, frame: event.at, selectedId: event.asset, mode: "Overview", layers: { ...previous.layers, [asset.layer]: true } })); }}><text x="9" y="16" className={styles.micro}>{`${snapshots[event.at]} / ${event.asset}`}</text><text x="9" y="36" className={styles.small}>{event.title}</text><text x="9" y="54" className={styles.dim}>{event.detail}</text></SvgButton>)}
    </g>}
    <path d="M0 40h1000M0 81h1000M52 82v460M762 82v460M0 542h1000M0 587h1000" stroke="#343b3f" />
    <text x="17" y="570" className={styles.micro}>REVIEW SNAPSHOTS</text>
    {snapshots.map((time, i) => <SvgButton key={time} x={200+i*130} y={545} width={119} height={39} label={`Show snapshot ${time}`} pressed={frame === i} onClick={() => selectFrame(i)}><text x="59" y="26" textAnchor="middle" className={styles.small}>{time}</text></SvgButton>)}
    <text x="976" y="570" textAnchor="end" className={styles.micro}>CLICK MARKERS TO EXPLORE</text><text x="17" y="609" className={styles.micro}>ACTPROVE</text><text x="126" y="609" className={styles.dim}>Air. Ground. Personnel.</text><text x="976" y="609" textAnchor="end" className={styles.micro}>PROVE-1 / INTERACTIVE CONCEPT</text>
  </svg>;
}
function initialState() { return { mode: "Overview", selectedId: "R-01", frame: 2, zoom: 1, page: 0, layers: { air: true, ground: true, vista: true, observations: true } }; }
export default function ProveMonitor({ compact = false, className = "" }) {
  const id = `prove-${useId().replace(/:/g, "")}`;
  const [state, setState] = useState(initialState);
  const dialog = useRef(null);
  return <figure className={`${styles.figure} ${compact ? styles.compact : ""} ${className}`} data-system="prove-1">
    <div className={styles.stage}><div className={styles.device}>
      <img className={styles.hardware} src="/media/prove-1-field-monitor.webp" alt="Graphite field monitor with protective casing and physical controls, an illustrative hardware presentation" width="1536" height="1024" loading="lazy" decoding="async" />
      <div className={styles.display}><Interface id={id} state={state} setState={setState} /></div>
    </div></div>
    <figcaption className={styles.caption}><span>Click a marker or use the screen controls.</span><button type="button" className={styles.expand} onClick={() => dialog.current.showModal()}>Inspect interface<span aria-hidden="true">↗</span></button></figcaption>
    <dialog ref={dialog} className={styles.dialog} aria-label="Explore PROVE-1 interface">
      <div className={styles.dialogBar}><span>PROVE-1 / INTERACTIVE CONCEPT</span><button type="button" onClick={() => dialog.current.close()}>Close interface <span aria-hidden="true">×</span></button></div>
      <div className={styles.dialogCanvas}><Interface id={`${id}-expanded`} state={state} setState={setState} /></div>
      <p className={styles.dialogHint}>Select objects, toggle layers and explore snapshots. On small screens, scroll sideways to explore the full workspace.</p>
    </dialog>
  </figure>;
}
