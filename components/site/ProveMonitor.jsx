"use client";

import { useId, useRef, useState } from "react";
import styles from "./ProveMonitor.module.css";

// Fictional website demonstration only. No real people, coordinates or live feeds.
const baseAssets = [
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
// Observation attributes are authored examples, not sensor-derived assessments.
const observationDetails = [
  ["Utility vehicle", "Reviewed", "Roadside vehicle silhouette.", "Single-source visual report."],
  ["Field position", "Needs review", "Earthwork-like outline.", "Classification unconfirmed."],
  ["Transport vehicle", "Reviewed", "Vehicle near service road.", "Two example frames reviewed."],
  ["Temporary site", "Needs review", "Grouped surface structures.", "Purpose remains unknown."],
  ["Vehicle group", "Needs review", "Three vehicle-like objects.", "Count is an illustrative estimate."],
  ["Covered vehicle", "Unresolved", "Partially obscured object.", "Visibility limited by tree cover."],
  ["Field position", "Reviewed", "Repeated ground features.", "Example report cross-checked."],
  ["Utility vehicle", "Needs review", "Object at road junction.", "Single-source visual report."],
  ["Equipment group", "Unresolved", "Multiple compact objects.", "Equipment type not established."],
  ["Temporary site", "Needs review", "Small structures at field edge.", "No personnel count available."],
  ["Transport vehicle", "Reviewed", "Vehicle-like outline in yard.", "Two example frames reviewed."],
  ["Observed structure", "Unresolved", "Roofed structure near road.", "Affiliation is scenario-defined."],
];
const extraAssets = [
  { id: "G-03", name: "Ground vehicle 03", type: "Vehicle", layer: "ground", source: "ERA-1", side: "Friendly", x: 137, y: 232, dx: 5, dy: 2 },
  { id: "G-04", name: "Ground vehicle 04", type: "Vehicle", layer: "ground", source: "ERA-1", side: "Friendly", x: 213, y: 442 },
  { id: "G-05", name: "Ground vehicle 05", type: "Vehicle", layer: "ground", source: "ERA-1", side: "Friendly", x: 280, y: 155 },
  { id: "S-02", name: "Sensor station 02", type: "Sensor", layer: "ground", source: "ARCA-1", side: "Friendly", x: 125, y: 325 },
  { id: "V-05", name: "VISTA wearer 05", type: "Personnel", layer: "vista", source: "VISTA-1", side: "Friendly", x: 211, y: 190 },
  { id: "V-06", name: "VISTA wearer 06", type: "Personnel", layer: "vista", source: "VISTA-1", side: "Friendly", x: 390, y: 140 },
  { id: "V-07", name: "VISTA wearer 07", type: "Personnel", layer: "vista", source: "VISTA-1", side: "Friendly", x: 255, y: 355 },
  ...[[550,153],[686,151],[666,232],[548,355],[713,322],[674,460],[589,489],[710,407]].map(([x,y], i) => ({ id: `O-${String(i+5).padStart(2,"0")}`, name: `Observation ${String(i+5).padStart(2,"0")}`, type: i%3 === 0 ? "Vehicle" : "Position", layer: "observations", source: i%2 ? "Recon R-02" : "Recon R-01", side: "Opposing", x, y, appears: i%3 })),
];
const assets = [...baseAssets, ...extraAssets].map(asset => {
  if (asset.side !== "Opposing") return asset;
  const index = Number(asset.id.slice(2)) - 1;
  const [classification, review, note, context] = observationDetails[index];
  return { ...asset, type: classification.toLowerCase().includes("vehicle") ? "Vehicle" : "Position", classification, review, note, context, firstSeen: ["00:00", "00:20", "00:40"][asset.appears || 0], report: `OBS-${String(index+1).padStart(3,"0")}` };
});
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
function wrapNote(value, limit = 29) {
  return value.split(" ").reduce((lines, word) => {
    const last = lines.length - 1;
    if (last < 0 || lines[last].length + word.length + 1 > limit) lines.push(word);
    else lines[last] += ` ${word}`;
    return lines;
  }, []);
}
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
const mainRoads = "M52 222C139 214 186 282 259 277S396 237 473 273 638 298 762 270M278 82C300 170 272 199 301 263S332 371 304 425 293 494 335 542";
const minorRoads = "M81 405C181 441 175 380 280 371S421 415 486 399 609 351 753 412M153 82 172 152 214 190 253 239M182 252 180 315 221 342 240 410 213 484M324 116 386 154 425 196 450 260M548 82 553 142 598 180 620 227 611 285 651 330 640 383 674 460 704 542M530 159 700 146 762 174M513 345 589 328 714 322M544 447 612 464 742 474";
const towns = [[188,230,5,3,-12],[313,328,4,3,10],[594,216,5,4,-8],[650,423,4,3,14],[124,144,3,3,-14],[363,451,3,2,-8]];
function Terrain({ id }) {
  return <>
    <rect x="52" y="82" width="710" height="460" fill="#252b2b" />
    <image href="/media/recon-terrain.webp" x="52" y="82" width="710" height="460" preserveAspectRatio="xMidYMid slice" filter={`url(#${id}-gray)`} opacity=".12" />
    <g fill="none" stroke="#a6b4ad" opacity=".14" strokeWidth=".65">{Array.from({ length: 34 }, (_, i) => <path key={i} d={`M52 ${74+i*15}C156 ${16+i*16} 222 ${179+i*10} 351 ${76+i*15}S592 ${160+i*10} 790 ${53+i*16}`} />)}</g>
    <g fill="#90988b" fillOpacity=".06" stroke="#b4b9ab" strokeOpacity=".18" strokeWidth=".65">
      {Array.from({length: 7}, (_,i) => <path key={i} d={`M${76+i*19} 438l14-5 24 57-14 5Z`} />)}
      {Array.from({length: 7}, (_,i) => <path key={i} d={`M${327+i*17} 94l13 4-16 46-13-4Z`} />)}
      <path d="m84 278 64-8 17 48-65 12Zm283-8 67-14 25 50-70 12Zm188 88 58-12 27 58-61 15Zm98-264 59 7-9 29-59-7Z" />
    </g>
    <g fill="#111d19" fillOpacity=".55" stroke="#748779" strokeOpacity=".13">
      <path d="M70 92 127 89 152 126 137 147 96 154 69 139ZM360 291l48-8 32 31-5 35-40 9-34-29ZM685 350l53-11 22 20v49l-34 9-32-27Z" />
      {Array.from({length: 66}, (_,i) => { const cluster = [[89,108],[379,307],[706,362]][i%3]; return <circle key={i} cx={cluster[0]+((i*13)%36)} cy={cluster[1]+((i*7)%31)} r={2+i%3} />; })}
    </g>
    <path d="M66 82C90 141 65 171 93 209S115 259 92 300 103 354 118 387 144 466 122 542" fill="none" stroke="#67797b" strokeOpacity=".45" strokeWidth="7" />
    <path d="M66 82C90 141 65 171 93 209S115 259 92 300 103 354 118 387 144 466 122 542" fill="none" stroke="#9aa9aa" strokeOpacity=".35" strokeWidth="1" />
    <path d={minorRoads} fill="none" stroke="#111817" strokeWidth="5" />
    <path d={minorRoads} fill="none" stroke="#919a90" strokeWidth="1" strokeOpacity=".5" />
    <path d={mainRoads} fill="none" stroke="#111716" strokeWidth="12" />
    <path d={mainRoads} fill="none" stroke="#879187" strokeWidth="2" strokeOpacity=".7" />
    <path d="M52 210 111 212M111 393 135 402" stroke="#bac0b5" strokeWidth="3" />
    <path d="M455 82C424 150 438 219 444 281S430 429 459 542" fill="none" stroke="#adb5ac" strokeOpacity=".3" strokeWidth="3" strokeDasharray="1 5" />
    <path d="M455 82C424 150 438 219 444 281S430 429 459 542" fill="none" stroke="#adb5ac" strokeOpacity=".4" strokeWidth=".6" />
    {towns.map(([x,y,cols,rows,rotation],n) => <g key={n} transform={`translate(${x} ${y}) rotate(${rotation})`}>
      <rect x="-6" y="-6" width={cols*14+5} height={rows*14+5} fill="#111615" fillOpacity=".3" stroke="#b0b8ad" strokeOpacity=".15" />
      {Array.from({length:rows*cols},(_,i) => <g key={i}><rect x={(i%cols)*14} y={Math.floor(i/cols)*14} width={7+i%3} height={6+i%2} fill="#a8ada0" fillOpacity=".3" stroke="#bec3b6" strokeOpacity=".25" strokeWidth=".5" /><path d={`M${(i%cols)*14+1} ${Math.floor(i/cols)*14+2}h5`} stroke="#e2e6d9" strokeOpacity=".15" /></g>)}
    </g>)}
    <g transform="translate(554 380) rotate(-12)" fill="#a8afa2" fillOpacity=".24" stroke="#c2c6b7" strokeOpacity=".3" strokeWidth=".7">
      <rect x="-8" y="-8" width="62" height="47" fill="none" /><rect width="15" height="30" /><rect x="21" width="25" height="11" /><rect x="21" y="18" width="25" height="12" /><path d="M4 3v23M25 5h17M25 23h17" />
    </g>
    <g transform="translate(665 178)" fill="#a4aca2" fillOpacity=".2" stroke="#b5bfb4" strokeOpacity=".35">{[0,1,2].map(i => <g key={i}><circle cx={i*15} cy="0" r="5" /><circle cx={i*15} cy="15" r="5" /></g>)}</g>
    <rect x="52" y="82" width="710" height="460" fill={`url(#${id}-grid)`} />
    <path d={zone} fill="#b84e4a" fillOpacity=".055" /><path d={zone} fill={`url(#${id}-hatch)`} />
    <path d={front} fill="none" stroke="#141a19" strokeWidth="5" /><path d={front} fill="none" stroke="#e29288" strokeWidth="1.7" strokeOpacity=".85" />
    <g className={styles.mapLabel}><text x="83" y="117">WEST / FRIENDLY</text><text x="320" y="116">NORTH RIDGE</text><text x="174" y="305">WESTFIELD</text><text x="565" y="312">EAST QUARTER</text><text x="547" y="435">WORKS DISTRICT</text><text x="82" y="495">SECTOR 07 / FICTIONAL</text></g>
    <text x="559" y="117" className={styles.hostileLabel}>OPPOSING CONTROL</text>
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
      <text x="782" y="108" className={styles.micro}>{`SELECTED / ${selected.id}`}</text><text x="782" y="139" className={styles.heading}>{(selected.side === "Opposing" ? selected.classification : selected.name)}</text>
      <circle cx="786" cy="164" r="3" fill={selected.side === "Opposing" ? "#ed9c91" : "#c9ddcf"} /><text x="797" y="168" className={styles.small}>{selected.side === "Opposing" ? "Reported observation" : "Connected / demo"}</text>
      <path d="M782 188h199" stroke="#343b3f" />
      {(selected.side === "Opposing" ? [["SOURCE", selected.source], ["CLASS", selected.classification], ["REVIEW", selected.review], ["FIRST SEEN", selected.firstSeen], ["UPDATED", snapshots[frame]], ["REPORT", selected.report]] : [["SOURCE", selected.source], ["TYPE", selected.type], ["AFFILIATION", selected.side], ["SNAPSHOT", snapshots[frame]]]).map(([key,value], i) => <g key={key}><text x="782" y={211+i*29} className={styles.micro}>{key}</text><text x="981" y={211+i*29} textAnchor="end" className={styles.recordValue}>{value}</text></g>)}
      <path d="M782 377h199" stroke="#343b3f" /><text x="782" y="403" className={styles.micro}>{selected.layer === "vista" ? "WEARABLE CONNECTION" : selected.side === "Opposing" ? "OBSERVATION SOURCE" : "SHARED CONTEXT"}</text>
      <text x="782" y="430" className={styles.small}>{`${selected.source} → PROVE-1`}</text>{(selected.side === "Opposing" ? [...wrapNote(selected.note), ...wrapNote(selected.context)] : [selected.layer === "vista" ? "Personnel location via VISTA-1." : "Equipment status in one view.", "Illustrative record."]).map((line, i) => <text key={i} x="782" y={457+i*17} className={styles.dim}>{line}</text>)}
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
