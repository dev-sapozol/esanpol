"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Recovery.module.css"
import logo from "../../../assets/LogoSPL.png"

type RecoveryProps = {
  verifyEmailEndpoint: string
  changePasswordEndpoint: string
  labels: {
    emailPlaceholder: string
    passwordPlaceholder: string
    emailButton: string
    invalidEmail: string
  }
  onError: (message: string) => void
}

const Recovery: React.FC<RecoveryProps> = ({
  verifyEmailEndpoint,
  changePasswordEndpoint,
  labels,
  onError,
}) => {
  const navigate = useNavigate()
  const [step, setStep] = useState<"email" | "password">("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(verifyEmailEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (data?.exists) {
        setStep("password")
      } else {
        onError(labels.invalidEmail)
      }
    } catch (err: any) {
      onError(err.message)
    }

    setLoading(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 8) {
      onError("Password must be at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      onError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(changePasswordEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data?.success) {
        navigate("/auth/login")
      } else {
        onError(data?.message)
      }
    } catch (err: any) {
      onError(err.message)
    }

    setLoading(false)
  }

  const slide = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.25 },
  }

  return (
    <div className={styles.recovery}>
      <AnimatePresence mode="wait">

        {step === "email" && (
          <motion.form
            key="email"
            {...slide}
            onSubmit={handleEmailSubmit}
            className={styles.form}
          >
            <div className={styles.logoRow}>
              <img className={styles.logo} src={logo} alt="Logo SPL" />
              <h2>Esanpol</h2>
            </div>

            <div className={styles.emailRow}>
              <h3>Reset password</h3>
              <p>Enter your Esanpol email</p>
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
              <span>Remember your password? <a href="/auth/login">Sign in</a></span>
              <span>Don't have an account? <a href="/auth/register">Create one</a></span>
            </div>

            <button disabled={loading}>{labels.emailButton}</button>
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
              <p>Create a new password</p>
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

            <div className={styles.field}>
              <input
                type="password"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label>Confirm password</label>
            </div>

            <button disabled={loading}>Update password</button>
          </motion.form>
        )}

      </AnimatePresence>
    </div>
  )
}

export default Recovery