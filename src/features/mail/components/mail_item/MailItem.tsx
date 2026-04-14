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

  const rawDate = mail.date ?? mail.inserted_at ?? null

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
          <div className={styles.sender}>
            {mail.senderName ?? mail.senderEmail}
          </div>

          <div className={styles.date}>
            {formattedDate}
          </div>
        </div>

        <div className={styles.subjectRow}>
          <span className={styles.subject}>{mail.subject}</span>
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
