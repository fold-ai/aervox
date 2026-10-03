"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./ProductConcepts.module.css";

function useConceptMotion(motionPaused) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(preference.matches);
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncPreference(); syncVisibility();
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .05 });
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  return { ref, reducedMotion, paused: motionPaused || reducedMotion || !inView || !pageVisible };
}

function Aircraft({ className = "", fill = "#c3d1c9" }) {
  return <g className={className}>
    <path d="M0-29 4-8 31 13 28 16 5 8 3 23 11 29 10 32 0 27-10 32-11 29-3 23-5 8-28 16-31 13-4-8Z" fill={fill} />
    <path d="M0-23V25M-25 13-3 3M25 13 3 3" fill="none" stroke="#f0f5ed" strokeWidth=".7" opacity=".55" />
  </g>;
}

const contours = [
  "M-70 248C66 126 147 238 244 163S372 39 499 79 667 24 769 61 902 16 987 73",
  "M-63 268C66 154 145 265 252 188S375 70 499 106 656 58 769 90 899 50 978 102",
  "M-60 288C69 181 145 290 260 214S380 99 501 132 654 86 770 116 902 80 979 131",
  "M-55 309C74 208 150 317 269 241S385 128 503 159 652 113 769 144 905 108 974 159",
  "M-48 328C79 236 154 343 278 266S390 157 505 185 650 140 768 171 907 137 971 189",
  "M-40 350C84 265 160 370 288 293S397 185 508 212 650 167 765 197 909 165 968 218",
  "M-32 369C90 293 169 396 298 319S404 213 514 239 650 194 763 225 910 194 965 246",
  "M-22 391C99 322 177 422 308 346S411 242 519 266 650 221 761 252 912 222 962 276",
  "M-13 412C108 350 187 449 320 373S420 271 526 293 651 249 759 280 914 251 958 304",
  "M-3 435C119 380 198 477 332 401S429 300 534 321 653 278 757 308 915 279 954 335",
  "M9 458C131 410 211 504 344 429S440 330 544 349 656 306 757 337 918 309 951 365",
  "M22 481C145 440 224 532 357 458S452 359 554 378 660 335 758 366 919 339 948 396",
];

function DetectVisual({ paused, perception }) {
  const id = `detect-${useId().replace(/:/g, "")}`;
  return <svg className={styles.visual} viewBox="0 0 900 520" role="img" aria-labelledby={`${id}-title ${id}-description`} data-paused={paused} data-perception={perception}>
    <title id={`${id}-title`}>DETECT-1: an aircraft observing a changing landscape</title>
    <desc id={`${id}-description`}>An animated concept aircraft passes over terrain contours. A translucent observation area and highlighted scene regions illustrate planned onboard perception. This is authored concept art, not sensor output or validated performance.</desc>
    <defs>
      <radialGradient id={`${id}-light`} cx="56%" cy="42%" r="61%"><stop stopColor="#173025" stopOpacity=".7" /><stop offset="1" stopColor="#070c0a" stopOpacity="0" /></radialGradient>
      <linearGradient id={`${id}-terrain`} x1="0" y1="0" x2=".7" y2="1"><stop stopColor="#1c2924" /><stop offset="1" stopColor="#080e0b" /></linearGradient>
      <linearGradient id={`${id}-beam`} x1=".5" y1="0" x2=".5" y2="1"><stop stopColor="#93f4b2" stopOpacity=".24" /><stop offset="1" stopColor="#93f4b2" stopOpacity=".015" /></linearGradient>
      <linearGradient id={`${id}-aircraft`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e0e9e3" /><stop offset=".46" stopColor="#879c90" /><stop offset=".5" stopColor="#c2cfc7" /><stop offset="1" stopColor="#4c6658" /></linearGradient>
      <linearGradient id={`${id}-fade`}><stop stopColor="white" stopOpacity="0" /><stop offset=".14" stopColor="white" /><stop offset=".85" stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient>
      <mask id={`${id}-mask`}><path d="M0 0h900v520H0z" fill={`url(#${id}-fade)`} /></mask>
    </defs>
    <path d="M0 0h900v520H0z" fill="#080d0b" />
    <path d="M0 0h900v520H0z" fill={`url(#${id}-light)`} />
    <g mask={`url(#${id}-mask)`}>
      <path d="M-30 282 298 110 897 199 1046 381 684 531 87 458Z" fill={`url(#${id}-terrain)`} opacity=".85" />
      <g className={styles.terrainLines} transform="translate(0 64) scale(1 .79)">{contours.map((d, i) => <path key={i} d={d} />)}</g>
      <g className={styles.terrainDetails}>
        <path d="M30 404C197 409 201 290 346 293s150 61 264 29S770 315 905 364" />
        <path d="M31 414C198 419 204 300 346 303s151 61 267 29S770 325 905 374" />
        <path d="m350 384 48-19 70 13-48 21Zm58 24 33-13 40 8-33 14Zm207-159 24-10 38 7-24 11Zm43 11 23-9 39 7-25 10Z" />
        <path d="m153 325 26-11 36 7-26 12Z" />
      </g>
      <path className={styles.flightPath} d="M74 94C265 64 365 127 478 161S680 131 832 82" />
      <path className={styles.flightPulse} d="M74 94C265 64 365 127 478 161S680 131 832 82" />
      <g className={styles.detectAircraft}>
        <g className={styles.perceptionLayer}>
          <path d="m475 160-144 166 241 47 92-96Z" fill={`url(#${id}-beam)`} />
          <path className={styles.beamEdge} d="m475 160-144 166 241 47 92-96Z" />
          <path className={styles.footprint} d="m331 326 241 47 92-96-239-42Z" />
          <path className={styles.scanLine} d="m374 283 240 47" />
        </g>
        <ellipse cx="480" cy="349" rx="61" ry="13" fill="#050906" opacity=".48" />
        <g transform="translate(475 160) rotate(70) scale(1.62)">
          <Aircraft fill={`url(#${id}-aircraft)`} />
          <path d="M-7 0 0-26 7 0 0 21Z" fill="#e5eee5" opacity=".22" />
        </g>
        <path d="M489 117V96h64" className={styles.calloutLine} />
        <text x="562" y="99" className={styles.lightLabel}>ONBOARD PERCEPTION</text>
      </g>
      <g className={`${styles.perceptionLayer} ${styles.sceneObservation}`}>
        <path d="m336 377 57-23 96 18-59 27Zm0 0v17l94 21 59-27v-16" fill="#91efac" fillOpacity=".025" stroke="#91efac" strokeOpacity=".65" strokeWidth="1" />
        <path d="m393 354 0-27h-68" className={styles.calloutLine} />
        <text x="316" y="330" textAnchor="end" className={styles.greenLabel}>SCENE CONTEXT</text>
        <circle cx="393" cy="354" r="2.5" fill="#a5ffc0" />
      </g>
      <g className={`${styles.perceptionLayer} ${styles.newObservation}`}>
        <path d="m604 244 35-14 45 9-34 15Zm0 0v15l46 10 34-15v-15" fill="#91efac" fillOpacity=".05" stroke="#91efac" strokeOpacity=".8" strokeWidth="1" />
        <path d="M684 239h40v-22h27" className={styles.calloutLine} />
        <circle cx="684" cy="239" r="2.5" fill="#a5ffc0" />
        <text x="760" y="220" className={styles.greenLabel}>OBSERVATION</text>
      </g>
    </g>
    <path d="M32 458v12h12M856 470h12v-12" className={styles.registration} />
    <text x="34" y="54" className={styles.figureLabel}>AIRCRAFT → SCENE UNDERSTANDING</text>
    <text x="866" y="488" textAnchor="end" className={styles.mutedLabel}>ILLUSTRATIVE / NO SENSOR DATA</text>
  </svg>;
}

function ArcaVisual({ paused, network }) {
  const id = `arca-${useId().replace(/:/g, "")}`;
  return <svg className={styles.visual} viewBox="0 0 900 520" role="img" aria-labelledby={`${id}-title ${id}-description`} data-paused={paused} data-network={network}>
    <title id={`${id}-title`}>ARCA-1: a planned radar and camera sensing concept</title>
    <desc id={`${id}-description`}>A central conceptual sensor scans an abstract observation field. Three aerial observations and two linked aircraft illustrate a possible shared view. Rings are graphic elements, not detection ranges or validated coverage.</desc>
    <defs>
      <radialGradient id={`${id}-ambient`}><stop stopColor="#254435" stopOpacity=".42" /><stop offset="1" stopColor="#090e0b" stopOpacity="0" /></radialGradient>
      <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#91f6b1" stopOpacity=".02" /><stop offset="1" stopColor="#91f6b1" stopOpacity=".18" /></linearGradient>
      <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#a4b8aa" /><stop offset=".45" stopColor="#5c7866" /><stop offset="1" stopColor="#223c2e" /></linearGradient>
      <clipPath id={`${id}-field`}><circle r="252" /></clipPath>
    </defs>
    <path d="M0 0h900v520H0z" fill="#080d0b" />
    <ellipse cx="472" cy="284" rx="377" ry="228" fill={`url(#${id}-ambient)`} />
    <g transform="translate(462 285) scale(1 .68)">
      <g className={styles.rings}>{[68, 126, 188, 252].map(radius => <circle key={radius} r={radius} />)}<path d="M-288 0h576M0-277v554M-210-210 210 210M-210 210 210-210" /></g>
      <g clipPath={`url(#${id}-field)`}>
        <g className={styles.radarSweep}>
          <path d="M0 0 0-265A265 265 0 0 1 237-119Z" fill={`url(#${id}-sweep)`} />
          <path d="M0 0V-265" stroke="#95f2b1" strokeWidth="1" strokeOpacity=".68" />
        </g>
      </g>
      <circle className={styles.sensorPulse} r="68" />
      <path className={styles.airTrackPath} d="M-288-143C-176-185-87-130-42-170M100-189C131-113 195-76 292-103M48 242C109 191 117 124 158 92" />
      <g className={styles.networkLayer}>
        <path className={styles.networkLine} d="M0 0-224 96M0 0 218 123" />
        <path className={styles.networkPulse} d="M0 0-224 96M0 0 218 123" />
      </g>
    </g>
    <g transform="translate(257 177)"><g className={styles.trackOne}><path className={styles.trackBrackets} d="M-19-10v-8h8M11-18h8v8M19 10v8h-8M-11 18h-8v-8" /><g transform="rotate(73) scale(.5)"><Aircraft fill="#a3b9ab" /></g><text className={styles.trackLabel} x="30" y="4">AIR 01</text></g></g>
    <g transform="translate(638 213)"><g className={styles.trackTwo}><path className={styles.trackBrackets} d="M-18-10v-8h8M10-18h8v8M18 10v8h-8M-10 18h-8v-8" /><g transform="rotate(137) scale(.46)"><Aircraft fill="#a3b9ab" /></g><text className={styles.trackLabel} x="29" y="4">AIR 02</text></g></g>
    <g transform="translate(560 413)"><g className={styles.trackThree}><path className={styles.trackBrackets} d="M-17-9v-8h8M9-17h8v8M17 9v8h-8M-9 17h-8v-8" /><g transform="rotate(22) scale(.43)"><Aircraft fill="#a3b9ab" /></g><text className={styles.trackLabel} x="29" y="4">AIR 03</text></g></g>
    <g className={styles.networkLayer}>
      <g transform="translate(238 350)"><circle r="27" className={styles.ownNode} /><g transform="rotate(54) scale(.49)"><Aircraft fill="#9cfdba" /></g><text x="0" y="46" textAnchor="middle" className={styles.greenLabel}>AIRCRAFT NODE</text></g>
      <g transform="translate(680 369)"><circle r="27" className={styles.ownNode} /><g transform="rotate(-51) scale(.49)"><Aircraft fill="#9cfdba" /></g><text x="0" y="46" textAnchor="middle" className={styles.greenLabel}>AIRCRAFT NODE</text></g>
    </g>
    <g transform="translate(462 278)">
      <ellipse cy="25" rx="46" ry="14" fill="#030805" opacity=".65" />
      <path d="m-24 20 24-13 24 13-24 13Z" fill="#213b2b" stroke="#6e9d7c" strokeWidth=".8" />
      <path d="M-7 16v-42h14v42L0 20Z" fill={`url(#${id}-metal)`} />
      <path d="m-29-55 34-16 28 14v35L0-6l-29-15Z" fill="#0e2116" stroke="#89b697" strokeWidth=".9" />
      <path d="m-29-55 29 14 33-16M0-41v35" fill="none" stroke="#9cc4a7" strokeOpacity=".7" />
      <path d="m-22-49 16 8v24l-16-8Zm27 9 21-10v23L5-16Z" fill={`url(#${id}-metal)`} />
      <path d="m9-34 13-6m-13 11 13-6m-13 11 13-6" stroke="#142d1d" strokeWidth="1.1" />
      <circle cx="-14" cy="-35" r="4.1" fill="#07140b" stroke="#b3eac0" strokeWidth=".8" />
      <circle cx="-13.5" cy="-35.5" r="1.1" fill="#b3ffca" />
      <path d="M0-72v-8" stroke="#d4e4d7" strokeWidth="1.3" />
      <path d="M36-43h32v-28h30" className={styles.calloutLine} />
      <text x="107" y="-68" className={styles.lightLabel}>RADAR + CAMERA</text>
    </g>
    <text x="34" y="54" className={styles.figureLabel}>SENSING → SHARED OBSERVATIONS</text>
    <text x="866" y="488" textAnchor="end" className={styles.mutedLabel}>CONCEPT GEOMETRY / NOT TO SCALE</text>
  </svg>;
}

function ConceptRow({ product, number, category, heading, description, note, motionPaused, children, controls }) {
  const { ref, paused } = useConceptMotion(motionPaused);
  return <article className={styles.row} aria-labelledby={`${product.toLowerCase()}-concept-title`}>
    <div className={styles.copy}>
      <span className={styles.index}>{number} / {category}</span>
      <h3 id={`${product.toLowerCase()}-concept-title`}>{product}</h3>
      <span className={styles.planned}><i />PLANNED SYSTEM</span>
      <h4>{heading}</h4>
      <p>{description}</p>
      <span className={styles.productNote}>{note}</span>
    </div>
    <div ref={ref} className={styles.figure} data-paused={paused}>
      {children(paused)}
      <div className={styles.figureFooter}><span>ILLUSTRATIVE CONCEPT</span>{controls}</div>
    </div>
  </article>;
}

export default function ProductConcepts({ motionPaused = false }) {
  const [localPaused, setLocalPaused] = useState(false);
  const [perception, setPerception] = useState(true);
  const [network, setNetwork] = useState(true);
  const { reducedMotion } = useConceptMotion(true);
  const paused = motionPaused || localPaused || reducedMotion;
  const motionLabel = reducedMotion ? "Motion off" : motionPaused ? "Motion paused" : localPaused ? "Play concepts" : "Pause concepts";

  return <div className={styles.concepts}>
    <div className={styles.sectionBar}><span>PLANNED CAPABILITIES</span><button type="button" className={styles.motionControl} disabled={motionPaused || reducedMotion} aria-pressed={paused} onClick={() => setLocalPaused(value => !value)}><svg viewBox="0 0 12 12" width="11" height="11" fill="currentColor" aria-hidden="true">{paused ? <path d="m3 1 8 5-8 5Z" /> : <path d="M2 1h3v10H2zm5 0h3v10H7Z" />}</svg>{motionLabel}</button></div>
    <ConceptRow product="DETECT-1" number="01" category="LONG-RANGE PERCEPTION" heading="Understand the scene ahead." description="Planned onboard perception for long-range strike aircraft. Recognize objects, interpret changing scenes, and surface new observations for operator review." note="A planned capability. Aircraft and observation regions are illustrative." motionPaused={paused} controls={<button type="button" aria-pressed={perception} onClick={() => setPerception(value => !value)}><span className={styles.layerIcon} aria-hidden="true" />{perception ? "Perception layer on" : "Perception layer off"}</button>}>
      {scenePaused => <DetectVisual paused={scenePaused} perception={perception} />}
    </ConceptRow>
    <ConceptRow product="ARCA-1" number="02" category="WIDE-AREA SENSING" heading="A wider view of aerial activity." description="A planned radar and camera system for drone detection. Explore a concept for connecting aerial observations with aircraft and operator context." note="Concept geometry only. Detection range and coverage are not demonstrated." motionPaused={paused} controls={<button type="button" aria-pressed={network} onClick={() => setNetwork(value => !value)}><span className={styles.layerIcon} aria-hidden="true" />{network ? "Aircraft links on" : "Aircraft links off"}</button>}>
      {scenePaused => <ArcaVisual paused={scenePaused} network={network} />}
    </ConceptRow>
  </div>;
}
