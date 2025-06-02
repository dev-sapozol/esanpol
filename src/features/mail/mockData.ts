import type { Mail, MailSection } from "./types"

// Helper to generate a random date within the last 30 days
const getRandomDate = () => {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 30)
  now.setDate(now.getDate() - daysAgo)
  return now.toISOString()
}

// Generate mock emails for each section
export const generateMockEmails = (section: MailSection): Mail[] => {
  const baseEmails: Record<MailSection, Mail[]> = {
    inbox: [
      {
        id: 1,
        subject: "Welcome to our service",
        sender: "support@example.com",
        preview: "Thank you for signing up to our service. We're excited to have you on board!",
        body: "Thank you for signing up to our service. We're excited to have you on board!\n\nHere are some tips to get started:\n1. Complete your profile\n2. Explore our features\n3. Reach out if you need help\n\nBest regards,\nSupport Team",
        isRead: false,
        date: getRandomDate(),
        section: "inbox",
      },
      {
        id: 2,
        subject: "Meeting tomorrow",
        sender: "manager@example.com",
        preview: "Don't forget about our team meeting tomorrow at 10 AM. Please prepare your weekly report.",
        body: "Hi,\n\nDon't forget about our team meeting tomorrow at 10 AM. Please prepare your weekly report and be ready to discuss the following topics:\n\n- Project status\n- Upcoming deadlines\n- Resource allocation\n\nRegards,\nYour Manager",
        isRead: true,
        date: getRandomDate(),
        section: "inbox",
      },
      {
        id: 3,
        subject: "Invoice #12345",
        sender: "billing@example.com",
        preview: "Your invoice for this month is attached. Please process the payment at your earliest convenience.",
        body: "Dear Customer,\n\nYour invoice #12345 for this month is ready. The total amount due is $199.99.\n\nPlease process the payment at your earliest convenience.\n\nThank you for your business!\n\nBilling Department",
        isRead: false,
        date: getRandomDate(),
        section: "inbox",
      },
    ],
    sent: [
      {
        id: 101,
        subject: "Project proposal",
        sender: "me@example.com",
        preview: "Attached is the project proposal we discussed. Please review and provide feedback.",
        body: "Hi Team,\n\nAttached is the project proposal we discussed during our last meeting. Please review and provide feedback by Friday.\n\nKey points to consider:\n- Timeline feasibility\n- Budget allocation\n- Resource requirements\n\nLooking forward to your input.\n\nBest regards,\nMe",
        isRead: true,
        date: getRandomDate(),
        section: "sent",
      },
      {
        id: 102,
        subject: "Vacation request",
        sender: "me@example.com",
        preview: "I would like to request vacation days from July 15 to July 25.",
        body: "Dear HR,\n\nI would like to request vacation days from July 15 to July 25 (10 working days).\n\nI've already discussed this with my team and ensured that my responsibilities will be covered during my absence.\n\nPlease let me know if you need any additional information.\n\nThank you,\nMe",
        isRead: true,
        date: getRandomDate(),
        section: "sent",
      },
    ],
    drafts: [
      {
        id: 201,
        subject: "Draft: Quarterly report",
        sender: "me@example.com",
        preview: "Here's the quarterly report for Q2 2023...",
        body: "Dear Leadership Team,\n\nHere's the quarterly report for Q2 2023.\n\n[DRAFT - INCOMPLETE]\n\nKey metrics:\n- Revenue: $X\n- Growth: Y%\n- New customers: Z\n\nI'll complete this with the final numbers by tomorrow.\n\nRegards,\nMe",
        isRead: true,
        date: getRandomDate(),
        section: "drafts",
      },
    ],
    spam: [
      {
        id: 301,
        subject: "YOU WON $1,000,000!!!",
        sender: "lottery@scam-example.com",
        preview: "Congratulations! You've been selected as the winner of our international lottery!",
        body: "CONGRATULATIONS!!!\n\nYou've been selected as the winner of our international lottery! You won $1,000,000!\n\nTo claim your prize, please send us your bank account details and a processing fee of $100.\n\nThis is totally legitimate and not a scam at all!",
        isRead: false,
        date: getRandomDate(),
        section: "spam",
      },
      {
        id: 302,
        subject: "Urgent: Your account needs verification",
        sender: "security@fake-bank.com",
        preview: "Your bank account has been compromised. Click here to verify your identity immediately.",
        body: "URGENT SECURITY NOTICE\n\nYour bank account has been compromised. Click the link below to verify your identity immediately or your account will be suspended.\n\n[SUSPICIOUS LINK]\n\nThis is a time-sensitive matter!",
        isRead: false,
        date: getRandomDate(),
        section: "spam",
      },
    ],
    trash: [
      {
        id: 401,
        subject: "Old newsletter",
        sender: "newsletter@example.com",
        preview: "Check out our latest products and offers!",
        body: "Hello,\n\nCheck out our latest products and offers!\n\nThis week's specials:\n- Product A: 20% off\n- Product B: Buy one get one free\n- Product C: New arrival\n\nShop now at our website!\n\nUnsubscribe",
        isRead: true,
        date: getRandomDate(),
        section: "trash",
      },
    ],
  }

  return baseEmails[section] || []
}

// Mail sections configuration
export const mailSections = [
  { id: "inbox" as MailSection, name: "Inbox", count: 3 },
  { id: "sent" as MailSection, name: "Sent", count: 2 },
  { id: "drafts" as MailSection, name: "Drafts", count: 1 },
  { id: "spam" as MailSection, name: "Spam", count: 2 },
  { id: "trash" as MailSection, name: "Trash", count: 1 },
]
