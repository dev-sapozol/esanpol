"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import styles from "./SidebarAI.module.css"

interface SidebarAIProps {
  isCollapsed: boolean
  onToggle: () => void
  currentSection: string
  onCompose: (draft: { subject: string; body: string }) => void
  aiMessagesRemaining: number
}

type Tone = "professional" | "formal" | "informal"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  draft?: { subject: string; body: string }
}

const TONES: { value: Tone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "formal", label: "Formal" },
  { value: "informal", label: "Informal" },
]

const SidebarAI: React.FC<SidebarAIProps> = ({
  isCollapsed,
  onToggle,
  onCompose,
  aiMessagesRemaining,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi 👋 Tell me what email you need and I'll draft it for you.",
    },
  ])
  const [input, setInput] = useState("")
  const [tone, setTone] = useState<Tone>("professional")
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const [remaining, setRemaining] = useState(aiMessagesRemaining)

  useEffect(() => {
    if (typeof aiMessagesRemaining === "number") {
      setRemaining(aiMessagesRemaining)
    }
  }, [aiMessagesRemaining])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const context = input.trim()
    setInput("")

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: context },
    ])

    setLoading(true)

    setMessages((prev) => [
      ...prev,
      { id: "typing", role: "assistant", content: "..." },
    ])

    try {
      const token = sessionStorage.getItem("access_token")

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ context, tone }),
      })

      const data = await res.json()

      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => m.id !== "typing")

        if (!res.ok) {
          return [
            ...withoutTyping,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: `⚠️ ${data.error ?? "Something went wrong."}`,
            },
          ]
        }

        let subject = data.subject
        let body = data.body

        if (typeof body === "string" && body.trim().startsWith("{")) {
          try {
            const parsed = JSON.parse(body)
            if (parsed.subject) subject = parsed.subject
            if (parsed.body) body = parsed.body
          } catch {
          }
        }
        if (typeof body === "object" && body !== null) {
          subject = body.subject ?? subject
          body = body.body ?? JSON.stringify(body)
        }

        if (!data.from_cache && typeof data.ai_messages_remaining === "number") {
          setRemaining(data.ai_messages_remaining)
        }

        return [
          ...withoutTyping,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: subject,
            draft: { subject, body },
          },
        ]
      })
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "typing"),
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "⚠️ Network error. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${styles.sidebarai} ${isCollapsed ? styles.collapsed : ""}`}>

      {/* HEADER */}
      <div className={styles.sidebarAIHeader}>
        <button onClick={onToggle} className={styles.toggleButton}>☰</button>
        {!isCollapsed && <span className={styles.title}>EMILIA</span>}
      </div>

      {!isCollapsed && (
        <>
          <div className={styles.expandedContent}>
            {/* TONE + CHAT + INPUT */}

            <div className={styles.toneBar}>
              {TONES.map((t) => (
                <button
                  key={t.value}
                  className={`${styles.toneBtn} ${tone === t.value ? styles.toneBtnActive : ""}`}
                  onClick={() => setTone(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className={styles.chatContainer}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={msg.role === "user" ? styles.userRow : styles.aiRow}
                >
                  <div className={msg.role === "user" ? styles.userMessage : styles.aiMessage}>
                    {msg.draft ? (
                      <div className={styles.draftCard}>
                        <span className={styles.draftLabel}>Draft ready ✉️</span>

                        <div className={styles.draftField}>
                          <span className={styles.draftFieldLabel}>Subject</span>
                          <div className={styles.draftSubject}>{msg.draft.subject}</div>
                        </div>

                        <div className={styles.draftField}>
                          <span className={styles.draftFieldLabel}>Body</span>
                          <div className={styles.draftBody}>{msg.draft.body}</div>
                        </div>

                        <button
                          className={styles.useDraftBtn}
                          onClick={() => onCompose(msg.draft!)}
                        >
                          Use this draft →
                        </button>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className={styles.inputContainer}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe the email you need..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className={styles.input}
                disabled={loading || (remaining !== undefined && remaining <= 0)}
              />

              <button
                onClick={handleSend}
                className={styles.sendButton}
                disabled={loading || (remaining !== undefined && remaining <= 0)}
              >
                {loading ? "…" : "➤"}
              </button>
            </div>

            {/* MENSAJE DE LÍMITE */}
            {remaining !== undefined && remaining <= 0 && (
              <div className={styles.limitReached}>
                <span>🚫</span>
                <p>You've used all your AI messages.</p>
                <small>This is a portfolio project with limited AI quota.</small>
              </div>
            )}

            {/* CONTADOR */}
            {remaining > 0 && (
              <div className={styles.remainingBadge}>
                {remaining}/{8} messages remaining
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default SidebarAI