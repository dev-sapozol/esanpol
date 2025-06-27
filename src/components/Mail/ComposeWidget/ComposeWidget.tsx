"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { ComposeEmailData } from "../../features/mail/types"
import styles from "./ComposeWidget.module.css"

interface ComposeWidgetProps {
  isExpanded: boolean
  onToggle: () => void
  onSend: (emailData: ComposeEmailData) => void
  onClose: () => void
  loading?: boolean
}

const ComposeWidget: React.FC<ComposeWidgetProps> = ({ isExpanded, onToggle, onSend, onClose, loading = false }) => {
  const [emailData, setEmailData] = useState<ComposeEmailData>({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    textBody: "",
    htmlBody: "",
    importance: 1,
    hasAttachment: false,
  })

  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Focus management
  useEffect(() => {
    if (isExpanded && formRef.current) {
      const firstInput = formRef.current.querySelector('input[type="email"]') as HTMLInputElement
      firstInput?.focus()
    }
  }, [isExpanded])

  const handleInputChange = (field: keyof ComposeEmailData, value: string | number | boolean) => {
    setEmailData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSend = () => {
    if (!emailData.to.trim() || !emailData.subject.trim() || !emailData.textBody.trim()) {
      alert("Please fill in required fields: To, Subject, and Message")
      return
    }

    onSend(emailData)
    handleReset()
  }

  const handleReset = () => {
    setEmailData({
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      textBody: "",
      htmlBody: "",
      importance: 1,
      hasAttachment: false,
    })
    setShowCc(false)
    setShowBcc(false)
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isExpanded) {
      handleClose()
    }
  }

  return (
    <div className={`${styles.composeWidget} ${isExpanded ? styles.expanded : ""}`} onKeyDown={handleKeyDown}>
      {!isExpanded ? (
        <button
          ref={triggerRef}
          className={styles.composeTrigger}
          onClick={onToggle}
          aria-label="Compose new email"
          type="button"
        >
        </button>
      ) : (
        <div ref={formRef} className={styles.composeForm} role="dialog" aria-label="Compose email" aria-modal="true">
          {/* Header */}
          <header className={styles.composeHeader}>
            <h2>Nuevo mensaje</h2>
            <div className={styles.headerActions}>
              <button
                className={styles.minimizeBtn}
                onClick={onToggle}
                aria-label="Minimize compose window"
                type="button"
              >
                −
              </button>
              <button className={styles.closeBtn} onClick={handleClose} aria-label="Close compose window" type="button">
                ×
              </button>
            </div>
          </header>

          {/* Form Fields */}
          <div className={styles.composeFields}>
            {/* To Field */}
            <div className={styles.fieldRow}>
              <label htmlFor="compose-to" className={styles.fieldLabel}>
                Para
              </label>
              <input
                id="compose-to"
                type="email"
                value={emailData.to}
                onChange={(e) => handleInputChange("to", e.target.value)}
                placeholder="Destinatarios"
                className={styles.fieldInput}
                required
                aria-required="true"
              />
              <div className={styles.fieldActions}>
                {!showCc && (
                  <button onClick={() => setShowCc(true)} className={styles.fieldToggle} type="button">
                    Cc
                  </button>
                )}
                {!showBcc && (
                  <button onClick={() => setShowBcc(true)} className={styles.fieldToggle} type="button">
                    Cco
                  </button>
                )}
              </div>
            </div>

            {/* CC Field */}
            {showCc && (
              <div className={styles.fieldRow}>
                <label htmlFor="compose-cc" className={styles.fieldLabel}>
                  Cc
                </label>
                <input
                  id="compose-cc"
                  type="email"
                  value={emailData.cc}
                  onChange={(e) => handleInputChange("cc", e.target.value)}
                  placeholder="Copia"
                  className={styles.fieldInput}
                />
                <button
                  onClick={() => setShowCc(false)}
                  className={styles.fieldRemove}
                  aria-label="Remove Cc field"
                  type="button"
                >
                  ×
                </button>
              </div>
            )}

            {/* BCC Field */}
            {showBcc && (
              <div className={styles.fieldRow}>
                <label htmlFor="compose-bcc" className={styles.fieldLabel}>
                  Cco
                </label>
                <input
                  id="compose-bcc"
                  type="email"
                  value={emailData.bcc}
                  onChange={(e) => handleInputChange("bcc", e.target.value)}
                  placeholder="Copia oculta"
                  className={styles.fieldInput}
                />
                <button
                  onClick={() => setShowBcc(false)}
                  className={styles.fieldRemove}
                  aria-label="Remove Bcc field"
                  type="button"
                >
                  ×
                </button>
              </div>
            )}

            {/* Subject Field */}
            <div className={styles.fieldRow}>
              <label htmlFor="compose-subject" className={styles.fieldLabel}>
                Asunto
              </label>
              <input
                id="compose-subject"
                type="text"
                value={emailData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Asunto del mensaje"
                className={styles.fieldInput}
                required
                aria-required="true"
              />
            </div>
          </div>

          {/* Message Body */}
          <div className={styles.composeBody}>
            <label htmlFor="compose-message" className={styles.visuallyHidden}>
              Contenido del mensaje
            </label>
            <textarea
              id="compose-message"
              value={emailData.textBody}
              onChange={(e) => handleInputChange("textBody", e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className={styles.messageTextarea}
              required
              aria-required="true"
            />
          </div>

          {/* Footer */}
          <footer className={styles.composeFooter}>
            <div className={styles.footerActions}>
              <button className={styles.sendBtn} onClick={handleSend} disabled={loading} type="button">
                {loading ? "Enviando..." : "Enviar"}
              </button>
              <select
                value={emailData.importance}
                onChange={(e) => handleInputChange("importance", Number.parseInt(e.target.value))}
                className={styles.importanceSelect}
                aria-label="Importancia del email"
              >
                <option value={1}>Normal</option>
                <option value={2}>Alta</option>
                <option value={0}>Baja</option>
              </select>
            </div>
          </footer>
        </div>
      )}
    </div>
  )
}

export default ComposeWidget
