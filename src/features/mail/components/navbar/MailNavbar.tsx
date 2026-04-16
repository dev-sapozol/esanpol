"use client"

import React, { useState, useRef, useEffect } from "react"
import styles from "./MailNavbar.module.css"
import logo from "../../../../assets/images/LogoSPL.webp"
import { useMailbox } from "../../hooks/useMailbox"
import { useApolloClient } from "@apollo/client"
import MailAddModal from "../mail-add-modal/MailAddModal"

interface NavbarProps {
  darkMode: boolean
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const [showAddModal, setShowAddModal] = useState(false)
  const client = useApolloClient()
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useMailbox()
  const avatarRef = useRef<HTMLDivElement | null>(null)

  const handleLogout = async () => {
    try {

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      })

      sessionStorage.removeItem("access_token")

      await client.clearStore()

      window.location.href = "/auth/login"

    } catch (err) {
      console.error("Logout error", err)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <nav className={styles.navbar}>
        {/* Left Section - Logo */}
        <div className={styles.left}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <h2>Esanpol</h2>
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

          <div className={styles.addEmail}>
            <button onClick={() => setShowAddModal(true)}>
              Add email
            </button>
          </div>

          <div
            ref={avatarRef}
            className={styles.avatarWrapper}
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(!menuOpen)
            }}
          >
            <img
              src={
                user?.avatar_url ??
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "User")}`
              }
              alt="User"
              className={styles.userAvatar}
            />

            {menuOpen && (
              <div className={styles.userMenu}>

                <div className={styles.userInfo}>
                  <strong>{user?.name}</strong>
                  <span>{user?.email}</span>
                </div>

                <button>Settings</button>
                <button onClick={() => setDarkMode(prev => !prev)}>
                  {darkMode ? "Light mode☀️" : "Dark mode🌙"}
                </button>
                <button onClick={handleLogout}  >Logout</button>

              </div>
            )}
          </div>
        </div>
      </nav>

      {showAddModal && (
        <MailAddModal onClose={() => setShowAddModal(false)} />
      )}

    </>
  )
}

export default Navbar
