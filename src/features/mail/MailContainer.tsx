"use client"

export const mailSections = [
  { id: "inbox", label: "Inbox" },
  { id: "spam", label: "Spam" },
  { id: "sent", label: "Sent" },
  { id: "drafts", label: "Drafts" },
  { id: "trash", label: "Trash" },
] as const;

import type React from "react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import NavMail from "../../components/Mail/Nav/NavMail"
import Sidebar from "../../components/Mail/Sidebar/SidebarMenu"
import SidebarAI from "../../components/Mail/Sidebar/SidebarAI"
import MailList from "../../components/Mail/MailList"
import MailDetailModal from "../../components/Mail/MailDetailModal"
import ComposeModal from "../../components/Mail/Compose/ComposeModal"
import { useCreateEmail } from "./hooks/useCreateEmail"
import type { ComposeEmailData } from "./types"
import styles from "./MailContainer.module.css"
import { useEmail } from "./hooks/useEmail";
import type {
  GetBasicEmailListQuery,
  GetEmailListQuery,
} from "../../types/graphql";

export type Email =
  | NonNullable<
      NonNullable<GetBasicEmailListQuery["getBasicEmailList"]>[number]
    >
  | NonNullable<GetEmailListQuery["getEmailList"]>[number];

type MailSection = (typeof mailSections)[number]["id"]

const MailContainer: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState<MailSection>("inbox")
  const [selectedMail, setSelectedMail] = useState<Email | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [isMailSidebarCollapsed, setIsMailSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("mail-sidebar-collapsed")
    return saved ? JSON.parse(saved) : false
  })
  const [isAISidebarCollapsed, setIsAISidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("ai-sidebar-collapsed")
    return saved ? JSON.parse(saved) : false
  })
  const { createEmail, loading: createEmailLoading } = useCreateEmail()
  const sidebarAIWidth = isAISidebarCollapsed ? 60 : 320
  const composeModalOffset = 20
  const { emails } = useEmail(currentSection);

  const sidebarSections = mailSections.map(({ id, label }) => ({
    id,
    name: label,
  })) satisfies { id: string; name: string }[];

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem("mail-sidebar-collapsed", JSON.stringify(isMailSidebarCollapsed))
  }, [isMailSidebarCollapsed])

  useEffect(() => {
    localStorage.setItem("ai-sidebar-collapsed", JSON.stringify(isAISidebarCollapsed))
  }, [isAISidebarCollapsed])

  // Redirect to inbox if no hash
  useEffect(() => {
    if (location.pathname === "/mail" && !location.hash) {
      navigate("/mail/#inbox", { replace: true })
    }
  }, [location, navigate])

  // Update current section based on URL hash
  useEffect(() => {
    const section = location.hash.replace("#", "") as MailSection
    if (section && mailSections.some((s) => s.id === section)) {
      setCurrentSection(section)
    }
  }, [location.hash])

  // Handle compose email
  const handleComposeEmail = async (emailData: ComposeEmailData) => {
    try {
      const emailInput = {
        userId: "1",
        from: "user1@esanpol.xyz",
        to: emailData.to,
        cc: emailData.cc || undefined,
        bcc: emailData.bcc || undefined,
        subject: emailData.subject,
        textBody: emailData.textBody,
        htmlBody: emailData.htmlBody || emailData.textBody,
        preview: emailData.textBody.substring(0, 100),
        importance: emailData.importance,
        hasAttachment: emailData.hasAttachment,
        isRead: false,
        inboxType: 1,
        folder: 1,
      }

      await createEmail(emailInput)
      alert("Email sent successfully!")
      setIsComposeOpen(false)
    } catch (error) {
      console.error("Failed to send email:", error)
      alert("Failed to send email. Please try again.")
    }
  }

  const toggleMailSidebar = () => {
    setIsMailSidebarCollapsed(!isMailSidebarCollapsed)
  }

  const toggleAISidebar = () => {
    setIsAISidebarCollapsed(!isAISidebarCollapsed)
  }

  return (
    <div className={styles.appLayout}
      style={{
        '--compose-modal-right-offset': `${sidebarAIWidth + composeModalOffset}px`,
      } as React.CSSProperties}
    >
      {/* 1. Barra de Navegación Superior */}
      <nav className={styles.topNavSection} role="navigation" aria-label="Main navigation">
        <NavMail />
      </nav>

      {/* 2. Cuerpo Principal (debajo de la barra de navegación) */}
      <div className={styles.mainBody}>
        {/* 2a. Sidebar Izquierda (Carpetas) */}
        <aside
          className={`${styles.sidebarSection} ${isMailSidebarCollapsed ? styles.collapsed : ""}`}
          role="complementary"
          aria-label="Mail folders"
        >
          <Sidebar
            sections={sidebarSections}
            isCollapsed={isMailSidebarCollapsed}
            onToggle={toggleMailSidebar}
            currentSection={currentSection}
          />
        </aside>

        {/* 2b. Sección Central (Lista de Correos) */}
        <main className={styles.mailListSectionWrapper} role="main">
          <header className={styles.mailListHeader}>
            <div className={styles.headerContent}>
              <div>
                <h1 className={styles.sectionTitle}>{currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}</h1>
                <span className={styles.mailCount} aria-live="polite">
                  {emails.length} messages
                </span>
              </div>
              <div className={styles.headerActions}>
                <button className={styles.refreshBtn} type="button" aria-label="Refresh emails">
                  ↻
                </button>
                <button className={styles.selectAllBtn} type="button" aria-label="Select all emails">
                  ☐
                </button>
              </div>
            </div>
          </header>
          <div className={styles.mailListContent}>
            <MailList
              section={currentSection}
              selectedMailId={selectedMail?.id ?? null}
              onMailSelect={setSelectedMail}
            />
          </div>
        </main>

        {/* 2c. Sidebar Derecha (IA) */}
        <aside
          className={`${styles.sidebarAISection} ${isAISidebarCollapsed ? styles.collapsed : ""}`}
          role="complementary"
          aria-label="AI features"
        >
          <SidebarAI
            isCollapsed={isAISidebarCollapsed}
            onToggle={toggleAISidebar}
          />
        </aside>
      </div>

      {/* Modales (se mantienen fuera del flujo principal para superponerse) */}
      {selectedMail && <MailDetailModal mail={selectedMail} onClose={() => setSelectedMail(null)} />}
      <ComposeModal
        isOpen={isComposeOpen}
        onToggle={() => setIsComposeOpen(!isComposeOpen)}
        onSend={handleComposeEmail}
        onClose={() => setIsComposeOpen(false)}
        loading={createEmailLoading}
      />
    </div>
  );
};

export default MailContainer
