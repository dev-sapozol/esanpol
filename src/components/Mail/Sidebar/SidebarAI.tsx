"use client"

import type React from "react"
import styles from "./SidebarAI.module.css"
import { t } from "i18next"

interface SidebarAIProps {
  isCollapsed: boolean
  onToggle: () => void
}

const sectionsAIIcons: Record<string, string> = {
  inbox: "../../assets/chat.png",
}

const SidebarAI: React.FC<SidebarAIProps> = ({ isCollapsed, onToggle }) => {
  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      {/* Collapsible Sidebar AI */}
      <div className={styles.sidebarHeader}>
        <button
          className={styles.toggleButton}
          onClick={onToggle}
          aria-label="Toggle AI sidebar"
          type="button"
        >
          <img
            src="/assets/chat.png"
            alt="AI Icon"
            className={styles.sidebarIcon}
          />
        </button>
        {!isCollapsed && <h2 className={styles.sidebarTitle}>AI Chat</h2>}
      </div>

      {/* Chat AI */}
      {!isCollapsed && (
        <div className={styles.sidebarContent}>
          <p>{t("emilIA.help")}</p>
          <button type="button">{t("emilIA.startChat")}</button>
        </div>
      )}
    </div>
  )
}


export default SidebarAI
