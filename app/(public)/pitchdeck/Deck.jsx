"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const SYSTEM = (
  <svg viewBox="0 0 420 420" role="img" aria-label="Abstract connected systems diagram" className="dwg">
    <circle className="dw thin" cx="210" cy="210" r="160" />
    <circle className="dw thin" cx="210" cy="210" r="115" />
    <path className="dw axis" d="M210 20v380M20 210h380" />
    <rect className="dw" x="145" y="145" width="130" height="130" />
    <rect className="dw thin" x="167" y="167" width="86" height="86" />
    <path className="dw" d="M210 145V50M275 210h95M210 275v95M145 210H50" />
    <circle className="dw" cx="210" cy="50" r="12" /><circle className="dw" cx="370" cy="210" r="12" />
    <circle className="dw" cx="210" cy="370" r="12" /><circle className="dw" cx="50" cy="210" r="12" />
    <text className="tag" x="210" y="215" textAnchor="middle">A / P</text>
  </svg>
);

export default function Deck() {
  const scroller = useRef(null);
  const [at, setAt] = useState(0);
  const [total, setTotal] = useState(8);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const slides = Array.from(el.querySelectorAll(".slide"));
    setTotal(slides.length);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setAt(slides.indexOf(entry.target));
      });
    }, { root: el, threshold: 0.55 });
    slides.forEach((slide) => io.observe(slide));
    const onKey = (event) => {
      const forward = ["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key);
      const backward = ["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key);
      if (!forward && !backward) return;
      event.preventDefault();
      const next = Math.min(slides.length - 1, Math.max(0, at + (forward ? 1 : -1)));
      slides[next].scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("keydown", onKey);
    return () => { io.disconnect(); window.removeEventListener("keydown", onKey); };
  }, [at]);

  return (
    <div className="deck" ref={scroller}>
      <div className="deck-bar"><a className="deck-home" href="/"><Image src="/actprove-wordmark.png" alt="Actprove" width={900} height={90} priority /></a><span className="deck-count">{String(at + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span></div>

      <section className="slide s-title">
        <div><Image className="deck-lockup" src="/actprove-lockup.png" alt="Actprove Defense Technologies" width={900} height={146} priority /><h1>Intelligence for the next generation of drones.</h1><p className="kicker">SOFTWARE / HARDWARE / MODELS / DATA</p></div>
        <div className="s-title-art">{SYSTEM}</div>
      </section>

      <section className="slide">
        <h2>Our focus</h2>
        <p className="lede">Actprove develops the computing and software systems that help drone manufacturers understand what their aircraft observe.</p>
        <div className="rows">
          <div className="row"><h3>Onboard compute</h3><p>Hardware and software designed to process sensor data on the aircraft.</p></div>
          <div className="row"><h3>Perception models</h3><p>Custom models for recognition and tracking, adapted to each partner platform.</p></div>
          <div className="row"><h3>Training data</h3><p>Curated datasets and evaluation workflows for teams developing their own models.</p></div>
        </div>
      </section>

      <section className="slide">
        <h2>Two products, one system</h2>
        <div className="cards">
          <div className="card"><span className="num">01 / GROUND</span><h3>PROVE-1</h3><p>A software platform for control, telemetry, model workflows, and analysis of collected information.</p></div>
          <div className="card"><span className="num">02 / ONBOARD</span><h3>ACT-1</h3><p>Onboard compute and perception for drones, initially focused on interceptor platforms.</p></div>
        </div>
        <p className="fine">Both systems are in development. We will publish validated performance information as testing progresses.</p>
      </section>

      <section className="slide">
        <h2>Our first company partnership: Savlo Dynamics</h2>
        <p className="lede">Savlo Dynamics is developing a drone designed to fly at 500 mph. We are building an onboard perception system for its platform to recognize relevant aerial objects and support high-speed interception decisions.</p>
        <div className="stats"><div><b>500</b><span>mph partner-stated aircraft design speed</span></div><div><b>ACT-1</b><span>onboard perception work in progress</span></div><div><b>01</b><span>first active company partnership</span></div></div>
      </section>

      <section className="slide">
        <h2>Model development as a partner capability</h2>
        <p className="lede">We combine datasets, custom model work, and evaluation so partners can develop models matched to their own aircraft and sensors.</p>
        <div className="cards four">
          <div className="card"><span className="num">01</span><h3>Collect</h3><p>Organize sensor observations and relevant context.</p></div>
          <div className="card"><span className="num">02</span><h3>Curate</h3><p>Prepare training and evaluation datasets.</p></div>
          <div className="card"><span className="num">03</span><h3>Develop</h3><p>Build models for the partner platform.</p></div>
          <div className="card"><span className="num">04</span><h3>Review</h3><p>Measure results and improve over time.</p></div>
        </div>
      </section>

      <section className="slide">
        <h2>Next on the roadmap</h2>
        <div className="stages">
          <div><h3>ARCA-1</h3><p>Planned 3-6 metre radar and camera system for drone detection. Its 50 km range is a design goal, not a validated capability.</p></div>
          <div><h3>DETECT-1</h3><p>Planned onboard perception for long-range drones, designed to identify objects of interest and surface changing conditions to operators.</p></div>
          <div><h3>ERA-1</h3><p>Long-term research into autonomous fighter-aircraft flight management, object classification, and civilian-risk awareness with human authorization.</p></div>
        </div>
      </section>

      <section className="slide">
        <h2>Where we are</h2>
        <div className="rows">
          <div className="row"><h3>Now</h3><p>Developing PROVE-1 and ACT-1, with an active integration project for Savlo Dynamics.</p></div>
          <div className="row"><h3>Next</h3><p>Testing model performance with partner hardware and expanding the training-data workflow.</p></div>
          <div className="row"><h3>Later</h3><p>Research and validation for ARCA-1, DETECT-1, and ERA-1.</p></div>
        </div>
        <p className="fine">Roadmap descriptions are development goals and should not be read as deployed capabilities.</p>
      </section>

      <section className="slide s-end">
        <div><Image className="deck-lockup" src="/actprove-lockup.png" alt="Actprove Defense Technologies" width={900} height={146} /><p className="kicker big">Drone software and hardware, built around the data.</p><a className="mailto" href="mailto:contact@actprove.com">contact@actprove.com</a></div>
        <div className="s-title-art">{SYSTEM}</div>
      </section>
    </div>
  );
}
