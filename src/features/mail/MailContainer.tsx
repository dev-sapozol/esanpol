"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar/Sidebar"
import MailList from "./components/mail_list/MailList"
import MailDetailModal from "./components/mail_detail_modal/MailDetailModal"
import MailNavbar from "./components/mail_navbar/MailNavbar"
import ComposeModal from "./components/ComposeModal/ComposeModal"

import type { MailSection } from "./types"
import type { ComposeEmailData } from "./types"

import { useMailbox } from "./hooks/useMailbox"
import { useCreateEmail } from "./hooks/useCreateEmail"

import styles from "./MailContainer.module.css"

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

const MailContainer: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [currentSection, setCurrentSection] = useState<MailSection>("inbox")
  const [selectedMail, setSelectedMail] = useState<any | null>(null)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("mail-sidebar-collapsed")
    return saved ? JSON.parse(saved) : false
  })

  const {
    getEmailsFor,
    loading: mailboxLoading,
    refetch: refetchMailbox,
  } = useMailbox(1, 50)

  const { createEmail, loading: createEmailLoading } = useCreateEmail()

  useEffect(() => {
    localStorage.setItem("mail-sidebar-collapsed", JSON.stringify(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  useEffect(() => {
    if (location.pathname === "/mail" && !location.hash) {
      navigate("/mail/#inbox", { replace: true })
    }
  }, [location, navigate])

  useEffect(() => {
    const section = location.hash.replace("#", "") as MailSection
    if (FOLDER_MAP[section]) {
      setCurrentSection(section)
      setSelectedMail(null)
    }
  }, [location.hash])

  const mails = useMemo(() => {
    const folder = FOLDER_MAP[currentSection]
    return getEmailsFor(folder.folder_type, folder.folder_id)
  }, [currentSection, getEmailsFor])

  const handleMailSelect = (mail: any) => {
    setSelectedMail(mail)
  }

  const handleComposeEmail = async (emailData: ComposeEmailData) => {
    try {
      const emailInput = {
        userId: "1",
        to: emailData.to,
        cc: emailData.cc || undefined,
        bcc: emailData.bcc || undefined,
        subject: emailData.subject,
        textBody: emailData.textBody,
        htmlBody: emailData.htmlBody || emailData.textBody,
        preview: (emailData.textBody ?? "").substring(0, 100),
        importance: emailData.importance,
        hasAttachment: emailData.hasAttachment,
        inboxType: 1,
        isRead: false,
      }

      await createEmail(emailInput)
      await refetchMailbox()

      alert("Email sent successfully!")
      setIsComposeOpen(false)
    } catch (error) {
      console.error("Failed to send email:", error)
      alert("Failed to send email. Please try again.")
    }
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className={styles.mailContainer}>
      <MailNavbar />

      <div className={styles.innerLayout}>
        <aside className={styles.sidebarSection}>
          <Sidebar
            sections={Object.keys(FOLDER_MAP).map((key) => ({
              id: key as MailSection,
              name: key,
            }))}
            isCollapsed={isSidebarCollapsed}
            onToggle={toggleSidebar}
            currentSection={currentSection}
            onCompose={() => setIsComposeOpen(true)}
          />
        </aside>

        <main className={styles.mailListSection}>
          <header className={styles.mailListHeader}>
            <div className={styles.headerContent}>
              <div>
                <h1 className={styles.sectionTitle}>
                  {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
                </h1>
                <span className={styles.mailCount}>
                  {mailboxLoading ? "…" : `${mails.length} messages`}
                </span>
              </div>
            </div>
          </header>

          <div className={styles.mailListContent}>
            <MailList
              mails={mails}
              selectedMailId={selectedMail?.id || null}
              onMailSelect={handleMailSelect}
            />
          </div>

          <footer className={styles.mailListFooter}>
            <div className={styles.footerContent}>
              <span className={styles.mailCount}>
                {mailboxLoading ? "…" : `${mails.length} messages`}
              </span>
            </div>
          </footer>
        </main>
      </div>

      {selectedMail && (
        <MailDetailModal
          mailId={selectedMail.id}
          onClose={() => setSelectedMail(null)}
          onEmailSent={() => {
            console.log("Correo repsondido");
            refetchMailbox()
        }}
        />
      )}

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={handleComposeEmail}
        loading={createEmailLoading}
      />
    </div>
  )
}

export default MailContainer
