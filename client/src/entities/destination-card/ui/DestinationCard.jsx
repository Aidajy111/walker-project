import { Link } from "react-router-dom";
import styles from "./DestinationCard.module.css";

export function DestinationCard({ image, imageAlt, title, description, href = "#" }) {
  return (
    <Link className={styles.card} to={href}>
      <div className={styles.cover}>
        <img className={styles.image} src={image} alt={imageAlt} />
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.description}>{description}</p>
      </div>
    </Link>
  );
}
