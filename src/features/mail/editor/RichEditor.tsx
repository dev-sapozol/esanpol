import { useEffect, useCallback, forwardRef, useImperativeHandle } from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import { buildExtensions } from "./../../../../tiptap.config"
import styles from "../components/ComposeModal/ComposeModal.module.css"

export interface RichEditorHandle {
  getHTML: () => string
  getText: () => string
  setContent: (html: string) => void
  focus: () => void
}

export interface RichEditorProps {
  initialContent?: string
  placeholder?: string
  isInline?: boolean
  onEditorReady?: (editor: Editor) => void
  onEditorDestroy?: () => void
}

const RichEditor = forwardRef<RichEditorHandle, RichEditorProps>(
  ({ initialContent = "", placeholder = "", isInline, onEditorReady, onEditorDestroy }, ref) => {

    const handleKeyDown = useCallback(
      (editor: Editor) =>
        (_view: unknown, event: KeyboardEvent): boolean => {
          if (event.key !== "Tab") return false
          event.preventDefault()
          return event.shiftKey
            ? editor.commands.outdentList()
            : editor.commands.indentList()
        },
      []
    )

    const editor = useEditor({
      extensions: buildExtensions(placeholder),
      content: initialContent,
      editorProps: {
        handleKeyDown: () => false,
      },
    })

    useEffect(() => {
      if (!editor) return
      editor.setOptions({
        editorProps: {
          handleKeyDown: handleKeyDown(editor),
        },
      })
    }, [editor, handleKeyDown])

    useEffect(() => {
      if (!editor) return
      onEditorReady?.(editor)
      return () => {
        onEditorDestroy?.()
        editor.destroy()
      }
    }, [editor])

    useImperativeHandle(
      ref,
      () => ({
        getHTML: () => editor?.getHTML() ?? "",
        getText: () => editor?.getText() ?? "",
        setContent: (html: string) => {
          if (editor && !editor.isDestroyed) {
            editor.commands.setContent(html)
            editor.commands.focus("start")
          }
        },
        focus: () => editor?.commands.focus(),
      }),
      [editor]
    )

    return (
      <div
        className={`${styles.editorContainer} ${isInline ? styles.inlineEditorHeight : ""}`}
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent editor={editor} className={styles.tiptapEditor} />
      </div>
    )
  }
)

RichEditor.displayName = "RichEditor"
export default RichEditor