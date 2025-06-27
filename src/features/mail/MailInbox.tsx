"use client"

import type React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import MailList from "../../components/Mail/MailList"
import Button from "../../components/Mail/Buttons/Button"
import { useState } from "react"

const MailInbox: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const currentHash = location.hash.replace("#", "") || "inbox"

  const navigateToSection = (section: string) => {
    navigate(`/mail/#${section}`)
  }

  return (
    <div className="mail-inbox">
      <div className="mail-navigation">
        <Button onClick={() => navigateToSection("inbox")}>Inbox</Button>
        <Button onClick={() => navigateToSection("spam")}>Spam</Button>
        <Button onClick={() => navigateToSection("sent")}>Sent</Button>
        <Button onClick={() => navigateToSection("drafts")}>Drafts</Button>
        <Button onClick={() => navigateToSection("trash")}>Trash</Button>
      </div>

      <h1>{currentHash.charAt(0).toUpperCase() + currentHash.slice(1)}</h1>

      <MailList
        section={currentHash}
        selectedMailId={selectedId}
        onMailSelect={mail => setSelectedId(mail.id ?? null)}
      />
    </div>
  )
}

export default MailInbox
