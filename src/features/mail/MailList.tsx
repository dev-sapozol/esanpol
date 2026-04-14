import type React from "react"
import type { Mail } from "@mail/types"
import MailItem from "./components/mail_item/MailItem"

interface MailListProps {
  mails: Mail[]
  selectedMailId?: number
  onSelect: (mail: Mail) => void
}

const MailList: React.FC<MailListProps> = ({
  mails,
  selectedMailId,
  onSelect
}) => {
  return (
    <div className="mail-list">
      {mails.map((mail, index) => (
        <MailItem
          key={mail.id}
          mail={mail}
          isSelected={mail.id === selectedMailId}
          onClick={() => onSelect(mail)}
          isLast={index === mails.length - 1}
        />
      ))}

      {mails.length === 0 && <p>No messages</p>}
    </div>
  )
}

export default MailList