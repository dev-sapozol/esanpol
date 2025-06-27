"use client"

import type React from "react"
import { useEffect } from "react"
import styles from "./MailDetailModal.module.css"
import type { Email } from "../../features/mail/MailContainer"

interface MailDetailModalProps {
  mail: Email
  onClose: () => void
}

const MailDetailModal: React.FC<MailDetailModalProps> = ({ mail, onClose }) => {

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mail-subject"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close mail detail">
            ×
          </button>
        </header>

        {/* Mail Content */}
        <div className={styles.mailContent}>
          <div className={styles.mailHeader}>
            <h1 id="mail-subject" className={styles.subject}>
              {mail.subject}
            </h1>

            <div className={styles.mailMeta}>
              <div className={styles.senderInfo}>
              </div>
            </div>
          </div>

          <div className={styles.mailBody}>
            <div className={styles.bodyContent}>{mail.preview}</div>
          </div>

          <div className={styles.mailActions}>
            <button className={styles.actionButton} type="button">
              Reply
            </button>
            <button className={styles.actionButton} type="button">
              Forward
            </button>
            <button className={styles.actionButton} type="button">
              Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MailDetailModal
