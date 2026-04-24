"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useBackendWarmup } from "../hooks/useBackendWarmup"
import { BackendWarmup } from "../../../components/ui/BackendWarmup/BackendWarmup"
import styles from "./Recovery.module.css"
import logo from "../../../assets/images/LogoSPL.webp"

type RecoveryProps = {
  requestPasswordResetEndpoint: string
  verifyResetOtpEndpoint: string
  resetPasswordEndpoint: string
  labels: {
    emailPlaceholder: string
    passwordPlaceholder: string
    emailButton: string
    invalidEmail: string
  }
  onError: (message: string) => void
}

const Recovery: React.FC<RecoveryProps> = ({
  requestPasswordResetEndpoint,
  verifyResetOtpEndpoint,
  resetPasswordEndpoint,
  labels,
  onError,
}) => {
  const navigate = useNavigate()
  const [step, setStep] = useState<"email" | "otp" | "password">("email")
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailPrefix, setEmailPrefix] = useState("")
  const email = emailPrefix.trim() + "@esanpol.xyz"

  // --- Estrategia Recovery ---
  // El backend puede tardar en arrancar, pero en Recovery no podemos "entretener"
  // al usuario con un formulario largo como en Register.
  //
  // Solución: UI optimista.
  // Cuando el usuario envía el email, mostramos INMEDIATAMENTE el step del OTP
  // con un mensaje de "revisa tu correo" sin esperar la respuesta del backend.
  // La petición al backend corre en paralelo en segundo plano (fire and forget).
  // Si falla, mostramos error desde el step de OTP (sin volver al email).
  //
  // El overlay de slides solo aparece si el usuario intenta verificar el OTP
  // antes de que el backend haya respondido, lo cual es muy improbable porque
  // el usuario necesita abrir su correo, buscar el código, y volver.
  const { warmingUp, start, stop } = useBackendWarmup(4000)

  // Referencia para trackear si el email fue enviado realmente
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  // --- Paso 1: Email — transición optimista ---
  // Se va al step de OTP inmediatamente; el fetch corre en segundo plano.
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Transición inmediata — el usuario ve la pantalla de OTP al instante
    setStep("otp")
    setResendCooldown(60)
    setEmailSent(false)

    // El fetch corre en segundo plano sin bloquear la UI
    try {
      await fetch(requestPasswordResetEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setEmailSent(true)
    } catch (err: any) {
      // Si falla el envío, lo indicamos desde la pantalla de OTP
      // (no volvemos al email para no interrumpir el flujo)
      setOtpError("We couldn't send the code. Please try again.")
    }
  }

  // --- Paso 2: Verificar OTP ---
  // Aquí sí necesitamos el backend. Si el usuario llega aquí muy rápido
  // (antes de que el backend arranque), el overlay de slides aparece.
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    start() // Iniciamos el warmup: si tarda >4s aparecen los slides

    try {
      const res = await fetch(verifyResetOtpEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()

      stop() // El backend respondió, ocultamos el overlay
      if (data?.success) {
        setStep("password")
      } else {
        setOtpError(data?.error ?? "Invalid code")
      }
    } catch (err: any) {
      stop()
      onError(err.message)
    }

    setLoading(false)
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setEmailSent(false)
    setOtp("")
    setOtpError(null)
    setResendCooldown(60)

    try {
      await fetch(requestPasswordResetEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setEmailSent(true)
    } catch (err: any) {
      setOtpError("We couldn't resend the code. Please try again.")
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { onError("Password must be at least 8 characters."); return }
    if (password !== confirmPassword) { onError("Passwords do not match."); return }
    setLoading(true)

    try {
      const res = await fetch(resetPasswordEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data?.success) navigate("/auth/login")
      else onError(data?.error ?? "Something went wrong")
    } catch (err: any) { onError(err.message) }

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
      {/* Overlay de slides — solo aparece si el OTP tarda mucho en verificarse */}
      <BackendWarmup visible={warmingUp} />
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
              <div className={styles.emailInput}>
                <input
                  type="text"
                  placeholder=" "
                  value={emailPrefix}
                  onChange={(e) => setEmailPrefix(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ""))}
                  required
                />
                <span className={styles.emailSuffix}>@esanpol.xyz</span>
                <label className={styles.emailLabel}>{labels.emailPlaceholder}</label>
              </div>
            </div>

            <div className={styles.redirectLinks}>
              <span>Remember your password? <a href="/auth/login">Sign in</a></span>
              <span>Don't have an account? <a href="/auth/register">Create one</a></span>
            </div>

            <button disabled={loading}>{labels.emailButton}</button>
          </motion.form>
        )}

        {step === "otp" && (
          <motion.form key="otp" {...slide} onSubmit={handleOtpSubmit} className={styles.form}>
            <div className={styles.backArrow} onClick={() => setStep("email")}>←</div>

            <div className={styles.logoRow}>
              <img className={styles.logo} src={logo} alt="Logo SPL" />
              <h2>Esanpol</h2>
            </div>

            <div className={styles.emailRow}>
              <h3>Check your recovery email</h3>
              {/* Mensaje optimista: aparece inmediatamente aunque el backend aún esté arrancando */}
              <p>
                We sent a 6-digit code to your recovery email.
                {!emailSent && (
                  // Indicador sutil de que el envío aún está en proceso (no un spinner grande)
                  <span className={styles.sendingNote}> Sending…</span>
                )}
              </p>
            </div>

            <div className={styles.field}>
              <input
                type="text"
                placeholder=" "
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6))
                  setOtpError(null)
                }}
                required
              />
              <label>6-digit code</label>
            </div>

            {otpError && (
              <div className={styles.alertError}>
                <span>⚠</span>
                <p>{otpError}</p>
              </div>
            )}

            <div className={styles.redirectLinks}>
              <span>
                Didn't receive the code?{" "}
                <a
                  onClick={resendCooldown > 0 ? undefined : handleResend}
                  style={{
                    cursor: resendCooldown > 0 ? "default" : "pointer",
                    color: resendCooldown > 0 ? "#999" : "#1a73e8",
                  }}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </a>
              </span>
            </div>

            <button disabled={loading || otp.length < 6 || !/^[A-Z0-9]{6}$/.test(otp)}>
              Verify code
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
            <div className={styles.backArrow} onClick={() => setStep("email")}>←</div>

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