"use clien"

import type React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import RegisterForm from "../../components/Register/RegisterForm"
import styles from "./RegisterContainer.module.css"

const RegisterContainer: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerFont}>
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterContainer