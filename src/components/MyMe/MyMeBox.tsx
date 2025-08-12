"use client"

import React, { useRef, useState } from "react"
import styles from "./MyMeBox.module.css"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import "@fontsource/bebas-neue"

type IconData = {
  id: number
  name: string
  icon: string
  x: number
  y: number
}

const lenguageIcons = [
  { id: 1, name: "Elixir", icon: "https://img.icons8.com/color/48/000000/html-5.png", x: 20, y: 20 },
  { id: 2, name: "Java", icon: "https://img.icons8.com/color/48/000000/html-5.png", x: 160, y: 50 },
  { id: 3, name: "React", icon: "https://img.icons8.com/color/48/000000/html-5.png", x: 100, y: 150 },
]

const frameworksIcons = [
  { id: 1, name: "SpringBoot", icon: "https://img.icons8.com/color/48/000000/html-5.png" },
  { id: 2, name: "Phoenix", icon: "https://img.icons8.com/color/48/000000/html-5.png" },
]

const cloudServicesIcons = [
  { id: 1, name: "AWS", icon: "https://img.icons8.com/color/48/000000/cloud.png" }
]

const MyMeBox: React.FC = () => {
  const { t } = useTranslation()
  const boardRef = useRef<HTMLDivElement>(null)
  const [icons, setIcons] = useState(lenguageIcons)
  const [activeIcon, setActiveIcon] = useState<number | null>(null)

  const handleDrag = (e: React.MouseEvent, id: number) => {
    const iconIndex = icons.findIndex(i => i.id === id)
    const icon = icons[iconIndex]

    const board = boardRef.current
    if (!board) return

    const boardRect = board.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const offsetX = icon.x
    const offsetY = icon.y

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (moveEvent.buttons !== 1) {
        // Botón izq no está presionado -> cancelar arrastre
        onMouseUp()
        return
      }

      const newX = offsetX + moveEvent.clientX - startX
      const newY = offsetY + moveEvent.clientY - startY

      // Limitar movimiento
      const maxX = boardRect.width - 100
      const maxY = boardRect.height - 100

      const updated = [...icons]
      updated[iconIndex] = {
        ...icon,
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      }

      setIcons(updated)
    }

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  return (
    <div className={styles.myMeContent}>
      <div className={styles.myMeContentHeader}>
        <div className={styles.myMeHeader}>
          <h1 className={`${styles.bebasFont}`}>
            <span className={`${styles.dev} ${styles.lineWithMaskTop}`}>
              {t("myMe.dev").split("\n")[0]}
            </span>
            <br />
            <span className={`${styles.dev} ${styles.lineWithMaskBottom}`}>
              {t("myMe.dev").split("\n")[1]}
            </span>
          </h1>

          <p className={`${styles.dev} ${styles.txtPresentation}`}>{t("myMe.presentation")}</p>
          <div className={styles.iconsContainer}>
            <div className={styles.languages}>
              <h3>{t("myMe.languages")}</h3>
              <div className={styles.languagesBoard} ref={boardRef}>
                {icons.map(icon => (
                  <motion.div
                    key={icon.id}
                    drag
                    dragConstraints={boardRef}
                    onMouseDown={() => setActiveIcon(icon.id)}
                    className={styles.icon}
                    style={{ left: icon.x, top: icon.y, position: 'absolute', zIndex: activeIcon === icon.id ? 10 : 1 }}
                  >
                    <img src={icon.icon} alt={icon.name} className={styles.iconImg} />
                    <span className={styles.iconLabel}>{icon.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className={styles.secondLevelWrapper}>
              <div className={styles.frameworks}>
                <h3>Frameworks</h3>
                <div className={styles.frameworksWrapper}>
                  {frameworksIcons.map(fw => (
                    <div key={fw.name} className={styles.card}>
                      <div className={styles.cardInner}>
                        <div className={styles.cardFront}>
                          <img src={fw.icon} alt={fw.name} />
                        </div>
                        <div className={styles.cardBack}>
                          <span>{fw.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.cloudServices}>
                <h3>{t("myMe.cloud")}</h3>
                <div className={styles.cloudWrapper}>
                  <div className={styles.glowIcon}>
                    {cloudServicesIcons.map(cs => (
                      <div key={cs.name} className={styles.iconContainer}>
                        <img src={cs.icon} alt={cs.name} />
                        <span className={styles.tooltip}>{cs.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.avatarContainer}>
          <h2>Sebastian Pozo Lucano</h2>
          <div className={styles.avatar}>
            <img src="/assets/AvatarSPL.png" alt="" />
          </div>
        </div>
      </div>
      <div className={styles.myMeContentBody}>

      </div>
    </div>
  )
}

export default MyMeBox