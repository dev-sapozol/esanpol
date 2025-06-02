export interface Mail {
  id: number
  subject: string
  sender: string
  preview: string
  body?: string
  isRead: boolean
  date: string
  section: MailSection
}

export type MailSection = "inbox" | "sent" | "drafts" | "spam" | "trash"

export interface MailSectionConfig {
  id: MailSection
  name: string
  count?: number
}

export interface ComposeEmailData {
  to: string
  cc?: string
  bcc?: string
  subject: string
  textBody: string
  htmlBody?: string
  importance: number
  hasAttachment: boolean
}

export interface ComposeModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (emailData: ComposeEmailData) => void
}
