import styles from "./Footer.module.css";

const logoImage = "/images/logo.svg";
const mailIcon = "/images/mail-icon.svg";
const phoneIcon = "/images/phone-call-green.svg";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.logoLink} href="/">
          <img className={styles.logo} src={logoImage} alt="Walker" />
        </a>
        <div className={styles.top}>
          <section id="about" className={styles.anchorSection}>
            <h4 className={styles.title}>Компания</h4>
            <a className={styles.itemLink} href="/">
              Главная
            </a>
            <a className={styles.itemLink} href="/#routes">
              Маршруты
            </a>
            <a className={styles.itemLink} href="/my-routes">
              Мои маршруты
            </a>
            <a className={styles.itemLink} href="/about">
              О приложении
            </a>
          </section>
          <section>
            <h4 className={styles.title}>Маршруты</h4>
            <a className={styles.itemLink} href="/search">
              Готовые маршруты
            </a>
            <a className={styles.itemLink} href="/places">
              Точки
            </a>
            <a className={styles.itemLink} href="/#routes">
              Бурятия
            </a>
          </section>
          <section id="support" className={styles.anchorSection}>
            <h4 className={styles.title}>Партнерам</h4>
            <a className={styles.itemLink} href="/#support">
              Поддержка
            </a>
            <a className={styles.itemLink} href="#!">
              Сотрудничество
            </a>
          </section>
          <section className={styles.contacts}>
            <h4 className={styles.title}>Контакты</h4>
            <a className={styles.contactLink} href="mailto:walker@gmail.com">
              <img src={mailIcon} alt="" />
              <span>walker@gmail.com</span>
            </a>
            <a className={styles.contactLink} href="tel:+79917881201">
              <img src={phoneIcon} alt="" />
              <span>+7(991) - 788 - 12 - 01</span>
            </a>
          </section>
        </div>
        <div className={styles.bottom}>
          <a className={styles.privacyLink} href="/privacy-policy">
            Политика обработки персональных данных
          </a>
          <span>Все права защищены © 2026</span>
        </div>
      </div>
    </footer>
  );
}
