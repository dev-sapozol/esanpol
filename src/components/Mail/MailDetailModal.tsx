"use client"

import type React from "react"
import { useEffect } from "react"
import type { Mail } from "../../features/mail/types"
import styles from "./MailDetailModal.module.css"

interface MailDetailModalProps {
  mail: Mail
  onClose: () => void
}

const MailDetailModal: React.FC<MailDetailModalProps> = ({ mail, onClose }) => {
  const formattedDate = new Date(mail.date).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

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
                <div className={styles.senderAvatar}>{mail.sender.charAt(0).toUpperCase()}</div>
                <div className={styles.senderDetails}>
                  <div className={styles.senderName}>{mail.sender}</div>
                  <div className={styles.senderEmail}>&lt;{mail.sender}&gt;</div>
                </div>
              </div>
              <div className={styles.dateInfo}>
                <div className={styles.date}>{formattedDate}</div>
                {!mail.isRead && <span className={styles.unreadBadge}>Unread</span>}
              </div>
            </div>
          </div>

          <div className={styles.mailBody}>
            <div className={styles.bodyContent}>{mail.body || mail.preview}</div>
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
