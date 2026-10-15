"use client";

import { useEffect, useRef, useState } from "react";
import FlightSequence from "./FlightSequence";
import monitor from "./ProveMonitor.module.css";
import styles from "./InterceptionFilm.module.css";

function Screen({ paused, setPaused, replay, setReplay, inactive = false }) {
  const viewport = useRef(null);
  const [scale, setScale] = useState(1);
  const [playback, setPlayback] = useState("paused");
  const reducedMotion = playback === "reduced-motion";
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1000));
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, []);
  return <div className={styles.viewport} ref={viewport}>
    <div className={styles.screen} style={{ transform: `scale(${scale})` }}>
      <div className={styles.header}><strong><span aria-hidden="true">◭</span> ACT-1</strong><span>ACTPROVE / ONBOARD PERCEPTION</span><span>ILLUSTRATIVE DEMO</span></div>
      <FlightSequence key={replay} className={styles.film} motionPaused={paused || inactive} onPlaybackStateChange={setPlayback} />
      <div className={styles.controls}>
        <span>01 / JET-POWERED UAV <i>CAMERA VIEW</i></span>
        <div>
          <button type="button" onClick={() => { setPaused(false); setReplay(value => value + 1); }} disabled={reducedMotion} aria-label="Replay ACT-1 film">↺ Replay</button>
          {!["blocked", "error"].includes(playback) && <button type="button" onClick={() => setPaused(value => !value)} disabled={reducedMotion} aria-label={paused ? "Resume ACT-1 film" : "Pause ACT-1 film"}>{reducedMotion ? "Motion off" : paused ? "▷ Play" : "Ⅱ Pause"}</button>}
        </div>
      </div>
    </div>
  </div>;
}

export default function InterceptionFilm({ className = "" }) {
  const [paused, setPaused] = useState(false);
  const [replay, setReplay] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef(null);
  const props = { paused, setPaused, replay, setReplay };
  return <figure className={`${monitor.figure} ${className}`} data-system="act-1">
    <div className={monitor.stage}><div className={monitor.device}>
      <img className={monitor.hardware} src="/media/prove-1-field-monitor.webp" alt="ACT-1 illustrative camera interface presented on a graphite field monitor" width="1536" height="1024" loading="lazy" decoding="async" />
      <div className={monitor.display}><Screen {...props} inactive={expanded} /></div>
    </div></div>
    <figcaption className={monitor.caption}><span>ACT-1 / Onboard perception demonstration.</span><button type="button" className={monitor.expand} onClick={() => { setExpanded(true); dialog.current.showModal(); }}>Inspect interface <span aria-hidden="true">↗</span></button></figcaption>
    <dialog className={`${monitor.dialog} ${styles.dialog}`} ref={dialog} aria-label="Explore ACT-1 interface" onClose={() => setExpanded(false)}>
      <div className={monitor.dialogBar}><span>ACT-1 / INTERACTIVE CONCEPT</span><button type="button" onClick={() => dialog.current.close()}>Close interface <span aria-hidden="true">×</span></button></div>
      {expanded && <div className={styles.viewer}><Screen {...props} /></div>}
      <p className={monitor.dialogHint}>Illustrative Shahed-238 camera sequence. Authored animation, not a recorded interception or a demonstration of validated system performance.</p>
    </dialog>
  </figure>;
}
