import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../shared/ui/button/Button";
import styles from "./CookieConsent.module.css";

const STORAGE_KEY = "walker-cookie-consent";
const cookieIcon = "/images/cookie.png";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!window.localStorage.getItem(STORAGE_KEY));
    } catch {
      setVisible(true);
    }
  }, []);

  function saveConsent(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, acceptedAt: new Date().toISOString() }));
    } catch {
      // Close the banner even if storage is unavailable.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section className={styles.banner} aria-label="Уведомление о cookie">
      <img className={styles.icon} src={cookieIcon} alt="" />
      <div className={styles.content}>
        <h2 className={styles.title}>Мы используем cookie</h2>
        <p className={styles.text}>
          Walker использует необходимые cookie для работы сайта, авторизации и сохранения маршрутов. Аналитические cookie
          помогают улучшать сервис. Подробнее — в{" "}
          <Link className={styles.link} to="/privacy-policy">
            Политике обработки персональных данных
          </Link>
          .
        </p>
      </div>
      <div className={styles.actions}>
        <Button type="button" variant="secondary" className={styles.secondaryButton} onClick={() => saveConsent("necessary")}>
          Только необходимые
        </Button>
        <Button type="button" className={styles.primaryButton} onClick={() => saveConsent("all")}>
          Принять
        </Button>
      </div>
    </section>
  );
}
