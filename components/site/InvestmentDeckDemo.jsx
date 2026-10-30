"use client";

import { useRef, useState } from "react";
import styles from "@/app/(public)/investment-deck/investment.module.css";

const films = [
  {
    id: "system-concept",
    title: "System overview",
    duration: "0:47",
    description: "ARCA-1 sensor station, ACT-1 launch concept and flight sequence.",
    alt: "Concept rendering of an ARCA-1 sensor station beside an aircraft enclosure",
  },
  {
    id: "aircraft-models",
    title: "Aircraft models",
    duration: "0:07",
    description: "Representative UAV and cruise-missile models used in the visualization.",
    alt: "Representative aircraft model from the concept animation",
  },
];
const mediaPath = "/media/investor-demo";

export default function InvestmentDeckDemo() {
  const videoRef = useRef(null);
  const [selected, setSelected] = useState(0);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const film = films[selected];

  function selectFilm(index) {
    if (index === selected) return;
    videoRef.current?.pause();
    setSelected(index);
    setStarted(false);
    setFailed(false);
  }

  async function playFilm() {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
    } catch (error) {
      // Switching clips can abort a pending play request for the old element.
      if (videoRef.current === video && error?.name !== "AbortError") setFailed(true);
    }
  }

  return (
    <div className={styles.demo}>
      <div className={styles.demoChoices} role="group" aria-label="Choose a concept film">
        {films.map((item, index) => (
          <button key={item.id} type="button" aria-pressed={index === selected} onClick={() => selectFilm(index)}>
            {item.title}<span>{item.duration}</span>
          </button>
        ))}
      </div>
      <figure className={styles.demoPlayer}>
        <div className={styles.demoStage}>
          <video key={film.id} ref={videoRef} controls muted playsInline preload="none" poster={`${mediaPath}/${film.id}-poster.jpg`} aria-label={`${film.title} concept film`} onPlay={() => { setStarted(true); setFailed(false); }} onError={() => setFailed(true)}>
            <source src={`${mediaPath}/${film.id}.mp4`} type="video/mp4" />
            <a href={`${mediaPath}/${film.id}.mp4`}>Open {film.title.toLowerCase()}</a>
          </video>
          {!started && !failed && <button className={styles.demoPlay} type="button" aria-label={`Play ${film.title.toLowerCase()}`} onClick={playFilm}><svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="m9 5 11 7-11 7Z" fill="currentColor" /></svg></button>}
        </div>
        <figcaption><span>{film.description}</span><a href={`${mediaPath}/${film.id}.mp4`} target="_blank" rel="noopener noreferrer">Open video <span aria-hidden="true">↗</span></a></figcaption>
        {failed && <p className={styles.demoError} role="status">Playback is unavailable in this browser. Use the Open video link to watch the film.</p>}
      </figure>
      <div className={styles.demoPrint}>
        {films.map(item => <figure key={item.id}><img src={`${mediaPath}/${item.id}-poster.jpg`} alt={item.alt} width="1280" height="726" /><figcaption>{item.title} / {item.duration}</figcaption></figure>)}
        <a href="https://www.actprove.com/investment-deck#slide-11">Watch both films at actprove.com/investment-deck#slide-11</a>
      </div>
      <p className={styles.sourceNote}>Concept visualization. The prototype-evidence slide contains the real test footage.</p>
    </div>
  );
}
