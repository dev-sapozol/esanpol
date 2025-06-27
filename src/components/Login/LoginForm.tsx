"use client"

import React, { useState } from "react"
import styles from "./LoginForm.module.css"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import { loginWithHttpOnlyCookie } from "../../services/authService/LoginWithHttpOnlyCookie"
import { fetchBasicUserData } from "../../services/userService/GetBasicDataUser"
import { useUser } from "../../context/UserContext"


const LoginForm: React.FC = () => {
  const { setUser } = useUser()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [step, setStep] = React.useState<"email" | "password">("email")
  const [loading, setLoading] = useState(false)

  const emailRef = React.useRef<HTMLDivElement>(null)
  const passwordRef = React.useRef<HTMLDivElement>(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      alert(t("login.error.emailRequired"))
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_POST_API_URL}/email-exists?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.exists) {
        setStep("password")
      } else {
        alert(t("login.error.emailNotFound"))
      }
    } catch (error) {
      console.error("Error al verificar email:", error)
      alert(t("login.error.checkingEmail"))
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await loginWithHttpOnlyCookie(email, password, t)

      if (result === "success") {
        const userData = await fetchBasicUserData();
        setUser(userData ?? null)
        console.log("🎯 Datos del usuario almacenados:", userData);
        navigate("/mail/#inbox")
      } else if (result === "invalid-credentials") {
        alert(t("login.error.passwordIncorrect"))
      }

    } catch (error) {
      console.error("Error en login:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginBox}>
      <div className={styles.loginHeader}>
        <img src="/assets/SPLnoBordeSmall.png" alt="Esanpol Logo" />
        <h2>Esanpol</h2>
      </div>

      <h2 className={styles.loginTittle}>{t("auth.login.title")}</h2>

      <SwitchTransition mode="out-in">
        <CSSTransition
          key={step}
          timeout={300}
          classNames={{
            enter: styles.slideEnter,
            enterActive: styles.slideEnterActive,
            exit: styles.slideExit,
            exitActive: styles.slideExitActive,
          }}
          nodeRef={step === "email" ? emailRef : passwordRef}
          unmountOnExit
        >
          {step === "email" ? (
            <div ref={emailRef}>
              <form className={styles.loginForm} onSubmit={handleNext}>
                <input
                  type="email"
                  placeholder={t("auth.login.email")}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <div className={styles.separator}></div>
                <p>
                  {t("auth.login.noAccount.text")}{" "}
                  <Link to="/register" className={styles.Link}>
                    {t("auth.login.noAccount.link")}
                  </Link>
                </p>
                <Link to="/#" className={styles.Link}>
                  {t("auth.login.noAccess")}
                </Link>
                <button type="submit" disabled={loading}>
                  {loading ? "Verificando..." : t("form.fields.submit")}
                </button>
              </form>
            </div>
          ) : (
            <div ref={passwordRef}>
              <form className={styles.loginForm} onSubmit={handleLogin}>
                <input
                  type="password"
                  placeholder={t("auth.login.password")}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <div className={styles.separator}></div>
                <Link to="/#" className={styles.Link}>
                  {t("auth.login.noPassword")}
                </Link>
                <Link to="/#" className={styles.Link}>
                  {t("auth.login.otherMethod")}
                </Link>
                <button type="submit" disabled={loading}>
                  {loading ? "Iniciando sesión..." : t("form.fields.submit2")}
                </button>
              </form>
            </div>
          )}
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

export default LoginForm
