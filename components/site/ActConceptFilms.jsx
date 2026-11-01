import styles from "./ActConceptFilms.module.css";

const films = [
  {
    id: "system-concept",
    title: "System overview",
    duration: "00:47",
    description: "ARCA-1 station, ACT-1 launch concept and flight sequence.",
  },
  {
    id: "aircraft-models",
    title: "Aircraft models",
    duration: "00:07",
    description: "A closer look at the representative aircraft models used in the animation.",
  },
];
const mediaPath = "/media/investor-demo";

export default function ActConceptFilms() {
  return (
    <section className={styles.section} id="concept-demos" aria-labelledby="act-demo-title">
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>ACT-1 / CONCEPT DEMOS</span>
          <h2 id="act-demo-title">ACT-1 in context.</h2>
        </div>
        <p>Explore the system through two short concept films. For recorded detection and tracking, <a href="#test-footage">watch the real test footage above.</a></p>
      </div>
      <div className={styles.films}>
        {films.map((film, index) => (
          <figure className={styles.film} key={film.id}>
            <div className={styles.filmHeading}>
              <span className={styles.number}>0{index + 1}</span>
              <h3 id={`act-demo-${film.id}`}>{film.title}</h3>
              <span className={styles.duration}>{film.duration}</span>
            </div>
            <video
              className={styles.video}
              controls
              muted
              playsInline
              preload="none"
              poster={`${mediaPath}/${film.id}-poster.jpg`}
              width="1280"
              height="726"
              aria-label={`ACT-1 ${film.title.toLowerCase()} concept film`}
              aria-describedby={`act-demo-${film.id}-caption`}
            >
              <source src={`${mediaPath}/${film.id}.mp4`} type="video/mp4" />
              Your browser does not support video playback. <a href={`${mediaPath}/${film.id}.mp4`}>Open the concept film.</a>
            </video>
            <figcaption id={`act-demo-${film.id}-caption`}>
              <p>{film.description}</p>
              <a href={`${mediaPath}/${film.id}.mp4`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${film.title.toLowerCase()} video`}>Open video <span aria-hidden="true">↗</span></a>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className={styles.note}>Concept visualizations of the intended workflow. These animations are separate from real test footage and do not establish validated performance.</p>
    </section>
  );
}
