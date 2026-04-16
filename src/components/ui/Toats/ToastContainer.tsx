import React from "react"
import styles from "./ToastContainer.module.css"
import ToastNotification from "./ToastNotification"
import type { Mail } from "../../../features/mail/types"

type ToastItem =
  | { id: number; email: Mail }
  | { id: number; customMessage: string }

interface ToastContainerProps {
  toasts: ToastItem[]
  onRemove: (id: number) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className={styles.container}>
      {toasts.map((t) => (
        <ToastNotification
          key={t.id}
          email={"email" in t ? t.email : undefined}
          customMessage={"customMessage" in t ? t.customMessage : undefined}
          onClose={() => onRemove(t.id)}
        />
      ))}
    </div>
  )
}

export default ToastContainer