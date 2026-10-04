"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./GroundOverview.module.css";

const ROUTES = [
  { id: "a", path: "M-70 556 C132 542 249 499 372 426 S628 332 778 308 S1068 250 1280 170" },
  { id: "b", path: "M146 -70 C172 80 294 147 324 265 S325 451 456 548 S613 635 627 785" },
  { id: "c", path: "M-80 175 C182 174 300 179 483 215 S798 291 970 400 S1130 530 1280 532" },
  { id: "d", path: "M929 -65 C905 78 927 176 860 261 S722 365 730 466 S930 617 1067 771" },
  { id: "e", path: "M-75 337 C133 337 168 281 274 279 S425 295 483 406 S653 568 803 581 S1088 626 1280 674" },
];
const TRACKS = [
  { id: "V-01", route: "a", offset: .72, duration: 112 }, { id: "V-02", route: "a", offset: .48, duration: 112 },
  { id: "V-03", route: "a", offset: .25, duration: 112 }, { id: "V-04", route: "b", offset: .24, duration: 125 },
  { id: "V-05", route: "b", offset: .62, duration: 125 }, { id: "V-06", route: "c", offset: .18, duration: 133 },
  { id: "V-07", route: "c", offset: .57, duration: 133 }, { id: "V-08", route: "c", offset: .83, duration: 133 },
  { id: "V-09", route: "d", offset: .29, duration: 118 }, { id: "V-10", route: "d", offset: .68, duration: 118 },
  { id: "V-11", route: "e", offset: .20, duration: 137 }, { id: "V-12", route: "e", offset: .70, duration: 137 },
  { id: "F-01", route: "a", offset: .87, duration: 112, friendly: true },
  { id: "F-02", route: "b", offset: .82, duration: 125, friendly: true },
  { id: "F-03", route: "d", offset: .47, duration: 118, friendly: true },
];
const DRONES = [
  { id: "D-01", label: "Drone 01", view: "drone01", x: 383, y: 218, rx: 43, ry: 22, phase: .5 },
  { id: "D-02", label: "Drone 02", view: "drone02", x: 898, y: 502, rx: 36, ry: 25, phase: 3 },
];
const BUILDINGS = [
  [192,214,26,17,-7], [226,206,34,19,-7], [232,236,23,16,-7], [166,242,20,14,-7],
  [396,283,43,23,22], [445,290,32,23,22], [426,325,28,16,22], [384,322,24,20,22],
  [597,194,47,21,10], [653,208,31,20,10], [617,232,30,19,10], [574,235,26,18,10],
  [900,319,25,20,31], [940,332,40,25,31], [885,356,34,15,31], [933,372,28,16,31],
  [553,489,24,19,28], [590,516,42,17,28], [542,532,27,17,28],
  [1000,555,37,21,15], [1046,575,26,18,15], [1006,591,25,13,15],
];
const inputKey = (event, callback) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); callback(); } };

export default function GroundOverview({ active, elapsedRef, showOverlays, compact, selectedId, onSelect, onOpenCamera, focusDroneId }) {
  const rootRef = useRef(null), pathRefs = useRef({}), markers = useRef({}), trails = useRef({}), drones = useRef({}), footprints = useRef({});
  const [width, setWidth] = useState(1200);
  const scale = 1200 / Math.max(width, 300);
  useEffect(() => { if (focusDroneId) drones.current[focusDroneId]?.focus({ preventScroll: true }); }, [focusDroneId]);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    if (rootRef.current) observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const paths = Object.fromEntries(ROUTES.map(route => [route.id, { path: pathRefs.current[route.id], length: pathRefs.current[route.id]?.getTotalLength() || 1 }]));
    let request, previous;
    const point = (track, time) => {
      const route = paths[track.route];
      const progress = ((track.offset + time / track.duration) % 1 + 1) % 1;
      return route.path.getPointAtLength(progress * route.length);
    };
    const paint = () => {
      const time = elapsedRef.current;
      TRACKS.forEach(track => {
        const p = point(track, time), next = point(track, time + .15);
        const angle = Math.atan2(next.y - p.y, next.x - p.x) * 180 / Math.PI;
        markers.current[track.id]?.setAttribute("transform", `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`);
        markers.current[track.id]?.querySelector("[data-body]")?.setAttribute("transform", `rotate(${angle.toFixed(1)})`);
        const tail = Array.from({ length: 18 }, (_, i) => point(track, time - (17 - i) * .25));
        const crossedEdge = Math.hypot(tail[0].x - p.x, tail[0].y - p.y) > 230;
        trails.current[track.id]?.setAttribute("d", crossedEdge ? "" : tail.map((pose, i) => `${i ? "L" : "M"}${pose.x.toFixed(1)} ${pose.y.toFixed(1)}`).join(" "));
      });
      DRONES.forEach(drone => {
        const phase = time / 25 + drone.phase;
        const x = drone.x + Math.cos(phase) * drone.rx, y = drone.y + Math.sin(phase) * drone.ry;
        drones.current[drone.id]?.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
        footprints.current[drone.id]?.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${drone.id === "D-01" ? 25 : 195})`);
      });
    };
    paint();
    const animate = now => {
      if (previous !== undefined) elapsedRef.current += Math.min((now - previous) / 1000, .08);
      previous = now; paint(); request = requestAnimationFrame(animate);
    };
    if (active) request = requestAnimationFrame(animate);
    return () => { if (request !== undefined) cancelAnimationFrame(request); };
  }, [active, elapsedRef, showOverlays]);

  return <div ref={rootRef} className={styles.overview} data-compact={compact} data-overlays={showOverlays}>
    <svg viewBox="0 0 1200 700" className={styles.map} role="group" aria-label="Illustrative overhead map with twelve vehicle tracks, three friendly vehicles, and two friendly camera drones">
      <rect width="1200" height="700" fill="#141414" />
      <g className={styles.parcels}>
        <path d="M390 88 574 128 550 179 372 141Z" /><path d="m663 116 156 11-9 74-160-26Z" />
        <path d="m71 374 166-29 33 111-182 27Z" /><path d="m834 407 175 93-47 42-161-89Z" />
      </g>
      <g className={styles.roads}>{ROUTES.map(route => <g key={route.id}>
        <path d={route.path} className={styles.roadEdge} />
        <path d={route.path} className={styles.roadFill} />
        <path d={route.path} className={styles.roadCenter} ref={element => { pathRefs.current[route.id] = element; }} />
      </g>)}</g>
      <g className={styles.accessRoads}><path d="m218 196 3 47 67 6M438 246l-23 52 42 30M647 253l8-41M868 319l51 22M536 496l29 44M1020 518l-16 47" /></g>
      <g className={styles.buildings}>{BUILDINGS.map(([x,y,w,h,angle],index) => <g key={index} transform={`translate(${x} ${y}) rotate(${angle})`}><rect width={w} height={h} /></g>)}</g>
      <g className={styles.mapLabels} aria-hidden="true"><text x="104" y="126">NORTH RIDGE</text><text x="615" y="398" transform="rotate(-10 615 398)">CORRIDOR A</text><text x="925" y="627">SOUTH APPROACH</text><text x="97" y="618">SECTOR 02</text></g>
      {showOverlays && <g className={styles.footprints}>{DRONES.map(drone => <g key={drone.id} ref={element => { footprints.current[drone.id] = element; }}><path d="M0 0 86 86Q19 133-43 107Z" /><path d="M86 86Q19 133-43 107" /></g>)}</g>}
      {showOverlays && <g className={styles.trails}>{TRACKS.map(track => <path key={track.id} ref={element => { trails.current[track.id] = element; }} data-friendly={track.friendly || undefined} />)}</g>}
      {TRACKS.map(track => <g key={track.id} ref={element => { markers.current[track.id] = element; }} className={styles.vehicle} data-friendly={track.friendly || undefined} data-selected={selectedId === track.id} transform="translate(-50 -50)" role="button" tabIndex={0} aria-label={`Select ${track.friendly ? "friendly vehicle" : "vehicle track"} ${track.id}`} onClick={() => onSelect(track.id)} onKeyDown={event => inputKey(event, () => onSelect(track.id))}>
        <g transform={`scale(${scale})`}>
          <circle className={styles.hitArea} r="22" />
          <g data-body><rect className={styles.vehicleBody} x="-5" y="-2.5" width="10" height="5" rx=".6" /><path d="M1-2v4M-3-2v4" className={styles.vehicleGlass} /></g>
          {showOverlays && <><rect className={styles.vehicleBracket} x="-9" y="-8" width="18" height="16" /><text x="13" y="-8" className={styles.vehicleId}>{track.id}</text>{track.friendly && <path className={styles.friendlyChevron} d="m-4-12 4-3 4 3" />}</>}
        </g>
      </g>)}
      {DRONES.map(drone => <g key={drone.id} ref={element => { drones.current[drone.id] = element; }} className={styles.drone} transform="translate(-50 -50)" role="button" tabIndex={0} aria-label={`Open ${drone.label} full-color camera`} onClick={() => onOpenCamera(drone.view)} onKeyDown={event => inputKey(event, () => onOpenCamera(drone.view, true))}>
        <g transform={`scale(${scale})`}>
          <circle className={styles.droneHit} r="24" />
          <circle className={styles.droneRing} r="16" />
          <path className={styles.droneIcon} d="m0-8 4 7 7 3-1 3-8-2-2 5-2-5-8 2-1-3 7-3Z" />
          {showOverlays && <><text x="23" y="-2" className={styles.droneId}>{drone.id}<tspan x="23" dy="12">CAMERA ↗</tspan></text><circle className={styles.droneDot} cx="-13" cy="-13" r="2.5" /></>}
        </g>
      </g>)}
      <g className={styles.north} transform="translate(1129 91)" aria-hidden="true"><path d="m0 17 0-34m-5 9 5-9 5 9" /><text y="-25" textAnchor="middle">N</text></g>
    </svg>
    {showOverlays && <>
      <div className={styles.topline}><span><i />Area overview</span><span>SIMULATED</span></div>

      <div className={styles.legend}><span><i className={styles.trackKey} />Vehicles <b>12</b></span><span><i className={styles.friendlyKey} />Friendly <b>03</b></span><span><i className={styles.droneKey} />Our drones <b>02</b></span></div>
      <div className={styles.selection}><small>SELECTED OBJECT</small><strong>{selectedId}</strong><span>{selectedId?.startsWith("F") ? "Friendly vehicle" : "Vehicle track"}</span></div>
      <div className={styles.cameraLinks} role="group" aria-label="Open an aircraft camera">{DRONES.map(drone => <button key={drone.id} type="button" onClick={event => onOpenCamera(drone.view, event.detail === 0)}>{drone.id}<span aria-hidden="true">↗</span></button>)}</div>
    </>}
  </div>;
}
