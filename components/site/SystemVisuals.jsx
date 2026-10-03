"use client";

import { useId } from "react";
import styles from "./SystemVisuals.module.css";

const boardTraces = [
  "M16 27h27l14 14v15", "M12 37h26l13 13v23h9", "M10 49h19l14 14v25h14",
  "M20 62h10l9 9v28h18", "M9 83h18l13 13v12h20", "M18 114h21l12-12h9",
  "M16 139h18l18-18h15", "M21 151h23l20-20v-9", "M35 167v-13l36-36",
  "M48 169v-9l32-32v-8", "M58 10v26l13 13v11", "M70 9v19l12 12v20",
  "M82 13v15l10 10v22", "M95 9v28l9 9v14", "M112 12v24l-3 3v21",
  "M127 13v27l-13 13v10", "M153 25h-15l-20 20v15", "M167 44h-26l-19 19",
  "M169 61h-23l-24 19", "M168 80h-32l-14 10", "M165 99h-28l-15 9",
  "M170 122h-27l-21-8", "M156 137h-20l-17-16", "M165 154h-27l-29-29v-5",
  "M143 168v-7l-46-35v-6", "M118 168v-16l-28-23v-9", "M96 170v-18l-17-17v-15",
  "M76 170v-17l-8-8v-24", "M15 10h22v9h10", "M140 8v9h24v12",
];

const boardPins = Array.from({ length: 12 }, (_, i) => 61 + i * 4.8);
const signalBars = [8, 14, 11, 20, 25, 16, 12, 21, 30, 18, 12, 27, 33, 24, 15, 20, 29, 18, 12, 23, 17, 10, 15, 8];

function VisualFrame({ title, id, paused, children }) {
  return (
    <svg
      className={`${styles.visual} ${paused ? styles.paused : ""}`}
      viewBox="0 0 600 340"
      role="img"
      aria-labelledby={`${id}-title`}
    >
      <title id={`${id}-title`}>{title}</title>
      {children}
    </svg>
  );
}

export function ComputeVisual({ paused = false }) {
  const id = `compute-${useId().replace(/:/g, "")}`;

  return (
    <VisualFrame title="Conceptual onboard compute architecture with circuit traces and animated sensor signals" id={id} paused={paused}>
      <defs>
        <radialGradient id={`${id}-ambient`} cx="53%" cy="49%" r="61%">
          <stop offset="0" stopColor="#233730" stopOpacity=".5" />
          <stop offset="1" stopColor="#101617" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-board`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#23332f" />
          <stop offset="1" stopColor="#131e1b" />
        </linearGradient>
        <linearGradient id={`${id}-chip`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#46564e" />
          <stop offset=".45" stopColor="#273a31" />
          <stop offset="1" stopColor="#18251f" />
        </linearGradient>
        <pattern id={`${id}-grid`} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke="#bad4c7" strokeOpacity=".035" />
        </pattern>
      </defs>

      <path fill="#101617" d="M0 0h600v340H0z" />
      <path fill={`url(#${id}-grid)`} d="M0 0h600v340H0z" />
      <path fill={`url(#${id}-ambient)`} d="M0 0h600v340H0z" />
      <g className={styles.frameCorners}>
        <path d="M21 40V21h19M560 21h19v19M579 300v19h-19M40 319H21v-19" />
      </g>
      <text className={styles.label} x="34" y="42">CONCEPT ARCHITECTURE</text>
      <text className={styles.faintLabel} x="566" y="42" textAnchor="end">ACT-1</text>

      <ellipse cx="312" cy="243" rx="177" ry="46" fill="#040907" opacity=".58" />
      <g className={styles.boardBase}>
        <path d="m132 196 180 103 180-103v11L312 310 132 207Z" fill="#0a100e" stroke="#527568" strokeOpacity=".3" />
        <path d="m132 196 180-103 180 103-180 103Z" fill="#17201d" stroke="#50665b" strokeOpacity=".48" />
        <path d="m147 196 165-94 165 94-165 95Z" fill="none" stroke="#90b9a5" strokeOpacity=".15" />
        <path d="m132 181 180 103 180-103v8L312 292 132 189Z" fill="#0b1310" stroke="#718c7d" strokeOpacity=".4" />
        <path d="M312 284v8" fill="none" stroke="#99b3a5" strokeOpacity=".4" />
      </g>

      <g transform="matrix(1 .572 -1 .572 312 78)">
        <rect width="180" height="180" rx="3" fill={`url(#${id}-board)`} stroke="#658a77" strokeWidth="1" />
        <rect x="6" y="6" width="168" height="168" rx="2" fill="none" stroke="#63826f" strokeOpacity=".3" strokeWidth=".65" />
        <g fill="none" stroke="#80a88f" strokeOpacity=".3" strokeWidth=".65">
          {boardTraces.map((path, i) => <path key={i} d={path} />)}
        </g>
        <g className={styles.traceSignals} fill="none" stroke="#b0e9c6" strokeWidth="1.4">
          <path d={boardTraces[1]} />
          <path d={boardTraces[11]} style={{ animationDelay: "-1.6s" }} />
          <path d={boardTraces[18]} style={{ animationDelay: "-3s" }} />
          <path d={boardTraces[24]} style={{ animationDelay: "-2.2s" }} />
        </g>
        <g fill="#86a792" opacity=".66">
          {[[12,12], [168,12], [12,168], [168,168]].map(([x,y]) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="3.1" /><circle cx={x} cy={y} r="1.5" fill="#102018" /></g>)}
          {[[18,28],[14,50],[16,139],[48,166],[95,12],[166,61],[164,99],[153,137],[117,167],[76,166]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" />)}
        </g>
        <g fill="#111b15" stroke="#627a68" strokeWidth=".7">
          <rect x="18" y="72" width="13" height="26" rx="1" /><rect x="136" y="48" width="13" height="28" rx="1" />
          <rect x="54" y="140" width="25" height="12" rx="1" /><rect x="102" y="22" width="25" height="12" rx="1" />
        </g>
        <g stroke="#a0b1a3" strokeWidth="1" opacity=".62">
          {Array.from({length: 6}, (_, i) => <path key={i} d={`M15 ${76+i*3.4}h3m13 0h3M133 ${52+i*3.4}h3m13 0h3M${57+i*3.7} 137v3m0 12v3M${105+i*3.7} 19v3m0 12v3`} />)}
        </g>
        <g fill="#a9bdac" opacity=".75">
          {boardPins.map((p) => <path key={p} d={`M${p} 52h2v7h-2zM${p} 120h2v7h-2zM52 ${p}h7v2h-7zM120 ${p}h7v2h-7z`} />)}
        </g>
        <rect x="58" y="58" width="64" height="64" rx="2" fill="#0a100c" stroke="#647c69" />
        <rect x="63" y="63" width="54" height="54" rx="1" fill="#27342a" stroke="#97b69d" strokeOpacity=".36" />
        <g fill="#8daa94" opacity=".35">
          {Array.from({length: 6}, (_,i) => <rect key={i} x={145+i*3.8} y="91" width="2" height="20" />)}
        </g>
      </g>

      <g className={styles.processor}>
        <path d="m259 169 53 30 53-30v9l-53 30-53-30Z" fill="#15221a" stroke="#718f79" strokeWidth=".6" />
        <path d="m259 169 53-30 53 30-53 30Z" fill={`url(#${id}-chip)`} stroke="#9cbaa2" strokeOpacity=".7" />
        <path d="m267 169 45-25 45 25-45 26Z" fill="none" stroke="#b0e9c6" strokeOpacity=".18" />
        <path d="m296 168 16-9 16 9-16 10Z" fill="none" stroke="#b0e9c6" strokeWidth=".7" opacity=".8" />
        <path d="m302 168 10-5 10 5-10 6Z" fill="#b0e9c6" fillOpacity=".1" />
        <path d="m310 163 8 4-8 5-4-2 7-4" fill="none" stroke="#b0e9c6" strokeWidth="1.1" />
      </g>

      <g className={styles.callouts}>
        <path d="M345 146h40l28-31h66M217 184h-33l-21-21h-48" />
        <circle cx="345" cy="146" r="2" /><circle cx="217" cy="184" r="2" />
      </g>
      <text className={styles.tinyLabel} x="415" y="107">ONBOARD COMPUTE</text>
      <text className={styles.tinyLabel} x="114" y="155" textAnchor="start">SENSOR INPUT</text>
      <circle className={styles.indicator} cx="35" cy="298" r="2.5" />
      <text className={styles.faintLabel} x="47" y="301">CONNECTED ARCHITECTURE</text>
      <text className={styles.faintLabel} x="566" y="301" textAnchor="end">ILLUSTRATIVE</text>
    </VisualFrame>
  );
}

const contours = [
  "M-36 193C21 172 32 123 71 110S155 127 172 91 131 17 203-8",
  "M-39 214C28 193 49 137 81 130S158 142 186 107 157 34 226-4",
  "M-30 235C42 215 58 157 95 150S170 158 200 123 181 52 249 0",
  "M-19 254C47 247 79 178 107 170S176 179 215 140 206 72 272 6",
  "M9 270C72 264 93 199 120 192S189 197 232 157 230 89 295 9",
  "M40 286C94 277 105 225 142 214S205 218 249 177 252 109 319 12",
  "M72 298C112 284 123 244 159 236S221 237 268 195 279 126 343 16",
  "M107 309C131 288 142 266 179 259S246 255 288 215 306 144 367 19",
  "M149 317C168 297 161 284 200 280S267 277 307 235 331 165 392 27",
  "M321 313C372 303 335 262 378 241S418 201 426 178 440 139 463 145 472 203 509 218 568 180 633 189",
  "M351 328C395 308 362 279 400 256S438 223 446 201 449 176 460 177 479 224 509 237 572 205 622 209",
  "M384 332C418 310 392 294 421 277S459 248 462 226 486 245 514 254 570 231 614 231",
  "M419 342C444 321 421 311 446 296S477 265 491 271 525 281 550 266 597 254 622 255",
  "M428-5C410 57 399 82 415 105S455 121 484 103 520 72 561 86 581 142 624 131",
  "M454-6C438 50 421 75 433 91S461 99 484 82 525 54 565 65 593 115 628 111",
  "M479-8C462 36 445 65 454 77S477 73 494 61 531 35 568 46 599 89 632 89",
];

export function DataVisual({ paused = false }) {
  const id = `data-${useId().replace(/:/g, "")}`;

  return (
    <VisualFrame title="Illustrative mission analysis map with topographic contours, observation points and a signal timeline" id={id} paused={paused}>
      <defs>
        <linearGradient id={`${id}-ambient`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b2923" />
          <stop offset="1" stopColor="#101617" />
        </linearGradient>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#101617" stopOpacity="0" />
          <stop offset="1" stopColor="#101617" />
        </linearGradient>
        <radialGradient id={`${id}-focus`}>
          <stop offset="0" stopColor="#b0e9c6" stopOpacity=".085" />
          <stop offset="1" stopColor="#b0e9c6" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#bad4c7" strokeOpacity=".04" />
        </pattern>
        <clipPath id={`${id}-map-clip`}><path d="M22 58h556v209H22z" /></clipPath>
      </defs>

      <path fill="#101617" d="M0 0h600v340H0z" />
      <path fill={`url(#${id}-ambient)`} d="M0 0h600v340H0z" />
      <path fill={`url(#${id}-grid)`} d="M0 0h600v340H0z" />
      <g className={styles.frameCorners}>
        <path d="M21 40V21h19M560 21h19v19M579 300v19h-19M40 319H21v-19" />
      </g>
      <text className={styles.label} x="34" y="42">OBSERVATION MAP</text>
      <text className={styles.faintLabel} x="566" y="42" textAnchor="end">PROVE-1</text>

      <g clipPath={`url(#${id}-map-clip)`}>
        <g className={styles.contours}>
          {contours.map((d, i) => <path d={d} key={i} opacity={i % 3 === 0 ? ".63" : ".3"} />)}
        </g>
        <circle cx="321" cy="153" r="102" fill={`url(#${id}-focus)`} />
        <g fill="none" stroke="#b0e9c6" strokeWidth=".6">
          <circle cx="321" cy="153" r="63" opacity=".11" />
          <circle cx="321" cy="153" r="39" opacity=".12" />
          <path d="M247 153h148M321 79v148" strokeDasharray="2 6" opacity=".14" />
        </g>
        <path className={styles.observationPath} d="m99 215 63-32 54 12 57-53 48 11 54-51 66 24 60-45" />
        <path className={styles.pathSignal} d="m99 215 63-32 54 12 57-53 48 11 54-51 66 24 60-45" />
        <path d="m216 195 33 29 56-6 33-27 46 10 39-24" fill="none" stroke="#a5baac" strokeOpacity=".4" strokeWidth=".9" strokeDasharray="3 5" />

        {[[99,215],[162,183],[216,195],[273,142],[375,102],[441,126],[501,81]].map(([x,y],i) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="5" fill="#112019" stroke="#abc7b4" strokeOpacity=".65" strokeWidth=".7" /><circle cx={x} cy={y} r="1.5" fill="#b0e9c6" opacity={i % 2 === 0 ? ".85" : ".5"} /></g>)}

        <g className={styles.mapFocus}>
          <circle className={styles.focusRing} cx="321" cy="153" r="14" />
          <path d="M309 148v-7h7M326 141h7v7M333 158v7h-7M316 165h-7v-7" fill="none" stroke="#b0e9c6" strokeWidth="1" />
          <circle cx="321" cy="153" r="3" fill="#c3f3d2" />
        </g>

        <path d="M335 162h18l11 12h42" fill="none" stroke="#b0e9c6" strokeOpacity=".42" strokeWidth=".6" />
        <rect x="364" y="174" width="103" height="26" fill="#122019" fillOpacity=".96" stroke="#7eae8e" strokeOpacity=".25" strokeWidth=".7" />
        <circle cx="375" cy="187" r="2" fill="#b0e9c6" />
        <text className={styles.tinyLabel} x="385" y="190">OBSERVATION</text>
        <path d="M0 230h600v52H0z" fill={`url(#${id}-fade)`} />
      </g>

      <g className={styles.mapCompass}>
        <path d="M548 215v-21m-5 6 5-6 5 6M543 215h10" />
        <text x="548" y="188" textAnchor="middle">N</text>
      </g>

      <g>
        <path d="M34 268h532" fill="none" stroke="#abc4b5" strokeOpacity=".17" strokeWidth=".7" />
        <text className={styles.faintLabel} x="34" y="291">SENSOR TIMELINE</text>
        <g className={styles.signalBars}>
          {signalBars.map((height, i) => <rect key={i} x={181+i*10.2} y={303-height} width="3" height={height} style={{ animationDelay: `${i*-.17}s` }} opacity={i < 14 ? ".6" : ".25"} />)}
        </g>
        <path d="M179 303h248" fill="none" stroke="#b0e9c6" strokeOpacity=".2" strokeWidth=".7" />
        <path className={styles.timelineCursor} d="M316 270v36m-3-36h6" fill="none" stroke="#d3efda" strokeWidth=".9" />
        <text className={styles.faintLabel} x="566" y="292" textAnchor="end">ILLUSTRATIVE</text>
      </g>
    </VisualFrame>
  );
}
