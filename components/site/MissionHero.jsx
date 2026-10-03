"use client";

import FlightSequence from "./FlightSequence";
import styles from "./MissionHero.module.css";

/** The hero and air demonstration share the same film and authored tracking overlay. */
export default function MissionHero({ className = "", ...props }) {
  return <FlightSequence {...props} variant="hero" className={`${styles.hero} ${className}`.trim()} />;
}
