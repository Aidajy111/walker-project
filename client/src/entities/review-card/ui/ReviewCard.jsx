import { classNames } from "../../../shared/lib/classNames";
import styles from "./ReviewCard.module.css";

export function ReviewCard({ image, imageAlt, title, description, size = "large" }) {
  return (
    <article className={classNames(styles.card, styles[size])}>
      <img className={styles.image} src={image} alt={imageAlt} />
      <div className={classNames(styles.overlay, styles[`overlay${size === "large" ? "Large" : "Small"}`])}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  );
}
