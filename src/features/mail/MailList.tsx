import type React from "react"

interface MailListProps {
  section: string
}

interface Mail {
  id: number
  subject: string
  sender: string
  preview: string
}

const MailList: React.FC<MailListProps> = ({ section }) => {
  // Mock data based on section
  const getMails = (): Mail[] => {
    if (section === "inbox") {
      return [
        { id: 1, subject: "Welcome", sender: "support@example.com", preview: "Welcome to our service..." },
        {
          id: 2,
          subject: "Meeting tomorrow",
          sender: "manager@example.com",
          preview: "Don't forget about our meeting...",
        },
      ]
    } else if (section === "spam") {
      return [
        { id: 101, subject: "You won!", sender: "lottery@example.com", preview: "You won a million dollars..." },
        {
          id: 102,
          subject: "Urgent action required",
          sender: "bank@secure-example.com",
          preview: "Your account needs verification...",
        },
      ]
    }
    return []
  }

  const mails = getMails()

  return (
    <div className="mail-list">
      {mails.map((mail) => (
        <div key={mail.id} className="mail-item">
          <div className="mail-sender">{mail.sender}</div>
          <div className="mail-subject">{mail.subject}</div>
          <div className="mail-preview">{mail.preview}</div>
        </div>
      ))}
      {mails.length === 0 && <p>No messages in {section}</p>}
    </div>
  )
}

export default MailList
