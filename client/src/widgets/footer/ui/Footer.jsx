import styles from "./Footer.module.css";

const logoImage = "https://www.figma.com/api/mcp/asset/ab717b01-0b0f-4b74-831d-fa62ef33501a";
const mailIcon = "https://www.figma.com/api/mcp/asset/58d09a17-affe-40a0-80b6-e973e1eae96a";
const phoneIcon = "https://www.figma.com/api/mcp/asset/6ed67273-738d-4e86-bd50-78859541bd52";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.logoLink} href="/">
          <img className={styles.logo} src={logoImage} alt="Walker" />
        </a>
        <div className={styles.top}>
          <section>
            <h4 className={styles.title}>Компания</h4>
            <a className={styles.itemLink} href="/">
              Главная
            </a>
            <a className={styles.itemLink} href="#routes">
              Маршруты
            </a>
            <a className={styles.itemLink} href="#!">
              Мои маршруты
            </a>
            <a className={styles.itemLink} href="#about">
              О приложении
            </a>
          </section>
          <section>
            <h4 className={styles.title}>Маршруты</h4>
            <a className={styles.itemLink} href="#!">
              Сахалин
            </a>
            <a className={styles.itemLink} href="#!">
              Озеро Байкал
            </a>
            <a className={styles.itemLink} href="#!">
              Горнолыжный Сочи
            </a>
            <a className={styles.itemLink} href="#!">
              Горы Алтая
            </a>
          </section>
          <section>
            <h4 className={styles.title}>Партнерам</h4>
            <a className={styles.itemLink} href="#support">
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
            <a className={styles.contactLink} href="tel:+79917881201">
              <img src={phoneIcon} alt="" />
              <span>+7(991) - 788 - 12 - 01</span>
            </a>
          </section>
        </div>
        <div className={styles.bottom}>
          <a className={styles.privacyLink} href="#!">
            Политика обработки персональных данных
          </a>
          <span>Все права защищены © 2026</span>
        </div>
      </div>
    </footer>
  );
}
