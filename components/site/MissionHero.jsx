"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MissionHero.module.css";

const SHOT_SECONDS = 6;
const FILM = "/media/mission-hero-v1.mp4";
const POSTERS = [0, 1, 2].map((phase) => `/media/mission-hero-phase-${phase}.webp`);

/** Authored fictional mission imagery; playback is independent of the perception demo. */
export default function MissionHero({
  motionPaused = false,
  phaseRequest,
  onPhaseChange,
  onPlaybackStateChange,
  className = "",
}) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const pendingSeekRef = useRef(null);
  const consumedRequestRef = useRef(null);
  const callbacksRef = useRef({ onPhaseChange, onPlaybackStateChange });
  const [phase, setPhase] = useState(0);
  const [playbackState, setPlaybackState] = useState("paused");
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [preferenceReady, setPreferenceReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasVideoFrame, setHasVideoFrame] = useState(false);
  const shouldPlay = preferenceReady && inView && pageVisible && !motionPaused && !reducedMotion;

  useEffect(() => { callbacksRef.current = { onPhaseChange, onPlaybackStateChange }; }, [onPhaseChange, onPlaybackStateChange]);
  useEffect(() => { callbacksRef.current.onPhaseChange?.(phase); }, [phase]);
  useEffect(() => { callbacksRef.current.onPlaybackStateChange?.(playbackState); }, [playbackState]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReducedMotion(preference.matches); setPreferenceReady(true); };
    const updateVisibility = () => setPageVisible(!document.hidden);
    update();
    updateVisibility();
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.03 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const applyPendingSeek = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 1 || pendingSeekRef.current === null || reducedMotion) return;
    try {
      video.currentTime = pendingSeekRef.current;
      pendingSeekRef.current = null;
    } catch { /* A metadata event retries a seek requested before decoding is ready. */ }
  }, [reducedMotion]);

  useEffect(() => {
    const requestedPhase = phaseRequest?.index;
    if (!Number.isInteger(requestedPhase) || requestedPhase < 0 || requestedPhase > 2) return;
    const consumed = consumedRequestRef.current;
    // Preference changes can re-enable a pending seek, but must not replay an old request.
    if (consumed?.index === requestedPhase && Object.is(consumed.nonce, phaseRequest?.nonce)) return;
    consumedRequestRef.current = { index: requestedPhase, nonce: phaseRequest?.nonce };
    setPhase(requestedPhase);
    pendingSeekRef.current = requestedPhase * SHOT_SECONDS + 0.04;
    applyPendingSeek();
  }, [phaseRequest?.index, phaseRequest?.nonce, applyPendingSeek]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    let cancelled = false;
    if (!shouldPlay) {
      video.pause();
      setPlaybackState(reducedMotion ? "reduced-motion" : "paused");
    } else {
      applyPendingSeek();
      video.play()?.then(() => {
        if (!cancelled) { setPlaybackState("playing"); setHasVideoFrame(true); }
      }).catch((error) => {
        if (!cancelled && error.name !== "AbortError") setPlaybackState(video.error ? "error" : "blocked");
      });
    }
    return () => { cancelled = true; };
  }, [shouldPlay, reducedMotion, applyPendingSeek]);

  const syncPhase = () => {
    const video = videoRef.current;
    if (!video || reducedMotion || pendingSeekRef.current !== null) return;
    setPhase(Math.min(2, Math.floor(video.currentTime / SHOT_SECONDS)));
  };

  const playFromGesture = async () => {
    const video = videoRef.current;
    if (!video || motionPaused || reducedMotion) return;
    if (video.error) video.load();
    applyPendingSeek();
    try {
      await video.play();
      setHasVideoFrame(true);
      setPlaybackState("playing");
    } catch {
      setPlaybackState(video.error ? "error" : "blocked");
    }
  };

  const showPoster = !preferenceReady || reducedMotion || !hasVideoFrame || playbackState === "error";
  const needsGesture = !motionPaused && !reducedMotion && (playbackState === "blocked" || playbackState === "error");

  return (
    <div ref={rootRef} className={`${styles.sequence} ${className}`.trim()} data-phase={phase} data-playback={playbackState} role="group" aria-label="Fictional aircraft and terrain mission film">
      <video
        ref={videoRef}
        className={styles.film}
        src={FILM}
        poster={POSTERS[0]}
        width="1920" height="1080"
        autoPlay={shouldPlay}
        muted playsInline loop preload="metadata"
        aria-label="Cinematic simulation of aircraft passing above clouds, fast terrain flight, and terrain sensing."
        onLoadedMetadata={applyPendingSeek}
        onTimeUpdate={syncPhase}
        onSeeked={() => { if (videoRef.current?.readyState >= 2) setHasVideoFrame(true); syncPhase(); }}
        onPlaying={() => { setHasVideoFrame(true); setPlaybackState("playing"); syncPhase(); }}
        onPause={() => setPlaybackState((state) => reducedMotion ? "reduced-motion" : state === "blocked" || state === "error" ? state : "paused")}
        onError={() => setPlaybackState("error")}
      />
      {showPoster && <img className={styles.poster} src={POSTERS[phase]} alt="Fictional cinematic aircraft and terrain scene" fetchPriority="high" decoding="async" draggable="false" />}
      {needsGesture && <button className={styles.playButton} type="button" onClick={playFromGesture}><span aria-hidden="true">▶</span>{playbackState === "error" ? "Retry film" : "Play film"}</button>}
    </div>
  );
}
