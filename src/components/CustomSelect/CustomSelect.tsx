import { useState, useRef, useEffect } from "react"
import styles from "./CustomSelect.module.css"

type Option = { value: string; label: string }

type Props = {
  value: string
  onChange: (value: string) => void
  options: Option[]
  label: string
  required?: boolean
}

const CustomSelect: React.FC<Props> = ({ value, onChange, options, label, required }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div className={styles.field} ref={ref}>
      <div
        className={`${styles.trigger} ${value ? styles.hasValue : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.selected}>{selected?.label ?? ""}</span>
        <span className={styles.chevron}>{open ? "▲" : "▼"}</span>
      </div>
      <label className={`${styles.label} ${value || open ? styles.floating : ""}`}>
        {label}
      </label>
      {open && (
        <ul className={styles.dropdown}>
          {options.map((o) => (
            <li
              key={o.value}
              className={`${styles.option} ${o.value === value ? styles.active : ""}`}
              onMouseDown={() => {
                onChange(o.value)
                setOpen(false)
              }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CustomSelect