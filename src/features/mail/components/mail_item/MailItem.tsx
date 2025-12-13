"use client"

import type React from "react"
import type { Mail } from "../../types"
import styles from "./MailItem.module.css"

interface MailItemProps {
  mail: Mail
  isSelected: boolean
  onClick: () => void
  isLast?: boolean
}

const MailItem: React.FC<MailItemProps> = ({ mail, isSelected, onClick, isLast = false }) => {

  // Tomamos mail.date o mail.inserted_at
  const rawDate = mail.date ?? mail.inserted_at ?? null

  // Creamos el objeto Date de forma segura
  const dateObj = rawDate
    ? new Date(rawDate.replace(" ", "T"))
    : new Date()

  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      new Date().getFullYear() !== dateObj.getFullYear()
        ? "numeric"
        : undefined,
  })

  const formattedTime = dateObj.toLocaleTimeString("en-US", {
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
      aria-label={`Email from ${mail.senderName}, subject: ${mail.subject}, ${mail.isRead ? "read" : "unread"}`}
    >
      <div className={styles.mailItemContent}>
        {/* Main row */}
        <div className={styles.mainRow}>
          <div className={styles.senderSection}>
            <span className={styles.sender}>
              {mail.senderName ?? mail.senderEmail} {/* si no hay nombre, usar email */}
            </span>
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
