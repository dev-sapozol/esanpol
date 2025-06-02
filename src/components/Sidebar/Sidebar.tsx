"use client"

import type React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import type { MailSection } from "../../features/mail/types"
import styles from "./Sidebar.module.css"

interface SidebarProps {
  sections: Array<{
    id: string
    name: string
    count?: number
  }>
  isCollapsed: boolean
  onToggle: () => void
  currentSection: MailSection
}

// Icon mapping for each section
const sectionIcons: Record<string, string> = {
  inbox: "📥",
  sent: "📤",
  drafts: "📝",
  spam: "🚫",
  trash: "🗑️",
}

const Sidebar: React.FC<SidebarProps> = ({ sections, isCollapsed, onToggle, currentSection }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleSectionClick = (sectionId: string) => {
    navigate(`/mail/#${sectionId}`)
  }

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      {/* Sidebar Header */}
      <div className={styles.sidebarHeader}>
        <button className={styles.toggleButton} onClick={onToggle} aria-label="Toggle sidebar" type="button">
          <span className={styles.hamburgerIcon}>☰</span>
        </button>
        {!isCollapsed && <h2 className={styles.sidebarTitle}>Mail</h2>}
      </div>


      {/* Navigation Menu */}
      <nav className={styles.sidebarNav} role="navigation">
        {sections.map((section) => {
          const isActive = currentSection === section.id
          const icon = sectionIcons[section.id] || "📁"

          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`${styles.navItem} ${isActive ? styles.active : ""} ${isCollapsed ? styles.collapsed : ""}`}
              title={isCollapsed ? section.name : undefined}
              aria-label={`${section.name}${section.count ? ` (${section.count} messages)` : ""}`}
              type="button"
            >
              <span className={styles.navIcon}>{icon}</span>
              {!isCollapsed && (
                <>
                  <span className={styles.navLabel}>{section.name}</span>
                  {section.count && section.count > 0 && <span className={styles.navCount}>{section.count}</span>}
                </>
              )}
              {isCollapsed && section.count && section.count > 0 && (
                <span className={styles.navCountCollapsed}>{section.count}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className={styles.sidebarFooter}>
          <div className={styles.footerInfo}>
            <span className={styles.footerText}>Storage</span>
            <div className={styles.storageBar}>
              <div className={styles.storageProgress} style={{ width: "75%" }} />
            </div>
            <span className={styles.storageText}>11.2 GB of 15 GB used</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
