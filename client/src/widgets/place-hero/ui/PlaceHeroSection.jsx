import styles from "./PlaceHeroSection.module.css";

// const leftBottomDecor = "https://www.figma.com/api/mcp/asset/f502387b-a22f-46d8-bc5a-5107b769945a";
// const rightBottomDecor = "https://www.figma.com/api/mcp/asset/51bd924c-a7c0-4f5f-8d35-db58a8835fff";

const leftBottomDecor = "/images/Subtract(1).png";
const rightBottomDecor = "/images/Subtract(1).png";

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
