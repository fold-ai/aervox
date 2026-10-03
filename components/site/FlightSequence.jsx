"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./FlightSequence.module.css";

const FILM = "/media/intercept-sequence-v1.mp4";
const POSTER = "/media/intercept-poster-v1.webp";
const TRACK = "/media/intercept-track-v1.json";
const HERO_POSITION = .64;
let trackRequest;

function loadTrack() {
  if (!trackRequest) {
    trackRequest = fetch(TRACK).then(response => {
      if (!response.ok) throw new Error("Authored film metadata unavailable");
      return response.json();
    }).then(data => {
      if (!data.width || !data.height || !data.fps || !data.duration || !Array.isArray(data.frames) || !data.frames.length) {
        throw new Error("Invalid authored film metadata");
      }
      data.lastLockedPose = [...data.frames].reverse().find(frame => frame.phase === "Locked") || data.frames[0];
      return data;
    }).catch(error => { trackRequest = undefined; throw error; });
  }
  return trackRequest;
}

// These poses come from the film renderer. This visual does not perform detection.
function sampleTrack(track, seconds) {
  const time = Math.max(0, Math.min(seconds, track.duration - 1 / track.fps));
  const position = time * track.fps;
  const index = Math.min(Math.floor(position), track.frames.length - 1);
  const from = track.frames[index];
  const to = track.frames[Math.min(index + 1, track.frames.length - 1)];
  const fraction = position - index;
  const sample = { ...from, time };
  for (const key of ["cx", "cy", "w", "h", "opacity", "lockAlpha"]) {
    const start = Number.isFinite(from[key]) ? from[key] : 1;
    const end = Number.isFinite(to[key]) ? to[key] : start;
    sample[key] = start + (end - start) * fraction;
  }
  const rotationDelta = ((to.rotation - from.rotation + 540) % 360) - 180;
  sample.rotation = from.rotation + rotationDelta * fraction;
  return sample;
}

function phaseLabel(phase) {
  if (phase === "Complete") return "Intercept complete";
  if (phase === "Locked" || phase === "Intercept") return "Locked";
  return "Tracking";
}
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

function TrackingOverlay({ track, frame, size, hero }) {
  if (!track || !frame || !size.width || !size.height) return null;
  const { width, height } = size;
  const scale = hero ? Math.max(width / track.width, height / track.height) : Math.min(width / track.width, height / track.height);
  const planeWidth = track.width * scale, planeHeight = track.height * scale;
  const offsetX = (width - planeWidth) * (hero ? HERO_POSITION : .5);
  const offsetY = (height - planeHeight) * .5;
  const centerX = offsetX + frame.cx * planeWidth, centerY = offsetY + frame.cy * planeHeight;
  const radians = frame.rotation * Math.PI / 180;
  const sourceW = frame.w * planeWidth, sourceH = frame.h * planeHeight;
  const rotatedW = Math.abs(sourceW * Math.cos(radians)) + Math.abs(sourceH * Math.sin(radians));
  const rotatedH = Math.abs(sourceW * Math.sin(radians)) + Math.abs(sourceH * Math.cos(radians));
  // Axis-aligned square contains the full rotated silhouette, including a modest visual margin.
  const side = Math.max(24, Math.max(rotatedW, rotatedH) + (width < 600 ? 12 : 18));
  const left = centerX - side / 2, top = centerY - side / 2;
  const right = left + side, bottom = top + side;
  const corner = Math.min(17, Math.max(8, side * .13));
  const ending = frame.phase === "Intercept" || frame.phase === "Complete";
  const anchor = ending ? track.lastLockedPose : frame;
  const anchorRadians = anchor.rotation * Math.PI / 180;
  const anchorW = anchor.w * planeWidth, anchorH = anchor.h * planeHeight;
  const anchorSide = Math.max(24, Math.max(Math.abs(anchorW * Math.cos(anchorRadians)) + Math.abs(anchorH * Math.sin(anchorRadians)), Math.abs(anchorW * Math.sin(anchorRadians)) + Math.abs(anchorH * Math.cos(anchorRadians))) + (width < 600 ? 12 : 18));
  const anchorX = offsetX + anchor.cx * planeWidth, anchorY = offsetY + anchor.cy * planeHeight;
  const anchorLeft = anchorX - anchorSide / 2, anchorRight = anchorX + anchorSide / 2;
  const anchorTop = anchorY - anchorSide / 2, anchorBottom = anchorY + anchorSide / 2;
  const margin = width < 600 ? 15 : 28;
  const panelWidth = width < 600 ? 132 : 160;
  const panelHeight = hero ? 113 : width < 600 ? 96 : 113;
  const gap = width < 600 ? 13 : 20;
  const rightFits = anchorRight + gap + panelWidth <= width - margin;
  const leftFits = anchorLeft - gap - panelWidth >= margin - 8;
  let panelX, panelY, placement;
  if (rightFits) {
    panelX = anchorRight + gap; panelY = anchorTop; placement = "right";
  } else if (leftFits) {
    panelX = Math.max(margin, anchorLeft - gap - panelWidth); panelY = anchorTop; placement = "left";
  } else {
    panelX = clamp(anchorX - panelWidth / 2, margin, width - margin - panelWidth);
    panelY = anchorBottom + gap; placement = "below";
  }
  const minY = hero ? 92 : 42;
  panelY = clamp(panelY, Math.min(minY, height - panelHeight - 18), height - panelHeight - (hero ? 24 : 35));
  panelX = clamp(panelX, margin, width - margin - panelWidth);
  const fixedMobileInfo = hero && width < 660;
  if (fixedMobileInfo) { panelX = 20; panelY = 116; placement = "fixed"; }
  const corners = `M${left + corner},${top}H${left}V${top + corner} M${right - corner},${top}H${right}V${top + corner} M${left},${bottom - corner}V${bottom}H${left + corner} M${right - corner},${bottom}H${right}V${bottom - corner}`;
  const alpha = clamp(frame.lockAlpha, 0, 1) * clamp(frame.opacity, 0, 1);
  const targetOnScreen = right > 0 && left < width && bottom > 0 && top < height;
  const status = phaseLabel(frame.phase);

  return <div className={styles.overlay} aria-hidden="true" data-status={status}>
    {!hero && <div className={styles.sceneHeader}><span>AIR / VISUAL TRACKING</span><span>CONCEPT SEQUENCE</span></div>}
    <svg className={styles.geometry} viewBox={`0 0 ${width} ${height}`} fill="none" preserveAspectRatio="none">
      <g opacity={targetOnScreen ? alpha : 0}>
        <rect className={styles.lockOutline} x={left} y={top} width={side} height={side} vectorEffect="non-scaling-stroke" />
        <path className={styles.lockCorners} d={corners} vectorEffect="non-scaling-stroke" />
        {!ending && placement !== "below" && placement !== "fixed" && <path className={styles.leader} d={placement === "right" ? `M${right + 5},${centerY}H${panelX - 7}` : `M${panelX + panelWidth + 7},${centerY}H${left - 5}`} vectorEffect="non-scaling-stroke" />}
      </g>
    </svg>
    {(targetOnScreen || ending) && <div className={styles.targetInfo} style={{ left: panelX, top: panelY, width: panelWidth, opacity: ending ? 1 : frame.opacity }} data-placement={placement}>
      <div className={styles.targetHeading}><span>TARGET</span><b>01</b></div>
      <div className={styles.targetClass}><strong>UAV</strong><span>FIXED WING</span></div>
      <div className={styles.targetStatus}><i />{status}</div>
      {hero && <span className={styles.simulation}>CONCEPT SEQUENCE</span>}
    </div>}
    {!hero && <>
      <div className={styles.sceneFooter}><span>AUTHORED FLIGHT SEQUENCE</span><span>{String(Math.floor(frame.time)).padStart(2, "0")} / {Math.round(track.duration)} SEC</span></div>
      <div className={styles.progress}><span style={{ transform: `scaleX(${frame.time / track.duration})` }} /></div>
    </>}
  </div>;
}

/** One fictional single-aircraft film shared by the hero and perception demonstration. */
export default function FlightSequence({ motionPaused = false, showOverlays = true, variant = "demo", className = "", onPlaybackStateChange }) {
  const hero = variant === "hero";
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const callbackRef = useRef(onPlaybackStateChange);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [preferenceReady, setPreferenceReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [playbackState, setPlaybackState] = useState("paused");
  const [hasVideoFrame, setHasVideoFrame] = useState(false);
  const [track, setTrack] = useState(null);
  const [frame, setFrame] = useState(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const wantsPlayback = preferenceReady && inView && pageVisible && !motionPaused && !reducedMotion;
  const showPoster = !preferenceReady || reducedMotion || !hasVideoFrame || playbackState === "error";

  useEffect(() => { callbackRef.current = onPlaybackStateChange; }, [onPlaybackStateChange]);
  useEffect(() => { callbackRef.current?.(playbackState); }, [playbackState]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => { setReducedMotion(preference.matches); setPreferenceReady(true); };
    const syncVisibility = () => setPageVisible(document.visibilityState !== "hidden");
    syncPreference(); syncVisibility();
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);
    const visibilityObserver = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .03 });
    const resizeObserver = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    if (rootRef.current) { visibilityObserver.observe(rootRef.current); resizeObserver.observe(rootRef.current); }
    return () => {
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
      visibilityObserver.disconnect(); resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!showOverlays) return undefined;
    let cancelled = false;
    loadTrack().then(data => { if (!cancelled) setTrack(data); }).catch(() => {});
    return () => { cancelled = true; };
  }, [showOverlays]);

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
      }).catch(error => {
        if (!cancelled && error.name !== "AbortError") setPlaybackState(video.error ? "error" : "blocked");
      });
    }
    return () => { cancelled = true; };
  }, [wantsPlayback, reducedMotion]);

  const syncFrame = useCallback(() => {
    if (track) setFrame(sampleTrack(track, showPoster ? track.posterTime : videoRef.current?.currentTime || 0));
  }, [track, showPoster]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !track || !showOverlays) return undefined;
    let cancelled = false, request;
    const nativeFrames = typeof video.requestVideoFrameCallback === "function";
    syncFrame();
    video.addEventListener("seeked", syncFrame);
    video.addEventListener("loadedmetadata", syncFrame);
    const update = (_, metadata) => {
      if (cancelled) return;
      setHasVideoFrame(true);
      setFrame(sampleTrack(track, nativeFrames ? metadata.mediaTime : video.currentTime));
      request = nativeFrames ? video.requestVideoFrameCallback(update) : window.requestAnimationFrame(update);
    };
    if (wantsPlayback && playbackState === "playing" && !showPoster) {
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
  }, [track, showOverlays, wantsPlayback, playbackState, showPoster, syncFrame]);

  const playFromGesture = async () => {
    const video = videoRef.current;
    if (!video || motionPaused || reducedMotion) return;
    if (video.error) video.load();
    try { await video.play(); setHasVideoFrame(true); setPlaybackState("playing"); }
    catch { setPlaybackState(video.error ? "error" : "blocked"); }
  };
  const showFallback = (playbackState === "blocked" || playbackState === "error") && !motionPaused && !reducedMotion;

  return <div ref={rootRef} className={`${styles.sequence} ${className}`.trim()} data-variant={hero ? "hero" : "demo"} data-playback={playbackState} role="group" aria-label="Simulated single-aircraft tracking and interception film">
    <video ref={videoRef} className={styles.video} src={FILM} poster={POSTER} width="1920" height="1080" autoPlay={wantsPlayback} muted playsInline loop preload="metadata" aria-label="A fictional unarmed aircraft approaches above clouds, is visually tracked, and exits into a non-graphic interception ending."
      onPlaying={() => { setHasVideoFrame(true); setPlaybackState("playing"); }}
      onSeeked={() => { if (videoRef.current?.readyState >= 2 && !reducedMotion) setHasVideoFrame(true); }}
      onPause={() => setPlaybackState(state => reducedMotion ? "reduced-motion" : state === "blocked" || state === "error" ? state : "paused")}
      onError={() => setPlaybackState("error")} />
    {showPoster && <img className={styles.poster} src={POSTER} alt="A single illustrative aircraft above a cloud landscape" fetchPriority={hero ? "high" : "auto"} decoding="async" draggable="false" />}
    {showOverlays && <TrackingOverlay track={track} frame={frame} size={size} hero={hero} />}
    {showFallback && <button className={styles.playButton} type="button" onClick={playFromGesture}><span aria-hidden="true">▷</span>{playbackState === "error" ? "Retry film" : "Play film"}</button>}
  </div>;
}
