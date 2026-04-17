"use client";

import { profile } from "../../data";
import { FadeIn } from "../shared/FadeIn";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div aria-hidden className={styles.heroBg}>POZO</div>

      <FadeIn delay={0.1}>
        <div className={styles.heroAvailable}>
          <span className={styles.heroAvailableLine} />
          Available for work
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <h1 className={styles.heroTitle}>
          Sebastian<br />
          <span className={styles.heroTitleAccent}>Pozo.</span>
        </h1>
      </FadeIn>

      <FadeIn delay={0.35}>
        <div className={styles.heroBottom}>
          <p className={styles.heroDescription}>{profile.description}</p>
          <div className={styles.heroActions}>
            <a href="#projects" className={styles.btnPrimary}>See work</a>
            <a href={profile.github} target="_blank" rel="noreferrer" className={styles.btnSecondary}>
              GitHub ↗
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}