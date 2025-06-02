"use client"

import type React from "react"
import type { Mail } from "../../features/mail/types"
import styles from "./MailDetail.module.css"

interface MailDetailProps {
  mail: Mail
  onBack: () => void
}

const MailDetail: React.FC<MailDetailProps> = ({ mail, onBack }) => {
  const formattedDate = new Date(mail.date).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className={styles.mailDetail}>
      {/* Header with back button */}
      <header className={styles.mailDetailHeader}>
        <button className={styles.backButton} onClick={onBack} aria-label="Back to mail list">
          <span className={styles.backIcon}>←</span>
          <span>Back to {mail.section}</span>
        </button>
      </header>

      {/* Mail content with proper spacing */}
      <div className={styles.mailDetailContent}>
        <div className={styles.mailContainer}>
          {/* Mail header */}
          <div className={styles.mailHeader}>
            <h1 className={styles.subject}>{mail.subject}</h1>

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

          {/* Mail body */}
          <div className={styles.mailBody}>
            <div className={styles.bodyContent}>{mail.body || mail.preview}</div>
          </div>

          {/* Action buttons */}
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

export default MailDetail
