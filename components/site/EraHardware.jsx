"use client";

import Image from "next/image";
import { useState } from "react";
import { eraModules, eraSensors, eraRenderPath, eraViewLabels } from "@/lib/era-hardware";
import styles from "./EraHardware.module.css";

function RenderViews({ item, view, onChange, imageId }) {
  return <div className={styles.views} role="group" aria-label={`${item.name} render views`}>
    {item.views.map(key => <button type="button" key={key} aria-pressed={view === key} aria-controls={imageId} onClick={() => onChange(key)}>{eraViewLabels[key]}</button>)}
  </div>;
}

function RenderImage({ item, view, imageId, priority = false, sizes }) {
  // Assembly images have different source proportions; object-fit preserves the complete render.
  const height = view === "exploded" ? 1600 : 1280;
  const width = view === "exploded" && item.id === "era-1-mini" ? 1440 : 1600;
  return <div className={styles.image} id={imageId}>
    <Image src={eraRenderPath(item.id, view)} alt={`${item.name}, ${eraViewLabels[view].toLowerCase()} CAD render of the mechanical prototype`} width={width} height={height} sizes={sizes} priority={priority} unoptimized />
  </div>;
}

export function EraModuleShowcase() {
  const [selected, setSelected] = useState("era-1");
  const [view, setView] = useState("exterior");
  const item = eraModules.find(module => module.id === selected);
  const imageId = "era-module-render";
  return <section className={styles.showcase} aria-label="ERA-1 hardware variants">
    <figure className={styles.moduleFigure}>
      <RenderImage item={item} view={view} imageId={imageId} sizes="(max-width: 800px) 100vw, 65vw" priority />
      <figcaption className={styles.renderCaption}><span>ACTPROVE / MECHANICAL DESIGN</span><span>{item.revision} / {eraViewLabels[view].toUpperCase()}</span></figcaption>
    </figure>
    <div className={styles.modulePanel}>
      <span className={styles.eyebrow}>TWO FORMATS. ONE CONNECTION.</span>
      <div className={styles.moduleChoices} role="group" aria-label="Select ERA-1 version">
        {eraModules.map(module => <button key={module.id} type="button" aria-pressed={selected === module.id} aria-controls={imageId} onClick={() => setSelected(module.id)}><strong>{module.name}</strong><span>{module.label}</span></button>)}
      </div>
      <div className={styles.moduleCopy}>
        <span className={styles.eyebrow}>EQUIPMENT INTEGRATION</span>
        <h2>{item.name}</h2><p>{item.description}</p>
        <dl className={styles.specs}><div><dt>CAD ENVELOPE</dt><dd>{item.dimensions}</dd></div><div><dt>DESIGN STAGE</dt><dd>Mechanical prototype</dd></div></dl>
      </div>
      <div className={styles.moduleViews}><span className={styles.eyebrow}>EXPLORE THE ENCLOSURE</span><RenderViews item={item} view={view} onChange={setView} imageId={imageId} /></div>
      <a className={styles.sensorLink} href="#era-sensors">Explore sensor modules <span aria-hidden="true">↓</span></a>
    </div>
  </section>;
}

function SensorCard({ item, index }) {
  const [view, setView] = useState("exterior");
  const imageId = `era-sensor-${item.id}-render`;
  return <article className={styles.sensorCard} aria-labelledby={`era-sensor-${item.id}-title`}>
    <div className={styles.cardTop}><span>{String(index + 1).padStart(2, "0")} / {item.label}</span><span>R04</span></div>
    <figure className={styles.sensorFigure}>
      <RenderImage item={item} view={view} imageId={imageId} sizes="(max-width: 620px) 100vw, (max-width: 1050px) 50vw, 33vw" />
      <figcaption><RenderViews item={item} view={view} onChange={setView} imageId={imageId} /></figcaption>
    </figure>
    <h3 id={`era-sensor-${item.id}-title`}>{item.name}</h3><p>{item.description}</p>
  </article>;
}

export default function EraSensors() {
  return <section className={styles.sensorSection} id="era-sensors" aria-labelledby="era-sensors-title">
    <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>ERA-1 / SENSOR MODULES</span><h2 id="era-sensors-title">Extend the view.</h2></div><p>Six sensor enclosure concepts for the ERA-1 family. Explore the housing, rear connections and internal layout of each design.</p></div>
    <div className={styles.sensorGrid}>{eraSensors.map((item, index) => <SensorCard key={item.id} item={item} index={index} />)}</div>
    <p className={styles.note}>Mechanical prototype renders. Images use different scales. Physical fit, interfaces, optics and environmental performance remain subject to validation.</p>
  </section>;
}
