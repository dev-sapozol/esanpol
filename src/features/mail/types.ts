export interface Mail {
  id: number
  subject: string
  senderName?: string
  senderEmail: string
  senderAvatar: string
  preview: string
  body?: string
  htmlBody?: string
  isRead: boolean
  date?: string
  inserted_at?: string
  section: MailSection
}

export type MailSection = "inbox" | "sent" | "drafts" | "trash" | "spam" | "archive" | "templates" | "system"

export interface MailSectionConfig {
  id: MailSection
  name: string
  count?: number
}

export interface ComposeEmailData {
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject?: string
  textBody?: string
  htmlBody?: string
  importance?: "normal" | "high"
  attachments?: File[]
  hasAttachment?: boolean
}

export interface ComposeModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (emailData: ComposeEmailData) => void
}
