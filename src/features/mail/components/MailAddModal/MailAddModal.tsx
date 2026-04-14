"use client"

import React, { useState } from "react"
import styles from "./MailAddModal.module.css"
import { useVerifyEmail } from "../../hooks/useVerifyEmail"
import { useCheckEmailVerification } from "../../hooks/useCheckEmailVerification"

interface MailAddModalProps {
  onClose: () => void
}

type VerificationStatus = "idle" | "pending" | "verified" | "failed" | "unknown"

const MailAddModal: React.FC<MailAddModalProps> = ({ onClose }) => {
  const { verifyEmail } = useVerifyEmail()
  const [email, setEmail] = useState("")
  const { checkEmailVerification } = useCheckEmailVerification()
  const [status, setStatus] = useState<VerificationStatus>("idle")
  const [loadingCheck, setLoadingCheck] = useState(false)

  const onSendVerifyEmail = async () => {
    try {
      const res = await verifyEmail(email)

      if (res?.status === "pending") {
        setStatus("pending")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onCheckStatus = async () => {
    try {
      setLoadingCheck(true)

      const res = await checkEmailVerification(email)

      setStatus(res?.status || "unknown")
      console.log(res)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingCheck(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.cardEmail}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        <div className={styles.content}>
          <h2 className={styles.title}>Add new email</h2>
          <span>
            To send an email, you need to add an email, <br />
            for example: "Esanpol@gmail.com"
          </span>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className={styles.add} onClick={onSendVerifyEmail}>Add</button>
          {status === "pending" && (
            <>
              <button onClick={onCheckStatus} disabled={loadingCheck}>
                {loadingCheck ? "Checking..." : "Confirm"}
              </button>

              <span>Verification pending...</span>
            </>
          )}

          {status === "verified" && (
            <>
              <span style={{ color: "green" }}>
                ✅ Email verified successfully
              </span>
            </>
          )}

          {status === "failed" && (
            <span style={{ color: "red" }}>
              ❌ Verification failed
            </span>
          )}

          {status === "unknown" && (
            <span>
              ⚠️ Unknown status
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default MailAddModal