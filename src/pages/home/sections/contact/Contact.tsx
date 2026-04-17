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
          <a href={`mailto:${profile.email}`} className={styles.contactBtnPrimary}>
            Send email ↗
          </a>
          {[
            { label: "LinkedIn", href: profile.linkedin },
            { label: "GitHub", href: profile.github },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={styles.contactBtnGhost}
            >
              {label}
            </a>
          ))}
        </div>
        <div className={styles.contactEmail}>{profile.email}</div>
      </FadeIn>
    </section>
  );
}