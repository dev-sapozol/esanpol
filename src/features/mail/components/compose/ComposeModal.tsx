"use client"

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
  type ChangeEvent,
} from "react"
import type { Editor } from "@tiptap/core"

import { RecipientField } from "./RecipientField"
import { AttachmentsList } from "./AttachmentsList"
import { EditorToolbar } from "./EditorToolbar"
import type { ComposeModalProps } from "../../types"
import type { RichEditorHandle } from "./RichEditor"

import styles from "../compose/ComposeModal.module.css"

const RichEditor = lazy(() => import("./RichEditor"))

const normalizeEmails = (value?: string[] | string): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value
  return value.split(",").map((e) => e.trim()).filter(Boolean)
}

export default function ComposeModal({
  isOpen,
  onClose,
  onSend,
  loading,
  initialData,
  isInline,
  disabled,
}: ComposeModalProps) {
  // ── Estado de destinatarios ──
  const [toList, setToList] = useState<string[]>([])
  const [ccList, setCcList] = useState<string[]>([])
  const [bccList, setBccList] = useState<string[]>([])
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)

  // ── Estado general ──
  const [subject, setSubject] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isFull, setIsFull] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [hasShownToast, setHasShownToast] = useState(false)

  // ── Refs al editor ──
  const editorRef = useRef<RichEditorHandle>(null)
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null)

  // ── Toast inicial ──
  useEffect(() => {
    if (isOpen && !hasShownToast) {
      setToast('Añade al menos un destinatario con el campo "To".')
      setHasShownToast(true)
      const id = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(id)
    }
  }, [isOpen, hasShownToast])

  useEffect(() => {
    if (!activeEditor || !initialData?.htmlBody) return
    activeEditor.commands.setContent(initialData.htmlBody)
  }, [activeEditor, initialData])

  useEffect(() => {
    if (!isOpen || !initialData) return

    setToList(normalizeEmails(initialData.to))

    const cc = normalizeEmails(initialData.cc)
    if (cc.length) { setCcList(cc); setShowCc(true) }

    const bcc = normalizeEmails(initialData.bcc)
    if (bcc.length) { setBccList(bcc); setShowBcc(true) }

    if (initialData.subject) setSubject(initialData.subject)
  }, [isOpen, initialData])

  // ── Handlers ──

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setAttachments((prev) => [...prev, ...Array.from(e.target.files!)])
    e.target.value = ""
  }, [])

  const handleRemoveAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleHideCc = useCallback(() => {
    setShowCc(false)
    setCcList([])
  }, [])

  const handleHideBcc = useCallback(() => {
    setShowBcc(false)
    setBccList([])
  }, [])

  const handleSend = useCallback(() => {
    onSend({
      to: toList.join(","),
      cc: ccList.join(","),
      bcc: bccList.join(","),
      subject,
      htmlBody: editorRef.current?.getHTML() ?? "",
      importance: "normal",
    })
  }, [toList, ccList, bccList, subject, onSend])

    const handleEditorDestroy = useCallback(() => setActiveEditor(null), [])

  if (!isOpen) return null

  const canSend = toList.length > 0 || ccList.length > 0 || bccList.length > 0

  const wrapperClass = isInline ? styles.inlineWrapper : styles.overlay
  const containerClass = isInline
    ? styles.inlineContainer
    : `${styles.modal} ${isFull ? styles.fullscreen : ""}`


  return (
    <>
      <div
        className={wrapperClass}
        onClick={() => { if (!isInline && !isFull) onClose() }}
      >
        <div className={containerClass} onClick={(e) => e.stopPropagation()}>

          {/* Header — solo en modo modal */}
          {!isInline && (
            <div className={styles.header}>
              <div className={styles.headerTitle}>Nuevo mensaje</div>
              <div className={styles.headerControls}>
                <button
                  onClick={() => setIsFull((f) => !f)}
                  title={isFull ? "Salir de pantalla completa" : "Pantalla completa"}
                >
                  {isFull ? "❐" : "□"}
                </button>
                <button onClick={onClose} title="Cerrar" className={styles.closeBtn}>
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Destinatarios */}
          <div className={styles.recipientsArea}>
            <RecipientField
              label="To"
              list={toList}
              setList={setToList}
              autoFocus={!isInline}
              rightActions={
                (!showCc || !showBcc) && (
                  <div className={styles.ccBccLinks}>
                    {!showCc && <span onClick={() => setShowCc(true)}>CC</span>}
                    {!showBcc && <span onClick={() => setShowBcc(true)}>CCO</span>}
                  </div>
                )
              }
            />
            {showCc && (
              <RecipientField
                label="Cc"
                list={ccList}
                setList={setCcList}
                onHide={handleHideCc}
              />
            )}
            {showBcc && (
              <RecipientField
                label="Cco"
                list={bccList}
                setList={setBccList}
                onHide={handleHideBcc}
              />
            )}
          </div>

          {/* Asunto — solo en modo modal */}
          {!isInline && (
            <div className={styles.subjectRow}>
              <input
                className={styles.subjectInput}
                placeholder="Asunto"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          )}

          {/* Toolbar — recibe la instancia viva del editor */}
          <EditorToolbar editor={activeEditor} />

          {/* Editor — lazy loaded. Suspense muestra un placeholder ligero */}
          <Suspense fallback={<div className={styles.editorPlaceholder} />}>
            <RichEditor
              ref={editorRef}
              isInline={isInline}
              onEditorReady={setActiveEditor}
              onEditorDestroy={handleEditorDestroy}
            />
          </Suspense>

          {/* Adjuntos */}
          <AttachmentsList
            attachments={attachments}
            onRemove={handleRemoveAttachment}
          />

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.footerLeft}>
              <button
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={loading || !canSend || disabled}
              >
                {loading ? "Enviando…" : "Enviar"}
              </button>

              <label className={styles.iconBtn} title="Adjuntar archivos">
                📎
                <input type="file" multiple onChange={handleFileChange} hidden />
              </label>
            </div>

            <div className={styles.footerRight}>
              <button className={styles.iconBtn} onClick={onClose} title="Descartar">
                🗑
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  )
}