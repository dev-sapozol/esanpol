"use client";

import React, { useState, useRef, useEffect } from "react";

interface RecipientChipsProps {
  value: string[]; // emails
  onChange: (list: string[]) => void;
  placeholder?: string;
  collapsed?: boolean; // if true show small pill + count
  onExpand?: () => void;
}

const isValidEmail = (s: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

export default function RecipientChips({
  value,
  onChange,
  placeholder = "Add recipients...",
  collapsed = false,
  onExpand,
}: RecipientChipsProps) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing && ref.current) ref.current.focus();
  }, [editing]);

  const addFromInput = () => {
    const raw = input.split(",").map((x) => x.trim()).filter(Boolean);
    const valid = raw.filter(Boolean);
    if (valid.length) {
      onChange([...value, ...valid]);
    }
    setInput("");
    setEditing(false);
  };

  const remove = (idx: number) => {
    const copy = [...value];
    copy.splice(idx, 1);
    onChange(copy);
  };

  if (collapsed && !editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setEditing(true);
          onExpand?.();
        }}
        className="rf-recipient-collapsed"
        aria-label="Open recipients"
      >
        {value.length === 0 ? <span className="rf-placeholder">{placeholder}</span> : <span>{value[0]}</span>}
        {value.length > 1 && <span className="rf-count">+{value.length - 1}</span>}
      </button>
    );
  }

  return (
    <div className="rf-chips-wrapper" onClick={() => setEditing(true)}>
      <div className="rf-chips">
        {value.map((email, i) => (
          <span key={i} className={`rf-chip ${isValidEmail(email) ? "" : "invalid"}`}>
            <span className="rf-chip-text">{email}</span>
            <button className="rf-chip-remove" onClick={() => remove(i)} aria-label={`Remove ${email}`}>×</button>
          </span>
        ))}

        <input
          ref={ref}
          className="rf-chip-input"
          placeholder={value.length === 0 ? placeholder : ""}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addFromInput();
            } else if (e.key === "Backspace" && input === "" && value.length) {
              // delete last
              remove(value.length - 1);
            }
          }}
          onBlur={() => {
            if (input.trim()) addFromInput();
            else setEditing(false);
          }}
        />
      </div>

      <style>{`
  .rf-chips-wrapper { display:flex; align-items:center; min-height:36px; }
  .rf-chips { display:flex; gap:8px; flex-wrap:wrap; align-items:center; width:100%; }
  .rf-chip { background:#f1f3f5; padding:6px 8px; border-radius:16px; display:inline-flex; align-items:center; gap:6px; font-size:13px; }
  .rf-chip.invalid { border:1px solid #e53935; background:#fff5f5; }
  .rf-chip-remove { background:none; border:none; cursor:pointer; font-weight:700; color:#666; padding:0 2px; }
  .rf-chip-input { border:none; outline:none; min-width:120px; font-size:14px; padding:6px 4px; }
  .rf-placeholder { color:#8a8a8a; font-size:14px; }
  .rf-recipient-collapsed { background:#1a73e8; color:white; border:none; padding:8px 12px; border-radius:20px; display:inline-flex; gap:8px; align-items:center; cursor:pointer; }
  .rf-count { background:rgba(255,255,255,0.18); padding:2px 6px; border-radius:10px; font-size:12px; }
`}</style>
    </div>
  );
}
