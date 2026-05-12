"use client";

import { profile } from "../../data";
import { FadeIn } from "../shared/FadeIn";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <FadeIn>
        <div className={styles.contactLabel}>
          <span className={styles.contactLabelLine} />
          Get in touch
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <h2 className={styles.contactTitle}>
          Let's<br />
          <span className={styles.contactTitleAccent}>Talk.</span>
        </h2>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className={styles.contactActions}>
          <a
            href={`mailto:${profile.email}`}
            className={styles.contactBtnPrimary}
          >
            Send email ↗
          </a>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className={styles.contactBtnGhost}
          >
            LinkedIn
          </a>

          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className={styles.contactBtnGhost}
          >
            GitHub
          </a>

          <a
            href="/cv-sebastian.pdf"
            download="CV_Sebastian_Pozo.pdf"
            className={`${styles.contactBtnGhost} ${styles.cvButton}`}
          >
            CV
          </a>
        </div>

        <div className={styles.contactEmail}>
          {profile.email}
        </div>
      </FadeIn>
    </section>
  );
}