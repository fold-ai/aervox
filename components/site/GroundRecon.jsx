"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState } from "react";
import GroundOverview from "./GroundOverview";
import styles from "./GroundRecon.module.css";

const GroundReconWorld = dynamic(() => import("./GroundReconWorld"), { ssr: false });
// The color camera illustrates this corridor subset of the wider authored map.
const VEHICLES = [
  { id: "V-01", color: "#bcbdb3", offset: 32, lane: 1.88, speed: 54, occupants: "1–2" },
  { id: "V-02", color: "#646e68", offset: 0, lane: 1.88, speed: 54, occupants: "2–3" },
  { id: "V-03", color: "#a4aaa4", offset: -35, lane: 1.88, speed: 54, occupants: "1–2" },
];
const VIEWS = [
  { id: "overview", label: "Overview", description: "Area view / all authored tracks" },
  { id: "drone01", label: "Drone 01", description: "Rear quarter / color camera" },
  { id: "drone02", label: "Drone 02", description: "Front quarter / color camera" },
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
  const elapsedRef = useRef(0);
  const cameraButtons = useRef({});
  const returnButton = useRef(null);
  const pendingCameraFocus = useRef(false);
  const [focusDroneId, setFocusDroneId] = useState(null);
  const [inView, setInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [selectedId, setSelectedId] = useState("V-02");
  const [view, setView] = useState("overview");
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
  const overview = view === "overview";
  const selected = VEHICLES[selectedIndex];
  const selectedView = VIEWS.find(item => item.id === view);
  const paused = motionPaused || reducedMotion;
  const chooseVehicle = useCallback(index => { setSelectedIndex(index); setSelectedId(VEHICLES[index].id); }, []);
  const chooseTrack = useCallback(id => {
    setSelectedId(id);
    const index = VEHICLES.findIndex(vehicle => vehicle.id === id);
    if (index !== -1) setSelectedIndex(index);
  }, []);
  const openCamera = useCallback((nextView, keyboard = false) => {
    if (failed) return;
    pendingCameraFocus.current = keyboard;
    setFocusDroneId(null);
    setSelectedId(VEHICLES[selectedIndex].id);
    setView(nextView);
  }, [failed, selectedIndex]);
  useEffect(() => {
    if (view !== "overview" && pendingCameraFocus.current) {
      (compact ? returnButton.current : cameraButtons.current[view])?.focus({ preventScroll: true });
      pendingCameraFocus.current = false;
    }
  }, [view, compact]);
  const chooseView = nextView => nextView === "overview" ? setView("overview") : openCamera(nextView);

  return <div ref={rootRef} className={`${styles.recon} ${className}`} data-compact={compact} data-failed={failed && !overview} data-mode={overview ? "overview" : "camera"}>
    <div className={styles.scene} role="group" aria-label={overview ? "Interactive situational overview with vehicle and friendly aircraft tracks" : "Full-color 3D camera illustrating the Corridor A vehicle subset"} data-overlays={showOverlays}>
      {overview ? <GroundOverview active={active} elapsedRef={elapsedRef} showOverlays={showOverlays} compact={compact} selectedId={selectedId} onSelect={chooseTrack} onOpenCamera={openCamera} focusDroneId={focusDroneId} /> : <>
        <div className={styles.canvas}>
          {hasEntered && !failed && <SceneBoundary onFailure={onFailure}>
            <GroundReconWorld active={active} reducedMotion={reducedMotion} view={view} selectedIndex={selectedIndex} vehicles={VEHICLES} trackerRefs={trackerRefs} clockRef={elapsedRef} onSelect={chooseVehicle} onFailure={onFailure} />
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
          {!compact && <div className={styles.sceneHeader}><span><i />GROUND / COLOR CAMERA</span><span>CONCEPT SCENE</span></div>}
          {!compact && <>
            <div className={styles.cameraLabel}><span>OUR AIRCRAFT / D-{view === "drone01" ? "01" : "02"}</span><strong>{selectedView.label}</strong><small>{selectedView.description}</small></div>
            <div className={styles.telemetry}>
              <span className={styles.telemetryTitle}>{selected.id}<span>SCENARIO DATA</span></span>
              <div className={styles.speed}><strong>{selected.speed}</strong><span>km/h<small>Speed (simulated)</small></span></div>
              <div className={styles.occupants}><span>Occupants (scenario)</span><strong>{selected.occupants}<small>approx.</small></strong></div>
            </div>
            <div className={styles.sceneFooter}><span>{paused ? "MOTION PAUSED" : "COLOR CAMERA / 3D"}</span><span>CORRIDOR A · V-01–03 SUBSET</span></div>
          </>}
        </>}
        {failed && <div className={styles.fallbackNotice}><span>3D PREVIEW UNAVAILABLE</span><p>This browser could not display the color camera.</p><button type="button" onClick={() => setView("overview")}>Return to overview</button></div>}
        {compact && <button type="button" ref={returnButton} className={styles.returnOverview} onClick={event => { if (event.detail === 0) setFocusDroneId(view === "drone01" ? "D-01" : "D-02"); setView("overview"); }}><span aria-hidden="true">←</span> Overview <span>/ D-{view === "drone01" ? "01" : "02"}</span></button>}
        {compact && !failed && <span className={styles.compactBadge}>CORRIDOR A / V-01–03</span>}
      </>}
    </div>
    {!compact && <>
      <div className={styles.observationBar}>
        <div className={styles.viewChoices} role="group" aria-label="Overview and aircraft cameras">{VIEWS.map(item => <button type="button" key={item.id} ref={element => { cameraButtons.current[item.id] = element; }} disabled={failed && item.id !== "overview"} aria-pressed={view === item.id} onClick={() => chooseView(item.id)}><span className={styles.viewIcon} aria-hidden="true">{item.id === "overview" ? "⌖" : "↗"}</span>{item.label}</button>)}</div>
        <span className={styles.viewStatus}>{overview ? "AREA VIEW / 17 TRACKS" : failed ? "STATIC REFERENCE" : "COLOR CAMERA / CORRIDOR A"}</span>
      </div>
      <div className={styles.context}>
        <div><span className={styles.kicker}>CONNECTED PERSPECTIVES</span><h3>Understand the area.<br />Choose your perspective.</h3><p>Track movement across the scene. Distinguish friendly vehicles and aircraft, then open a drone’s camera for a closer look.</p></div>
        <div className={styles.vehiclePanel}>
          {overview ? <>
            <div className={styles.vehiclePanelTitle}><span>SELECTED TRACK</span><span>AUTHORED SCENARIO</span></div>
            <div className={styles.selectedTrack}><strong>{selectedId}</strong><span>{selectedId.startsWith("F") ? "Friendly vehicle" : "Vehicle track"}<small>Tracked in area view</small></span><i data-friendly={selectedId.startsWith("F")} /></div>
            <p className={styles.scenarioNote}>Simulated movement and friendly classifications. Select D-01 or D-02 to open the color camera.</p>
          </> : <>
            <div className={styles.vehiclePanelTitle}><span>CAMERA SUBSET / CORRIDOR A</span><span>03 VEHICLES</span></div>
            <div className={styles.vehicleChoices} role="group" aria-label="Select a vehicle in the camera subset">{VEHICLES.map((vehicle, index) => <button type="button" key={vehicle.id} disabled={failed} aria-pressed={selectedIndex === index} onClick={() => chooseVehicle(index)}><span style={{ backgroundColor: vehicle.color }} />{vehicle.id}<small>{failed ? "Unavailable" : selectedIndex === index ? "Following" : "Follow"}</small></button>)}</div>
            <p className={styles.scenarioNote}>Color reconstruction of V-01–03. Speed and occupant ranges are authored scenario values.</p>
          </>}
        </div>
      </div>
    </>}
  </div>;
}
