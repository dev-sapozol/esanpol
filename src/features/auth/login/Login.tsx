"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import styles from "./Login.module.css";

type LoginProps = {
  verifyEmailEndpoint: string;
  loginEndpoint: string;
  labels: {
    emailPlaceholder: string;
    passwordPlaceholder: string;
    emailButton: string;
    passwordButton: string;
    invalidEmail: string;
  };
  onSuccess: (token: string) => void;
  onError: (message: string) => void;
};

const Login: React.FC<LoginProps> = ({
  verifyEmailEndpoint,
  loginEndpoint,
  labels,
  onSuccess,
  onError
}) => {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // VERIFY EMAIL

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true)

    try {
      const res = await fetch(verifyEmailEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data?.exists) {
        setStep("password");
      } else {
        onError(labels.invalidEmail);
      }
    } catch (err: any) {
      onError(err.message);
    }

    setLoading(false)
  };

  // LOGIN

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data?.token) {
        handleLoginSuccess(data.token);
      } else {
        onError(data?.message);
      }
    } catch (err: any) {
      onError(err.message);
    }

    setLoading(false);
  };

  const handleLoginSuccess = (token: string) => {
    sessionStorage.setItem("access_token", token);
    window.location.href = "/mail";
  };

  // ANIMATIONS

  const slide = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.25 },
  };
  return (
    <div className={styles.loginContainer}>
      <AnimatePresence mode="wait">
        {step === "email" && (
          <motion.form
            key="email-step"
            {...slide}
            onSubmit={handleEmailSubmit}
            className={styles.loginBox}
          >
            <input
              type="email"
              placeholder={labels.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {labels.emailButton}
            </button>
          </motion.form>
        )}

        {step === "password" && (
          <motion.form
            key="password-step"
            {...slide}
            onSubmit={handlePasswordSubmit}
            className={styles.loginBox}
          >
            <input
              type="password"
              placeholder={labels.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {labels.passwordButton}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login