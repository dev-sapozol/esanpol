"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useBackendWarmup } from "../hooks/useBackendWarmup";
import { BackendWarmup } from "../../../components/ui/BackendWarmup/BackendWarmup";
import styles from "./Login.module.css";
import logo from "../../../assets/images/LogoSPL.webp";

type LoginProps = {
  verifyEmailEndpoint: string;
  loginEndpoint: string;
  labels: {
    emailPlaceholder: string;
    passwordPlaceholder: string;
    emailButton: string;
    passwordButton: string;
    invalidEmail: string;
    back: string;
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
  const { warmingUp, start, stop } = useBackendWarmup(4000);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    start();

    try {
      const res = await fetch(verifyEmailEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    stop();
    setLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(loginEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data?.token) {
        sessionStorage.setItem("access_token", data.token);
        window.location.href = "/mail";
      } else {
        onError(data?.message);
      }
    } catch (err: any) {
      onError(err.message);
    }

    setLoading(false);
  };

  const slide = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.25 },
  };

  return (
    <div className={styles.login}>
      <BackendWarmup visible={warmingUp} />
      <AnimatePresence mode="wait">

        {step === "email" && (
          <motion.form
            key="email"
            id="email"
            {...slide}
            onSubmit={handleEmailSubmit}
            className={styles.form}
          >
            <div className={styles.logoRow}>
              <img className={styles.logo} src={logo} alt="Logo SPL" />
              <h2>Esanpol</h2>
            </div>

            <div className={styles.emailRow}>
              <h3>Sign in</h3>
              <p>Use your email from Esanpol</p>
            </div>

            <div className={styles.field}>
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>{labels.emailPlaceholder}</label>
            </div>

            <div className={styles.redirectLinks}>
              <span>Don't have an account? <a href="/auth/register">Create one</a></span>
              <span>Forgot your password? <a href="/auth/change-password">Reset it</a></span>
            </div>

            <button disabled={loading}>
              {labels.emailButton}
            </button>

          </motion.form>
        )}

        {step === "password" && (
          <motion.form
            key="password"
            {...slide}
            onSubmit={handlePasswordSubmit}
            className={styles.form}
          >

            <div className={styles.backArrow} onClick={() => setStep("email")}>
              ←
            </div>

            <div className={styles.logoRow}>
              <img className={styles.logo} src={logo} alt="Logo SPL" />
              <h2>Esanpol</h2>
            </div>

            <div className={styles.emailRow}>
              <div className={styles.email}>
                <span>{email}</span>
              </div>
              <p>Enter password</p>
            </div>

            <div className={styles.field}>
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>{labels.passwordPlaceholder}</label>
            </div>

            <div className={styles.redirectLinks}>
              <span>Don't have an account? <a href="/auth/register">Create one</a></span>
              <span>Forgot your password? <a href="/auth/change-password">Reset it</a></span>
            </div>

            <button disabled={loading}>
              {labels.passwordButton}
            </button>

          </motion.form>
        )}

      </AnimatePresence>

    </div>
  );
};

export default Login;