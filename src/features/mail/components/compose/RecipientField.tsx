"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { useUserSearch } from "../../hooks/useUserSearch"
import styles from "../compose/ComposeModal.module.css"

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
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { suggestions, search, clear } = useUserSearch()

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  // Cierra dropdown al clickar fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
        clear()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [clear])

  const addEmail = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    if (isValidEmail(trimmed)) {
      if (!list.includes(trimmed)) setList([...list, trimmed])
      setInputValue("")
      setHasError(false)
      setShowDropdown(false)
      clear()
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    if (hasError) setHasError(false)
    search(val)
    setShowDropdown(val.length >= 2)
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

      <div
        className={styles.fieldBody}
        onClick={() => inputRef.current?.focus()}
        ref={dropdownRef}
        style={{ position: "relative" }}
      >
        {list.map((email, idx) => (
          <span key={idx} className={styles.chip}>
            {email}
            <button
              tabIndex={-1}
              onClick={() => removeChip(idx)}
              aria-label={`Eliminar ${email}`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          className={styles.input}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (inputValue) addEmail(inputValue) }}
          placeholder={list.length === 0 && !showLabel ? label : ""}
          aria-label={label}
        />

        {/* Dropdown de sugerencias */}
        {showDropdown && suggestions.length > 0 && (
          <div className={styles.suggestionsDropdown}>
            {suggestions.map((s) => (
              <div
                key={s.email}
                className={styles.suggestionItem}
                onMouseDown={(e) => {
                  e.preventDefault()
                  addEmail(s.email)
                }}
              >
                <div className={styles.suggestionAvatar}>
                  {s.avatarUrl ? (
                    <img src={s.avatarUrl} alt={s.name} />
                  ) : (
                    <span>{s.name?.charAt(0)?.toUpperCase() ?? "?"}</span>
                  )}
                </div>
                <div className={styles.suggestionInfo}>
                  <span className={styles.suggestionName}>{s.name} {s.fathername} {s.mothername}</span>
                  <span className={styles.suggestionEmail}>{s.email}</span>
                </div>
              </div>
            ))}
          </div>
        )}
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