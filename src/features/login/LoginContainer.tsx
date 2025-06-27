"use client"

import type React from "react"
import { useLocation , useNavigate } from "react-router-dom"
import LoginForm from "../../components/Login/LoginForm"
import styles from "./LoginContainer.module.css"

const LoginContainer: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginFont}>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginContainer
