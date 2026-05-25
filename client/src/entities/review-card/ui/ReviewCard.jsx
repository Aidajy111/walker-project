import { classNames } from "../../../shared/lib/classNames";
import styles from "./ReviewCard.module.css";

export function ReviewCard({ image, imageAlt, title, description, size = "large", onClick }) {
  function handleKeyDown(event) {
    if (!onClick || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    onClick();
  }

  return (
    <article
      className={classNames(styles.card, styles[size], onClick && styles.clickable)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <img className={styles.image} src={image} alt={imageAlt} />
      <div className={classNames(styles.overlay, styles[`overlay${size === "large" ? "Large" : "Small"}`])}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  );
}
