import type React from "react"
import { Outlet } from "react-router-dom"
import styles from "./AuthPage.module.css"

const AuthPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthPage