"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./FlightSequence.module.css";

const FILM = "/media/flight-sequence-v2.mp4";
const START_POSTER = "/media/flight-start-v2.webp";
const ACQUIRED_POSTER = "/media/flight-poster-v2.webp";
let trackRequest;

function loadTrack() {
  if (!trackRequest) {
    trackRequest = fetch("/media/flight-track-v2.json")
      .then((response) => {
        if (!response.ok) throw new Error("Illustration metadata unavailable");
        return response.json();
      })
      .catch((error) => { trackRequest = undefined; throw error; });
  }
  return trackRequest;
}

// Geometry is exported by the film renderer, not inferred by a detection system.
function sampleTrack(track, seconds) {
  const time = Math.max(0, Math.min(seconds, track.duration - 1 / track.fps));
  const position = time * track.fps;
  const index = Math.min(Math.floor(position), track.samples.length - 1);
  const from = track.samples[index];
  const to = track.samples[Math.min(index + 1, track.samples.length - 1)];
  const fraction = position - index;
  const sample = { ...from, t: time };
  for (const key of ["cx", "cy", "w", "h", "rotation", "opacity", "acquisition", "zoom", "confidence"]) {
    sample[key] = from[key] + (to[key] - from[key]) * fraction;
  }
  return sample;
}

function timeLabel(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${(seconds % 60).toFixed(1).padStart(4, "0")}`;
}

function TrackingOverlay({ track, frame, size }) {
  if (!track || !frame) return null;
  const scale = Math.min(size.width / track.width, size.height / track.height);
  const planeWidth = size.width ? track.width * scale : "100%";
  const planeHeight = size.height ? track.height * scale : "100%";
  const expansion = 1 + (1 - frame.acquisition) * 0.3;
  const w = frame.w * expansion + 22;
  const h = frame.h * expansion + 22;
  const x = -w / 2;
  const y = -h / 2;
  const corner = Math.min(34, Math.max(20, w * 0.075));
  const corners = `M${x + corner},${y}H${x}V${y + corner} M${-x - corner},${y}H${-x}V${y + corner} M${x},${-y - corner}V${-y}H${x + corner} M${-x - corner},${-y}H${-x}V${-y - corner}`;
  const angle = frame.rotation * Math.PI / 180;
  const leaderX = frame.cx + x * Math.cos(angle) - (-y) * Math.sin(angle);
  const leaderY = frame.cy + x * Math.sin(angle) + (-y) * Math.cos(angle);
  const acquiring = frame.phase === "Acquiring";
  const identified = frame.acquisition >= 1;
  const ringRadius = Math.hypot(w, h) / 2 + 28;

  return (
    <div className={styles.overlay} style={{ width: planeWidth, height: planeHeight, left: size.width ? (size.width - planeWidth) / 2 : 0, top: size.height ? (size.height - planeHeight) / 2 : 0 }} aria-hidden="true" data-acquiring={acquiring}>
      <div className={styles.sceneHeader}><span>AIR / VISUAL TRACKING</span><span className={styles.simulation}>SIMULATED</span></div>
      <div className={styles.status}><span />{frame.phase}</div>
      <svg className={styles.trackingGeometry} viewBox={`0 0 ${track.width} ${track.height}`} fill="none" preserveAspectRatio="none">
        <g opacity={frame.opacity}>
          {identified && frame.w > track.width * 0.24 && <polyline className={styles.leader} points={`${leaderX},${leaderY} ${track.width * 0.20},${track.height * 0.765} ${track.width * 0.055},${track.height * 0.765}`} vectorEffect="non-scaling-stroke" />}
          <g transform={`translate(${frame.cx} ${frame.cy}) rotate(${frame.rotation})`}>
            <path className={styles.bracket} d={corners} vectorEffect="non-scaling-stroke" />
          </g>
          {acquiring && <g className={styles.acquisitionRing} transform={`translate(${frame.cx} ${frame.cy}) rotate(${frame.t * 22})`} opacity={1 - frame.acquisition}>
            <circle r={ringRadius} strokeDasharray="26 39" vectorEffect="non-scaling-stroke" />
            <path d={`M0 ${-ringRadius - 12}V${-ringRadius + 2} M${ringRadius - 2} 0H${ringRadius + 12} M0 ${ringRadius - 2}V${ringRadius + 12} M${-ringRadius - 12} 0H${-ringRadius + 2}`} vectorEffect="non-scaling-stroke" />
          </g>}
        </g>
      </svg>
      <div className={styles.objectInfo} style={{ opacity: frame.opacity }}>
        <span className={styles.objectId}>SELECTED OBJECT / A-01</span>
        <strong>{identified ? "Fixed-wing aircraft" : "Classifying object"}</strong>
        <div className={styles.confidence}><span>Track continuity</span><b>{identified ? "Established" : "Acquiring"}</b><em>frame {String(Math.floor(frame.t * track.fps)).padStart(3, "0")}</em></div>
      </div>
      <div className={styles.sequenceFooter}>
        <span className={styles.timecode}>{timeLabel(frame.t)} <span>/ {timeLabel(track.duration)}</span></span>
        <span className={styles.zoom}>View magnification <b>{frame.zoom.toFixed(1)}×</b><span>simulated</span></span>
      </div>
      <div className={styles.progressTrack}><span style={{ transform: `scaleX(${frame.t / track.duration})` }} /></div>
    </div>
  );
}

/** Clean authored film in the hero; synchronized illustrative annotations in the demo. */
export default function FlightSequence({
  motionPaused = false,
  showOverlays = true,
  variant = "demo",
  className = "",
  onPlaybackStateChange,
}) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const callbackRef = useRef(onPlaybackStateChange);
  const [inView, setInView] = useState(false);
  const [preferenceReady, setPreferenceReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [playbackState, setPlaybackState] = useState("paused");
  const [track, setTrack] = useState(null);
  const [frame, setFrame] = useState(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const wantsPlayback = preferenceReady && inView && !motionPaused && !reducedMotion;
  const hasOverlay = variant !== "hero" && showOverlays;
  const staticPoster = reducedMotion || playbackState === "error";

  useEffect(() => { callbackRef.current = onPlaybackStateChange; }, [onPlaybackStateChange]);
  useEffect(() => { callbackRef.current?.(playbackState); }, [playbackState]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReducedMotion(preference.matches); setPreferenceReady(true); };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasOverlay) return undefined;
    let cancelled = false;
    loadTrack().then((data) => { if (!cancelled) setTrack(data); }).catch(() => {});
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    if (rootRef.current) observer.observe(rootRef.current);
    return () => { cancelled = true; observer.disconnect(); };
  }, [hasOverlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    let cancelled = false;
    if (!wantsPlayback) {
      video.pause();
      setPlaybackState(reducedMotion ? "reduced-motion" : "paused");
    } else {
      video.play()?.then(() => {
        if (!cancelled) setPlaybackState("playing");
      }).catch((error) => {
        if (!cancelled && error.name !== "AbortError") setPlaybackState(video.error ? "error" : "blocked");
      });
    }
    return () => { cancelled = true; };
  }, [wantsPlayback, reducedMotion]);

  const syncFrame = useCallback(() => {
    if (track) setFrame(sampleTrack(track, staticPoster ? track.posterTime : videoRef.current?.currentTime || 0));
  }, [track, staticPoster]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !track || !hasOverlay) return undefined;
    let cancelled = false;
    let request;
    const nativeFrames = typeof video.requestVideoFrameCallback === "function";
    syncFrame();
    video.addEventListener("seeked", syncFrame);
    video.addEventListener("loadedmetadata", syncFrame);
    const update = (_, metadata) => {
      if (cancelled) return;
      setFrame(sampleTrack(track, nativeFrames ? metadata.mediaTime : video.currentTime));
      request = nativeFrames ? video.requestVideoFrameCallback(update) : window.requestAnimationFrame(update);
    };
    if (wantsPlayback && playbackState === "playing" && !staticPoster) {
      request = nativeFrames ? video.requestVideoFrameCallback(update) : window.requestAnimationFrame(update);
    }
    return () => {
      cancelled = true;
      video.removeEventListener("seeked", syncFrame);
      video.removeEventListener("loadedmetadata", syncFrame);
      if (request !== undefined) {
        if (nativeFrames) video.cancelVideoFrameCallback(request);
        else window.cancelAnimationFrame(request);
      }
    };
  }, [track, hasOverlay, wantsPlayback, playbackState, staticPoster, syncFrame]);

  const playFromGesture = async () => {
    const video = videoRef.current;
    if (!video || motionPaused || reducedMotion) return;
    if (video.error) video.load();
    try { await video.play(); setPlaybackState("playing"); }
    catch { setPlaybackState(video.error ? "error" : "blocked"); }
  };

  const showFallback = (playbackState === "blocked" || playbackState === "error") && !motionPaused && !reducedMotion;
  const showPoster = !preferenceReady || staticPoster;

  return (
    <div ref={rootRef} className={`${styles.sequence} ${className}`.trim()} data-variant={variant === "hero" ? "hero" : "demo"} data-playback={playbackState} role="group" aria-label="Illustrative flight sequence">
      <video
        ref={videoRef}
        className={styles.video}
        src={FILM}
        poster={START_POSTER}
        width="1920"
        height="1080"
        autoPlay={wantsPlayback}
        muted playsInline loop preload="metadata"
        aria-label="An illustrative film of a distant aircraft approaching above a cloud landscape."
        onPlaying={() => setPlaybackState("playing")}
        onPause={() => setPlaybackState((state) => reducedMotion ? "reduced-motion" : state === "blocked" || state === "error" ? state : "paused")}
        onError={() => setPlaybackState("error")}
      />
      {showPoster && <img className={styles.poster} src={staticPoster ? ACQUIRED_POSTER : START_POSTER} alt="Illustrative aircraft above a cloud landscape" decoding="async" draggable="false" />}
      {hasOverlay && <TrackingOverlay track={track} frame={frame} size={size} />}
      {showFallback && <button className={styles.playButton} type="button" onClick={playFromGesture}><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="m4 2 8 5-8 5V2Z" fill="currentColor" /></svg>{playbackState === "error" ? "Retry sequence" : "Play sequence"}</button>}
    </div>
  );
}
