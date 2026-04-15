"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import styles from "./ComposeModal/ComposeModal.module.css"

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export interface RecipientFieldProps {
  label: string
  list: string[]
  setList: (list: string[]) => void
  showLabel?: boolean
  onHide?: () => void
  rightActions?: ReactNode
  autoFocus?: boolean
}

export function RecipientField({
  label,
  list,
  setList,
  showLabel = true,
  onHide,
  rightActions,
  autoFocus,
}: RecipientFieldProps) {
  const [inputValue, setInputValue] = useState("")
  const [hasError, setHasError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const addEmail = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    if (isValidEmail(trimmed)) {
      if (!list.includes(trimmed)) setList([...list, trimmed])
      setInputValue("")
      setHasError(false)
    } else {
      setHasError(true)
      setTimeout(() => setHasError(false), 500)
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

  const removeChip = (index: number) =>
    setList(list.filter((_, i) => i !== index))

  return (
    <div className={`${styles.fieldRow} ${hasError ? styles.fieldError : ""}`}>
      {showLabel && (
        <span className={styles.label} onClick={onHide}>
          {label}
        </span>
      )}

      <div className={styles.fieldBody} onClick={() => inputRef.current?.focus()}>
        {list.map((email, idx) => (
          <span key={idx} className={styles.chip}>
            {email}
            <button tabIndex={-1} onClick={() => removeChip(idx)} aria-label={`Eliminar ${email}`}>
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
            if (hasError) setHasError(false)
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (inputValue) addEmail(inputValue) }}
          placeholder={list.length === 0 && !showLabel ? label : ""}
          aria-label={label}
        />
      </div>

      {rightActions && <div className={styles.rightActions}>{rightActions}</div>}

      {onHide && (
        <button
          className={styles.closeFieldBtn}
          onClick={onHide}
          title={`Ocultar ${label}`}
          aria-label={`Ocultar ${label}`}
        >
          ×
        </button>
      )}
    </div>
  )
}