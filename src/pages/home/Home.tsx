"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { technologies } from "./data";
import { useNavigate } from "react-router-dom";
import baseStyles from "./Home.module.css";

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
  const navigate = useNavigate();
  const esanpol = `/auth/`;

  // Scroll → blur nav
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
      {/* NAV — lives here because it needs scroll + active state */}
      <nav className={scrolled ? `${baseStyles.nav} ${baseStyles.scrolled}` : baseStyles.nav}>
        <div className={baseStyles.navLogo}>SP.</div>

        <div className={menuOpen ? `${baseStyles.navLinks} ${baseStyles.open}` : baseStyles.navLinks}>
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
          <button
            className={baseStyles.navCta}
            onClick={() => {
              setMenuOpen(false);
              navigate(esanpol);
            }}
          >

            Esanpol →
          </button>
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

      {/* SECTIONS — each owns its styles */}
      <Suspense fallback={null}>
        <Hero />
        <Marquee items={allTech} />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </Suspense>

      {/* FOOTER */}
      <footer className={baseStyles.footer}>
        <span>© 2025 Sebastian Pozo Lucano</span>
        <span>Lima, Perú</span>
        <span>Built with React</span>
      </footer>
    </>
  );
}