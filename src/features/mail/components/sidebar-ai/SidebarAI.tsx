"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react";
import styles from "./SidebarAI.module.css"

interface SidebarAIProps {
  isCollapsed: boolean
  onToggle: () => void
  currentSection: string
  onCompose: () => void
}

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

const SidebarAI: React.FC<SidebarAIProps> = ({
  isCollapsed,
  onToggle,
  currentSection,
  onCompose,
}) => {

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi 👋 I can help you summarize or reply to emails."
    }
  ])

  const [input, setInput] = useState("")

  const chatEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    setMessages((prev) => [
      ...prev,
      { id: "typing", role: "assistant", content: "..." }
    ])

    setTimeout(() => {
      setMessages((prev) => [
        ...prev.filter(m => m.id !== "typing"),
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "This is a simulated response."
        }
      ])
    }, 900)
  }
  return (
    <div className={`${styles.sidebarai} ${isCollapsed ? styles.collapsed : ""}`}>

      {/* HEADER */}
      <div className={styles.sidebarAIHeader}>
        <button onClick={onToggle} className={styles.toggleButton}>
          ☰
        </button>
        {!isCollapsed && <span className={styles.title}>EMILIA</span>}
      </div>

      {!isCollapsed && (
        <>
          {/* CHAT */}
          <div className={styles.chatContainer}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.role === "user"
                    ? styles.userMessage
                    : styles.aiMessage
                }
              >
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT */}
          <div className={styles.inputContainer}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className={styles.input}
            />
            <button onClick={handleSend} className={styles.sendButton}>
              ➤
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default SidebarAI