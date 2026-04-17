"use client";

import { profile, technologies } from "../../data";
import { FadeIn } from "../shared/FadeIn";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.aboutGrid}>
        <FadeIn>
          <div className={styles.aboutHeadline}>
            Full<br />Stack<br />
            <span className={styles.aboutHeadlineAccent}>Dev.</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className={styles.aboutContent}>
            <p className={styles.aboutText}>
              I build scalable backends and clean frontends — from database modeling and async
              processing. I care about systems that hold up under pressure.
            </p>
            <p className={styles.aboutText}>
              Currently based in Lima, Peru.
            </p>
            <div className={styles.aboutLinks}>
              {[
                { label: "LinkedIn ↗", href: profile.linkedin },
                { label: "GitHub ↗", href: profile.github },
                { label: "Email", href: `mailto:${profile.email}` },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className={styles.aboutLink}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.1}>
        <div className={styles.techStack}>
          <div className={styles.techStackLabel}>Tech stack</div>
          <div className={styles.techCategories}>
            {Object.entries(technologies).map(([cat, items]) => (
              <div key={cat} className={styles.techCategory}>
                <div className={styles.techCategoryName}>{cat}</div>
                <ul className={styles.techList}>
                  {items.map((t) => (
                    <li key={t} className={styles.techItem}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}