import styles from "./ActTestFootage.module.css";

export default function ActTestFootage() {
  return <section className={styles.section} id="test-footage" aria-labelledby="act-test-title">
    <div className={styles.copy}>
      <span className={styles.eyebrow}>ACT-1 / TEST FOOTAGE</span>
      <h2 id="act-test-title">See what<br />the system sees.</h2>
      <p>Real footage from drone detection and tracking tests. Watch the recorded system view as it follows a drone and displays tracking information.</p>
      <p className={styles.context}>This recording demonstrates the view during testing. It does not show an interception.</p>
      <span className={styles.duration}>00:37 / DETECTION + TRACKING</span>
    </div>
    <figure className={styles.figure}>
      <video
        className={styles.video}
        controls
        playsInline
        preload="none"
        poster="/media/act-1-testing/detection-tracking-poster.jpg"
        width="480"
        height="360"
        aria-label="ACT-1 drone detection and tracking test recording"
        aria-describedby="act-test-caption"
      >
        <source src="/media/act-1-testing/detection-tracking-test.mp4" type="video/mp4" />
        Your browser does not support video playback. <a href="/media/act-1-testing/detection-tracking-test.mp4">Open the test recording.</a>
      </video>
      <figcaption id="act-test-caption">Recorded system view with a tracking marker, crosshair and status overlay. Original 4:3 recording.</figcaption>
    </figure>
  </section>;
}
