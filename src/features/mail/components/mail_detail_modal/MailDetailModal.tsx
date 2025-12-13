"use client"

import React, { useState, useRef, useEffect } from "react"
import { useGetEmail } from "../../hooks/useGetEmail"
import { useReplyEmail } from "../../hooks/useReplyEmail"
import ComposeModal from "../ComposeModal/ComposeModal" 
import styles from "./MailDetailModal.module.css"
import { ComposeEmailData } from "../../types"

interface MailDetailModalProps {
  mailId: number
  onClose: () => void
  onEmailSent?: () => void
}

const getInitials = (name?: string) => {
  if (!name) return "?"
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
}

const formatDateDetail = (dateString: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleString("es-ES", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  })
}

const MailDetailModal: React.FC<MailDetailModalProps> = ({ mailId, onClose, onEmailSent }) => {
  const { mail, loading, error } = useGetEmail(mailId)
  
  const { replyEmail, loading: mutationLoading } = useReplyEmail()

  const [isReplying, setIsReplying] = useState(false)
  const [replyData, setReplyData] = useState<Partial<ComposeEmailData> | null>(null)
  const [sendingReply, setSendingReply] = useState(false)
  
  const replyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isReplying && replyRef.current) {
      setTimeout(() => {
        replyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [isReplying])

  if (loading) return <div className={styles.loading}>Cargando...</div>
  if (error) return <div className={styles.error}>Error</div>
  if (!mail) return null

  const safeDate = mail.inserted_at || mail.date || ""

  const handleReply = () => {
    const originalDate = formatDateDetail(safeDate)
    const sender = mail.senderName || mail.senderEmail
    const contentBody = (mail as any).htmlBody || mail.body || ""

    const quoteHtml = `
      <br><br>
      <div class="gmail_quote">
        El ${originalDate}, ${sender} escribió:
        <blockquote class="gmail_quote" style="margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex">
          ${contentBody}
        </blockquote>
      </div>
    `

    const subjectPrefix = mail.subject.toLowerCase().startsWith("re:") ? "" : "Re: "
    
    setReplyData({
      to: [mail.senderEmail], 
      subject: `${subjectPrefix}${mail.subject}`,
      htmlBody: quoteHtml
    })
    setIsReplying(true)
  }

  const handleCancelReply = () => {
    setIsReplying(false)
    setReplyData(null)
  }

  const onSendReply = async (data: any) => {
    setSendingReply(true)
    try {
      console.log("Enviando respuesta:", data)
      
      await replyEmail({
        parentId: mail.id,
        subject: data.subject,
        htmlBody: data.htmlBody,
        textBody: data.textBody,
        replyAll: false
      })

      setIsReplying(false)
      setReplyData(null)
    } catch (error) {
      console.error("Error al enviar la respuesta:", error)
    } finally {
      setSendingReply(false)
    }
  }

  const displayHtml = (mail as any).htmlBody || null
  const displayBody = mail.body || ""

  // Clase dinámica: Si responde, el modal crece
  const modalClass = isReplying 
    ? `${styles.modal} ${styles.modalExpanded}` 
    : styles.modal

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        
        {/* Top Bar */}
        <div className={styles.topBar}>
           <div className={styles.topBarLeft}>
              {/* Aquí podrías poner íconos de archivar/borrar el correo actual */}
           </div>
           <button className={styles.iconBtn} onClick={onClose} title="Cerrar">✕</button>
        </div>

        <div className={styles.scrollContent}>
          
          {/* Asunto con separador visual */}
          <div className={styles.subjectRow}>
            <h1 className={styles.subject}>{mail.subject}</h1>
            <div className={styles.labels}>
              <span className={styles.tagInbox}>Recibidos</span>
            </div>
          </div>

          {/* Info del Remitente con separador */}
          <div className={styles.metaHeader}>
            <div className={styles.avatar}>
              {getInitials(mail.senderName || mail.senderEmail)}
            </div>
            
            <div className={styles.metaInfo}>
              <div className={styles.senderLine}>
                <span className={styles.senderName}>{mail.senderName || "Desconocido"}</span>
                <span className={styles.senderEmail}>&lt;{mail.senderEmail}&gt;</span>
              </div>
              <div className={styles.recipientLine}>para mí</div>
            </div>

            <div className={styles.dateInfo}>
              {formatDateDetail(safeDate)}
            </div>
          </div>

          {/* Contenido */}
          <div className={styles.bodyContainer}>
            {displayHtml ? (
               <div dangerouslySetInnerHTML={{ __html: displayHtml }} />
            ) : (
               <div className={styles.plainText}>{displayBody}</div>
            )}
          </div>

          {/* Área de Acción */}
          <div className={styles.actionButtons}>
            {!isReplying ? (
              <div className={styles.initialActions}>
                <button className={styles.replyBtn} onClick={handleReply}>
                  ↩ Responder
                </button>
                <button className={styles.secondaryBtn}>
                  ➝ Reenviar
                </button>
              </div>
            ) : (
              <div ref={replyRef} className={styles.inlineReplyContainer}>
                 <div className={styles.replyHeaderInfo}>
                    <div className={styles.replyHeaderLeft}>
                        <div className={styles.avatarSmall}>YO</div>
                        <div className={styles.replyArrow}>↩</div>
                        <span className={styles.replyingTo}>
                            Respondiendo a <b>{mail.senderName || mail.senderEmail}</b>
                        </span>
                    </div>
                    {/* Botón explícito para CANCELAR la respuesta */}
                    <button 
                        className={styles.cancelReplyBtn} 
                        onClick={handleCancelReply}
                        title="Descartar respuesta"
                    >
                        ✕
                    </button>
                 </div>

                 <ComposeModal 
                    isOpen={true}
                    onClose={handleCancelReply}
                    onSend={onSendReply}
                    loading={sendingReply}
                    initialData={replyData as any}
                    isInline={true}
                 />
              </div>
            )}
          </div>
          
          <div style={{ height: 20 }}></div>
        </div>
      </div>
    </div>
  )
}

export default MailDetailModal