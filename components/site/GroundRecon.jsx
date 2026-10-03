"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState } from "react";
import styles from "./GroundRecon.module.css";

const GroundReconWorld = dynamic(() => import("./GroundReconWorld"), { ssr: false });
const VEHICLES = [
  { id: "G-01", color: "#bcbdb3", offset: 32, lane: 1.88, speed: 54, occupants: "1–2" },
  { id: "G-02", color: "#646e68", offset: 0, lane: 1.88, speed: 54, occupants: "2–3" },
  { id: "G-03", color: "#a4aaa4", offset: -35, lane: 1.88, speed: 54, occupants: "1–2" },
];
const VIEWS = [
  { id: "aerial", label: "Aerial", description: "Wide area / elevated perspective" },
  { id: "drone01", label: "Drone 01", description: "Rear quarter / following vehicle" },
  { id: "drone02", label: "Drone 02", description: "Front quarter / opposite side" },
];

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error("GroundRecon render failure:", error); this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function GroundRecon({ motionPaused = false, showOverlays = true, compact = false, className = "" }) {
  const rootRef = useRef(null);
  const trackerRefs = useRef([]);
  const [inView, setInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [view, setView] = useState("drone01");
  const [failed, setFailed] = useState(false);
  const onFailure = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(preference.matches);
    const syncVisibility = () => setPageVisible(document.visibilityState !== "hidden");
    syncMotion(); syncVisibility();
    preference.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setHasEntered(true);
    }, { threshold: .02 });
    if (rootRef.current) observer.observe(rootRef.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  const active = inView && pageVisible && !motionPaused && !reducedMotion;
  const selected = VEHICLES[selectedIndex];
  const selectedView = VIEWS.find(item => item.id === view);
  const paused = motionPaused || reducedMotion;
  const chooseVehicle = useCallback(index => setSelectedIndex(index), []);

  return <div ref={rootRef} className={`${styles.recon} ${className}`} data-compact={compact} data-failed={failed}>
    <div className={styles.scene} role="group" aria-label="Interactive 3D reconstruction of three civilian vehicles on a country road" data-overlays={showOverlays}>
      <div className={styles.canvas}>
        {hasEntered && !failed && <SceneBoundary onFailure={onFailure}>
          <GroundReconWorld active={active} reducedMotion={reducedMotion} view={view} selectedIndex={selectedIndex} vehicles={VEHICLES} trackerRefs={trackerRefs} onSelect={chooseVehicle} onFailure={onFailure} />
        </SceneBoundary>}
        {(!hasEntered || failed) && <img className={styles.fallbackImage} src="/media/ground-road-clean.webp" alt="A country road through scrubland" width="1672" height="941" loading="lazy" />}
      </div>
      {!failed && showOverlays && <div className={styles.trackingLayer} aria-hidden="true">
        {VEHICLES.map((vehicle, index) => <div key={vehicle.id} ref={element => { trackerRefs.current[index] = element; }} className={styles.track} data-selected={index === selectedIndex}>
          <i /><i /><i /><i />
          <span className={styles.trackLabel}>{vehicle.id}<span>{index === selectedIndex ? "FOLLOWING" : "VEHICLE"}</span></span>
        </div>)}
      </div>}
      {showOverlays && !failed && <>
        <div className={styles.sceneHeader}><span><i />GROUND / 3D RECONSTRUCTION</span><span>SIMULATED SCENARIO</span></div>
        {!compact && <>
          <div className={styles.cameraLabel}><span>VIEWPOINT</span><strong>{selectedView.label}</strong><small>{selectedView.description}</small></div>
          <div className={styles.telemetry}>
            <span className={styles.telemetryTitle}>{selected.id}<span>SIMULATED DATA</span></span>
            <div className={styles.speed}><strong>{selected.speed}</strong><span>km/h<small>Speed (simulated)</small></span></div>
            <div className={styles.occupants}><span>Occupants (scenario)</span><strong>{selected.occupants}<small>approx.</small></strong></div>
          </div>
          <div className={styles.sceneFooter}><span>{paused ? "MOTION PAUSED" : "CONTINUOUS 3D FOLLOW"}</span><span>03 VEHICLES / 03 PERSPECTIVES</span></div>
        </>}
      </>}
      {failed && <div className={styles.fallbackNotice}><span>3D PREVIEW UNAVAILABLE</span><p>This browser could not display the interactive scene.</p><small>The image is a static scene reference.</small></div>}
      {compact && !failed && <span className={styles.compactBadge}>3D / SIMULATED</span>}
    </div>
    {!compact && <>
      <div className={styles.observationBar}>
        <div className={styles.viewChoices} role="group" aria-label="3D camera viewpoint">{VIEWS.map(item => <button type="button" key={item.id} disabled={failed} aria-pressed={view === item.id} onClick={() => setView(item.id)}><span className={styles.viewIcon} aria-hidden="true">{item.id === "aerial" ? "⌖" : "↗"}</span>{item.label}</button>)}</div>
        <span className={styles.viewStatus}>{failed ? "STATIC REFERENCE" : "3D VIEW / SIMULATED"}</span>
      </div>
      <div className={styles.context}>
        <div><span className={styles.kicker}>A DIFFERENT PERSPECTIVE</span><h3>Move around the scene.<br />See more of the story.</h3><p>Follow the same vehicle from above, behind, or across the road. Each view reveals its shape, motion, and place in the wider scene.</p></div>
        <div className={styles.vehiclePanel}>
          <div className={styles.vehiclePanelTitle}><span>SELECT A VEHICLE</span><span>03 IN SCENARIO</span></div>
          <div className={styles.vehicleChoices} role="group" aria-label="Select a vehicle">{VEHICLES.map((vehicle, index) => <button type="button" key={vehicle.id} disabled={failed} aria-pressed={selectedIndex === index} onClick={() => setSelectedIndex(index)}><span style={{ backgroundColor: vehicle.color }} />{vehicle.id}<small>{failed ? "Unavailable" : selectedIndex === index ? "Following" : "Follow"}</small></button>)}</div>
          <p className={styles.scenarioNote}>Digital reconstruction. Speed and approximate occupant counts are authored scenario values; occupancy is not inferred from the windows.</p>
        </div>
      </div>
    </>}
  </div>;
}
