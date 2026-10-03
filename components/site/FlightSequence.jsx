"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FlightSequence.module.css";

/** Illustrative film with real playback controls supplied by the parent. */
export default function FlightSequence({
  motionPaused = false,
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
  const wantsPlayback = preferenceReady && inView && !motionPaused && !reducedMotion;

  useEffect(() => {
    callbackRef.current = onPlaybackStateChange;
  }, [onPlaybackStateChange]);

  useEffect(() => {
    callbackRef.current?.(playbackState);
  }, [playbackState]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(preference.matches);
      setPreferenceReady(true);
    };
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
    const video = videoRef.current;
    if (!video) return undefined;
    let cancelled = false;
    if (!wantsPlayback) {
      video.pause();
      setPlaybackState(reducedMotion ? "reduced-motion" : "paused");
    } else {
      // A rejected autoplay attempt must expose a real user-gesture play control.
      video.play()?.then(() => {
        if (!cancelled) setPlaybackState("playing");
      }).catch((error) => {
        if (!cancelled && error.name !== "AbortError") setPlaybackState(video.error ? "error" : "blocked");
      });
    }
    return () => { cancelled = true; };
  }, [wantsPlayback, reducedMotion]);

  const playFromGesture = async () => {
    const video = videoRef.current;
    if (!video || motionPaused || reducedMotion) return;
    if (video.error) video.load();
    try {
      await video.play();
      setPlaybackState("playing");
    } catch {
      setPlaybackState(video.error ? "error" : "blocked");
    }
  };

  const showFallback = (playbackState === "blocked" || playbackState === "error") && !motionPaused && !reducedMotion;
  const showPoster = !preferenceReady || reducedMotion || playbackState === "error";

  return (
    <div
      ref={rootRef}
      className={`${styles.sequence} ${className}`.trim()}
      data-variant={variant === "hero" ? "hero" : "demo"}
      data-playback={playbackState}
      role="group"
      aria-label="Illustrative flight sequence"
    >
      <video
        ref={videoRef}
        className={styles.video}
        src="/media/flight-sequence.mp4"
        poster="/media/flight-start.webp"
        autoPlay={wantsPlayback}
        muted
        playsInline
        loop
        preload="metadata"
        aria-label="An illustrative film of a distant aircraft being identified, followed, and shown closer."
        onPlaying={() => setPlaybackState("playing")}
        onPause={() => setPlaybackState((state) => reducedMotion ? "reduced-motion" : state === "blocked" || state === "error" ? state : "paused")}
        onError={() => setPlaybackState("error")}
      />
      {showPoster && <img className={styles.poster} src={reducedMotion || playbackState === "error" ? "/media/flight-poster.png" : "/media/flight-start.webp"} alt="Illustrative aircraft above a cloud landscape" decoding="async" draggable="false" />}
      {showFallback && (
        <button className={styles.playButton} type="button" onClick={playFromGesture}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="m4 2 8 5-8 5V2Z" fill="currentColor" /></svg>
          {playbackState === "error" ? "Retry sequence" : "Play sequence"}
        </button>
      )}
    </div>
  );
}
