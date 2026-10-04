"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import wordmark from "@/public/actprove-wordmark.png";
import styles from "./InvestmentDeckFrame.module.css";

function indexFromHash(hash, count) {
  const match = /^#(?:investment-)?slide-(\d+)$/.exec(hash);
  if (!match) return null;
  const index = Number(match[1]) - 1;
  return Number.isInteger(index) && index >= 0 && index < count ? index : null;
}

export default function InvestmentDeckFrame({ slides = [], brief = false, children }) {
  const frameRef = useRef(null);
  const viewportRef = useRef(null);
  const presentationButtonRef = useRef(null);
  const activeRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [presentation, setPresentation] = useState(false);
  const count = slides.length;

  const setActive = useCallback((index, writeHash = true) => {
    activeRef.current = index;
    setActiveIndex(index);
    const hash = `#slide-${index + 1}`;
    if (writeHash && window.location.hash !== hash) window.history.replaceState(window.history.state, "", hash);
  }, []);

  const navigate = useCallback((requestedIndex) => {
    const viewport = viewportRef.current;
    const sections = viewport?.querySelectorAll("[data-investment-slide]");
    if (!viewport || !sections?.length || !count) return;
    const index = Math.max(0, Math.min(requestedIndex, count - 1, sections.length - 1));
    const section = sections[index];
    const top = section.getBoundingClientRect().top - viewport.getBoundingClientRect().top + viewport.scrollTop;
    setActive(index);
    viewport.scrollTo({ top, behavior: "instant" });
  }, [count, setActive]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !count) return undefined;
    const sections = Array.from(viewport.querySelectorAll("[data-investment-slide]")).slice(0, count);
    if (!sections.length) return undefined;
    navigate(indexFromHash(window.location.hash, sections.length) ?? 0);

    const observer = new IntersectionObserver(() => {
      const bounds = viewport.getBoundingClientRect();
      const center = bounds.top + bounds.height / 2;
      const index = sections.findIndex((section) => {
        const rectangle = section.getBoundingClientRect();
        return rectangle.top <= center && rectangle.bottom > center;
      });
      if (index >= 0 && index !== activeRef.current) setActive(index);
    }, { root: viewport, threshold: Array.from({ length: 21 }, (_, index) => index / 20) });
    sections.forEach((section) => observer.observe(section));

    const followHash = () => {
      const index = indexFromHash(window.location.hash, sections.length);
      if (index !== null) navigate(index);
    };
    window.addEventListener("hashchange", followHash);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", followHash);
    };
  }, [count, navigate, setActive]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
      const target = event.target;
      if (target instanceof Element && target !== document.body && !frameRef.current?.contains(target)) return;
      if (event.key === "Escape" && presentation) {
        event.preventDefault();
        setPresentation(false);
        presentationButtonRef.current?.focus({ preventScroll: true });
        return;
      }
      if (target instanceof Element && target.closest("input, textarea, select, button, a, [contenteditable], [role='textbox']")) return;
      const commands = {
        ArrowDown: activeRef.current + 1,
        ArrowRight: activeRef.current + 1,
        PageDown: activeRef.current + 1,
        ArrowUp: activeRef.current - 1,
        ArrowLeft: activeRef.current - 1,
        PageUp: activeRef.current - 1,
        Home: 0,
        End: count - 1,
      };
      if (Object.hasOwn(commands, event.key)) {
        event.preventDefault();
        if (!event.repeat) navigate(commands[event.key]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count, navigate, presentation]);

  const togglePresentation = () => {
    if (presentation) {
      setPresentation(false);
      presentationButtonRef.current?.focus({ preventScroll: true });
      return;
    }
    setPresentation(true);
    viewportRef.current?.focus({ preventScroll: true });
  };

  return (
    <div ref={frameRef} className={styles.frame} data-presentation={presentation}>
      <header className={styles.topbar}>
        <a className={styles.brand} href="/" aria-label="Actprove home">
          <Image src={wordmark} alt="Actprove" priority sizes="(max-width: 660px) 148px, 171px" />
          <span>DEFENSE TECHNOLOGIES</span>
        </a>
        <div className={styles.topActions}>
          <a className={styles.versionLink} href={brief ? "/investment-deck" : "/investment-deck/brief"}>{brief ? "Full deck ↗" : "6-slide brief ↗"}</a>
          <button className={styles.printButton} type="button" onClick={() => window.print()}>Print</button>
          <button ref={presentationButtonRef} className={styles.presentButton} type="button" aria-pressed={presentation} onClick={togglePresentation}>
            {presentation ? "Exit presentation" : "Present"}
          </button>
        </div>
      </header>

      <div ref={viewportRef} className={styles.viewport} tabIndex={0} role="region" aria-label="Investment deck slides">
        {children}
      </div>

      <nav className={styles.bottomBar} aria-label="Slide navigation">
        <div className={styles.slideCounter} aria-label={`Slide ${count ? activeIndex + 1 : 0} of ${count}`}>
          <span>{String(count ? activeIndex + 1 : 0).padStart(2, "0")}</span><span className={styles.counterDivider}>/</span><span className={styles.total}>{String(count).padStart(2, "0")}</span>
        </div>
        <select className={styles.slideSelect} aria-label="Go to slide" value={count ? activeIndex : ""} onChange={(event) => navigate(Number(event.target.value))} disabled={!count}>
          {!count && <option value="">No slides</option>}
          {slides.map((title, index) => <option key={`${index}-${title}`} value={index}>{String(index + 1).padStart(2, "0")} · {title}</option>)}
        </select>
        <div className={styles.arrows}>
          <button className={styles.arrowButton} type="button" aria-label="Previous slide" disabled={!count || activeIndex === 0} onClick={() => navigate(activeIndex - 1)}>←</button>
          <button className={styles.arrowButton} type="button" aria-label="Next slide" disabled={!count || activeIndex === count - 1} onClick={() => navigate(activeIndex + 1)}>→</button>
        </div>
      </nav>
    </div>
  );
}
