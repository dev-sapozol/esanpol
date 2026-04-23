"use client"

import React, { useState } from "react"
import styles from "./MailAddModal.module.css"
import { useVerifyEmail } from "../../hooks/useVerifyEmail"
import { useCheckEmailVerification } from "../../hooks/useCheckEmailVerification"
import { useListExternalEmails } from "../../hooks/useListExternalEmails"

interface MailAddModalProps {
  onClose: () => void
}

type VerificationStatus = "idle" | "pending" | "verified" | "failed" | "unknown"

const MAX_EXTERNAL_EMAILS = 2

const MailAddModal: React.FC<MailAddModalProps> = ({ onClose }) => {
  const { verifyEmail } = useVerifyEmail()
  const { checkEmailVerification } = useCheckEmailVerification()
  const { emails, loading: loadingList } = useListExternalEmails()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<VerificationStatus>("idle")
  const [loadingCheck, setLoadingCheck] = useState(false)
  const [loadingAdd, setLoadingAdd] = useState(false)

  const isLimitReached = emails.length >= MAX_EXTERNAL_EMAILS

  const onSendVerifyEmail = async () => {
    if (!email.trim() || isLimitReached) return
    setLoadingAdd(true)
    try {
      const res = await verifyEmail(email)
      if (res?.status === "pending") setStatus("pending")
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingAdd(false)
    }
  }

  const onCheckStatus = async () => {
    setLoadingCheck(true)
    try {
      const res = await checkEmailVerification(email)
      setStatus(res?.status || "unknown")
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingCheck(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.cardEmail} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <div className={styles.content}>
          <h2 className={styles.title}>Add new email</h2>

          {/* Emails registrados */}
          {!loadingList && emails.length > 0 && (
            <div className={styles.existingList}>
              <span className={styles.existingLabel}>Registered addresses</span>
              {emails.map((e) => (
                <div key={e.id} className={styles.existingItem}>
                  <span className={styles.existingEmail}>{e.email}</span>
                </div>
              ))}
            </div>
          )}

          {/* Límite alcanzado */}
          {isLimitReached ? (
            <div className={styles.limitBox}>
              <span className={styles.limitIcon}>🔒</span>
              <p className={styles.limitTitle}>External email limit reached</p>
              <p className={styles.limitDesc}>
                To keep things stable and manageable, each account is limited
                to {MAX_EXTERNAL_EMAILS} external email addresses. This is an
                intentional constraint of this portfolio project.
              </p>
            </div>
          ) : (
            <>
              <span className={styles.hint}>
                Add an external address to send emails from Esanpol,
                for example: <em>yourname@gmail.com</em>
              </span>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loadingAdd}
              />

              <button
                className={styles.add}
                onClick={onSendVerifyEmail}
                disabled={!email.trim() || loadingAdd}
              >
                {loadingAdd ? "Sending..." : "Add"}
              </button>

              {status === "pending" && (
                <>
                  <span className={styles.pendingMsg}>
                    ✉️ Check your inbox and confirm the verification link.
                  </span>
                  <button onClick={onCheckStatus} disabled={loadingCheck}>
                    {loadingCheck ? "Checking..." : "I've confirmed it"}
                  </button>
                </>
              )}

              {status === "verified" && (
                <span className={styles.successMsg}>✅ Email verified successfully</span>
              )}

              {status === "failed" && (
                <span className={styles.errorMsg}>❌ Verification failed</span>
              )}

              {status === "unknown" && (
                <span className={styles.unknownMsg}>⚠️ Unknown status, try again</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MailAddModal