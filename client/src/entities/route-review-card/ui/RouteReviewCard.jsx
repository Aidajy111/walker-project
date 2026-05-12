import styles from "./RouteReviewCard.module.css";

export function RouteReviewCard({ review }) {
  const roundedRating = Math.round(review.rating);
  const stars = Array.from({ length: 5 }, (_, index) => index < roundedRating);

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.authorWrap}>
          <span className={styles.avatar} />
          <p className={styles.author}>{review.author}</p>
        </div>
        <div className={styles.ratingWrap}>
          <p className={styles.stars}>
            {stars.map((isFilled, index) => (
              <span key={`${review.id}-star-${index}`} className={isFilled ? styles.starFilled : styles.starEmpty}>
                ★
              </span>
            ))}
          </p>
          <p className={styles.ratingValue}>{review.rating.toFixed(1)}</p>
        </div>
      </div>
      <p className={styles.text}>{review.text}</p>
    </article>
  );
}
