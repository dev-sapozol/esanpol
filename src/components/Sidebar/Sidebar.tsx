"use client"

import type React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import type { MailSection } from "../../features/mail/types"
import styles from "./Sidebar.module.css"

interface SidebarProps {
  sections: Array<{ id: string; name: string; count?: number }>
  isCollapsed: boolean
  onToggle: () => void
  currentSection: MailSection
  onCompose: () => void
}

// Icon mapping for each section
const sectionIcons: Record<string, string> = {
  inbox: "📥",
  sent: "📤",
  drafts: "📝",
  spam: "🚫",
  trash: "🗑️",
}

// SVG pencil/compose icon
const ComposeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      fill="currentColor"
    />
  </svg>
)

const Sidebar: React.FC<SidebarProps> = ({
  sections,
  isCollapsed,
  onToggle,
  currentSection,
  onCompose,
}) => {
  const navigate = useNavigate()

  const handleSectionClick = (sectionId: string) => {
    navigate(`/mail/#${sectionId}`)
  }

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>

      {/* Sidebar Header */}
      <div className={styles.sidebarHeader}>
        <button
          className={styles.toggleButton}
          onClick={onToggle}
          aria-label="Toggle sidebar"
          type="button"
        >
          <span className={styles.hamburgerIcon}>☰</span>
        </button>
        {!isCollapsed && <h2 className={styles.sidebarTitle}>Mail</h2>}
      </div>

      {/* Compose Button */}
      <div className={styles.composeSection}>
        {!isCollapsed ? (
          <button
            className={styles.composeButton}
            onClick={onCompose}
            type="button"
            aria-label="Compose email"
          >
            <span className={styles.composeIcon}>
              <ComposeIcon />
            </span>
            <span className={styles.composeText}>Write</span>
          </button>
        ) : (
          <button
            className={styles.composeButtonCollapsed}
            onClick={onCompose}
            type="button"
            title="Compose email"
            aria-label="Compose email"
          >
            <span className={styles.composeIcon}>
              <ComposeIcon />
            </span>
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className={styles.sidebarNav} role="navigation" aria-label="Secciones de correo">
        {sections.map((section) => {
          const isActive = currentSection === section.id
          const icon = sectionIcons[section.id] || "📁"

          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`${styles.navItem} ${isActive ? styles.active : ""} ${isCollapsed ? styles.collapsed : ""}`}
              title={isCollapsed ? section.name : undefined}
              aria-current={isActive ? "page" : undefined}
              type="button"
            >
              <span className={styles.navIcon}>{icon}</span>

              {!isCollapsed && (
                <>
                  <span className={styles.navLabel}>{section.name}</span>
                  {section.count != null && section.count > 0 && (
                    <span className={styles.navCount}>{section.count}</span>
                  )}
                </>
              )}

              {/* Badge visible only when collapsed */}
              {isCollapsed && section.count != null && section.count > 0 && (
                <span className={styles.navCountCollapsed} aria-label={`${section.count} sin leer`}>
                  {section.count > 99 ? "99+" : section.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className={styles.sidebarFooter}>
          <div className={styles.footerInfo}>
            <span className={styles.footerText}>Almacenamiento</span>
            <div className={styles.storageBar}>
              <div className={styles.storageProgress} style={{ width: "75%" }} />
            </div>
            <span className={styles.storageText}>11.2 GB de 15 GB usados</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar