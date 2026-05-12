import styles from "./PlaceHeroSection.module.css";

const leftBottomDecor = "https://www.figma.com/api/mcp/asset/9e196504-fded-4212-94fe-1434dce47aec";
const rightBottomDecor = "https://www.figma.com/api/mcp/asset/9b2edfa6-c53b-424b-b88e-9ef306aed7f5";

export function PlaceHeroSection({ title, shortDescription, heroImage }) {
  return (
    <section className={styles.hero}>
      <img className={styles.heroBackground} src={heroImage} alt={title} />
      <div className={styles.overlay} />

      <div className={styles.centerContent}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.descriptionBox}>
          <p>{shortDescription}</p>
        </div>
      </div>

      <img className={styles.leftBottomDecor} src={leftBottomDecor} alt="" />
      <img className={styles.rightBottomDecor} src={rightBottomDecor} alt="" />
    </section>
  );
}
