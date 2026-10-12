import Image from "next/image";
import styles from "./VistaVisual.module.css";

export default function VistaVisual({ compact = false, className = "" }) {
  return <div className={`${styles.visual} ${compact ? styles.compact : ""} ${className}`}>
    <Image
      src="/media/vista-1-concept.png"
      alt="Concept visualization of a dark forearm-mounted display"
      fill
      sizes={compact ? "(max-width: 720px) 100vw, 50vw" : "100vw"}
      className={styles.image}
    />
    <div className={styles.shade} aria-hidden="true" />
    <div className={styles.header}><span>ACTPROVE / OPERATOR CONTEXT</span><span>06 / CONCEPT STUDY</span></div>
    <div className={styles.copy}><span>VISTA-1</span><strong>Information<br />within reach.</strong><i /></div>
    <div className={styles.footer}><span>PROVE-1 / WEARABLE VIEW</span><span>DESIGN DIRECTION</span></div>
  </div>;
}
