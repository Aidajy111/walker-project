import styles from "./PlaceHeroSection.module.css";

const heroImage = "https://www.figma.com/api/mcp/asset/8785733b-5710-4adc-b969-85be5910ea34";
const leftBottomDecor = "https://www.figma.com/api/mcp/asset/9e196504-fded-4212-94fe-1434dce47aec";
const rightBottomDecor = "https://www.figma.com/api/mcp/asset/9b2edfa6-c53b-424b-b88e-9ef306aed7f5";

export function PlaceHeroSection() {
  return (
    <section className={styles.hero}>
      <img className={styles.heroBackground} src={heroImage} alt="Иволгинский дацан" />
      <div className={styles.overlay} />

      <div className={styles.centerContent}>
        <h1 className={styles.title}>Иволгинский дацан</h1>
        <div className={styles.descriptionBox}>
          <p>
            буддийский монастырь-дацан, центр Буддийской традиционной Сангхи России. Расположен в Республике Бурятия в
            селе Верхняя Иволга в 36 км западнее центра Улан-Удэ.
          </p>
        </div>
      </div>

      <img className={styles.leftBottomDecor} src={leftBottomDecor} alt="" />
      <img className={styles.rightBottomDecor} src={rightBottomDecor} alt="" />
    </section>
  );
}
