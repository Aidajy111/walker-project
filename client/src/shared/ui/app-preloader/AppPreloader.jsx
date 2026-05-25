import { useEffect, useState } from "react";
import styles from "./AppPreloader.module.css";

const MIN_VISIBLE_MS = 650;
const EXIT_MS = 360;

export function AppPreloader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let hiddenTimerId;
    let removeTimerId;
    let loadReady = document.readyState === "complete";
    const startedAt = Date.now();

    function hideWhenReady() {
      const elapsed = Date.now() - startedAt;
      const delay = Math.max(0, MIN_VISIBLE_MS - elapsed);

      hiddenTimerId = window.setTimeout(() => {
        setLeaving(true);
        removeTimerId = window.setTimeout(() => setVisible(false), EXIT_MS);
      }, delay);
    }

    function handleLoad() {
      loadReady = true;
      hideWhenReady();
    }

    if (loadReady) {
      hideWhenReady();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", handleLoad);
      window.clearTimeout(hiddenTimerId);
      window.clearTimeout(removeTimerId);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`${styles.overlay} ${leaving ? styles.leaving : ""}`} aria-live="polite" aria-busy="true">
      <div className={styles.loader} aria-label="Загрузка сайта">
        <div className={styles.core}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
