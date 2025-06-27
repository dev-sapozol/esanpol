"use client"

import { useEmail } from "../../features/mail/hooks/useEmail"
import type { GetBasicEmailList } from "../../types/graphql";
import styles from "./MailList.module.css";
import { t } from "i18next";

interface MailListProps {
  section: string;// "inbox", "spam", ...
  selectedMailId: string | null;
  onMailSelect: (mail: GetBasicEmailList) => void;
}

const MailList: React.FC<MailListProps> = ({
  section,
  selectedMailId,
  onMailSelect
}) => {
  const { emails, loading } = useEmail(section);

  if (loading) return <p className={styles.loading} >{t("email.noMessages.load")}</p>

  if (!emails.length) {
    return (
      <div className={styles.emptyState} role="status">
        <div className={styles.emptyIcon}>📭</div>
        <p className={styles.emptyText}>{t("email.noMessages.noMsgFolder")}</p>
        <p className={styles.emptySubText}>{t("email.noMessages.noMsgEmail")}</p>
      </div>
    )
  }

  return (
    <div className={styles.mailList} role="list">
      <div className={styles.listHeader}></div>
      {emails.map((mail) => (
        <div
          key={mail.id}
          role="listitem"
          className={
            mail.id === selectedMailId ? styles.itemSelected : styles.item
          }
          onClick={() => onMailSelect(mail)}
        >
          <div className={styles.mailMeta}>
            <input 
              type="checkbox"
              onClick={(e) => e.stopPropagation()}
            ></input>
            <span className={styles.nameSender}>Sebastian Pozo</span>
            <div className={styles.mailPreview}>
              <span className={styles.subject}>{mail.subject}</span>
              <span>-</span>
              <span className={styles.preview}>{mail.preview}</span>
            </div>
          </div>
          {mail.hasAttachment && <span className={styles.attachment}>📎</span>}
        </div>
      ))}
      <div className={styles.listFooter}>
        <div className={styles.sidebarFooter}>
          <div className={styles.footerInfo}>
            <span className={styles.footerText}>Storage</span>
            <div className={styles.storageBar}>
              <div className={styles.storageProgress} style={{ width: "75%" }} />
            </div>
            <span className={styles.storageText}>11.2 GB of 15 GB used</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MailList