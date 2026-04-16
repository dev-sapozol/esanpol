import { useMemo } from "react"
import type { Mail } from "../types"

const MAX_SENT = 10

interface EmailsByFolder {
  folder_id: number
  folder_type: string
  emails: Mail[]
}

interface UseSentLimitOptions {
  role: string | undefined
  emailsByFolder: EmailsByFolder[]
}


export function useSentLimit({ role, emailsByFolder }: UseSentLimitOptions) {
  const sentCount = useMemo(() => {
    const sentFolder = emailsByFolder.find(
      (f) => f.folder_id === 2 && f.folder_type === "SYSTEM"
    )
    return sentFolder?.emails.length ?? 0
  }, [emailsByFolder])

  const isLimited = role === "USER" && sentCount >= MAX_SENT

  const limitMessage = isLimited
    ? `You've reached the maximum of ${MAX_SENT} sent emails allowed per account. This limit exists to manage storage on this portfolio project.`
    : null

  return { sentCount, isLimited, limitMessage, MAX_SENT }
}