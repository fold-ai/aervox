"use client";

import { useEffect, useId, useRef, useState } from "react";
import GroundTerrain from "./GroundTerrain";
import { OVERVIEW_DRONES as DRONES, OVERVIEW_ASSETS as ASSETS, OVERVIEW_COUNT, overviewRecord } from "./ground-overview-data";
import styles from "./GroundOverview.module.css";

const inputKey = (event, callback) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); callback(); } };
// Three authored boundary snapshots. Interpolation is decorative, not a prediction.
const BOUNDARIES = [
  [758, 734, 783, 747, 805, 767, 830, 798, 850],
  [772, 751, 771, 770, 786, 785, 814, 821, 839],
  [752, 763, 793, 758, 814, 793, 837, 810, 864],
];
const boundaryAt = time => {
  const phase = (time % 72) / 24, index = Math.floor(phase), blend = (1 - Math.cos((phase % 1) * Math.PI)) / 2;
  const xs = BOUNDARIES[index].map((x, i) => x + (BOUNDARIES[(index + 1) % 3][i] - x) * blend);
  const points = xs.map((x, i) => [x, i * 87.5]);
  let path = `M${points[0][0]} 0`;
  for (let i = 1; i < points.length; i++) {
    const [x0,y0] = points[i - 1], [x,y] = points[i];
    path += ` C${x0.toFixed(1)} ${(y0 + 44).toFixed(1)} ${x.toFixed(1)} ${(y - 44).toFixed(1)} ${x.toFixed(1)} ${y}`;
  }
  return path;
};
function ReportIcon({ kind }) {
  if (kind === "aircraft") return <path d="m0-8 4 7 6 3-1 2-7-1-2 4-2-4-7 1-1-2 6-3Z" />;
  if (kind === "personnel") return <><circle cx="0" cy="-3" r="2.6" /><path d="M-5 5c0-6 10-6 10 0Z" /></>;
  if (kind === "armor" || kind === "carrier") return <>
    <rect x="-7" y="-5" width="3" height="11" rx=".8" /><rect x="4" y="-5" width="3" height="11" rx=".8" />
    <path d="M-3-6h6l1 3v7h-8v-7Z" />
    {kind === "armor" ? <><circle r="2.2" fill="#1b2328" /><path d="M0 0v-10" stroke="currentColor" strokeWidth="1.5" /></> : <path d="M-2-2h4v3h-4Z" fill="#1b2328" />}
  </>;
  if (kind === "position") return <><path d="M-7 5V-2L0-6l7 4v7M-7 2h14" fill="none" stroke="currentColor" strokeWidth="1.2" /><rect x="-2" y="-1" width="4" height="4" /></>;
  return <><path d="m0-5 5 5-5 5-5-5Z" fill="none" stroke="currentColor" strokeWidth="1.3" /><circle r="1.3" /></>;
}

export default function GroundOverview({ active, elapsedRef, showOverlays, compact, selectedId, onSelect, onOpenCamera, focusDroneId }) {
  const rootRef = useRef(null), drones = useRef({}), footprints = useRef({});
  const frontRef = useRef(null), regionRef = useRef(null), clockRef = useRef(null), dragRef = useRef(null);
  const patternId = `front-${useId().replaceAll(":", "")}`;
  const [width, setWidth] = useState(1200);
  const [layers, setLayers] = useState({ relief: true, boundary: true, positions: true });
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 600, y: 350 });
  const [snapshot, setSnapshot] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const scale = (1200 / Math.max(width, 300)) / zoom;
  const record = overviewRecord(selectedId);
  const toggle = key => setLayers(current => ({ ...current, [key]: !current[key] }));
  const pick = id => { onSelect(id); setShowDetails(true); };
  const boundCenter = (x, y, z = zoom) => ({ x: Math.max(600 / z, Math.min(1200 - 600 / z, x)), y: Math.max(350 / z, Math.min(700 - 350 / z, y)) });
  const revealFocusedMarker = event => {
    if (zoom <= 1 || !event.currentTarget.matches(":focus-visible")) return;
    const position = event.currentTarget.transform.baseVal.consolidate()?.matrix;
    if (position) setCenter(boundCenter(position.e, position.f));
  };
  const changeZoom = next => { const z = Math.max(1, Math.min(2.5, next)); setZoom(z); setCenter(current => boundCenter(current.x, current.y, z)); };
  useEffect(() => { if (focusDroneId) drones.current[focusDroneId]?.focus({ preventScroll: true }); }, [focusDroneId]);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    if (rootRef.current) observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let request, previous, lastPaint = -Infinity;
    const paint = () => {
      const time = elapsedRef.current;
      DRONES.forEach(drone => {
        const phase = time / 25 + drone.phase;
        const x = drone.x + Math.cos(phase) * drone.rx, y = drone.y + Math.sin(phase) * drone.ry;
        drones.current[drone.id]?.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
        footprints.current[drone.id]?.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${drone.id === "D-01" ? -35 : -100})`);
      });
      const boundary = boundaryAt(time);
      frontRef.current?.setAttribute("d", boundary);
      regionRef.current?.setAttribute("d", `${boundary} L1200 700 L1200 0Z`);
      if (clockRef.current) clockRef.current.textContent = `0${Math.floor(time % 72 / 60)}:${String(Math.floor(time % 72 % 60)).padStart(2, "0")}`;
    };
    paint();
    const animate = now => {
      if (previous !== undefined) elapsedRef.current += Math.min((now - previous) / 1000, .08);
      previous = now;
      if (now - lastPaint >= 32) { paint(); lastPaint = now; }
      request = requestAnimationFrame(animate);
    };
    if (active) request = requestAnimationFrame(animate);
    return () => { if (request !== undefined) cancelAnimationFrame(request); };
  }, [active, elapsedRef, showOverlays, layers.boundary, snapshot]);

  return <div ref={rootRef} className={styles.overview} data-compact={compact} data-overlays={showOverlays}>
    <div className={styles.mapArea}>
      <svg viewBox={`${center.x - 600 / zoom} ${center.y - 350 / zoom} ${1200 / zoom} ${700 / zoom}`} preserveAspectRatio="xMidYMid meet" className={styles.map} data-zoomed={zoom > 1} role="group" tabIndex={0} aria-label={`Fictional terrain map with ${OVERVIEW_COUNT} observations. Use zoom controls, then drag or use arrow keys to pan.`}
        onKeyDown={event => {
          if (event.target !== event.currentTarget || !["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)) return;
          event.preventDefault();
          setCenter(current => boundCenter(current.x + (event.key === "ArrowRight" ? 40 : event.key === "ArrowLeft" ? -40 : 0), current.y + (event.key === "ArrowDown" ? 40 : event.key === "ArrowUp" ? -40 : 0)));
        }}
        onPointerDown={event => {
          if (zoom <= 1 || event.target.closest('[role="button"]')) return;
          dragRef.current = { x: event.clientX, y: event.clientY, center, pointer: event.pointerId };
          event.currentTarget.setPointerCapture(event.pointerId);
        }} onPointerMove={event => {
          if (!dragRef.current) return;
          const rect = event.currentTarget.getBoundingClientRect(), unit = Math.max(1200 / rect.width, 700 / rect.height) / zoom;
          setCenter(boundCenter(dragRef.current.center.x - (event.clientX - dragRef.current.x) * unit, dragRef.current.center.y - (event.clientY - dragRef.current.y) * unit));
        }} onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; }}>
        <defs><pattern id={patternId} width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(32)"><rect width="11" height="11" fill="#a8544910" /><path d="M0 0V11" stroke="#d2826d" strokeWidth=".6" opacity=".22" /></pattern></defs>
        <GroundTerrain relief={layers.relief} />
        {showOverlays && layers.boundary && <g className={styles.boundary} aria-hidden="true"><path ref={regionRef} d={`${boundaryAt(0)} L1200 700 L1200 0Z`} fill={`url(#${patternId})`} /><path ref={frontRef} className={styles.frontline} d={boundaryAt(0)} /></g>}
        <g className={styles.mapLabels} aria-hidden="true"><text x="105" y="100">NORTH RIDGE</text><text x="480" y="390" transform="rotate(-10 480 390)">WESTFIELD VALLEY</text><text x="940" y="650">EASTERN APPROACH</text><text x="97" y="610">SECTOR 07</text><text x="960" y="302">EASTERN RIDGE</text><text x="280" y="465">OPEN GROUND</text></g>
        {showOverlays && <g className={styles.footprints}>{DRONES.map(drone => <g key={drone.id} ref={element => { footprints.current[drone.id] = element; }}><path d="M0 0 105 92Q45 150-42 128Z" /><path d="M105 92Q45 150-42 128" /></g>)}</g>}
        {ASSETS.filter(report => layers.positions || report.kind !== "position").map(report => <g key={report.id} transform={`translate(${report.x} ${report.y})`} className={styles.report} data-affiliation={report.affiliation} data-selected={selectedId === report.id} role="button" tabIndex={0} onFocus={revealFocusedMarker} aria-pressed={selectedId === report.id} aria-label={`Select ${report.label} ${report.id}`} onClick={() => pick(report.id)} onKeyDown={event => inputKey(event, () => pick(report.id))}>
          <g transform={`scale(${scale})`}><circle className={styles.hitArea} r="20" /><g className={styles.reportIcon} transform={`rotate(${report.heading || 0})`}><ReportIcon kind={report.kind} /></g><path className={styles.reportBracket} d="M-7-11h-4v4m18-4h4v4M-11 7v4h4m18-4v4H7" />{showOverlays && <text x="15" y="-8" className={styles.markerLabel}>{report.id}</text>}</g>
        </g>)}
        {DRONES.map(drone => <g key={drone.id} ref={element => { drones.current[drone.id] = element; }} className={styles.drone} transform="translate(-50 -50)" role="button" tabIndex={0} onFocus={revealFocusedMarker} aria-label={`Open ${drone.label} field camera`} onClick={() => onOpenCamera(drone.view)} onKeyDown={event => inputKey(event, () => onOpenCamera(drone.view, true))}>
          <g transform={`scale(${scale})`}><circle className={styles.hitArea} r="24" /><circle className={styles.droneRing} r="16" /><path className={styles.droneIcon} d="m0-8 4 7 7 3-1 3-8-2-2 5-2-5-8 2-1-3 7-3Z" />{showOverlays && <text x="23" y="-2" className={styles.droneId}>{drone.id}<tspan x="23" dy="12">CAMERA ↗</tspan></text>}</g>
        </g>)}
      </svg>
      {showOverlays && <>
        <div className={styles.sectorLabels} aria-hidden="true"><span>WEST / FRIENDLY</span>{layers.boundary && <span>EAST / OPPOSING</span>}</div>
        <div className={styles.mapCompass} aria-hidden="true"><span>N</span><svg width="15" height="27" viewBox="0 0 15 27"><path d="M7.5 27V3m-5 7 5-7 5 7" fill="none" stroke="currentColor" /></svg></div>
        <div className={styles.zoomControls} role="group" aria-label="Map zoom"><button type="button" aria-label="Zoom in" disabled={zoom >= 2.5} onClick={() => changeZoom(zoom + .5)}>+</button><button type="button" aria-label="Zoom out" disabled={zoom <= 1} onClick={() => changeZoom(zoom - .5)}>−</button><button type="button" aria-label="Reset map view" onClick={() => { setZoom(1); setCenter({ x: 600, y: 350 }); }}>{zoom.toFixed(1)}×</button></div>
        <div className={styles.mapScale} aria-hidden="true"><i /><span>ILLUSTRATIVE TERRAIN</span></div>
      </>}
    </div>
    {showOverlays && <>
        <div className={styles.selection} data-expanded={showDetails}>
          <button type="button" className={styles.selectionHeading} aria-expanded={showDetails} onClick={() => setShowDetails(value => !value)}><i data-affiliation={record.affiliation} /><strong>{selectedId}</strong><span>{record.label}</span><b aria-hidden="true">{showDetails ? "−" : "+"}</b></button>
          {showDetails && <dl><div><dt>Source</dt><dd>{record.source}</dd></div><div><dt>Affiliation</dt><dd>{record.affiliation}</dd></div><div><dt>Record</dt><dd>Illustrative</dd></div></dl>}
        </div>
      <header className={styles.topline}><div className={styles.mapTitle}><strong>Frontline overview</strong><span><i />SIMULATED / {OVERVIEW_COUNT} OBJECTS</span></div><div className={styles.layerControls} role="group" aria-label="Map layers">{[["relief","Relief"],["boundary","Front line"],["positions","Positions"]].map(([key,label]) => <button type="button" key={key} aria-pressed={layers[key]} onClick={() => toggle(key)}><i aria-hidden="true" />{label}</button>)}</div></header>
      <footer className={styles.bottomline}>
        <div className={styles.legend}><span><i className={styles.friendlyKey} />Friendly</span><span><i className={styles.opposingKey} />Opposing</span><span><i className={styles.trackKey} />Unconfirmed</span></div>
        <div className={styles.timeline} role="group" aria-label="Scenario snapshots"><span ref={clockRef}>00:00</span>{[0,24,48].map((time,i) => <button key={time} type="button" aria-label={`View scenario snapshot ${i + 1}`} onClick={() => { elapsedRef.current = time; setSnapshot(value => value + 1); }}>{String(i + 1).padStart(2,"0")}</button>)}</div>
        <div className={styles.cameraLinks} role="group" aria-label="Open an aircraft camera">{DRONES.map(drone => <button key={drone.id} type="button" onClick={event => onOpenCamera(drone.view, event.detail === 0)}>{drone.id}<span aria-hidden="true">↗</span></button>)}</div>
      </footer>
    </>}
  </div>;
}
