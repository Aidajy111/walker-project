import { Button } from "../../../shared/ui/button/Button";
import styles from "./GastronomyBannerSection.module.css";

const gastronomyImage = "/images/traditional-buza.png";

export function GastronomyBannerSection() {
  return (
    <section className={styles.section}>
      <a className={styles.banner} href="#!">
        <img className={styles.background} src={gastronomyImage} alt="Гастрономическое путешествие" />
        <div className={styles.overlay} />
        <h2 className={styles.title}>Гастрономическое путешествие в сердце кочевой культуры</h2>
        <p className={styles.description}>
          Буузы с горячим бульоном, хухыры с хрустящей корочкой, ароматный шулэн с лапшой — здесь каждый приём пищи
          согревает и рассказывает историю. Пробуйте Бурятию не глазами, а языком
        </p>
        <Button variant="glass" className={styles.actionButton}>
          Найти заведения
        </Button>
      </a>
    </section>
  );
}
