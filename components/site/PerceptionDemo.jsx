"use client";

import { useEffect, useState } from "react";
import FlightSequence from "./FlightSequence";
import GroundRecon from "./GroundRecon";
import styles from "./PerceptionDemo.module.css";

function PlaybackIcon({ paused }) {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">{paused ? <path d="m4 2 6 4-6 4V2Z" fill="currentColor" /> : <path d="M4 2v8M8 2v8" stroke="currentColor" strokeWidth="1.5" />}</svg>;
}

export function TrackedScene({ motionPaused = false, className = "", showOverlays = true }) {
  return <GroundRecon compact motionPaused={motionPaused} showOverlays={showOverlays} className={className} />;
}

export default function PerceptionDemo({ motionPaused = false }) {
  const [sceneKey, setSceneKey] = useState("air");
  const [localPaused, setLocalPaused] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const [replay, setReplay] = useState(0);
  const [filmPlayback, setFilmPlayback] = useState("paused");
  const [reducedMotion, setReducedMotion] = useState(false);
  const paused = motionPaused || localPaused || reducedMotion;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  return <div id="perception-demo" className={styles.demo}>
    <div className={styles.tabs} role="group" aria-label="Choose a scene">
      <button className={styles.tab} type="button" aria-pressed={sceneKey === "air"} onClick={() => setSceneKey("air")}>Air tracking</button>
      <button className={styles.tab} type="button" aria-pressed={sceneKey === "ground"} onClick={() => setSceneKey("ground")}>Ground reconnaissance</button>
      <span className={styles.demoLabel}>ILLUSTRATIVE SEQUENCES</span>
    </div>
    {sceneKey === "air" ? <FlightSequence key={`air-${replay}`} motionPaused={paused} showOverlays={showOverlays} onPlaybackStateChange={setFilmPlayback} /> : <GroundRecon key={`ground-${replay}`} motionPaused={paused} showOverlays={showOverlays} />}
    <div className={styles.footer}>
      <p className={styles.caption}>{sceneKey === "air" ? "Visual acquisition / continuous tracking" : "Ground observation / simulated vehicle movement"}</p>
      <div className={styles.controls}>
        <button type="button" className={styles.control} aria-pressed={showOverlays} onClick={() => setShowOverlays(value => !value)}><span className={styles.annotationIcon} aria-hidden="true" /><span>{showOverlays ? "Hide overlay" : "Show overlay"}</span></button>
        <button type="button" className={styles.control} onClick={() => { setReplay(value => value + 1); setLocalPaused(false); }} disabled={motionPaused || reducedMotion} aria-label="Replay sequence"><span aria-hidden="true">↺</span><span>Replay</span></button>
        {(sceneKey === "ground" || !["blocked", "error"].includes(filmPlayback)) && <button type="button" className={styles.control} onClick={() => setLocalPaused(value => !value)} disabled={motionPaused || reducedMotion} aria-label={reducedMotion ? "Motion disabled by reduced motion preference" : motionPaused ? "Motion paused by page control" : paused ? "Resume sequence" : "Pause sequence"}><PlaybackIcon paused={paused} /><span>{reducedMotion ? "Motion off" : paused ? "Resume" : "Pause"}</span></button>}
      </div>
    </div>
  </div>;
}
