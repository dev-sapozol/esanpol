"use client"
import { useEffect, useRef, useCallback } from "react"
import { Socket, Channel } from "phoenix"
import type { Mail } from "../types"

interface UseInboxSocketOptions {
  userId: number | undefined
  onNewEmail: (mail: Mail) => void
}

export function useInboxSocket({ userId, onNewEmail }: UseInboxSocketOptions) {
  const socketRef = useRef<Socket | null>(null)
  const channelRef = useRef<Channel | null>(null)
  const onNewEmailRef = useRef(onNewEmail)

  useEffect(() => {
    onNewEmailRef.current = onNewEmail
  }, [onNewEmail])

  useEffect(() => {
    if (!userId) return

    const token = sessionStorage.getItem("access_token")

    const socket = new Socket(`${import.meta.env.VITE_WS_URL}/socket`, {
      params: { token },
      heartbeatIntervalMs: 20_000,// ping 20s
      reconnectAfterMs: (tries) => {
        return [1000, 2000, 5000, 10000][tries - 1] ?? 10000
      },
      rejoinAfterMs: (tries) => {
        return [1000, 2000, 5000][tries - 1] ?? 5000
      },
      logger: (kind, msg, data) => {
        if (import.meta.env.DEV) console.log(`[Socket] ${kind}: ${msg}`, data)
      }
    })

    socket.onError(() => console.warn("[Socket] Connection error"))
    socket.onClose(() => console.warn("[Socket] Connection closed"))

    socket.connect()
    socketRef.current = socket

    const setupChannel = () => {
      const channel = socket.channel(`inbox:${userId}`, {})
      channelRef.current = channel

      channel.on("new_email", (raw) => {
        const mail: Mail = {
          id: raw.id,
          subject: raw.subject,
          senderName: raw.sender_name,
          senderEmail: raw.sender_email,
          senderAvatar: "",
          preview: raw.preview,
          isRead: raw.is_read,
          inserted_at: raw.inserted_at,
          section: "inbox",
        }
        onNewEmailRef.current(mail)
      })

      channel.join()
        .receive("ok", () => console.log("[Socket] Joined inbox channel"))
        .receive("error", (err) => console.error("[Socket] Join error:", err))

      return channel
    }

    setupChannel()

    // Reconectar al volver a la pestaña (como Gmail)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (socketRef.current?.connectionState() !== "open") {
          console.log("[Socket] Tab visible, reconnecting...")
          socketRef.current?.connect()
        }
        if (channelRef.current?.state !== "joined") {
          channelRef.current?.join()
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      channelRef.current?.leave()
      socketRef.current?.disconnect()
    }
  }, [userId])
}