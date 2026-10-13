"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./VistaVisual.module.css";

export default function VistaVisual({ compact = false, className = "" }) {
  const [screenOn, setScreenOn] = useState(false);
  return <div className={`${styles.visual} ${compact ? styles.compact : ""} ${screenOn ? styles.screenOn : ""} ${className}`}>
    <Image
      src="/media/vista-1-concept.png"
      alt="Concept visualization of a dark forearm-mounted display"
      fill
      sizes={compact ? "(max-width: 720px) 100vw, 50vw" : "100vw"}
      className={styles.image}
    />
    <svg className={styles.screenPreview} viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden={!screenOn} aria-label="Concept interface showing an aircraft view and selected observations on the wearable screen">
      <defs>
        <clipPath id="vista-screen"><path d="M751 333 1192 221 1247 470 785 555Z" /></clipPath>
        <linearGradient id="vista-glass" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#151b18" /><stop offset="1" stopColor="#070a09" /></linearGradient>
      </defs>
      <g clipPath="url(#vista-screen)">
        <path d="M751 333 1192 221 1247 470 785 555Z" fill="url(#vista-glass)" />
        <g className={styles.screenContent} transform="translate(783 352) rotate(-13)">
          <text x="0" y="0" className={styles.screenMicro}>ACTPROVE / VISTA-1</text>
          <text x="406" y="0" textAnchor="end" className={styles.screenMicro}>CONCEPT VIEW</text>
          <path d="M0 16H410" stroke="#a4ada5" strokeOpacity=".45" />
          <rect x="0" y="30" width="116" height="123" fill="#1a201c" stroke="#a4ada5" strokeOpacity=".5" />
          <path d="M0 112 27 91 49 101 79 68 116 86M0 135 29 116 59 121 84 105 116 114" fill="none" stroke="#7e887e" strokeOpacity=".7" />
          <path d="M13 49h17m-17 0v17m90-17H86m17 0v17m-90 70h17m-17 0v-17m90 17H86m17 0v-17" fill="none" stroke="#d8ed8a" strokeWidth="1.5" />
          <text x="9" y="171" className={styles.screenMicro}>AIRCRAFT VIEW</text>
          <path d="M141 30V174" stroke="#a4ada5" strokeOpacity=".42" />
          <path d="M162 73c30-17 47-3 72-22 22-17 46-8 66-20 22-13 41-2 75-12m-213 80c32-19 55-9 80-25 22-14 48-7 67-20 25-13 43-5 66-11m-213 82c30-13 47-4 71-19 25-14 44-4 72-22 27-16 48-5 70-13m-213 83c26-13 53-7 80-23 27-17 47-8 69-20 27-14 46-6 64-9" fill="none" stroke="#69756c" strokeOpacity=".5" />
          <path d="M274 48 349 81 298 140 209 109Z" fill="#d8ed8a" fillOpacity=".07" stroke="#d8ed8a" strokeOpacity=".44" />
          <circle cx="268" cy="87" r="7" fill="#d8ed8a" /><circle cx="268" cy="87" r="15" fill="none" stroke="#d8ed8a" strokeOpacity=".65" />
          <path d="m209 107 11-11 11 11-11 11Z" fill="#d8ed8a" fillOpacity=".75" />
          <circle cx="333" cy="82" r="5" fill="none" stroke="#e8e8df" strokeWidth="2" />
          <text x="162" y="171" className={styles.screenMicro}>SELECTED OBSERVATIONS</text>
        </g>
      </g>
    </svg>
    <div className={styles.shade} aria-hidden="true" />
    <div className={styles.header}><span>ACTPROVE / OPERATOR CONTEXT</span><span>06 / CONCEPT STUDY</span></div>
    <div className={styles.copy}><span>VISTA-1</span><strong>Information<br />within reach.</strong><i /></div>
    <div className={styles.footer}><span>PROVE-1 / WEARABLE VIEW</span><button type="button" className={styles.toggle} aria-pressed={screenOn} onClick={() => setScreenOn(value => !value)}><span className={styles.powerIcon} aria-hidden="true" />{screenOn ? "SCREEN ON" : "PREVIEW SCREEN"}</button></div>
  </div>;
}
