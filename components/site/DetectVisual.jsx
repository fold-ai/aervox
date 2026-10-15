"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './DetectVisual.module.css';

const labels = ['Assembly hall', 'Storage building', 'Office building', 'Storage vessels', 'Loading yard'];
const ids = ['B-01','B-02','B-03','S-01','Y-01'];
const types = ['Industrial building','Warehouse','Building','Industrial structures','Open area'];
const descriptions = [
  'Large roof span, repeated skylights and connected service buildings.',
  'Rectangular footprint, loading doors and an adjacent paved yard.',
  'Repeated window pattern and a separate pedestrian entrance.',
  'Cylindrical structures grouped on a shared concrete pad.',
  'Paved circulation area, parked trailers and marked loading spaces.',
];

function Scene({ inactive = false }) {
  const host = useRef(null), canvas = useRef(null), playback = useRef({time:0,paused:false,selected:0,structures:true,scan:true,inactive});
  const [paused,setPaused]=useState(false), [reduced,setReduced]=useState(false), [selected,setSelected]=useState(0);
  const [structures,setStructures]=useState(true), [scan,setScan]=useState(true), [showLabels,setShowLabels]=useState(true);
  const [frame,setFrame]=useState({time:0,points:[]}), [state,setState]=useState('loading');
  useEffect(()=>{Object.assign(playback.current,{paused,selected,structures,scan,inactive});},[paused,selected,structures,scan,inactive]);
  useEffect(()=>{
    let cancelled=false, engine, request, resize, previous=0, lastUi=0, visible=false, dirty=true, lastSignature='';
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync=()=>{playback.current.reduced=preference.matches;setReduced(preference.matches);if(preference.matches)playback.current.time=10;};
    sync(); preference.addEventListener('change',sync);
    const observer=new IntersectionObserver(async([entry])=>{
      visible=entry.isIntersecting;
      if(!visible||engine||cancelled)return;
      observer.unobserve(host.current);
      try {
        const module=await import('./detect-scene');
        if(cancelled)return;
        engine=module.createDetectScene(canvas.current);
        resize=new ResizeObserver(([entry])=>{engine.resize(entry.contentRect.width,entry.contentRect.height);dirty=true;});resize.observe(host.current);
        const size=host.current.getBoundingClientRect();engine.resize(size.width,size.height);
        setState('ready');
        const tick=now=>{
          if(cancelled)return;
          const s=playback.current;
          const dt=previous?Math.min((now-previous)/1000,.05):0;previous=now;
          if(!s.paused&&!s.reduced&&!s.inactive&&!document.hidden&&visible)s.time=Math.min(22,s.time+dt);
          const signature=`${s.time}:${s.selected}:${s.structures}:${s.scan}`;
          if(!s.inactive&&!document.hidden&&visible&&(dirty||signature!==lastSignature)){
            const points=engine.render(s.time,s);
            if(now-lastUi>90||dirty||s.paused||s.reduced||s.time>=22){setFrame({time:s.time,points});lastUi=now;}
            lastSignature=signature;dirty=false;
          }
          request=requestAnimationFrame(tick);
        };
        request=requestAnimationFrame(tick);
        observer.observe(host.current);
      } catch {if(!cancelled)setState('error');}
    },{rootMargin:'120px'});observer.observe(host.current);
    return()=>{cancelled=true;observer.disconnect();resize?.disconnect();cancelAnimationFrame(request);engine?.dispose();preference.removeEventListener('change',sync);};
  },[]);
  const replay=()=>{playback.current.time=0;setPaused(false);};
  const done=frame.time>=22;
  return <div className={styles.workspace}>
    <header className={styles.header}><strong>◭ <span>DETECT-1</span></strong><span>SCENE UNDERSTANDING</span><small>FICTIONAL CAMPUS / 01</small></header>
    <div className={styles.scene} ref={host}>
      <canvas ref={canvas} aria-label="Illustrative first-person aerial approach to a fictional industrial campus" />
      {state==='loading'&&<div className={styles.loading}>Preparing scene<span>DETECT-1 / Concept study</span></div>}
      {state==='error'&&<div className={styles.loading}>3D preview unavailable<span>Use a browser with WebGL to explore this concept.</span></div>}
      <div className={styles.topline}><span>01 / ONBOARD VIEW</span><span>{frame.time<5?'OBSERVING':frame.time<18?'BUILDING CONTEXT':'OBSERVATIONS READY'}</span></div>
      {state==='ready'&&showLabels&&frame.points.map((point,i)=>point.visible&&(frame.time>2+i*2.2||selected===i)&&<button key={ids[i]} className={styles.marker} style={{left:`${point.x}%`,top:`${point.y}%`}} aria-label={`Inspect ${labels[i]}`} aria-pressed={selected===i} onClick={()=>setSelected(i)}><i/>{ids[i]}<span>{labels[i]}</span></button>)}
      <div className={styles.sceneTitle} aria-hidden="true"><span>PERCEPTION, IN CONTEXT.</span><strong>DETECT-1</strong></div>
      <aside className={styles.observation} aria-label="Selected observation">
        <div><span>OBSERVATION</span><span>{ids[selected]}</span></div>
        <h3>{labels[selected]}</h3><p>{descriptions[selected]}</p>
        <dl><div><dt>Class</dt><dd>{types[selected]}</dd></div><div><dt>Source</dt><dd>Illustrative model</dd></div></dl>
      </aside>
      <div className={styles.timeline}><span style={{transform:`scaleX(${frame.time/22})`}}/></div>
    </div>
    <div className={styles.toolbar}>
      <div className={styles.layers} aria-label="Scene layers">{[['Contours',structures,setStructures],['Labels',showLabels,setShowLabels],['Scan',scan,setScan]].map(([label,on,set])=><button key={label} type="button" aria-pressed={on} onClick={()=>set(v=>!v)}><i/>{label}</button>)}</div>
      <div className={styles.playback}><span>{String(Math.floor(frame.time)).padStart(2,'0')} / 22</span><button type="button" onClick={replay} disabled={reduced||state!=='ready'} aria-label="Replay DETECT-1 approach">↺ Replay</button><button type="button" disabled={reduced||state!=='ready'} onClick={()=>done?replay():setPaused(v=>!v)} aria-label={paused||done?'Play DETECT-1 approach':'Pause DETECT-1 approach'}>{reduced?'Motion off':done?'▷ Play again':paused?'▷ Play':'Ⅱ Pause'}</button></div>
    </div>
    <div className={styles.objectList} aria-label="Campus observations">{labels.map((label,i)=><button type="button" key={label} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span>{ids[i]}</span>{label}</button>)}</div>
    <p className={styles.mobileDetail}><strong>{labels[selected]}.</strong> {descriptions[selected]}</p>
  </div>;
}

export default function DetectVisual({className=''}) {
  const dialog=useRef(null);const [expanded,setExpanded]=useState(false);
  return <figure className={`${styles.figure} ${className}`} data-system="detect-1">
    <Scene inactive={expanded}/>
    <figcaption><span>Fictional scene / illustrative observations</span><button type="button" onClick={()=>{setExpanded(true);dialog.current.showModal();}}>Explore scene <span aria-hidden="true">↗</span></button></figcaption>
    <dialog ref={dialog} className={styles.dialog} aria-label="Explore DETECT-1 scene" onClose={()=>setExpanded(false)}>
      <div className={styles.dialogBar}><span>DETECT-1 / PERCEPTION CONCEPT</span><button type="button" onClick={()=>dialog.current.close()}>Close scene ×</button></div>
      {expanded&&<Scene/>}
      <p className={styles.note}>An authored 3D scene with illustrative classifications. No live sensor data or demonstrated recognition performance.</p>
    </dialog>
  </figure>;
}
