"use client";

import { useState } from "react";
import FlightSequence from "./FlightSequence";
import styles from "./InterceptionFilm.module.css";

export default function InterceptionFilm({ className = "" }) {
  const [paused, setPaused] = useState(false);
  const [replay, setReplay] = useState(0);
  const [playback, setPlayback] = useState("paused");
  const reducedMotion = playback === "reduced-motion";
  return <div className={`${styles.player} ${className}`} data-system="act-1">
    <FlightSequence key={replay} className={styles.film} motionPaused={paused} onPlaybackStateChange={setPlayback} />
    <div className={styles.controls}>
      <span>ACT-1 <i>/ INTERCEPTION CONCEPT</i></span>
      <div>
        <button type="button" onClick={() => { setPaused(false); setReplay(value => value + 1); }} disabled={reducedMotion} aria-label="Replay ACT-1 film">↺ <span>Replay</span></button>
        {!["blocked", "error"].includes(playback) && <button type="button" onClick={() => setPaused(value => !value)} disabled={reducedMotion} aria-label={paused ? "Resume ACT-1 film" : "Pause ACT-1 film"}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>{reducedMotion ? "Motion off" : paused ? "Play" : "Pause"}</button>}
      </div>
    </div>
  </div>;
}
