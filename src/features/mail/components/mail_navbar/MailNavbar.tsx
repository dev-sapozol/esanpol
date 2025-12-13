"use client"

import React from "react"
import styles from "./MailNavbar.module.css"

const Navbar: React.FC = () => {
  const userName = "Rodrigo Pozo"

  return (
    <nav className={styles.navbar}>
      {/* Left Section - Logo */}
      <div className={styles.left}>
        <img src="/logo.png" alt="Logo" className={styles.logo} />
      </div>

      {/* Center - Search bar */}
      <div className={styles.center}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>

      {/* Right - User */}
      <div className={styles.right}>
        <span className={styles.userName}>{userName}</span>
        <img
          src="/user-avatar.jpg"
          alt="User Avatar"
          className={styles.userAvatar}
        />
      </div>
    </nav>
  )
}

export default Navbar
