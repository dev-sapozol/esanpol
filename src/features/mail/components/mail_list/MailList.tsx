"use client"

import type React from "react"
import MailItem from "../mail_item/MailItem"
import type { Mail } from "../../types"
import styles from "./MailList.module.css"

interface MailListProps {
  mails: Mail[]
  selectedMailId: number | null
  onMailSelect: (mail: Mail) => void
}

const MailList: React.FC<MailListProps> = ({ mails, selectedMailId, onMailSelect }) => {
  return (
    <div className={styles.mailList} role="list" aria-label="Email messages">
      {mails.length === 0 ? (
        <div className={styles.emptyState} role="status">
          <div className={styles.emptyIcon}>📭</div>
          <p className={styles.emptyText}>No messages in this folder</p>
          <p className={styles.emptySubtext}>When you receive emails, they'll appear here.</p>
        </div>
      ) : (
        <div className={styles.mailItems}>
          {mails.map((mail, index) => (
            <MailItem
              key={mail.id}
              mail={mail}
              isSelected={mail.id === selectedMailId}
              onClick={() => onMailSelect(mail)}
              isLast={index === mails.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MailList
