export interface Mail {
  id: number
  subject: string
  sender: string
  preview: string
  body?: string
  isRead?: boolean
  date?: string
}

export type MailSection = "inbox" | "spam"
