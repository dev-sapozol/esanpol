import React from "react"
import styles from "./MyMeContainer.module.css"
import MyMeBox from "../../components/MyMe/MyMeBox"

const MyMe: React.FC = () => {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.6 + 0.4,
  }))

  return (
    <div className={styles.myMeContainer}>
      {/* Nebulosas espaciales */}
      <div className={styles.nebula}></div>
      <div className={styles.nebula}></div>
      <div className={styles.nebula}></div>

      {/* Estrellas dinámicas */}
      {stars.map((s, i) => (
        <div
          key={i}
          className={styles.star}
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
          }}
        />
      ))}

      <div className={styles.myMeContent}>
        <MyMeBox />
      </div>
    </div>
  )
}

export default MyMe
