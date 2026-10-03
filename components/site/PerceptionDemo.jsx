"use client";

import { useEffect, useRef, useState } from "react";
import FlightSequence from "./FlightSequence";
import styles from "./PerceptionDemo.module.css";

// Hand-positioned illustration annotations, expressed in source-image percentages.
const SCENES = {
  air: {
    name: "Air",
    image: "/media/perception-air.webp",
    width: 1916,
    height: 821,
    alt: "A fixed-wing aircraft above a mountain landscape, with an illustrative annotation around the aircraft",
    targets: [
      { id: "A-01", name: "Fixed-wing aircraft", label: "Aircraft", x: 71.5, y: 40.9, width: 28, height: 18 },
    ],
  },
  ground: {
    name: "Ground",
    image: "/media/perception-ground.webp",
    width: 1672,
    height: 941,
    alt: "Three vehicles on a mountain road, with an illustrative annotation around each vehicle",
    targets: [
      { id: "G-01", name: "Utility van", label: "Van", x: 34.55, y: 71.25, width: 5.4, height: 8 },
      { id: "G-02", name: "Passenger car", label: "Car", x: 52.85, y: 44.9, width: 4.8, height: 7 },
      { id: "G-03", name: "Utility vehicle", label: "SUV", x: 70.05, y: 19, width: 4.6, height: 7.2 },
    ],
  },
};

const MAX_SCENE_SCALE = 1.02;

function imageGeometry(scene, frameWidth, frameHeight) {
  const ratio = scene.width / scene.height;
  let width = Math.max(frameWidth, frameHeight * ratio);
  let height = width / ratio;
  // A custom frame may be tall. Use contain if cover would clip any annotation.
  const allVisible = scene.targets.every((target) => {
    const horizontalEdge = Math.max(Math.abs(target.x - target.width / 2 - 50), Math.abs(target.x + target.width / 2 - 50)) / 100;
    const verticalEdge = Math.max(Math.abs(target.y - target.height / 2 - 50), Math.abs(target.y + target.height / 2 - 50)) / 100;
    return horizontalEdge * width * MAX_SCENE_SCALE < frameWidth / 2 && verticalEdge * height * MAX_SCENE_SCALE < frameHeight / 2;
  });
  if (!allVisible) {
    width = Math.min(frameWidth, frameHeight * ratio);
    height = width / ratio;
  }
  return { width, height, left: (frameWidth - width) / 2, top: (frameHeight - height) / 2 };
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  return reduced;
}

function PlaybackIcon({ paused }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      {paused ? <path d="m4 2 6 4-6 4V2Z" fill="currentColor" /> : <path d="M4 2v8M8 2v8" stroke="currentColor" strokeWidth="1.5" />}
    </svg>
  );
}

/** Shared image and annotation plane; this is an illustration, not a detection system. */
export function TrackedScene({
  scene = "ground",
  motionPaused = false,
  className = "",
  interactive = false,
  showOverlays = true,
  selectedId,
  onSelect,
}) {
  const sceneKey = SCENES[scene] ? scene : "ground";
  const data = SCENES[sceneKey];
  const viewportRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [localSelection, setLocalSelection] = useState(null);
  const selection = selectedId ?? localSelection;
  const geometry = imageGeometry(data, size.width, size.height);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const selectObject = (target) => {
    setLocalSelection(target.id);
    onSelect?.(target);
  };

  return (
    <div
      ref={viewportRef}
      className={`${styles.viewport} ${className}`.trim()}
      data-scene={sceneKey}
      data-paused={motionPaused}
      data-overlays={showOverlays}
    >
      <div
        className={styles.sourcePlane}
        style={size.width ? geometry : { width: "100%", aspectRatio: `${data.width} / ${data.height}` }}
      >
        <div className={styles.movingPlane} key={sceneKey} style={{ "--scene-max-scale": MAX_SCENE_SCALE }}>
          <img
            className={styles.image}
            src={data.image}
            alt={data.alt}
            width={data.width}
            height={data.height}
            loading="lazy"
            decoding="async"
            draggable="false"
          />
          {showOverlays && data.targets.map((target) => (
            <div
              key={target.id}
              className={styles.annotation}
              data-selected={selection === target.id}
              data-label-side={target.x > 65 ? "right" : "left"}
              style={{ left: `${target.x - target.width / 2}%`, top: `${target.y - target.height / 2}%`, width: `${target.width}%`, height: `${target.height}%` }}
            >
              <span className={styles.corners} aria-hidden="true" />
              <span className={styles.objectLabel} aria-hidden="true">{target.label}<span>{target.id}</span></span>
              {interactive && (
                <button
                  type="button"
                  className={styles.objectButton}
                  aria-label={`Select ${target.name}, ${target.id}`}
                  aria-pressed={selection === target.id}
                  onClick={() => selectObject(target)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PerceptionDemo({ motionPaused = false }) {
  const [sceneKey, setSceneKey] = useState("air");
  const [localPaused, setLocalPaused] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const [selection, setSelection] = useState(null);
  const [replay, setReplay] = useState(0);
  const [filmPlayback, setFilmPlayback] = useState("paused");
  const reducedMotion = useReducedMotion();
  const paused = motionPaused || localPaused || reducedMotion;

  const changeScene = (key) => {
    setSceneKey(key);
    setSelection(null);
  };

  return (
    <div className={styles.demo}>
      <div className={styles.tabs} role="group" aria-label="Choose a scene">
        {Object.entries(SCENES).map(([key, data]) => (
          <button key={key} className={styles.tab} type="button" aria-pressed={sceneKey === key} onClick={() => changeScene(key)}>{data.name}</button>
        ))}
      </div>
      {sceneKey === "air" ? <FlightSequence key={replay} motionPaused={paused} onPlaybackStateChange={setFilmPlayback} /> : <TrackedScene
        scene={sceneKey}
        motionPaused
        interactive
        showOverlays={showOverlays}
        selectedId={selection?.id || ""}
        onSelect={setSelection}
      />}
      <div className={styles.footer}>
        <p className={styles.caption}>
          <span>{sceneKey === "air" ? "Acquire. Lock. Follow. / 16-second concept film" : "Ground recognition / Illustrative scene"}</span>
          {sceneKey === "ground" && selection && showOverlays && <span className={styles.selection}>{selection.name} · {selection.id}</span>}
        </p>
        <div className={styles.controls}>
          {sceneKey === "ground" ? <button type="button" className={styles.control} aria-pressed={showOverlays} onClick={() => setShowOverlays((value) => !value)}>
            <span className={styles.annotationIcon} aria-hidden="true" />
            <span>{showOverlays ? "Hide annotations" : "Show annotations"}</span>
          </button> : <>
          <button type="button" className={styles.control} onClick={() => { setReplay(value => value + 1); setLocalPaused(false); }} disabled={motionPaused || reducedMotion} aria-label="Replay flight film"><span aria-hidden="true">↺</span><span>Replay</span></button>
          {!["blocked", "error"].includes(filmPlayback) && <button
            type="button"
            className={styles.control}
            onClick={() => setLocalPaused((value) => !value)}
            disabled={motionPaused || reducedMotion}
            aria-label={reducedMotion ? "Motion disabled by reduced motion preference" : motionPaused ? "Motion paused by page control" : paused ? "Resume sequence" : "Pause sequence"}
          >
            <PlaybackIcon paused={paused} />
            <span>{reducedMotion ? "Motion off" : motionPaused ? "Paused" : paused ? "Resume" : "Pause"}</span>
          </button>}</>}
        </div>
      </div>
    </div>
  );
}
