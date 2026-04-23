"use client";

import { projects } from "../../data";
import { FadeIn } from "../shared/FadeIn";
import { type Project } from "../shared/types";
import { useState } from "react";
import styles from "./Projects.module.css";

function ProjectRow({ p, i }: { p: Project; i: number }) {
  const [codeVisible, setCodeVisible] = useState(false);
  return (
    <div className={styles.projectRow}>
      <div className={styles.projectAccent} />

      {p.featured && (
        <span className={styles.projectFeatured}>Featured</span>
      )}

      <div className={styles.projectIndex}>0{i + 1}</div>

      <div className={styles.projectInfo}>
        <div className={styles.projectHeader}>
          {p.logo && (
            <img
              className={styles.projectLogo}
              src={p.logo}
              alt={`${p.name} logo`}
            />
          )}
          <div className={styles.projectName}>{p.name}</div>
        </div>
        <p className={styles.projectDescription}>{p.description}</p>
        <div className={styles.projectTech}>
          {p.tech.map((t) => (
            <span key={t} className={styles.projectTechTag}>{t}</span>
          ))}
        </div>
      </div>

      <div className={styles.projLinksCol}>
        {p.github && (
          <a href={p.github} target="_blank" rel="noreferrer" className={styles.projectLinkGhost}>
            GitHub ↗
          </a>
        )}
        {p.live && (
          <a href={p.live} target="_blank" rel="noreferrer" className={styles.projectLinkSolid}>
            Live ↗
          </a>
        )}
        {p.code && (
          <p
            className={`${styles.projectCode} ${!codeVisible ? styles.projectCodeBlurred : ""}`}
            onClick={() => setCodeVisible(true)}
            title={!codeVisible ? "Click para ver el código" : undefined}
          >
            Code: {p.code}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className={styles.projects}>
      <FadeIn>
        <h2 className={styles.projectsTitle}>
          Selected<br />
          <span className={styles.projectsTitleAccent}>Projects.</span>
        </h2>
      </FadeIn>

      <div className={styles.projectsList}>
        {projects.map((p, i) => (
          <FadeIn key={p.id} delay={i * 0.1}>
            <ProjectRow p={p} i={i} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}