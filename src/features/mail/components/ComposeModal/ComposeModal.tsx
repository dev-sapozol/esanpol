"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useEditor, EditorContent, type Editor, Extension } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import TextAlign from "@tiptap/extension-text-align"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"

import styles from "./ComposeModal.module.css"
import { MixedList } from "../../../../components/MixedList"

type FontSizeOptions = {
  types: string[]
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType
      unsetFontSize: () => ReturnType
    }
  }
}

const FontSize = Extension.create<FontSizeOptions>({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
          ({ chain }) => {
            return chain().setMark("textStyle", { fontSize }).run()
          },
      unsetFontSize:
        () =>
          ({ chain }) => {
            return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run()
          },
    }
  },
})

export interface ComposeModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (data: any) => void | Promise<void>
  loading: boolean
  initialData?: {
    to?: string[]
    cc?: string[]
    bcc?: string[]
    subject?: string
    htmlBody?: string
    textBody?: string
  }
  isInline?: boolean
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface RecipientFieldProps {
  label: string
  list: string[]
  setList: (list: string[]) => void
  showLabel?: boolean
  onHide?: () => void
  rightActions?: React.ReactNode
  autoFocus?: boolean
}

const RecipientField: React.FC<RecipientFieldProps> = ({
  label,
  list,
  setList,
  showLabel = true,
  onHide,
  rightActions,
  autoFocus,
}) => {
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const addEmail = (val: string) => {
    const trimmed = val.trim()
    if (!trimmed) return

    if (isValidEmail(trimmed)) {
      if (!list.includes(trimmed)) {
        setList([...list, trimmed])
      }
      setInputValue("")
      setError(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault()
      addEmail(inputValue)
    } else if (e.key === "Backspace" && !inputValue && list.length > 0) {
      setList(list.slice(0, -1))
    }
  }

  const handleBlur = () => {
    if (inputValue) addEmail(inputValue)
  }

  const removeChip = (index: number) => {
    setList(list.filter((_, i) => i !== index))
  }

  return (
    <div className={`${styles.fieldRow} ${error ? styles.fieldError : ""}`}>
      {showLabel && (
        <span className={styles.label} onClick={() => onHide && onHide()}>
          {label}
        </span>
      )}

      <div className={styles.fieldBody} onClick={() => inputRef.current?.focus()}>
        {list.map((email, idx) => (
          <span key={idx} className={styles.chip}>
            {email}
            <button tabIndex={-1} onClick={() => removeChip(idx)}>
              ×
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          className={styles.input}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            if (error) setError(false)
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={list.length === 0 && !showLabel ? label : ""}
        />
      </div>

      {rightActions && <div className={styles.rightActions}>{rightActions}</div>}

      {onHide && (
        <button className={styles.closeFieldBtn} onClick={onHide} title={`Ocultar ${label}`}>
          ×
        </button>
      )}
    </div>
  )
}

const EditorToolbar: React.FC<{ editor: Editor | null }> = ({ editor }) => {
  if (!editor) return null

  const toggle = (cmd: () => any) => cmd()
  const isActive = (name: string, opts?: any) => (editor.isActive(name, opts) ? styles.active : "")

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolGroup}>
        <button onClick={() => editor.chain().focus().undo().run()} title="Deshacer">
          ↩
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} title="Rehacer">
          ↪
        </button>
      </div>

      <div className={styles.separator} />

      <div className={styles.toolGroup}>
        <select
          className={styles.select}
          onChange={(e) => {
            const val = e.target.value
            if (val) editor.chain().focus().setFontSize(val).run()
            else editor.chain().focus().unsetFontSize().run()
          }}
          value={editor.getAttributes("textStyle").fontSize || ""}
        >
          <option value="" disabled>
            Tamaño
          </option>
          <option value="12px">Pequeño</option>
          <option value="16px">Normal</option>
          <option value="20px">Grande</option>
          <option value="32px">Enorme</option>
        </select>
      </div>

      <div className={styles.separator} />

      <div className={styles.toolGroup}>
        <button className={isActive("bold")} onClick={() => toggle(() => editor.chain().focus().toggleBold().run())}>
          <b>B</b>
        </button>
        <button
          className={isActive("italic")}
          onClick={() => toggle(() => editor.chain().focus().toggleItalic().run())}
        >
          <i>I</i>
        </button>
        <button
          className={isActive("underline")}
          onClick={() => toggle(() => editor.chain().focus().toggleUnderline().run())}
        >
          <u>U</u>
        </button>

        <div className={styles.colorWrapper}>
          <span
            className={styles.colorIcon}
            style={{
              color: editor.getAttributes("textStyle").color || "#000",
            }}
          >
            A
          </span>
          <input
            type="color"
            className={styles.colorInput}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </div>
      </div>

      <div className={styles.separator} />

      <div className={styles.toolGroup}>
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>≡</button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>⩰</button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>≣</button>
      </div>

      <div className={styles.separator} />

      <div className={styles.toolGroup}>
        <button
          className={isActive("bulletList")}
          onClick={() => toggle(() => editor.chain().focus().toggleBulletList().run())}
          title="Lista puntos"
        >
          •
        </button>
        <button
          className={isActive("orderedList")}
          onClick={() => toggle(() => editor.chain().focus().toggleOrderedList().run())}
          title="Lista numérica"
        >
          1.
        </button>

        <button
          onClick={() => editor.chain().focus().outdentList().run()}
          disabled={!editor.can().liftListItem("listItem")}
          title="Disminuir sangría (Outdent)"
        >
          ⇤
        </button>
        <button
          onClick={() => editor.chain().focus().indentList().run()}
          disabled={!editor.can().sinkListItem("listItem")}
          title="Aumentar sangría (Indent)"
        >
          ⇥
        </button>
      </div>
    </div>
  )
}

export default function ComposeModal({ isOpen, onClose, onSend, loading, initialData, isInline }: ComposeModalProps) {
  const [toList, setToList] = useState<string[]>([])
  const [ccList, setCcList] = useState<string[]>([])
  const [bccList, setBccList] = useState<string[]>([])

  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)

  const [subject, setSubject] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isFull, setIsFull] = useState(false)

  // 1. handler seguro con types
  const handleEditorKey =
    (editor: Editor | null) =>
      (view: any, event: KeyboardEvent): boolean => {
        if (!editor) return false

        if (event.key === "Tab") {
          event.preventDefault()

          if (event.shiftKey) {
            return editor.commands.outdentList()
          }
          return editor.commands.indentList()
        }

        return false
      }

  // 2. Editor sin referencias circulares
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
      }),
      Underline,
      TextStyle,
      FontSize,
      Color,
      Link.configure({ openOnClick: false }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: "" }),
      MixedList,
    ],
    content: "",
  })

  useEffect(() => {
    if (!editor) return

    editor.setOptions({
      editorProps: {
        handleKeyDown: (view, event) => handleEditorKey(editor)(view, event),
      },
    })
  }, [editor])

  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  useEffect(() => {
    if (isOpen && initialData) {
      if (initialData.to) setToList(initialData.to)

      if (initialData.cc && initialData.cc.length > 0) {
        setCcList(initialData.cc)
        setShowCc(true)
      }

      if (initialData.bcc && initialData.bcc.length > 0) {
        setBccList(initialData.bcc)
        setShowBcc(true)
      }

      if (initialData.subject) setSubject(initialData.subject)

      if (initialData.htmlBody && editor) {
        setTimeout(() => {
          editor.commands.setContent(initialData.htmlBody!)
          editor.commands.focus("start")
        }, 50)
      }
    }
  }, [isOpen, initialData, editor])

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)])
      e.target.value = ""
    }
  }

  const handleSend = () => {
    onSend({
      to: toList.join(","),
      cc: ccList.join(","),
      bcc: bccList.join(","),
      subject,
      htmlBody: editor?.getHTML() || "",
      textBody: editor?.getText() || "",
      attachments,
      importance: "normal",
    })
  }

  const Wrapper = isInline ? "div" : "div"
  const wrapperClass = isInline ? styles.inlineWrapper : styles.overlay
  const containerClass = isInline ? styles.inlineContainer : `${styles.modal} ${isFull ? styles.fullscreen : ""}`

return (
    <div
      className={wrapperClass}
      onClick={() => {
        if (!isInline && !isFull) onClose()
      }}
    >
      <div className={containerClass} onClick={(e) => e.stopPropagation()}>
        
        {/* Header: SOLO si NO es inline */}
        {!isInline && (
          <div className={styles.header}>
            <div className={styles.headerTitle}>Nuevo mensaje</div>
            <div className={styles.headerControls}>
              <button onClick={() => setIsFull(!isFull)} title={isFull ? "Salir pantalla completa" : "Pantalla completa"}>
                {isFull ? "❐" : "□"}
              </button>
              <button onClick={onClose} title="Guardar y cerrar" className={styles.closeBtn}>×</button>
            </div>
          </div>
        )}

        {/* Destinatarios */}
        <div className={styles.recipientsArea}>
          <RecipientField
            label="Para" list={toList} setList={setToList} autoFocus={!isInline}
            rightActions={(!showCc || !showBcc) && (
              <div className={styles.ccBccLinks}>
                {!showCc && <span onClick={() => setShowCc(true)}>CC</span>}
                {!showBcc && <span onClick={() => setShowBcc(true)}>CCO</span>}
              </div>
            )}
          />
          {showCc && <RecipientField label="Cc" list={ccList} setList={setCcList} onHide={() => { setShowCc(false); setCcList([]) }} />}
          {showBcc && <RecipientField label="Cco" list={bccList} setList={setBccList} onHide={() => { setShowBcc(false); setBccList([]) }} />}
        </div>

        {/* Asunto: Opcionalmente oculto en modo inline para ahorrar espacio*/}
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

        {/* Toolbar */}
        <EditorToolbar editor={editor} />

        {/* Editor */}
        <div 
           className={`${styles.editorContainer} ${isInline ? styles.inlineEditorHeight : ''}`} 
           onClick={() => editor?.commands.focus()}
        >
          <EditorContent editor={editor} className={styles.tiptapEditor} />
        </div>

        {/* Adjuntos */}
        {attachments.length > 0 && (
          <div className={styles.attachmentsList}>
            {attachments.map((file, i) => (
              <div key={i} className={styles.attachmentChip}>
                <div className={styles.fileIcon}>📄</div>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>{(file.size / 1024).toFixed(0)} KB</span>
                </div>
                <button onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}>×</button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={loading || (!toList.length && !ccList.length && !bccList.length)}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>

            <label className={styles.iconBtn} title="Adjuntar archivos">
              📎
              <input type="file" multiple onChange={handleFileChange} hidden />
            </label>
          </div>

          <div className={styles.footerRight}>
            <button className={styles.iconBtn} onClick={onClose} title="Descartar">🗑</button>
          </div>
        </div>
      </div>
    </div>
  )
}