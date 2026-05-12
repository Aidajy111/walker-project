import { classNames } from "../../../shared/lib/classNames";
import { Link } from "react-router-dom";
import styles from "./RoutePointCard.module.css";

/**
 * @typedef {Object} RoutePointImage
 * @property {string} id
 * @property {string} src
 * @property {string} [alt]
 */

/**
 * @typedef {Object} RoutePoint
 * @property {string} id
 * @property {'default' | 'establishment' | 'discount'} cardVariant
 * @property {string} [badgeText] — для establishment, например «Заведение месяца»
 * @property {string} [discountText] — для discount, например «Скидка 15%»
 * @property {string} title
 * @property {number} rating
 * @property {string} workingHours
 * @property {string} averageCheck
 * @property {string} address
 * @property {string} description
 * @property {RoutePointImage[]} images
 * @property {string | null} [bookingPhone] — если есть, показываем «Забронировать» как tel:
 */

const PREVIEW_COUNT = 3;

function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return Number.isFinite(value) && value > 0;
  if (typeof value !== "string") return false;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  if (normalized === "0") return false;
  if (normalized === "не указано" || normalized === "не указан") return false;
  if (normalized === "описание отсутствует." || normalized === "описание отсутствует") return false;
  return true;
}

export function RoutePointCard({ point, onGalleryOpen, onSelect, isActive = false }) {
  const safeImages = Array.isArray(point.images) ? point.images : [];
  const previewImages = safeImages.slice(0, PREVIEW_COUNT);
  const extraCount = Math.max(0, safeImages.length - PREVIEW_COUNT);
  const rawRating = Number(point.rating) || 0;
  const ratingValue = Math.max(0, Math.round(rawRating));
  const ratingLabel = rawRating > 0 ? rawRating.toFixed(1) : "";
  const ratingStars = "★".repeat(ratingValue);
  const hasWorkingHours = hasValue(point.workingHours);
  const hasDescription = hasValue(point.description);
  const hasAverageCheck = hasValue(point.averageCheck);
  const hasAddress = hasValue(point.address);
  const hasBookingPhone = hasValue(point.bookingPhone);

  const showEstablishmentBadge = point.cardVariant === "establishment";
  const showDiscountBadge = point.cardVariant === "discount";

  const establishmentLabel = point.badgeText || "Заведение месяца";

  function handleCardClick(event) {
    if (event.target.closest("button, a")) {
      return;
    }
    onSelect(point);
  }

  return (
    <article
      className={classNames(
        styles.card,
        styles.cardClickable,
        isActive && styles.cardActive,
        point.cardVariant === "establishment" && styles.cardEstablishment,
        point.cardVariant === "discount" && styles.cardDiscount,
      )}
      onClick={handleCardClick}
    >
      {(showEstablishmentBadge || showDiscountBadge) && (
        <div className={styles.badgeRow}>
          {showEstablishmentBadge ? <span className={styles.badgeEstablishment}>{establishmentLabel}</span> : null}
          {showDiscountBadge ? (
            <span className={styles.badgeDiscount}>{point.discountText || "Скидка"}</span>
          ) : null}
        </div>
      )}

      <div className={styles.photoRow}>
        {previewImages.map((img, index) => {
          const isLastPreview = index === PREVIEW_COUNT - 1;
          const showMoreOverlay = isLastPreview && extraCount > 0;

          return (
            <button
              key={img.id}
              type="button"
              className={styles.photoThumb}
              onClick={() => onGalleryOpen(safeImages, index)}
            >
              <img className={styles.photoImg} src={img.src} alt={img.alt || point.title} />
              {showMoreOverlay ? (
                <span className={styles.moreOverlay} aria-label={`Ещё ${extraCount} фото`}>
                  +{extraCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <h3 className={styles.title}>{point.title}</h3>

      {(ratingValue > 0 || hasWorkingHours) && (
        <div className={styles.metaRow}>
          {ratingValue > 0 ? <span className={styles.rating}>{ratingStars}</span> : null}
          {ratingValue > 0 ? <span className={styles.ratingValue}>{ratingLabel}</span> : null}
          {ratingValue > 0 && hasWorkingHours ? <span className={styles.metaDot} aria-hidden /> : null}
          {hasWorkingHours ? <span className={styles.hours}>{point.workingHours}</span> : null}
        </div>
      )}

      {hasDescription ? <p className={styles.description}>{point.description}</p> : null}

      {(hasAverageCheck || hasAddress) && (
        <div className={styles.details}>
          {hasAverageCheck ? (
            <p className={styles.detailLine}>
              <span className={styles.detailLabel}>Средний чек</span>
              <span className={styles.detailValue}>{point.averageCheck}</span>
            </p>
          ) : null}
          {hasAddress ? (
            <p className={styles.detailLine}>
              <span className={styles.detailLabel}>Адрес</span>
              <span className={styles.detailValue}>{point.address}</span>
            </p>
          ) : null}
        </div>
      )}

      {(hasBookingPhone || point.href) && (
        <div className={styles.actionRow}>
          {hasBookingPhone ? (
            <a className={styles.actionLink} href={`tel:${point.bookingPhone.replace(/\s/g, "")}`}>
              Забронировать
            </a>
          ) : null}

          {point.href ? (
            <Link className={classNames(styles.actionLink, styles.detailsLink)} to={point.href}>
              Подробнее
            </Link>
          ) : null}
        </div>
      )}
    </article>
  );
}
