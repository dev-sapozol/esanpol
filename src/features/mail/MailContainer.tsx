"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar/Sidebar"
import MailList from "../../components/Mail/MailList"
import MailDetailModal from "../../components/Mail/MailDetailModal"
import ComposeModal from "../../components/ComposeModal"
import { generateMockEmails, mailSections } from "./mockData"
import type { Mail, MailSection } from "./types"
import { useCreateEmail } from "./hooks/useCreateEmail"
import type { ComposeEmailData } from "./types"
import styles from "./MailContainer.module.css"

const MailContainer: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState<MailSection>("inbox")
  const [mails, setMails] = useState<Mail[]>([])
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    // Persist sidebar state in localStorage
    const saved = localStorage.getItem("mail-sidebar-collapsed")
    return saved ? JSON.parse(saved) : false
  })
  const { createEmail, loading: createEmailLoading } = useCreateEmail()

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem("mail-sidebar-collapsed", JSON.stringify(isSidebarCollapsed))
  }, [isSidebarCollapsed])

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

  // Load emails for the current section
  useEffect(() => {
    const sectionMails = generateMockEmails(currentSection)
    setMails(sectionMails)
    setSelectedMail(null)
  }, [currentSection])

  // Handle mail selection - opens detail modal
  const handleMailSelect = (mail: Mail) => {
    if (!mail.isRead) {
      const updatedMails = mails.map((m) => (m.id === mail.id ? { ...m, isRead: true } : m))
      setMails(updatedMails)
    }
    setSelectedMail(mail)
  }

  // Handle compose email
  const handleComposeEmail = async (emailData: ComposeEmailData) => {
    try {
      const emailInput = {
        userId: "1",
        from: "user@example.com",
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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className={`${styles.mailContainer} ${isSidebarCollapsed ? styles.sidebarCollapsed : ""}`}>
      {/* Collapsible Sidebar */}
      <aside className={styles.sidebarSection} role="navigation" aria-label="Mail folders">
        <Sidebar
          sections={mailSections}
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
          currentSection={currentSection}
        />
      </aside>

      {/* Main Mail List Section */}
      <main className={styles.mailListSection} role="main">
        {/* Reduced Header */}
        <header className={styles.mailListHeader}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.sectionTitle}>{currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}</h1>
              <span className={styles.mailCount} aria-live="polite">
                {mails.length} messages
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

        {/* Mail List Content */}
        <div className={styles.mailListContent}>
          <MailList mails={mails} selectedMailId={selectedMail?.id || null} onMailSelect={handleMailSelect} />
        </div>

        {/* Bottom Status Bar */}
        <footer className={styles.mailListFooter}>
          <div className={styles.footerContent}>
            <span className={styles.mailCount} aria-live="polite">
              {mails.length} messages
            </span>
          </div>
        </footer>
      </main>

      {/* Independent Mail Detail Modal */}
      {selectedMail && <MailDetailModal mail={selectedMail} onClose={() => setSelectedMail(null)} />}

      {/* Independent Compose Modal - Bottom Left */}
      <ComposeModal
        isOpen={isComposeOpen}
        onToggle={() => setIsComposeOpen(!isComposeOpen)}
        onSend={handleComposeEmail}
        onClose={() => setIsComposeOpen(false)}
        loading={createEmailLoading}
      />
    </div>
  )
}

export default MailContainer
