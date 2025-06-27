"use client"

import { useState, useRef, useEffect } from "react"
import styles from "./NavMail.module.css"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { useUser } from "../../../context/UserContext"
import { logoutWithHttpOnlyCookie } from "../../../services/authService/LogoutWithHttpOnlyCookie"

const sectionsLogoIcon: Record<string, string> = {
  logo: "../../assets/SPLnoBordeSmall.png"
}

const NavMail: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setUser, user } = useUser()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutWithHttpOnlyCookie()
      setUser(null)
      navigate("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <nav className={styles.navMail}>
      <div className={styles.navBox}>
        <img src="../../assets/SPLnoBordeSmall.png" alt="Logo Esanpol" />
        <h2>Esanpol</h2>
      </div>
      <div className={styles.navInput}>
        <input type="text" placeholder={t("generic.searchPlaceholder")} />
      </div>
      <div className={styles.navBoxProfile} ref={menuRef}>
        <p>{(user?.name ?? "") + " " + (user?.fatherName ?? "")}</p>

        {/* Contenedor del Avatar y Dropdown */}
        <div className={styles.avatarContainer}> {/* <--- Nuevo contenedor para el avatar y el dropdown */}
          <div className={styles.avatar} onClick={() => setOpen(!open)} role="button" tabIndex={0} aria-haspopup="true" aria-expanded={open}>
            {/* Si tienes una URL para el avatar del usuario, úsala aquí */}
            {/* <img src={user?.avatarUrl || "../../assets/default-avatar.png"} alt={t("nav.userAvatarAlt")} /> */}
            {!user?.avatarUrl && <span className={styles.avatarPlaceholder}>{(user?.name?.[0] ?? "U").toUpperCase()}</span>}
          </div>

          {/* Submenu */}
          {open && (
            <ul className={styles.dropdown}>
              <li role="menuitem" onClick={() => { console.log("perfil"); setOpen(false); }}>{t("user.profile")}</li>
              <li role="menuitem" onClick={() => { console.log("config"); setOpen(false); }}>{t("user.settings")}</li>
              <li role="menuitem" onClick={() => { console.log("logout"); setOpen(false); handleLogout(); }}>{t("user.logout")}</li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavMail