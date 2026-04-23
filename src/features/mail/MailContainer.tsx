"use client"

import type React from "react"
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react"
import { useLocation, useNavigate } from "react-router-dom"

import type { MailSection, Mail } from "./types"
import type { ComposeEmailData } from "./types"

import { useMailbox } from "./hooks/useMailbox"
import { useCreateEmail } from "./hooks/useCreateEmail"
import { useInboxSocket } from "./hooks/useInboxSocket"
import { useSentLimit } from "./hooks/useSentLimit"

import ToastContainer from "../../components/ui/Toats/ToastContainer"
import styles from "./MailContainer.module.css"
import Sidebar from "./components/sidebar/Sidebar"
import MailNavbar from "./components/navbar/MailNavbar"
const MailList = lazy(() => import("./components/mail-list/MailList"))
const MailDetailModal = lazy(() => import("./components/mail-detail/MailDetailModal"))
const ComposeModal = lazy(() => import("./components/compose/ComposeModal"))
const SidebarAI = lazy(() => import("./components/sidebar-ai/SidebarAI"))

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

  const [selectedMail, setSelectedMail] = useState<Mail | null>(null)
  const [isComposeOpen, setIsComposeOpen] = useState(false)

  // 🔥 REALTIME
  const [realtimeEmails, setRealtimeEmails] = useState<Mail[]>([])
  const [composeDraft, setComposeDraft] = useState<{ subject: string; body: string } | null>(null)

  type ToastItem =
    | { id: number; email: Mail }
    | { id: number; customMessage: string }

  const [toasts, setToasts] = useState<ToastItem[]>([])

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("mail-sidebar-collapsed")
    return saved ? JSON.parse(saved) : false
  })

  const [isSidebarAICollapsed, setIsSidebarAICollapsed] = useState(() => {
    const saved = localStorage.getItem("mail-sidebar-ai-collapsed")
    return saved ? JSON.parse(saved) : false
  })

  const {
    user,
    getEmailsFor,
    emailsByFolder,
    loading: mailboxLoading,
    refetch: refetchMailbox,
  } = useMailbox(50)

  const { isLimited, limitMessage } = useSentLimit({
    role: user?.role,
    emailsByFolder
  })

  const { createEmail, loading: createEmailLoading } = useCreateEmail()

  const handleNewEmail = useCallback((email: Mail) => {
    setRealtimeEmails((prev) => {
      if (prev.some((e) => e.id === email.id)) return prev
      return [email, ...prev]
    })

    setToasts((prev) => [...prev, { id: email.id, email }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useInboxSocket({
    userId: user?.id,
    onNewEmail: handleNewEmail,
  })

  // persist sidebar
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
    const folderMails = getEmailsFor(folder.folder_type, folder.folder_id)

    if (currentSection !== "inbox") return folderMails

    const existingIds = new Set(folderMails.map((m: Mail) => m.id))
    const newOnes = realtimeEmails.filter((m) => !existingIds.has(m.id))

    return [...newOnes, ...folderMails]
  }, [currentSection, getEmailsFor, realtimeEmails])

  const handleMailSelect = (mail: Mail) => {
    setSelectedMail(mail)
  }

  const handleComposeEmail = async (emailData: ComposeEmailData) => {
    if (isLimited) return

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
            onCompose={() => {
              if (isLimited) {
                setToasts((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    customMessage: limitMessage ?? "Limit reached",
                  },
                ])
                return
              }
              setIsComposeOpen(true)
            }}
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
              selectedMailId={selectedMail?.id ?? null}
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
        <aside className={`${styles.sidebarAISection} ${isSidebarAICollapsed ? styles.collapsed : ""}`}>
          <SidebarAI
            isCollapsed={isSidebarAICollapsed}
            onToggle={() =>
              setIsSidebarAICollapsed((v: boolean) => !v)
            }
            currentSection={currentSection}
            onCompose={(draft) => {
              setComposeDraft(draft)
              setIsComposeOpen(true)
            }}
            aiMessagesRemaining={user?.ai_messages_remaining ?? 0}
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
            islimited={isLimited}
            onLimitReached={() =>
              setToasts((prev) => [
                ...prev,
                { id: Date.now(), customMessage: limitMessage ?? "Limit reached" },
              ])
            }
          />
        </Suspense>
      )}

      {/* MODAL: COMPOSE */}
      <Suspense fallback={null}>
        <ComposeModal
          isOpen={isComposeOpen}
          onClose={() => { setIsComposeOpen(false); setComposeDraft(null) }}
          onSend={handleComposeEmail}
          loading={createEmailLoading}
          disabled={isLimited}
          initialData={composeDraft ? {
            subject: composeDraft.subject,
            htmlBody: composeDraft.body,
          } : undefined}
        />
      </Suspense>

      {/* 🔥 TOASTS */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default MailContainer