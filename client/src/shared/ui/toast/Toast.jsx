import { useEffect } from "react";
import styles from "./Toast.module.css";

export function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message || !onClose) return undefined;
    const timerId = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timerId);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="status" aria-live="polite">
      <span className={styles.mark}>{type === "error" ? "!" : "✓"}</span>
      <span className={styles.message}>{message}</span>
      <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Закрыть уведомление">
        ×
      </button>
    </div>
  );
}
