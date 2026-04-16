"use client"

import type { Editor } from "@tiptap/core"
import styles from "../compose/ComposeModal.module.css"

interface EditorToolbarProps {
  editor: Editor | null
}

const FONT_SIZE_OPTIONS = [
  { value: "12px", label: "Pequeño" },
  { value: "16px", label: "Normal" },
  { value: "20px", label: "Grande" },
  { value: "32px", label: "Enorme" },
] as const

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  const isActive = (name: string, opts?: Record<string, unknown>) =>
    editor.isActive(name, opts) ? styles.active : ""

  const currentFontSize = editor.getAttributes("textStyle").fontSize as string | undefined
  const currentColor = editor.getAttributes("textStyle").color as string | undefined

  return (
    <div className={styles.toolbar}>
      {/* Undo / Redo */}
      <div className={styles.toolGroup}>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Deshacer"
        >
          ↩
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rehacer"
        >
          ↪
        </button>
      </div>

      <div className={styles.separator} />

      {/* Font size */}
      <div className={styles.toolGroup}>
        <select
          className={styles.select}
          value={currentFontSize ?? ""}
          onChange={(e) => {
            const val = e.target.value
            val
              ? editor.chain().focus().setFontSize(val).run()
              : editor.chain().focus().unsetFontSize().run()
          }}
        >
          <option value="" disabled>
            size
          </option>
          {FONT_SIZE_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.separator} />

      {/* Bold / Italic / Underline / Color */}
      <div className={styles.toolGroup}>
        <button
          className={isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Negrita"
        >
          <b>B</b>
        </button>
        <button
          className={isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Cursiva"
        >
          <i>I</i>
        </button>
        <button
          className={isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Subrayado"
        >
          <u>U</u>
        </button>

        <div className={styles.colorWrapper}>
          <span className={styles.colorIcon} style={{ color: currentColor ?? "#000" }}>
            A
          </span>
          <input
            type="color"
            className={styles.colorInput}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            title="Color de texto"
          />
        </div>
      </div>

      <div className={styles.separator} />

      {/* Alignment */}
      <div className={styles.toolGroup}>
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Izquierda">
          ≡
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Centro">
          ⩰
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Derecha">
          ≣
        </button>
      </div>

      <div className={styles.separator} />

      {/* Lists */}
      <div className={styles.toolGroup}>
        <button
          className={isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Lista de puntos"
        >
          •
        </button>
        <button
          className={isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Lista numerada"
        >
          1.
        </button>
        <button
          onClick={() => editor.chain().focus().outdentList().run()}
          disabled={!editor.can().liftListItem("listItem")}
          title="Disminuir sangría"
        >
          ⇤
        </button>
        <button
          onClick={() => editor.chain().focus().indentList().run()}
          disabled={!editor.can().sinkListItem("listItem")}
          title="Aumentar sangría"
        >
          ⇥
        </button>
      </div>
    </div>
  )
}