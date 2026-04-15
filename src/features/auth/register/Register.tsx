"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { getData, getCode } from "country-list"
import CustomSelect from "../../../components/CustomSelect/CustomSelect"
import styles from "./Register.module.css"
import logo from "../../../assets/LogoSPL.png";

type RegisterProps = {
  verifyEmailEndpoint: string
  registerEndpoint: string
  labels: {
    emailPlaceholder: string
    passwordPlaceholder: string
    namePlaceholder: string
    fathernamePlaceholder: string
    mothernamePlaceholder: string
    countryPlaceholder: string
    birthdatePlaceholder: string
    cellphonePlaceholder: string
    agePlaceholder: string
    genderPlaceholder: string
    passwordButton: string
    emailButton: string
    registerButton: string
    validEmail: string
    back: string
  }
  onSuccess: (token: string) => void
  onError: (message: string) => void
}

const Register: React.FC<RegisterProps> = ({
  verifyEmailEndpoint,
  registerEndpoint,
  labels,
  onSuccess,
  onError,
}) => {
  const [step, setStep] = useState<"email" | "password" | "register">("email")
  const [emailPrefix, setEmailPrefix] = useState("")
  const [emailError, setEmailError] = useState<"exists" | "invalid" | null>(null)
  const email = emailPrefix.trim() + "@esanpol.xyz"
  const [password, setPassword] = useState("")
  const [registerData, setRegisterData] = useState({
    name: "",
    fathername: "",
    mothername: "",
    country: "",
    birthdate: "",
    cellphone: "",
    gender: ""
  })
  const [loading, setLoading] = useState(false)
  const countries = getData()
  const [country, setCountry] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = /^[a-zA-Z0-9._-]+$/.test(emailPrefix.trim())
    if (!isValid) {
      setEmailError("invalid")
      return
    }

    setLoading(true)
    setEmailError(null)

    try {
      const res = await fetch(verifyEmailEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (data?.exists) {
        setEmailError("exists")
      } else {
        setStep("register")
      }
    } catch (err: any) {
      onError(err.message)
    }

    setLoading(false)
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep("password")
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 8) {
      onError("Password must be at least 8 characters.")
      setLoading(false)
      return
    }

    setLoading(true)

    const birth = new Date(registerData.birthdate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--

    const spanishCountries = [
      "Argentina", "Bolivia", "Chile", "Colombia", "Costa Rica", "Cuba",
      "Dominican Republic", "Ecuador", "El Salvador", "Guatemala", "Honduras",
      "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru", "Puerto Rico",
      "Spain", "Uruguay", "Venezuela"
    ]
    const language = spanishCountries.includes(registerData.country) ? "es" : "en"

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    try {
      const res = await fetch(registerEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, ...registerData, age, lenguage: language, timezone }),
      })

      const data = await res.json()

      if (data?.token) {
        sessionStorage.setItem("access_token", data.token)
        window.location.href = "/mail"
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
    <div className={styles.login}>
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
              <h3>Create account</h3>
              <p>Use your email from Esanpol</p>
            </div>

            <div className={styles.field}>
              <div className={styles.emailInput}>
                <input
                  type="text"
                  placeholder=" "
                  value={emailPrefix}
                  onChange={(e) => {
                    setEmailPrefix(e.target.value)
                    setEmailError(null)
                  }}
                  required
                />
                <span className={styles.emailSuffix}>@esanpol.xyz</span>
                <label className={styles.emailLabel}>{labels.emailPlaceholder}</label>
              </div>

              {emailError === "exists" && (
                <div className={styles.alertError}>
                  <span>⚠</span>
                  <div>
                    <strong>This email is already in use</strong>
                    <p>{email} is already registered. Try signing in instead.</p>
                  </div>
                </div>
              )}

              {emailError === "invalid" && (
                <div className={styles.alertError}>
                  <span>⚠</span>
                  <p>Only letters, numbers, dots, and hyphens are allowed.</p>
                </div>
              )}
            </div>

            <div className={styles.redirectLinks}>
              <span>Already have an account? <a href="/auth/login">Sign in</a></span>
            </div>

            <button disabled={loading}>{labels.emailButton}</button>
          </motion.form>
        )}

        {step === "register" && (
          <motion.form
            key="register"
            {...slide}
            onSubmit={handleRegisterSubmit}
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
              <p>Complete your profile</p>
            </div>

            <div className={styles.field}>
              <input
                type="text"
                placeholder=" "
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                required
              />
              <label>{labels.namePlaceholder}</label>
            </div>

            <div className={styles.field}>
              <input
                type="text"
                placeholder=" "
                value={registerData.fathername}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    fathername: e.target.value,
                  })
                }
                required
              />
              <label>{labels.fathernamePlaceholder}</label>
            </div>

            <div className={styles.field}>
              <input
                type="text"
                placeholder=" "
                value={registerData.mothername}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    mothername: e.target.value,
                  })
                }
              />
              <label>{labels.mothernamePlaceholder}</label>
            </div>

            <CustomSelect
              value={registerData.country}
              onChange={(val) => setRegisterData({ ...registerData, country: val })}
              options={countries.map((c) => ({ value: c.name, label: c.name }))}
              label={labels.countryPlaceholder}
              required
            />

            <div className={styles.field}>
              <input
                type="text"
                placeholder=" "
                value={registerData.birthdate}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text"
                }}
                onChange={(e) =>
                  setRegisterData({ ...registerData, birthdate: e.target.value })
                }
                className={registerData.birthdate ? styles.hasValue : ""}
                required
              />
              <label>{labels.birthdatePlaceholder}</label>
            </div>

            <div className={styles.field}>
              <input
                type="tel"
                placeholder=" "
                value={registerData.cellphone}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    cellphone: e.target.value,
                  })
                }
                required
              />
              <label>{labels.cellphonePlaceholder}</label>
            </div>

            <CustomSelect
              value={registerData.gender}
              onChange={(val) => setRegisterData({ ...registerData, gender: val })}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              label={labels.genderPlaceholder}
              required
            />

            <button disabled={loading}>{labels.registerButton}</button>
          </motion.form>
        )}

        {step === "password" && (
          <motion.form
            key="password"
            {...slide}
            onSubmit={handlePasswordSubmit}
            className={styles.form}
          >
            <div className={styles.backArrow} onClick={() => setStep("register")}>
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
              <p>Create your password</p>
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

            <button disabled={loading}>{labels.passwordButton}</button>
          </motion.form>
        )}

      </AnimatePresence>
    </div>
  )
}

export default Register
