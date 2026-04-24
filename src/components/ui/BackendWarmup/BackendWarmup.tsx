"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import styles from "./BackendWarmup.module.css";

const SLIDES = [
  {
    icon: "✉️",
    title: "Institutional Email",
    description:
      "Esanpol gives you an @esanpol.xyz email so all project communication stays centralized and professional.",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    description:
      "Your account is yours alone. Passwords are stored encrypted, and access requires a special administrator code.",
  },
  {
    icon: "🌎",
    title: "Available Worldwide",
    description:
      "You can access it from any country. Esanpol automatically detects your time zone to show everything in your local time. This feature is still under development.",
  },
  {
    icon: "📬",
    title: "Receive and Send Emails",
    description:
      "Connect your recovery email (Gmail, Outlook...) to receive and send messages from your Esanpol account.",
  },
];

export const BackendWarmup = ({ visible }: { visible: boolean }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!visible) {
      setCurrent(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.card}>
            {/* Slide with AnimatePresence */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                className={styles.slide}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                <span className={styles.icon}>{SLIDES[current].icon}</span>
                <p className={styles.slideTitle}>{SLIDES[current].title}</p>
                <p className={styles.slideSub}>{SLIDES[current].description}</p>
              </motion.div>
            </AnimatePresence>

            {/* Indicadores de posicion */}
            <div className={styles.dots}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Spinner*/}
            <div className={styles.spinnerRow}>
              <div className={styles.spinner} />
              <span className={styles.spinnerLabel}>Conectando…</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};