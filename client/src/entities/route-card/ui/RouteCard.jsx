import { Link } from "react-router-dom";
import { Button } from "../../../shared/ui/button/Button";
import styles from "./RouteCard.module.css";

export function RouteCard({
  image,
  imageAlt,
  title,
  description,
  chips,
  href = "#!",
  onSave,
  saveButtonText = "Сохранить маршрут",
  saveDisabled = false,
  footer,
}) {
  return (
    <article className={styles.card}>
      <Link className={styles.cardLink} to={href}>
        <div className={styles.cover}>
          <img className={styles.image} src={image} alt={imageAlt} />
        </div>
        <div className={styles.chips}>
          {chips.map((chip) => (
            <span key={chip.text} className={styles.chip} style={{ background: chip.color }}>
              {chip.text}
            </span>
          ))}
        </div>
        <div className={styles.content}>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.description}>{description}</p>
        </div>
      </Link>
      {footer ? (
        <div className={styles.footer}>{footer}</div>
      ) : (
        <Button type="button" className={styles.saveButton} onClick={onSave} disabled={saveDisabled}>
          {saveButtonText}
        </Button>
      )}
    </article>
  );
}
