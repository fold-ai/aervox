"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./GroundRecon.module.css";

const VEHICLES = [
  { id: "G-01", offset: 0.16, tone: "light" },
  { id: "G-02", offset: 0.45, tone: "dark" },
  { id: "G-03", offset: 0.74, tone: "silver" },
];
// Authored animation coordinates in the photograph, not sensor data.
const ROAD = [
  { x: 10, y: 111 }, { x: 34.55, y: 71.25 },
  { x: 52.85, y: 44.9 }, { x: 70.05, y: 19 }, { x: 89.4, y: -11 },
];

function positionAt(progress) {
  const scaled = progress * (ROAD.length - 1);
  const index = Math.min(Math.floor(scaled), ROAD.length - 2);
  const amount = scaled - index;
  const from = ROAD[index];
  const to = ROAD[index + 1];
  return { x: from.x + (to.x - from.x) * amount, y: from.y + (to.y - from.y) * amount };
}

function Observer({ x, y, number }) {
  return <g transform={`translate(${x} ${y})`} className={styles.observer}>
    <circle r="17" /><path d="m-11 3 11-8 11 8-11-3Z" /><text x="25" y="4">VIEW {number}</text>
  </g>;
}

export default function GroundRecon({ motionPaused = false, showOverlays = true, compact = false, className = "" }) {
  const rootRef = useRef(null);
  const elapsedRef = useRef(0);
  const [elapsed, setElapsed] = useState(0);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedId, setSelectedId] = useState("G-02");
  const [view, setView] = useState("wide");

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (rootRef.current) observer.observe(rootRef.current);
    return () => { observer.disconnect(); preference.removeEventListener("change", sync); };
  }, []);

  useEffect(() => {
    if (!inView || motionPaused || reducedMotion) return undefined;
    let request;
    let previous;
    let drawn = 0;
    const animate = now => {
      if (previous !== undefined) elapsedRef.current += Math.min((now - previous) / 1000, 0.1);
      previous = now;
      if (now - drawn >= 32) { setElapsed(elapsedRef.current); drawn = now; }
      request = requestAnimationFrame(animate);
    };
    request = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(request);
  }, [inView, motionPaused, reducedMotion]);

  const vehicles = VEHICLES.map(vehicle => ({ ...vehicle, ...positionAt((vehicle.offset + elapsed / 52) % 1) }));
  const selected = vehicles.find(vehicle => vehicle.id === selectedId);
  const zoom = view === "detail" && !compact ? 2.25 : 1;
  const limit = (zoom - 1) * 50;
  const shiftX = Math.max(-limit, Math.min(limit, (50 - selected.x) * zoom));
  const shiftY = Math.max(-limit, Math.min(limit, (50 - selected.y) * zoom));
  const isVisible = vehicle => {
    const x = 50 + (vehicle.x - 50) * zoom + shiftX;
    const y = 50 + (vehicle.y - 50) * zoom + shiftY;
    const halfWidth = 2.4 * zoom;
    const halfHeight = halfWidth * (1672 / 941) * (1122 / 1402);
    return x + halfWidth > 0 && x - halfWidth < 100 && y + halfHeight > 0 && y - halfHeight < 100;
  };
  const visibleCount = vehicles.filter(isVisible).length;
  const selectedVisible = isVisible(selected);

  return <div ref={rootRef} className={`${styles.recon} ${className}`} data-compact={compact}>
    <div className={styles.scene} data-overlays={showOverlays} role="group" aria-label="Simulated reconnaissance view with three moving vehicles">
      <div className={styles.world} style={{ transform: `translate(${shiftX}%, ${shiftY}%) scale(${zoom})` }}>
        <img className={styles.landscape} src="/media/ground-road-clean.webp" width="1672" height="941" alt="A mountain road seen from above" loading="lazy" draggable="false" />
        {!compact && showOverlays && <svg className={styles.observationLines} viewBox="0 0 1672 941" fill="none" aria-hidden="true">
          <path d={`M 600 185 L ${selected.x * 16.72} ${selected.y * 9.41} L 1260 720`} />
          <Observer x={600} y={185} number="01" /><Observer x={1260} y={720} number="02" />
        </svg>}
        {vehicles.map(vehicle => <div key={vehicle.id} className={styles.vehicle} data-selected={vehicle.id === selectedId} data-tone={vehicle.tone} style={{ left: `${vehicle.x}%`, top: `${vehicle.y}%` }}>
          <img src="/media/recon-vehicle.webp" alt="" draggable="false" className={styles.vehicleImage} />
          {showOverlays && <div className={styles.track}>
            <i className={styles.cornerTL} /><i className={styles.cornerTR} /><i className={styles.cornerBL} /><i className={styles.cornerBR} />
            <span className={styles.trackLabel}>{vehicle.id}<span>{vehicle.id === selectedId ? "FOLLOWING" : "VEHICLE"}</span></span>
          </div>}
          {!compact && <button type="button" className={styles.vehicleButton} aria-label={`Follow vehicle ${vehicle.id}`} aria-pressed={vehicle.id === selectedId} onClick={() => setSelectedId(vehicle.id)} />}
        </div>)}
      </div>
      {!compact && showOverlays && <>
        <div className={styles.sceneHeader}><span><i />GROUND / RECONNAISSANCE</span><span>SIMULATED SCENE</span></div>
        <div className={styles.sceneReadout}><span>EO OBSERVATION</span><strong>{String(visibleCount).padStart(2, "0")}<small>vehicles in view</small></strong><span>03 UNIQUE VEHICLE TRACKS</span></div>
        <div className={styles.viewLabel}><span>{view === "detail" ? "VEHICLE DETAIL" : "WIDE AREA VIEW"}</span><span>{zoom.toFixed(2)}× DIGITAL VIEW</span></div>
        <div className={styles.sceneScale} aria-hidden="true"><span /><span /><span /><span /><span /></div>
        {view === "detail" && !selectedVisible && <div className={styles.reacquiring}><span>{selectedId} / OUT OF VIEW</span><strong>Waiting for the vehicle to re-enter.</strong></div>}
      </>}
    </div>
    {!compact && <>
      <div className={styles.observationBar}>
        <div className={styles.vehicleChoices} role="group" aria-label="Select a vehicle">{VEHICLES.map(vehicle => <button type="button" key={vehicle.id} aria-pressed={selectedId === vehicle.id} onClick={() => setSelectedId(vehicle.id)}><span />{vehicle.id}</button>)}</div>
        <div className={styles.viewChoices} role="group" aria-label="Reconnaissance view"><button type="button" aria-pressed={view === "wide"} onClick={() => setView("wide")}>Overview</button><button type="button" aria-pressed={view === "detail"} onClick={() => setView("detail")}>Vehicle detail <span aria-hidden="true">↗</span></button></div>
      </div>
      <div className={styles.context}>
        <div><span className={styles.kicker}>RECONNAISSANCE</span><h3>Follow the movement.<br />Keep the context.</h3><p>A concept for reconnaissance aircraft: follow vehicles and connect observations across the scene.</p></div>
        <dl><div><dt>Selected vehicle</dt><dd>{selectedId} · {selectedVisible ? "visual track" : "out of view"}</dd></div><div><dt>Observation viewpoints</dt><dd>02 · illustrated</dd></div><div><dt>Occupancy</dt><dd>Unconfirmed<span>Cabin not visible</span></dd></div></dl>
      </div>
    </>}
  </div>;
}
