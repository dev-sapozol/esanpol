import React, { useEffect, useState } from "react"
import styles from "./ToastNotification.module.css"
import type { Mail } from "../../../features/mail/types"

interface ToastNotificationProps {
  email?: Mail
  customMessage?: string
  onClose: () => void
  duration?: number
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  email,
  customMessage,
  onClose,
  duration = 7000,
}) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {

    try {
      const ctx = new AudioContext()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g)
      g.connect(ctx.destination)
      o.frequency.setValueAtTime(880, ctx.currentTime)
      o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15)
      g.gain.setValueAtTime(0.3, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      o.start(ctx.currentTime)
      o.stop(ctx.currentTime + 0.3)
    } catch (_) { }

    const fadeTimer = setTimeout(() => setVisible(false), duration - 400)
    const closeTimer = setTimeout(onClose, duration)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(closeTimer)
    }
  }, [duration, onClose])

  if (customMessage) {
    return (
      <div className={`${styles.toast} ${styles.toastWarning} ${!visible ? styles.fadeOut : ""}`}>
        <div className={styles.toastContent}>
          <div className={styles.toastIcon}>⚠️</div>
          <div className={styles.toastBody}>
            <span className={styles.toastSender}>Sending limit reached</span>
            <span className={styles.toastPreview}>{customMessage}</span>
          </div>
        </div>
        <button className={styles.toastClose} onClick={onClose}>✕</button>
      </div>
    )
  }

  return (
    <div className={`${styles.toast} ${!visible ? styles.fadeOut : ""}`}>
      <div className={styles.toastContent}>
        <div className={styles.toastIcon}>✉️</div>
        <div className={styles.toastBody}>
          <span className={styles.toastSender}>
            {email?.senderName ?? email?.senderEmail ?? "System"}
          </span>
          <span className={styles.toastSubject}>{email?.subject}</span>
          <span className={styles.toastPreview}>{email?.preview}</span>
        </div>
      </div>
      <button className={styles.toastClose} onClick={onClose}>✕</button>
    </div>
  )
}

export default ToastNotification