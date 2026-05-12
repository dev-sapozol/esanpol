"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { technologies } from "./data";
import { PROJECTS } from "./projects";
import baseStyles from "./Home.module.css";
import { useBackendPrewarm } from "./hooks/useBackendPrewarm";

const Hero = lazy(() => import("./sections/hero/Hero"));
const About = lazy(() => import("./sections/about/About"));
const Experience = lazy(() => import("./sections/experience/Experience"));
const Projects = lazy(() => import("./sections/projects/Projects"));
const Contact = lazy(() => import("./sections/contact/Contact"));

type MarqueeProps = { items: string[] };

function Marquee({ items }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div className={baseStyles.marqueeStrip}>
      <div className={baseStyles.marqueeTrack}>
        {doubled.map((t, i) => (
          <span key={i} className={baseStyles.marqueeItem}>
            {t}<span className={baseStyles.marqueeDot}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  // Se dispara 1.5s después del primer render, una vez por sesión de pestaña.
  // Extrae los healthEndpoints directamente de PROJECTS
  useBackendPrewarm(PROJECTS.map((p) => p.healthEndpoint));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["hero", "about", "experience", "projects", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.35 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const allTech = Object.values(technologies).flat();
  const navLinks = ["about", "experience", "projects", "contact"] as const;

  return (
    <>
      <nav className={`${baseStyles.nav} ${scrolled ? baseStyles.scrolled : ""}`}>
        <div className={baseStyles.navLogo}>SP.</div>

        <div
          className={[
            baseStyles.navLinks,
            menuOpen ? baseStyles.open : "",
            scrolled ? baseStyles.menuScrolled : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {navLinks.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? baseStyles.active : ""}
              onClick={() => setMenuOpen(false)}
            >
              {id}
            </a>
          ))}
        </div>

        <div
          className={baseStyles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          role="button"
          aria-label="Toggle menu"
        >
          <span style={menuOpen ? { transform: "rotate(45deg) translate(5px,5px)" } : {}} />
          <span style={menuOpen ? { opacity: 0 } : {}} />
          <span style={menuOpen ? { transform: "rotate(-45deg) translate(5px,-5px)" } : {}} />
        </div>
      </nav>

      <Suspense fallback={null}>
        <Hero />
        <Marquee items={allTech} />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </Suspense>

      <footer className={baseStyles.footer}>
        <span>© 2025 Sebastian Pozo Lucano</span>
        <span>Lima, Perú</span>
        {/* 
          Footer dinámico: 1 proyecto → enlace clicable.
          2+ proyectos → solo nombres en texto, sin destacar ninguno.
        */}
        {PROJECTS.length === 1 ? (
          <span>
            <a href={PROJECTS[0].url} className={baseStyles.footerLink}>
              {PROJECTS[0].name}
            </a>
          </span>
        ) : PROJECTS.length > 1 ? (
          <span>{PROJECTS.map((p) => p.name).join(" · ")}</span>
        ) : null}
        <span>Built with React</span>
      </footer>
    </>
  );
}