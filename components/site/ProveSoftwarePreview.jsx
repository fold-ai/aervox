import styles from "./ProveSoftwarePreview.module.css";

export const proveSoftwareImage = "/media/prove-1-software-preview.webp";

export default function ProveSoftwarePreview() {
  return <div className={styles.preview}>
    <img src={proveSoftwareImage} alt="ACTPROVE operator software with a satellite map, asset tracks and mission panels" width="1600" height="900" loading="lazy" decoding="async" />
  </div>;
}
