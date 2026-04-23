import { motion, AnimatePresence } from "framer-motion";
import styles from "./BackendWarmup.module.css";

export const BackendWarmup = ({ visible }: { visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className={styles.card}>
          <div className={styles.spinner} />
          <p className={styles.title}>Loading...</p>
          <p className={styles.sub}>
            This may take up to 90 seconds the first time. Please wait.
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);