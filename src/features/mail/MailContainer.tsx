"use client"

import type React from "react"
import { useState, useEffect, useMemo, lazy, Suspense } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import type { MailSection } from "./types"
import type { ComposeEmailData } from "./types"

import { useMailbox } from "./hooks/useMailbox"
import { useCreateEmail } from "./hooks/useCreateEmail"

import styles from "./MailContainer.module.css"

import Sidebar from "../../components/Sidebar/Sidebar"
import MailNavbar from "./components/mail_navbar/MailNavbar"

const MailList = lazy(() =>
  import("./components/mail_list/MailList")
)

const MailDetailModal = lazy(() =>
  import("./components/mail_detail_modal/MailDetailModal")
)

const ComposeModal = lazy(() =>
  import("./components/ComposeModal/ComposeModal")
)

const SidebarAI = lazy(() =>
  import("../../components/SidebarAI/SidebarAI")
)

const FOLDER_MAP: Record<
  MailSection,
  { folder_id: number; folder_type: "SYSTEM" }
> = {
  inbox: { folder_id: 1, folder_type: "SYSTEM" },
  sent: { folder_id: 2, folder_type: "SYSTEM" },
  drafts: { folder_id: 3, folder_type: "SYSTEM" },
  trash: { folder_id: 4, folder_type: "SYSTEM" },
  spam: { folder_id: 5, folder_type: "SYSTEM" },
  archive: { folder_id: 6, folder_type: "SYSTEM" },
  templates: { folder_id: 7, folder_type: "SYSTEM" },
  system: { folder_id: 8, folder_type: "SYSTEM" },
}

interface MailContainerProps {
  darkMode: boolean
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

const MailContainer: React.FC<MailContainerProps> = ({
  darkMode,
  setDarkMode
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  const [currentSection, setCurrentSection] =
    useState<MailSection>("inbox")

  const [selectedMail, setSelectedMail] = useState<any | null>(null)

  const [isComposeOpen, setIsComposeOpen] = useState(false)

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("mail-sidebar-collapsed")
    return saved ? JSON.parse(saved) : false
  })

  const [isSidebarAICollapsed, setIsSidebarAICollapsed] = useState(() => {
    const saved = localStorage.getItem("mail-sidebar-ai-collapsed")
    return saved ? JSON.parse(saved) : false
  })

  const {
    getEmailsFor,
    loading: mailboxLoading,
    refetch: refetchMailbox,
  } = useMailbox(50)

  const { createEmail, loading: createEmailLoading } = useCreateEmail()

  // persist sidebar state
  useEffect(() => {
    localStorage.setItem(
      "mail-sidebar-collapsed",
      JSON.stringify(isSidebarCollapsed)
    )
  }, [isSidebarCollapsed])

  useEffect(() => {
    localStorage.setItem(
      "mail-sidebar-ai-collapsed",
      JSON.stringify(isSidebarAICollapsed)
    )
  }, [isSidebarAICollapsed])

  // route sync
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
        to: emailData.to,
        cc: emailData.cc,
        bcc: emailData.bcc,
        subject: emailData.subject,
        htmlBody: emailData.htmlBody,
        hasAttachment: emailData.hasAttachment,
        importance: emailData.importance,
        folderId: 1
      }

      await createEmail(emailInput)
      await refetchMailbox()
      setIsComposeOpen(false)
    } catch (error) {
      console.error("Failed to send email:", error)
    }
  }

  return (
    <div className={styles.mailContainer}>
      <MailNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className={styles.innerLayout}>
        {/* SIDEBAR */}
        <aside className={styles.sidebarSection}>
          <Sidebar
            sections={Object.keys(FOLDER_MAP).map((key) => ({
              id: key as MailSection,
              name: key,
            }))}
            isCollapsed={isSidebarCollapsed}
            onToggle={() =>
              setIsSidebarCollapsed((v: boolean) => !v)
            }
            currentSection={currentSection}
            onCompose={() => setIsComposeOpen(true)}
          />
        </aside>

        {/* MAIL LIST */}
        <main className={styles.mailListSection}>
          <header className={styles.mailListHeader}>
            <div>
              <h1 className={styles.sectionTitle}>
                {currentSection.charAt(0).toUpperCase() +
                  currentSection.slice(1)}
              </h1>
              <span className={styles.mailCount}>
                {mailboxLoading ? "…" : `${mails.length} messages`}
              </span>
            </div>
          </header>

          <div className={styles.mailListContent}>
              <MailList
                mails={mails}
                selectedMailId={selectedMail?.id}
                onMailSelect={handleMailSelect}
              />
          </div>

          <footer className={styles.mailListFooter}>
            <span className={styles.textFooter}>
              Project by Sebastian Pozo - 2026
            </span>
          </footer>
        </main>

        {/* AI SIDEBAR */}
        <aside className={styles.sidebarAISection}>
            <SidebarAI
              isCollapsed={isSidebarAICollapsed}
              onToggle={() =>
                setIsSidebarAICollapsed((v: boolean) => !v)
              }
              currentSection={currentSection}
              onCompose={() => setIsComposeOpen(true)}
            />
        </aside>
      </div>

      {/* MODAL: DETAIL */}
      {selectedMail && (
        <Suspense fallback={null}>
          <MailDetailModal
            mailId={selectedMail.id}
            onClose={() => setSelectedMail(null)}
            onEmailSent={() => {
              refetchMailbox()
            }}
          />
        </Suspense>
      )}

      {/* MODAL: COMPOSE */}
      <Suspense fallback={null}>
        <ComposeModal
          isOpen={isComposeOpen}
          onClose={() => setIsComposeOpen(false)}
          onSend={handleComposeEmail}
          loading={createEmailLoading}
        />
      </Suspense>
    </div>
  )
}

export default MailContainer