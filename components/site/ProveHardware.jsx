"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./ProveHardware.module.css";

const hardware = [
  {
    id: "controller",
    number: "01",
    title: "Field controller",
    label: "OPERATOR CONTROL",
    description: "A dedicated control station for operating connected drones and devices through PROVE-1. Controls, live feeds and equipment status come together in one operator view.",
    features: "Device control / Live feeds / Equipment status",
  },
  {
    id: "block",
    number: "02",
    title: "Edge compute & relay",
    label: "LOCAL PROCESSING + CONNECTIVITY",
    description: "A compact, modular AI data center designed to process information from multiple drones on site and deliver timely data and assessments in PROVE-1. The unit also supports signal reinforcement for a stronger connection between the controller and connected devices.",
    features: "Multi-drone data / Local AI processing / Signal relay",
  },
];

function HardwareCard({ item }) {
  const [view, setView] = useState("front");
  const imageId = `prove-${item.id}-view`;
  return <article className={styles.card} aria-labelledby={`prove-${item.id}-title`}>
    <div className={styles.cardTop}><span>{item.number} / {item.label}</span><span>HARDWARE DESIGN</span></div>
    <figure className={styles.figure}>
      <div className={styles.image} id={imageId}>
        <Image src={`/media/prove-hardware/${item.id}-${view}.webp`} alt={`PROVE-1 ${item.title.toLowerCase()}, ${view} view of the enclosure design`} width={1600} height={1200} sizes="(max-width: 760px) 100vw, 50vw" unoptimized />
      </div>
      <figcaption className={styles.viewControls}>
        <span>VIEW THE HARDWARE</span>
        <div role="group" aria-label={`${item.title} views`}>
          {["front", "rear"].map(side => <button key={side} type="button" aria-pressed={view === side} aria-controls={imageId} onClick={() => setView(side)}>{side === "front" ? "Front" : "Rear"}</button>)}
        </div>
      </figcaption>
    </figure>
    <div className={styles.copy}><h3 id={`prove-${item.id}-title`}>{item.title}</h3><p>{item.description}</p></div>
    <p className={styles.features}>{item.features}</p>
  </article>;
}

export default function ProveHardware() {
  return <section className={styles.section} id="hardware" aria-labelledby="prove-hardware-title">
    <div className={styles.heading}><div><span className={styles.eyebrow}>PROVE-1 / HARDWARE</span><h2 id="prove-hardware-title">Control. Compute. Connect.</h2></div><p>The operator interface and the local processing unit, designed to work together with PROVE-1.</p></div>
    <div className={styles.grid}>{hardware.map(item => <HardwareCard key={item.id} item={item} />)}</div>
    <p className={styles.note}>In development. Enclosure designs shown.</p>
  </section>;
}
