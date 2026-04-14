import type React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useMemo } from "react"

import MailList from "./MailList"
import Button from "../../components/Buttons/Button"
import { useMailbox } from "../mail/hooks/useMailbox"
import type { MailSection } from "../mail/types"

const FOLDER_MAP: Record<MailSection, { folder_id: number; folder_type: "SYSTEM" }> = {
  inbox: { folder_id: 1, folder_type: "SYSTEM" },
  sent: { folder_id: 2, folder_type: "SYSTEM" },
  drafts: { folder_id: 3, folder_type: "SYSTEM" },
  trash: { folder_id: 4, folder_type: "SYSTEM" },
  spam: { folder_id: 5, folder_type: "SYSTEM" },
  archive: { folder_id: 6, folder_type: "SYSTEM" },
  templates: { folder_id: 7, folder_type: "SYSTEM" },
  system: { folder_id: 8, folder_type: "SYSTEM" },
}

const MailInbox: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const currentHash = location.hash.replace("#", "") as MailSection || "inbox"

  const { getEmailsFor, loading } = useMailbox()

  const mails = useMemo(() => {
    const folder = FOLDER_MAP[currentHash]
    if (!folder) return []
    return getEmailsFor(folder.folder_type, folder.folder_id)
  }, [currentHash, getEmailsFor])

  const navigateToSection = (section: MailSection) => {
    navigate(`/mail/#${section}`)
  }

  const handleSelect = (mail: any) => {
    console.log("selected mail:", mail)
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

      <h1>{currentHash}</h1>

      <MailList
        mails={mails}
        selectedMailId={undefined}
        onSelect={handleSelect}
      />
    </div>
  )
}

export default MailInbox