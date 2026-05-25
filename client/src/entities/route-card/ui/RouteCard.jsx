import { Link } from "react-router-dom";
import { Button } from "../../../shared/ui/button/Button";
import styles from "./RouteCard.module.css";

export function RouteCardSkeleton() {
  return (
    <article className={`${styles.card} ${styles.skeletonCard}`} aria-hidden="true">
      <div className={`${styles.cover} ${styles.skeletonBlock}`} />
      <div className={styles.skeletonChips}>
        <span className={`${styles.skeletonChip} ${styles.skeletonBlock}`} />
        <span className={`${styles.skeletonChip} ${styles.skeletonBlock}`} />
      </div>
      <div className={styles.skeletonContent}>
        <span className={`${styles.skeletonLine} ${styles.skeletonBlock}`} />
        <span className={`${styles.skeletonLine} ${styles.skeletonLineShort} ${styles.skeletonBlock}`} />
        <span className={`${styles.skeletonText} ${styles.skeletonBlock}`} />
        <span className={`${styles.skeletonText} ${styles.skeletonTextShort} ${styles.skeletonBlock}`} />
      </div>
      <span className={`${styles.skeletonButton} ${styles.skeletonBlock}`} />
    </article>
  );
}

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
  isSaving = false,
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
          <span className={styles.saveButtonContent}>
            {isSaving ? <span className={styles.buttonSpinner} aria-hidden="true" /> : null}
            <span>{saveButtonText}</span>
          </span>
        </Button>
      )}
    </article>
  );
}
