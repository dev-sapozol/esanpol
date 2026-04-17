"use client";

import { experiences } from "../../data";
import { FadeIn } from "../shared/FadeIn";
import styles from "./Experience.module.css";

export default function Experience() {
  return (
    <section id="experience" className={styles.experience}>
      <FadeIn>
        <div className={styles.experienceHeader}>
          <h2 className={styles.experienceTitle}>
            Work<br />
            <span className={styles.experienceTitleAccent}>History.</span>
          </h2>
          <span className={styles.experienceCount}>0{experiences.length}</span>
        </div>
      </FadeIn>

      <div>
        {experiences.map((exp, i) => (
          <FadeIn key={exp.id} delay={i * 0.12}>
            <div className={styles.expItem}>
              <div className={styles.expMeta}>
                <div className={styles.expPeriod}>{exp.period}</div>
                <div className={styles.expCompany}>{exp.company}</div>
              </div>
              <div className={styles.expBody}>
                <div className={styles.expRole}>{exp.role}</div>
                <ul className={styles.expDescList}>
                  {(Array.isArray(exp.description) ? exp.description : [exp.description]).map(
                    (d, j) => (
                      <li key={j} className={styles.expDescItem}>
                        <span className={styles.expDescArrow}>→</span>
                        {d}
                      </li>
                    )
                  )}
                </ul>
                <div className={styles.expTech}>
                  {exp.tech.map((t) => (
                    <span key={t} className={styles.expTechTag}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}