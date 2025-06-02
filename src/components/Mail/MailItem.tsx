"use client"

import type React from "react"
import type { Mail } from "../features/mail/types"
import styles from "./MailItem.module.css"

interface MailItemProps {
  mail: Mail
  isSelected: boolean
  onClick: () => void
  isLast?: boolean
}

const MailItem: React.FC<MailItemProps> = ({ mail, isSelected, onClick, isLast = false }) => {
  const formattedDate = new Date(mail.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: new Date().getFullYear() !== new Date(mail.date).getFullYear() ? "numeric" : undefined,
  })

  const formattedTime = new Date(mail.date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  const itemClasses = [
    styles.mailItem,
    isSelected ? styles.selected : "",
    !mail.isRead ? styles.unread : "",
    isLast ? styles.last : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      className={itemClasses}
      onClick={onClick}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label={`Email from ${mail.sender}, subject: ${mail.subject}, ${mail.isRead ? "read" : "unread"}`}
    >
      <div className={styles.mailItemContent}>
        {/* Main row with sender, subject, and date */}
        <div className={styles.mainRow}>
          <div className={styles.senderSection}>
            <span className={styles.sender}>{mail.sender}</span>
            {!mail.isRead && <span className={styles.unreadIndicator} aria-label="Unread" />}
          </div>

          <div className={styles.subjectSection}>
            <span className={styles.subject}>{mail.subject}</span>
          </div>

          <div className={styles.dateSection}>
            <span className={styles.date}>{formattedDate}</span>
            <span className={styles.time}>{formattedTime}</span>
          </div>
        </div>

        {/* Preview row */}
        <div className={styles.previewRow}>
          <span className={styles.preview}>{mail.preview}</span>
        </div>
      </div>
    </div>
  )
}

export default MailItem
